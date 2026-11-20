import { FastifyInstance } from 'fastify';
import { ExpenseController } from '../controllers/expense.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function expenseRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  fastify.get('/expenses', { preHandler: adminOnly }, ExpenseController.getAll);
  fastify.post('/expenses', { preHandler: adminOnly }, ExpenseController.create);
  fastify.delete('/expenses/:id', { preHandler: adminOnly }, ExpenseController.delete);
}
