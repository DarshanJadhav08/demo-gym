import { FastifyRequest, FastifyReply } from 'fastify';
import { ReportRepository } from '../repositories/report.repository.js';

export class ReportController {
  static async getDashboardSummary(request: FastifyRequest, reply: FastifyReply) {
    try {
      const summary = ReportRepository.getDashboardSummary();
      return reply.send(summary);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getFinancialReport(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const report = ReportRepository.getFinancialReport(q.startDate, q.endDate);
      return reply.send(report);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }
}
