import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controllers/customer.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function customerRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];
  const staffOrAdmin = [authenticate, requireRole(['superadmin', 'admin', 'trainer'])];

  fastify.get('/customers', { preHandler: staffOrAdmin }, CustomerController.getAll);
  fastify.get('/customers/:id', { preHandler: staffOrAdmin }, CustomerController.getById);
  fastify.post('/customers', { preHandler: adminOnly }, CustomerController.create);
  fastify.put('/customers/:id', { preHandler: adminOnly }, CustomerController.update);
  fastify.delete('/customers/:id', { preHandler: adminOnly }, CustomerController.delete);
}
