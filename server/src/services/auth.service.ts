import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';
import { AuthPayload, logAudit } from '../middleware/auth.js';

export class AuthService {
  static async login(email: string, password: string, jwtSign: (payload: any) => string): Promise<{ token: string; user: any }> {
    const user = UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status !== 'active') {
      throw new Error('This account has been deactivated or suspended. Please contact gym management.');
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    // Look up associated customer_id or trainer_id
    let customer_id: string | undefined;
    let trainer_id: string | undefined;

    if (user.role === 'customer') {
      const cust = db.prepare('SELECT id FROM customers WHERE user_id = ? OR email = ?').get(user.id, user.email) as any;
      customer_id = cust?.id;
    } else if (user.role === 'trainer') {
      const trn = db.prepare('SELECT id FROM trainers WHERE user_id = ? OR email = ?').get(user.id, user.email) as any;
      trainer_id = trn?.id;
    }

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      customer_id,
      trainer_id,
    };

    const token = jwtSign(payload);
    logAudit(user.id, 'LOGIN', 'user', user.id, { email: user.email, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        avatar_url: user.avatar_url,
        customer_id,
        trainer_id,
      }
    };
  }

  static async registerCustomer(data: {
    email: string;
    password: string;
    full_name: string;
    mobile_number: string;
  }, jwtSign: (payload: any) => string): Promise<{ token: string; user: any }> {
    const existing = UserRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = generateId('usr');
    const hash = bcrypt.hashSync(data.password, 10);

    const names = data.full_name.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || '';

    UserRepository.create({
      id: userId,
      username: data.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
      email: data.email,
      password_hash: hash,
      role: 'customer',
      first_name: firstName,
      last_name: lastName,
      phone: data.mobile_number,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'active'
    });

    return this.login(data.email, data.password, jwtSign);
  }

  static getProfile(userId: string): any {
    const user = UserRepository.findById(userId);
    if (!user) throw new Error('User not found');

    let extra: any = {};
    if (user.role === 'customer') {
      extra.customer = db.prepare('SELECT * FROM customers WHERE user_id = ? OR email = ?').get(user.id, user.email);
    } else if (user.role === 'trainer') {
      extra.trainer = db.prepare('SELECT * FROM trainers WHERE user_id = ? OR email = ?').get(user.id, user.email);
    }

    const { password_hash, ...safeUser } = user;
    return { ...safeUser, ...extra };
  }
}
