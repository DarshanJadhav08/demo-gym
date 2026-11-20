import { db } from '../database/db.js';
import { Payment } from '../models/types.js';
import { generateId, generateReceiptNumber } from '../utils/idGenerator.js';

export class PaymentRepository {
  static getNextReceiptNumber(): string {
    const row = db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number };
    return generateReceiptNumber(row.count + 1);
  }

  static getAll(filters?: { customerId?: string; paymentMethod?: string; startDate?: string; endDate?: string }): any[] {
    let query = `
      SELECT p.*, c.full_name as customer_name, c.customer_code, c.mobile_number, c.email,
             mp.name as plan_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN customer_memberships cm ON p.customer_membership_id = cm.id
      LEFT JOIN membership_plans mp ON cm.plan_id = mp.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.customerId) {
      query += ' AND p.customer_id = ?';
      params.push(filters.customerId);
    }
    if (filters?.paymentMethod && filters.paymentMethod !== 'all') {
      query += ' AND p.payment_method = ?';
      params.push(filters.paymentMethod);
    }
    if (filters?.startDate) {
      query += ' AND p.payment_date >= ?';
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      query += ' AND p.payment_date <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY p.payment_date DESC, p.created_at DESC';
    return db.prepare(query).all(...params);
  }

  static getById(id: string): any {
    return db.prepare(`
      SELECT p.*, c.full_name as customer_name, c.customer_code, c.mobile_number, c.email, c.address as customer_address,
             mp.name as plan_name, mp.duration_months
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN customer_memberships cm ON p.customer_membership_id = cm.id
      LEFT JOIN membership_plans mp ON cm.plan_id = mp.id
      WHERE p.id = ? OR p.receipt_number = ?
    `).get(id, id);
  }

  static createPayment(data: {
    customer_id: string;
    customer_membership_id?: string;
    total_amount: number;
    paid_amount: number;
    payment_method: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Online Payment';
    payment_date?: string;
    transaction_ref?: string;
    notes?: string;
    discount_amount?: number;
  }): any {
    const id = generateId('pay');
    const receipt_number = this.getNextReceiptNumber();
    const paymentDate = data.payment_date || new Date().toISOString().split('T')[0];
    const discount = data.discount_amount || 0;
    const netTotal = Math.max(0, data.total_amount - discount);
    const paid = data.paid_amount;
    const pending = Math.max(0, netTotal - paid);
    const status = pending === 0 ? 'completed' : 'partial';

    // Atomic transaction for payment creation and membership balance update
    db.exec('BEGIN TRANSACTION;');
    try {
      db.prepare(`
        INSERT INTO payments (
          id, receipt_number, customer_id, customer_membership_id,
          total_amount, paid_amount, pending_amount, discount_amount,
          payment_method, payment_date, transaction_ref, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        receipt_number,
        data.customer_id,
        data.customer_membership_id || null,
        netTotal,
        paid,
        pending,
        discount,
        data.payment_method,
        paymentDate,
        data.transaction_ref || null,
        data.notes || null,
        status
      );

      // If tied to a customer membership, update its paid and pending balances
      if (data.customer_membership_id) {
        const mem = db.prepare('SELECT * FROM customer_memberships WHERE id = ?').get(data.customer_membership_id) as any;
        if (mem) {
          const newPaid = (mem.paid_amount || 0) + paid;
          const newPending = Math.max(0, (mem.total_amount || 0) - newPaid);
          const newPaymentStatus = newPending === 0 ? 'paid' : (newPaid > 0 ? 'partial' : 'pending');

          db.prepare(`
            UPDATE customer_memberships
            SET paid_amount = ?, pending_amount = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(newPaid, newPending, newPaymentStatus, data.customer_membership_id);
        }
      }

      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }

    return this.getById(id);
  }
}
