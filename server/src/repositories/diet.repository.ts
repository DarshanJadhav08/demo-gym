import { db } from '../database/db.js';
import { DietPlan } from '../models/types.js';
import { generateId } from '../utils/idGenerator.js';

export class DietRepository {
  static getAllPlans(): DietPlan[] {
    return db.prepare('SELECT * FROM diet_plans ORDER BY created_at DESC').all() as unknown as DietPlan[];
  }

  static getPlanById(id: string): DietPlan | null {
    return (db.prepare('SELECT * FROM diet_plans WHERE id = ?').get(id) as unknown as DietPlan) || null;
  }

  static createPlan(data: Partial<DietPlan>): DietPlan {
    const id = generateId('dtp');
    db.prepare(`
      INSERT INTO diet_plans (
        id, plan_name, goal, target_calories, protein_grams, carbs_grams, fats_grams,
        water_liters, breakfast, lunch, dinner, snacks, dietary_notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.plan_name!,
      data.goal || 'Weight Loss',
      data.target_calories || 2000,
      data.protein_grams || 150,
      data.carbs_grams || 200,
      data.fats_grams || 60,
      data.water_liters || 3.0,
      data.breakfast || 'Healthy balanced breakfast',
      data.lunch || 'Balanced lunch with lean protein and greens',
      data.dinner || 'Light protein dinner with vegetables',
      data.snacks || 'Nuts or protein shake',
      data.dietary_notes || '',
      data.created_by || 'Gym Nutritionist'
    );

    return this.getPlanById(id)!;
  }

  static assignPlan(data: { customer_id: string; diet_plan_id: string; assigned_by?: string; start_date: string; end_date: string }): any {
    const id = generateId('dta');
    db.prepare(`
      INSERT INTO diet_assignments (id, customer_id, diet_plan_id, assigned_by, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(id, data.customer_id, data.diet_plan_id, data.assigned_by || null, data.start_date, data.end_date);

    return db.prepare('SELECT * FROM diet_assignments WHERE id = ?').get(id);
  }
}
