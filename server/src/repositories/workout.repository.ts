import { db } from '../database/db.js';
import { WorkoutPlan, Exercise } from '../models/types.js';
import { generateId } from '../utils/idGenerator.js';

export class WorkoutRepository {
  static getAllPlans(): WorkoutPlan[] {
    const plans = db.prepare(`
      SELECT wp.*, t.full_name as trainer_name
      FROM workout_plans wp
      LEFT JOIN trainers t ON wp.created_by_trainer_id = t.id
      ORDER BY wp.created_at DESC
    `).all() as unknown as WorkoutPlan[];

    for (const plan of plans) {
      plan.exercises = db.prepare('SELECT * FROM exercises WHERE workout_plan_id = ? ORDER BY display_order ASC').all(plan.id) as unknown as Exercise[];
    }
    return plans;
  }

  static getPlanById(id: string): WorkoutPlan | null {
    const plan = db.prepare(`
      SELECT wp.*, t.full_name as trainer_name
      FROM workout_plans wp
      LEFT JOIN trainers t ON wp.created_by_trainer_id = t.id
      WHERE wp.id = ?
    `).get(id) as unknown as WorkoutPlan | undefined;

    if (!plan) return null;
    plan.exercises = db.prepare('SELECT * FROM exercises WHERE workout_plan_id = ? ORDER BY display_order ASC').all(plan.id) as unknown as Exercise[];
    return plan;
  }

  static createPlan(data: Partial<WorkoutPlan>, exercisesList?: Partial<Exercise>[]): WorkoutPlan {
    const id = generateId('wkp');
    db.prepare(`
      INSERT INTO workout_plans (id, plan_name, category, difficulty, duration_weeks, description, created_by_trainer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.plan_name!,
      data.category || 'Strength',
      data.difficulty || 'Intermediate',
      data.duration_weeks || 4,
      data.description || '',
      data.created_by_trainer_id || null
    );

    if (exercisesList && exercisesList.length > 0) {
      const insertEx = db.prepare(`
        INSERT INTO exercises (id, workout_plan_id, day_of_week, exercise_name, sets, reps, weight_target, rest_seconds, notes, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      exercisesList.forEach((ex, idx) => {
        insertEx.run(
          generateId('ex'),
          id,
          ex.day_of_week || 'Monday',
          ex.exercise_name || 'Exercise',
          ex.sets || 3,
          ex.reps || '10',
          ex.weight_target || '',
          ex.rest_seconds || 60,
          ex.notes || '',
          idx + 1
        );
      });
    }

    return this.getPlanById(id)!;
  }

  static assignPlan(data: { customer_id: string; workout_plan_id: string; assigned_by_trainer_id?: string; start_date: string; end_date: string }): any {
    const id = generateId('wka');
    db.prepare(`
      INSERT INTO workout_assignments (id, customer_id, workout_plan_id, assigned_by_trainer_id, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(id, data.customer_id, data.workout_plan_id, data.assigned_by_trainer_id || null, data.start_date, data.end_date);

    return db.prepare('SELECT * FROM workout_assignments WHERE id = ?').get(id);
  }
}
