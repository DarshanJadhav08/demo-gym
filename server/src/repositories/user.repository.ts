import { db } from '../database/db.js';
import { User } from '../models/types.js';

export class UserRepository {
  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  static findById(id: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  static create(user: Omit<User, 'created_at' | 'updated_at'>): User {
    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, phone, avatar_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
      user.username,
      user.email,
      user.password_hash,
      user.role,
      user.first_name || null,
      user.last_name || null,
      user.phone || null,
      user.avatar_url || null,
      user.status || 'active'
    );
    return this.findById(user.id)!;
  }

  static updatePassword(id: string, passwordHash: string): void {
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(passwordHash, id);
  }
}
