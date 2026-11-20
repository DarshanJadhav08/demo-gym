import { FastifyRequest, FastifyReply } from 'fastify';
import { PaymentRepository } from '../repositories/payment.repository.js';
import { logAudit } from '../middleware/auth.js';

export class PaymentController {
  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const payments = PaymentRepository.getAll({
        customerId: q.customerId,
        paymentMethod: q.paymentMethod,
        startDate: q.startDate,
        endDate: q.endDate
      });
      return reply.send(payments);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const payment = PaymentRepository.getById(id);
      if (!payment) return reply.status(404).send({ error: 'Payment receipt not found' });
      return reply.send(payment);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async createPayment(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.customer_id || body.paid_amount === undefined || !body.payment_method) {
        return reply.status(400).send({ error: 'Customer ID, paid amount, and payment method are required.' });
      }
      const payment = PaymentRepository.createPayment(body);
      logAudit(request.user?.id || null, 'COLLECT_PAYMENT', 'payment', payment.id, {
        customer_id: body.customer_id,
        paid: body.paid_amount,
        receipt: payment.receipt_number
      });
      return reply.status(201).send(payment);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
