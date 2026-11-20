import { FastifyRequest, FastifyReply } from 'fastify';
import { WorkoutRepository } from '../repositories/workout.repository.js';
import { logAudit } from '../middleware/auth.js';

export class WorkoutController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = WorkoutRepository.getAllPlans();
      return reply.send(plans);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const plan = WorkoutRepository.getPlanById(id);
      if (!plan) return reply.status(404).send({ error: 'Workout plan not found' });
      return reply.send(plan);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { plan, exercises } = request.body as any;
      if (!plan?.plan_name) return reply.status(400).send({ error: 'Plan name is required.' });
      const created = WorkoutRepository.createPlan(plan, exercises);
      logAudit(request.user?.id || null, 'CREATE_WORKOUT', 'workout_plan', created.id, { name: created.plan_name });
      return reply.status(201).send(created);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async assign(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.customer_id || !body.workout_plan_id) {
        return reply.status(400).send({ error: 'Customer ID and Workout Plan ID are required.' });
      }
      const assignment = WorkoutRepository.assignPlan(body);
      logAudit(request.user?.id || null, 'ASSIGN_WORKOUT', 'workout_assignment', assignment.id, body);
      return reply.status(201).send(assignment);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
