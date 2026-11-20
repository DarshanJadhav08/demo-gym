import { FastifyRequest, FastifyReply } from 'fastify';
import { DietRepository } from '../repositories/diet.repository.js';
import { logAudit } from '../middleware/auth.js';

export class DietController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = DietRepository.getAllPlans();
      return reply.send(plans);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const plan = DietRepository.getPlanById(id);
      if (!plan) return reply.status(404).send({ error: 'Diet plan not found' });
      return reply.send(plan);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.plan_name) return reply.status(400).send({ error: 'Plan name is required.' });
      const created = DietRepository.createPlan(body);
      logAudit(request.user?.id || null, 'CREATE_DIET', 'diet_plan', created.id, { name: created.plan_name });
      return reply.status(201).send(created);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async assign(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.customer_id || !body.diet_plan_id) {
        return reply.status(400).send({ error: 'Customer ID and Diet Plan ID are required.' });
      }
      const assignment = DietRepository.assignPlan(body);
      logAudit(request.user?.id || null, 'ASSIGN_DIET', 'diet_assignment', assignment.id, body);
      return reply.status(201).send(assignment);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
