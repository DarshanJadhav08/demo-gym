import { FastifyInstance } from 'fastify';
import { DietController } from '../controllers/diet.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function dietRoutes(fastify: FastifyInstance) {
  const staffOrAdmin = [authenticate, requireRole(['superadmin', 'admin', 'trainer'])];

  fastify.get('/diets', { preHandler: [authenticate] }, DietController.getAll);
  fastify.get('/diets/:id', { preHandler: [authenticate] }, DietController.getById);
  fastify.post('/diets', { preHandler: staffOrAdmin }, DietController.create);
  fastify.post('/diets/assign', { preHandler: staffOrAdmin }, DietController.assign);
}
