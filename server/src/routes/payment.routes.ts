import { FastifyInstance } from 'fastify';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function paymentRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];
  const authenticated = [authenticate];

  fastify.get('/payments', { preHandler: adminOnly }, PaymentController.getAll);
  fastify.get('/payments/:id', { preHandler: authenticated }, PaymentController.getById);
  fastify.post('/payments', { preHandler: adminOnly }, PaymentController.createPayment);
}
