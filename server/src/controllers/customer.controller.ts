import { FastifyRequest, FastifyReply } from 'fastify';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { logAudit } from '../middleware/auth.js';

export class CustomerController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const result = CustomerRepository.getAll({
        search: q.search,
        status: q.status,
        trainerId: q.trainerId,
        planId: q.planId,
        limit: q.limit ? parseInt(q.limit, 10) : undefined,
        offset: q.offset ? parseInt(q.offset, 10) : undefined,
      });
      return reply.send(result);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const customer = CustomerRepository.getById(id);
      if (!customer) {
        return reply.status(404).send({ error: 'Customer not found' });
      }
      return reply.send(customer);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.full_name || !body.mobile_number || !body.email) {
        return reply.status(400).send({ error: 'Full name, mobile number, and email are required.' });
      }
      const customer = CustomerRepository.create(body);
      logAudit(request.user?.id || null, 'CREATE_CUSTOMER', 'customer', customer.id, { name: customer.full_name });
      return reply.status(201).send(customer);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = CustomerRepository.update(id, body);
      logAudit(request.user?.id || null, 'UPDATE_CUSTOMER', 'customer', id, body);
      return reply.send(updated);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      CustomerRepository.delete(id);
      logAudit(request.user?.id || null, 'DELETE_CUSTOMER', 'customer', id);
      return reply.send({ success: true, message: 'Customer successfully deleted' });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }
}
