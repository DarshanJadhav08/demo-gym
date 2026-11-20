import { db } from '../database/db.js';
import { Trainer } from '../models/types.js';
import { generateId, generateCode } from '../utils/idGenerator.js';

export class TrainerRepository {
  static getNextCode(): string {
    const row = db.prepare('SELECT COUNT(*) as count FROM trainers').get() as { count: number };
    return generateCode('TRN', row.count + 1);
  }

  static getAll(filters?: { status?: string; search?: string }): Trainer[] {
    let query = 'SELECT * FROM trainers WHERE 1=1';
    const params: any[] = [];

    if (filters?.status && filters.status !== 'all') {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.search) {
      query += ' AND (full_name LIKE ? OR mobile_number LIKE ? OR specialization LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params) as unknown as Trainer[];
  }

  static getById(id: string): any {
    const trainer = db.prepare('SELECT * FROM trainers WHERE id = ? OR trainer_code = ?').get(id, id);
    if (!trainer) return null;

    const trnId = (trainer as any).id;
    // Fetch assigned clients
    const clients = db.prepare(`
      SELECT id, customer_code, full_name, mobile_number, email, status, profile_photo
      FROM customers
      WHERE assigned_trainer_id = ?
    `).all(trnId);

    // Fetch classes taught
    const classes = db.prepare('SELECT * FROM classes WHERE trainer_id = ?').all(trnId);

    return {
      ...trainer,
      clients,
      classes
    };
  }

  static create(data: Partial<Trainer>): Trainer {
    const id = generateId('trn');
    const trainer_code = data.trainer_code || this.getNextCode();

    db.prepare(`
      INSERT INTO trainers (
        id, trainer_code, user_id, full_name, profile_image, mobile_number, email,
        gender, date_of_birth, specialization, qualifications, experience,
        salary, employment_type, availability, assigned_programs, description, social_links, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      trainer_code,
      data.user_id || null,
      data.full_name!,
      data.profile_image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400',
      data.mobile_number!,
      data.email!,
      data.gender || 'Other',
      data.date_of_birth || null,
      data.specialization || 'Fitness Specialist',
      data.qualifications || '',
      data.experience || '3 Years',
      data.salary || 0,
      data.employment_type || 'Full-time',
      data.availability || 'Mon-Sat: 06:00 AM - 02:00 PM',
      typeof data.assigned_programs === 'object' ? JSON.stringify(data.assigned_programs) : data.assigned_programs || '[]',
      data.description || '',
      typeof data.social_links === 'object' ? JSON.stringify(data.social_links) : data.social_links || '{}',
      data.status || 'active'
    );

    return this.getById(id);
  }

  static update(id: string, data: Partial<Trainer>): Trainer {
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      'full_name', 'profile_image', 'mobile_number', 'email', 'gender', 'date_of_birth',
      'specialization', 'qualifications', 'experience', 'salary', 'employment_type',
      'availability', 'assigned_programs', 'description', 'social_links', 'status'
    ];

    for (const key of allowed) {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = ?`);
        let val = (data as any)[key];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        values.push(val);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      db.prepare(`UPDATE trainers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    }

    return this.getById(id);
  }

  static delete(id: string): boolean {
    const res = db.prepare('DELETE FROM trainers WHERE id = ?').run(id);
    return (res.changes ?? 0) > 0;
  }
}
