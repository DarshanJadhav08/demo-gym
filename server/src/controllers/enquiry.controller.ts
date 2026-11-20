import { FastifyRequest, FastifyReply } from 'fastify';
import { EnquiryRepository } from '../repositories/enquiry.repository.js';
import { logAudit } from '../middleware/auth.js';

export class EnquiryController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const enquiries = EnquiryRepository.getAll({ status: q.status, search: q.search });
      return reply.send(enquiries);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async submitPublic(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.full_name || !body.email || !body.phone) {
        return reply.status(400).send({ error: 'Full name, email, and phone number are required.' });
      }
      const enquiry = EnquiryRepository.create(body);
      return reply.status(201).send({
        success: true,
        message: 'Your enquiry has been received! Our fitness advisor will get in touch with you shortly.',
        enquiry
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      if (!body.status) return reply.status(400).send({ error: 'Status is required.' });

      const updated = EnquiryRepository.updateStatus(id, body);
      logAudit(request.user?.id || null, 'UPDATE_ENQUIRY_STATUS', 'enquiry', id, body);
      return reply.send(updated);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async convertToCustomer(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const result = EnquiryRepository.convertToCustomer(id, body);
      logAudit(request.user?.id || null, 'CONVERT_ENQUIRY_TO_CUSTOMER', 'enquiry', id, { customer_id: result.customer.id });
      return reply.send({
        success: true,
        message: 'Lead successfully converted into an active customer record!',
        ...result
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
