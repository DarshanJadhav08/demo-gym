import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';

export class AttendanceRepository {
  static getTodayAttendance(): any {
    const today = new Date().toISOString().split('T')[0];
    const records = db.prepare(`
      SELECT a.*,
             CASE
               WHEN a.entity_type = 'customer' THEN c.full_name
               WHEN a.entity_type = 'trainer' THEN t.full_name
             END as person_name,
             CASE
               WHEN a.entity_type = 'customer' THEN c.customer_code
               WHEN a.entity_type = 'trainer' THEN t.trainer_code
             END as person_code,
             CASE
               WHEN a.entity_type = 'customer' THEN c.profile_photo
               WHEN a.entity_type = 'trainer' THEN t.profile_image
             END as photo
      FROM attendance a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN trainers t ON a.trainer_id = t.id
      WHERE a.attendance_date = ?
      ORDER BY a.check_in_time DESC
    `).all(today);

    const stats = {
      totalToday: records.length,
      customersPresent: records.filter((r: any) => r.entity_type === 'customer').length,
      trainersPresent: records.filter((r: any) => r.entity_type === 'trainer').length,
      currentlyInside: records.filter((r: any) => !r.check_out_time).length,
    };

    return { records, stats };
  }

  static getHistory(filters?: { date?: string; customerId?: string; trainerId?: string; limit?: number }): any[] {
    let query = `
      SELECT a.*,
             CASE
               WHEN a.entity_type = 'customer' THEN c.full_name
               WHEN a.entity_type = 'trainer' THEN t.full_name
             END as person_name,
             CASE
               WHEN a.entity_type = 'customer' THEN c.customer_code
               WHEN a.entity_type = 'trainer' THEN t.trainer_code
             END as person_code
      FROM attendance a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN trainers t ON a.trainer_id = t.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (filters?.date) {
      query += ' AND a.attendance_date = ?';
      params.push(filters.date);
    }
    if (filters?.customerId) {
      query += ' AND a.customer_id = ?';
      params.push(filters.customerId);
    }
    if (filters?.trainerId) {
      query += ' AND a.trainer_id = ?';
      params.push(filters.trainerId);
    }

    query += ' ORDER BY a.attendance_date DESC, a.check_in_time DESC';
    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    return db.prepare(query).all(...params);
  }

  static checkIn(data: { entity_type: 'customer' | 'trainer'; customer_id?: string; trainer_id?: string; notes?: string }): any {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Duplicate check for the same entity on the same date with active session
    if (data.entity_type === 'customer') {
      const existing = db.prepare('SELECT * FROM attendance WHERE customer_id = ? AND attendance_date = ? AND check_out_time IS NULL').get(data.customer_id, today);
      if (existing) {
        throw new Error('This customer is already checked in and has not checked out yet today.');
      }
    } else {
      const existing = db.prepare('SELECT * FROM attendance WHERE trainer_id = ? AND attendance_date = ? AND check_out_time IS NULL').get(data.trainer_id, today);
      if (existing) {
        throw new Error('This trainer is already checked in.');
      }
    }

    const id = generateId('att');
    db.prepare(`
      INSERT INTO attendance (id, entity_type, customer_id, trainer_id, attendance_date, check_in_time, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'present', ?)
    `).run(id, data.entity_type, data.customer_id || null, data.trainer_id || null, today, now, data.notes || null);

    return db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
  }

  static checkOut(id: string): any {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    db.prepare('UPDATE attendance SET check_out_time = ? WHERE id = ?').run(now, id);
    return db.prepare('SELECT * FROM attendance WHERE id = ?').get(id);
  }
}
