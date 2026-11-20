import { db } from '../database/db.js';
import { Customer } from '../models/types.js';
import { generateId, generateCode } from '../utils/idGenerator.js';

export class CustomerRepository {
  static getNextCode(): string {
    const row = db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
    return generateCode('CUST', row.count + 1);
  }

  static getAll(filters?: {
    search?: string;
    status?: string;
    trainerId?: string;
    planId?: string;
    limit?: number;
    offset?: number;
  }): { customers: Customer[]; total: number } {
    let whereClause = '1=1';
    const params: any[] = [];

    if (filters?.search) {
      whereClause += ` AND (c.full_name LIKE ? OR c.mobile_number LIKE ? OR c.customer_code LIKE ? OR c.email LIKE ?)`;
      const searchParam = `%${filters.search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    if (filters?.status && filters.status !== 'all') {
      whereClause += ` AND c.status = ?`;
      params.push(filters.status);
    }

    if (filters?.trainerId && filters.trainerId !== 'all') {
      whereClause += ` AND c.assigned_trainer_id = ?`;
      params.push(filters.trainerId);
    }

    if (filters?.planId && filters.planId !== 'all') {
      whereClause += ` AND c.membership_plan_id = ?`;
      params.push(filters.planId);
    }

    const countStmt = db.prepare(`SELECT COUNT(*) as count FROM customers c WHERE ${whereClause}`);
    const totalRow = countStmt.get(...params) as { count: number };

    let query = `
      SELECT c.*, t.full_name as trainer_name, p.name as plan_name,
             cm.status as membership_status, cm.end_date as membership_end_date,
             cm.pending_amount as outstanding_balance
      FROM customers c
      LEFT JOIN trainers t ON c.assigned_trainer_id = t.id
      LEFT JOIN membership_plans p ON c.membership_plan_id = p.id
      LEFT JOIN (
        SELECT customer_id, status, end_date, pending_amount
        FROM customer_memberships
        ORDER BY created_at DESC
        LIMIT 1
      ) cm ON cm.customer_id = c.id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
    `;

    if (filters?.limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(filters.limit, filters.offset || 0);
    }

    const customers = db.prepare(query).all(...params) as unknown as Customer[];
    return { customers, total: totalRow.count };
  }

  static getById(id: string): any {
    const customer = db.prepare(`
      SELECT c.*, t.full_name as trainer_name, t.mobile_number as trainer_mobile, p.name as plan_name
      FROM customers c
      LEFT JOIN trainers t ON c.assigned_trainer_id = t.id
      LEFT JOIN membership_plans p ON c.membership_plan_id = p.id
      WHERE c.id = ? OR c.customer_code = ?
    `).get(id, id);

    if (!customer) return null;

    // Load full relational tabs for the complete 11-tab customer view
    const custId = (customer as any).id;

    // 1. Memberships
    const memberships = db.prepare(`
      SELECT cm.*, p.name as plan_name, p.price as plan_price
      FROM customer_memberships cm
      JOIN membership_plans p ON cm.plan_id = p.id
      WHERE cm.customer_id = ?
      ORDER BY cm.created_at DESC
    `).all(custId);

    // 2. Payments
    const payments = db.prepare(`
      SELECT * FROM payments WHERE customer_id = ? ORDER BY payment_date DESC, created_at DESC
    `).all(custId);

    // 3. Attendance
    const attendance = db.prepare(`
      SELECT * FROM attendance WHERE customer_id = ? ORDER BY attendance_date DESC, check_in_time DESC LIMIT 30
    `).all(custId);

    // 4. Workout Plans
    const workouts = db.prepare(`
      SELECT wa.*, wp.plan_name, wp.category, wp.difficulty, wp.duration_weeks, wp.description, t.full_name as trainer_name
      FROM workout_assignments wa
      JOIN workout_plans wp ON wa.workout_plan_id = wp.id
      LEFT JOIN trainers t ON wa.assigned_by_trainer_id = t.id
      WHERE wa.customer_id = ?
      ORDER BY wa.created_at DESC
    `).all(custId);

    // 5. Diet Plans
    const diets = db.prepare(`
      SELECT da.*, dp.plan_name, dp.goal, dp.target_calories, dp.protein_grams, dp.carbs_grams, dp.fats_grams, dp.water_liters,
             dp.breakfast, dp.lunch, dp.dinner, dp.snacks, dp.dietary_notes
      FROM diet_assignments da
      JOIN diet_plans dp ON da.diet_plan_id = dp.id
      WHERE da.customer_id = ?
      ORDER BY da.created_at DESC
    `).all(custId);

    // 6. Progress Records
    const progress = db.prepare(`
      SELECT * FROM customer_progress WHERE customer_id = ? ORDER BY recorded_date DESC
    `).all(custId);

    return {
      ...customer,
      memberships,
      payments,
      attendance,
      workouts,
      diets,
      progress
    };
  }

  static create(data: Partial<Customer>): Customer {
    const id = generateId('cst');
    const customer_code = data.customer_code || this.getNextCode();

    db.prepare(`
      INSERT INTO customers (
        id, customer_code, user_id, full_name, profile_photo, gender, date_of_birth,
        mobile_number, email, address, emergency_contact, joining_date,
        height, weight, blood_group, medical_notes, assigned_trainer_id, membership_plan_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      customer_code,
      data.user_id || null,
      data.full_name!,
      data.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      data.gender || 'Other',
      data.date_of_birth || '2000-01-01',
      data.mobile_number!,
      data.email!,
      data.address || 'Address not provided',
      data.emergency_contact || 'None',
      data.joining_date || new Date().toISOString().split('T')[0],
      data.height || null,
      data.weight || null,
      data.blood_group || null,
      data.medical_notes || null,
      data.assigned_trainer_id || null,
      data.membership_plan_id || null,
      data.status || 'active'
    );

    return this.getById(id);
  }

  static update(id: string, data: Partial<Customer>): Customer {
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = [
      'full_name', 'profile_photo', 'gender', 'date_of_birth', 'mobile_number',
      'email', 'address', 'emergency_contact', 'joining_date', 'height', 'weight',
      'blood_group', 'medical_notes', 'assigned_trainer_id', 'membership_plan_id', 'status'
    ];

    for (const key of allowed) {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push((data as any)[key]);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      db.prepare(`UPDATE customers SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    }

    return this.getById(id);
  }

  static delete(id: string): boolean {
    const result = db.prepare('DELETE FROM customers WHERE id = ?').run(id);
    return (result.changes ?? 0) > 0;
  }
}
