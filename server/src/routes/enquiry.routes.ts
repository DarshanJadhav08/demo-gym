import { FastifyInstance } from 'fastify';
import { EnquiryController } from '../controllers/enquiry.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function enquiryRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  // Public Lead submissions
  fastify.post('/enquiries/submit', EnquiryController.submitPublic);

  // Admin Leads Management
  fastify.get('/enquiries', { preHandler: adminOnly }, EnquiryController.getAll);
  fastify.put('/enquiries/:id/status', { preHandler: adminOnly }, EnquiryController.updateStatus);
  fastify.post('/enquiries/:id/convert', { preHandler: adminOnly }, EnquiryController.convertToCustomer);
}
