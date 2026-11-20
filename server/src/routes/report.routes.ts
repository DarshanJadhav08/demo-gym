import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function reportRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  fastify.get('/reports/dashboard-summary', { preHandler: adminOnly }, ReportController.getDashboardSummary);
  fastify.get('/reports/financial', { preHandler: adminOnly }, ReportController.getFinancialReport);
}
