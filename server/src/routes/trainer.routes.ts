import { FastifyInstance } from 'fastify';
import { TrainerController } from '../controllers/trainer.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function trainerRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  // Public/All can see trainers
  fastify.get('/trainers', TrainerController.getAll);
  fastify.get('/trainers/:id', TrainerController.getById);

  // Admin management
  fastify.post('/trainers', { preHandler: adminOnly }, TrainerController.create);
  fastify.put('/trainers/:id', { preHandler: adminOnly }, TrainerController.update);
  fastify.delete('/trainers/:id', { preHandler: adminOnly }, TrainerController.delete);
}
