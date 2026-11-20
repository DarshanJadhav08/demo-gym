import { db } from '../database/db.js';
import { Enquiry } from '../models/types.js';
import { generateId, generateCode } from '../utils/idGenerator.js';
import { CustomerRepository } from './customer.repository.js';

export class EnquiryRepository {
  static getNextCode(): string {
    const count = (db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as { count: number }).count;
    return generateCode('ENQ', count + 1);
  }

  static getAll(filters?: { status?: string; search?: string }): Enquiry[] {
    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const params: any[] = [];
    if (filters?.status && filters.status !== 'all') {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters?.search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const s = `%${filters.search}%`;
      params.push(s, s, s);
    }
    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params) as unknown as Enquiry[];
  }

  static getById(id: string): Enquiry | null {
    return (db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as unknown as Enquiry) || null;
  }

  static create(data: {
    full_name: string;
    email: string;
    phone: string;
    program_interest?: string;
    source?: 'Join Now' | 'Contact Form' | 'Walk-in' | 'Book Session';
    message?: string;
  }): Enquiry {
    const id = generateId('enq');
    const enquiry_code = this.getNextCode();

    db.prepare(`
      INSERT INTO enquiries (id, enquiry_code, full_name, email, phone, program_interest, source, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).run(
      id,
      enquiry_code,
      data.full_name,
      data.email,
      data.phone,
      data.program_interest || 'General Membership',
      data.source || 'Contact Form',
      data.message || ''
    );

    return this.getById(id)!;
  }

  static updateStatus(id: string, data: { status: string; follow_up_date?: string; notes?: string }): Enquiry {
    db.prepare(`
      UPDATE enquiries
      SET status = ?, follow_up_date = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.status, data.follow_up_date || null, data.notes || null, id);

    return this.getById(id)!;
  }

  static convertToCustomer(id: string, additionalData?: any): any {
    const enquiry = this.getById(id);
    if (!enquiry) throw new Error('Enquiry not found');

    // Create customer reusing all contact details
    const customer = CustomerRepository.create({
      full_name: enquiry.full_name,
      email: enquiry.email,
      mobile_number: enquiry.phone,
      address: additionalData?.address || 'Converted from website enquiry',
      gender: additionalData?.gender || 'Other',
      date_of_birth: additionalData?.date_of_birth || '1998-01-01',
      emergency_contact: additionalData?.emergency_contact || 'None',
      joining_date: new Date().toISOString().split('T')[0],
      assigned_trainer_id: additionalData?.assigned_trainer_id || null,
      membership_plan_id: additionalData?.membership_plan_id || null,
      status: 'active'
    });

    // Mark enquiry as Converted and link customer ID
    db.prepare(`
      UPDATE enquiries
      SET status = 'Converted', converted_customer_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(customer.id, id);

    return { customer, enquiry: this.getById(id) };
  }
}
