import { FastifyRequest, FastifyReply } from 'fastify';
import { AttendanceRepository } from '../repositories/attendance.repository.js';
import { logAudit } from '../middleware/auth.js';

export class AttendanceController {
  static async getToday(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = AttendanceRepository.getTodayAttendance();
      return reply.send(data);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getHistory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const history = AttendanceRepository.getHistory({
        date: q.date,
        customerId: q.customerId,
        trainerId: q.trainerId,
        limit: q.limit ? parseInt(q.limit, 10) : 50
      });
      return reply.send(history);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async checkIn(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.entity_type || (!body.customer_id && !body.trainer_id)) {
        return reply.status(400).send({ error: 'entity_type (customer or trainer) and an ID are required.' });
      }
      const record = AttendanceRepository.checkIn(body);
      logAudit(request.user?.id || null, 'CHECK_IN', 'attendance', record.id, body);
      return reply.status(201).send(record);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async checkOut(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const record = AttendanceRepository.checkOut(id);
      logAudit(request.user?.id || null, 'CHECK_OUT', 'attendance', id);
      return reply.send(record);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
