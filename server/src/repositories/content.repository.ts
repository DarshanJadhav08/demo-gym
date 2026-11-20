import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';

export class ContentRepository {
  // Services
  static getServices(onlyActive: boolean = true): any[] {
    let q = 'SELECT * FROM services';
    if (onlyActive) q += ' WHERE is_active = 1';
    q += ' ORDER BY display_order ASC';
    return db.prepare(q).all();
  }

  static getServiceBySlug(slug: string): any {
    return db.prepare('SELECT * FROM services WHERE slug = ?').get(slug);
  }

  // Programs
  static getPrograms(onlyActive: boolean = true): any[] {
    let q = 'SELECT * FROM programs';
    if (onlyActive) q += ' WHERE is_active = 1';
    q += ' ORDER BY display_order ASC';
    return db.prepare(q).all();
  }

  // Classes
  static getClasses(onlyActive: boolean = true): any[] {
    let q = `
      SELECT c.*, t.profile_image as trainer_image, t.specialization as trainer_specialization
      FROM classes c
      LEFT JOIN trainers t ON c.trainer_id = t.id
    `;
    if (onlyActive) q += ' WHERE c.is_active = 1';
    return db.prepare(q).all();
  }

  // Testimonials
  static getTestimonials(): any[] {
    return db.prepare('SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY is_featured DESC, created_at DESC').all();
  }

  // Gallery
  static getGallery(category?: string): any[] {
    let q = 'SELECT * FROM gallery';
    const params: any[] = [];
    if (category && category !== 'All') {
      q += ' WHERE category = ?';
      params.push(category);
    }
    q += ' ORDER BY display_order ASC';
    return db.prepare(q).all(...params);
  }

  // Settings
  static getSettings(): any {
    return db.prepare('SELECT * FROM gym_settings LIMIT 1').get() || {
      gym_name: 'APEX ELITE FITNESS',
      phone: '+91 98765 43210',
      email: 'contact@apexelite.com',
      address: '700 Olympus Boulevard, Mumbai',
      opening_hours: 'Mon - Sun: 05:00 AM - 11:00 PM',
      stats_members: 2250,
      stats_trainers: 520,
      stats_equipment: 520,
      stats_programs: 45
    };
  }

  static updateSettings(data: any): any {
    const current = this.getSettings();
    db.prepare(`
      UPDATE gym_settings
      SET gym_name = ?, phone = ?, email = ?, address = ?, opening_hours = ?,
          stats_members = ?, stats_trainers = ?, stats_equipment = ?, stats_programs = ?,
          social_instagram = ?, social_facebook = ?, social_youtube = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.gym_name || current.gym_name,
      data.phone || current.phone,
      data.email || current.email,
      data.address || current.address,
      data.opening_hours || current.opening_hours,
      data.stats_members || current.stats_members,
      data.stats_trainers || current.stats_trainers,
      data.stats_equipment || current.stats_equipment,
      data.stats_programs || current.stats_programs,
      data.social_instagram || current.social_instagram,
      data.social_facebook || current.social_facebook,
      data.social_youtube || current.social_youtube,
      current.id || 'gym_settings_default'
    );
    return this.getSettings();
  }

  // Newsletter
  static subscribeNewsletter(email: string): { success: boolean; message: string } {
    const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email);
    if (existing) {
      return { success: true, message: 'You are already subscribed to our VIP newsletter.' };
    }
    const id = generateId('sub');
    db.prepare('INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)').run(id, email);
    return { success: true, message: 'Successfully subscribed to Apex Elite VIP news & offers!' };
  }
}
