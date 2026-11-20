import { db } from '../database/db.js';
import { Expense } from '../models/types.js';
import { generateId } from '../utils/idGenerator.js';

export class ExpenseRepository {
  static getAll(filters?: { category?: string; startDate?: string; endDate?: string }): Expense[] {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params: any[] = [];
    if (filters?.category && filters.category !== 'all') {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters?.startDate) {
      query += ' AND expense_date >= ?';
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      query += ' AND expense_date <= ?';
      params.push(filters.endDate);
    }
    query += ' ORDER BY expense_date DESC, created_at DESC';
    return db.prepare(query).all(...params) as unknown as Expense[];
  }

  static create(data: Partial<Expense>): Expense {
    const id = generateId('exp');
    db.prepare(`
      INSERT INTO expenses (id, expense_date, category, amount, description, payment_method, receipt_attachment, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.expense_date || new Date().toISOString().split('T')[0],
      data.category || 'Other Expenses',
      data.amount || 0,
      data.description || '',
      data.payment_method || 'Bank Transfer',
      data.receipt_attachment || null,
      data.created_by || 'Admin'
    );

    return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id) as unknown as Expense;
  }

  static delete(id: string): boolean {
    const res = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    return (res.changes ?? 0) > 0;
  }
}
