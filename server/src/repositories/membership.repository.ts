import { db } from '../database/db.js';
import { MembershipPlan, CustomerMembership } from '../models/types.js';
import { generateId, generateCode } from '../utils/idGenerator.js';

export class MembershipRepository {
  // Plans
  static getAllPlans(onlyActive: boolean = false): MembershipPlan[] {
    let query = 'SELECT * FROM membership_plans';
    if (onlyActive) {
      query += ' WHERE is_active = 1';
    }
    query += ' ORDER BY price ASC';
    return db.prepare(query).all() as unknown as MembershipPlan[];
  }

  static getPlanById(id: string): MembershipPlan | null {
    return (db.prepare('SELECT * FROM membership_plans WHERE id = ? OR slug = ?').get(id, id) as MembershipPlan) || null;
  }

  static createPlan(data: Partial<MembershipPlan>): MembershipPlan {
    const id = generateId('pln');
    const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `plan-${id}`;

    db.prepare(`
      INSERT INTO membership_plans (
        id, name, slug, price, duration_months, duration_days, description,
        benefits, features, discount_percentage, joining_fee, renewal_rules, is_active, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.name!,
      slug,
      data.price!,
      data.duration_months || 1,
      data.duration_days || (data.duration_months ? data.duration_months * 30 : 30),
      data.description || '',
      typeof data.benefits === 'object' ? JSON.stringify(data.benefits) : data.benefits || '[]',
      typeof data.features === 'object' ? JSON.stringify(data.features) : data.features || '[]',
      data.discount_percentage || 0,
      data.joining_fee || 0,
      data.renewal_rules || '',
      data.is_active ?? 1,
      data.is_featured ?? 0
    );

    return this.getPlanById(id)!;
  }

  static updatePlan(id: string, data: Partial<MembershipPlan>): MembershipPlan {
    const fields: string[] = [];
    const values: any[] = [];
    const allowed = ['name', 'slug', 'price', 'duration_months', 'duration_days', 'description', 'benefits', 'features', 'discount_percentage', 'joining_fee', 'renewal_rules', 'is_active', 'is_featured'];

    for (const key of allowed) {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = ?`);
        let val = (data as any)[key];
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        values.push(val);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      db.prepare(`UPDATE membership_plans SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    }
    return this.getPlanById(id)!;
  }

  static deletePlan(id: string): boolean {
    const res = db.prepare('DELETE FROM membership_plans WHERE id = ?').run(id);
    return (res.changes ?? 0) > 0;
  }

  // Applications
  static getApplications(status?: string): any[] {
    let query = `
      SELECT ma.*, mp.name as plan_name, mp.price as plan_price, mp.duration_months
      FROM membership_applications ma
      JOIN membership_plans mp ON ma.plan_id = mp.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (status && status !== 'all') {
      query += ' AND ma.status = ?';
      params.push(status);
    }
    query += ' ORDER BY ma.submitted_at DESC';
    return db.prepare(query).all(...params);
  }

  static createApplication(data: {
    customer_id?: string;
    full_name: string;
    email: string;
    mobile_number: string;
    plan_id: string;
    notes?: string;
  }): any {
    const id = generateId('app');
    const count = (db.prepare('SELECT COUNT(*) as count FROM membership_applications').get() as { count: number }).count;
    const application_code = generateCode('APP', count + 1);

    db.prepare(`
      INSERT INTO membership_applications (id, application_code, customer_id, full_name, email, mobile_number, plan_id, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(id, application_code, data.customer_id || null, data.full_name, data.email, data.mobile_number, data.plan_id, data.notes || null);

    return db.prepare('SELECT * FROM membership_applications WHERE id = ?').get(id);
  }

  static updateApplicationStatus(id: string, status: 'approved' | 'rejected', reviewer: string): any {
    db.prepare(`
      UPDATE membership_applications
      SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, reviewer, id);

    return db.prepare('SELECT * FROM membership_applications WHERE id = ?').get(id);
  }

  // Customer Memberships Lifecycle
  static getAllCustomerMemberships(filters?: { status?: string; search?: string }): any[] {
    let query = `
      SELECT cm.*, c.full_name as customer_name, c.customer_code, c.mobile_number, c.email,
             p.name as plan_name, p.price as plan_price
      FROM customer_memberships cm
      JOIN customers c ON cm.customer_id = c.id
      JOIN membership_plans p ON cm.plan_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (filters?.status && filters.status !== 'all') {
      query += ' AND cm.status = ?';
      params.push(filters.status);
    }
    if (filters?.search) {
      query += ' AND (c.full_name LIKE ? OR c.customer_code LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s);
    }
    query += ' ORDER BY cm.created_at DESC';
    return db.prepare(query).all(...params);
  }

  static assignMembership(data: {
    customer_id: string;
    plan_id: string;
    start_date: string;
    discount_amount?: number;
    paid_amount?: number;
    notes?: string;
  }): CustomerMembership {
    const plan = this.getPlanById(data.plan_id);
    if (!plan) throw new Error('Selected membership plan not found');

    const startDate = new Date(data.start_date || new Date().toISOString().split('T')[0]);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (plan.duration_days || plan.duration_months * 30));

    const totalAmount = plan.price;
    const discountAmount = data.discount_amount || 0;
    const netAmount = Math.max(0, totalAmount - discountAmount);
    const paidAmount = data.paid_amount || 0;
    const pendingAmount = Math.max(0, netAmount - paidAmount);

    let paymentStatus: 'paid' | 'partial' | 'pending' = 'pending';
    if (paidAmount >= netAmount) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }

    const id = generateId('cms');
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO customer_memberships (
        id, customer_id, plan_id, start_date, end_date, duration_months,
        total_amount, paid_amount, pending_amount, discount_amount,
        payment_status, status, approval_status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 'approved', ?)
    `).run(
      id,
      data.customer_id,
      data.plan_id,
      startStr,
      endStr,
      plan.duration_months,
      netAmount,
      paidAmount,
      pendingAmount,
      discountAmount,
      paymentStatus,
      data.notes || null
    );

    // Update customer's membership_plan_id & status
    db.prepare(`
      UPDATE customers
      SET membership_plan_id = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.plan_id, data.customer_id);

    return db.prepare('SELECT * FROM customer_memberships WHERE id = ?').get(id) as unknown as CustomerMembership;
  }
}
