import { FastifyRequest, FastifyReply } from 'fastify';
import { ExpenseRepository } from '../repositories/expense.repository.js';
import { logAudit } from '../middleware/auth.js';

export class ExpenseController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const expenses = ExpenseRepository.getAll({
        category: q.category,
        startDate: q.startDate,
        endDate: q.endDate
      });
      return reply.send(expenses);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.amount || !body.category || !body.description) {
        return reply.status(400).send({ error: 'Amount, category, and description are required.' });
      }
      body.created_by = request.user?.username || 'Admin';
      const expense = ExpenseRepository.create(body);
      logAudit(request.user?.id || null, 'RECORD_EXPENSE', 'expense', expense.id, body);
      return reply.status(201).send(expense);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      ExpenseRepository.delete(id);
      logAudit(request.user?.id || null, 'DELETE_EXPENSE', 'expense', id);
      return reply.send({ success: true, message: 'Expense deleted' });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }
}
