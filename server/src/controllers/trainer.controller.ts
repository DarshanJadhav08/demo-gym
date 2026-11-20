import { FastifyRequest, FastifyReply } from 'fastify';
import { TrainerRepository } from '../repositories/trainer.repository.js';
import { logAudit } from '../middleware/auth.js';

export class TrainerController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const trainers = TrainerRepository.getAll({ status: q.status, search: q.search });
      return reply.send(trainers);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const trainer = TrainerRepository.getById(id);
      if (!trainer) return reply.status(404).send({ error: 'Trainer not found' });
      return reply.send(trainer);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.full_name || !body.mobile_number || !body.email || !body.specialization) {
        return reply.status(400).send({ error: 'Full name, mobile number, email, and specialization are required.' });
      }
      const trainer = TrainerRepository.create(body);
      logAudit(request.user?.id || null, 'CREATE_TRAINER', 'trainer', trainer.id, { name: trainer.full_name });
      return reply.status(201).send(trainer);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = TrainerRepository.update(id, body);
      logAudit(request.user?.id || null, 'UPDATE_TRAINER', 'trainer', id, body);
      return reply.send(updated);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      TrainerRepository.delete(id);
      logAudit(request.user?.id || null, 'DELETE_TRAINER', 'trainer', id);
      return reply.send({ success: true, message: 'Trainer removed' });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }
}
