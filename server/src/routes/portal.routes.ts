import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { TrainerRepository } from '../repositories/trainer.repository.js';
import { db } from '../database/db.js';

export async function portalRoutes(fastify: FastifyInstance) {
  // Customer Portal: Get currently logged-in customer's dashboard
  fastify.get('/portal/customer/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user!;
      let customerId = user.customer_id;
      if (!customerId) {
        const cust = db.prepare('SELECT id FROM customers WHERE user_id = ? OR email = ?').get(user.id, user.email) as any;
        customerId = cust?.id;
      }
      if (!customerId) {
        return reply.status(404).send({ error: 'Customer profile not found for this account.' });
      }
      const fullProfile = CustomerRepository.getById(customerId);
      return reply.send(fullProfile);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  // Trainer Portal: Get currently logged-in trainer's dashboard
  fastify.get('/portal/trainer/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user!;
      let trainerId = user.trainer_id;
      if (!trainerId) {
        const trn = db.prepare('SELECT id FROM trainers WHERE user_id = ? OR email = ?').get(user.id, user.email) as any;
        trainerId = trn?.id;
      }
      if (!trainerId) {
        return reply.status(404).send({ error: 'Trainer profile not found for this account.' });
      }
      const fullProfile = TrainerRepository.getById(trainerId);
      return reply.send(fullProfile);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });
}
