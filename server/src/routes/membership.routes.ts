import { FastifyInstance } from 'fastify';
import { MembershipController } from '../controllers/membership.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function membershipRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  // Public Plans
  fastify.get('/memberships/plans', MembershipController.getPlans);
  fastify.get('/memberships/plans/:id', MembershipController.getPlanById);

  // Admin Plans CRUD
  fastify.post('/memberships/plans', { preHandler: adminOnly }, MembershipController.createPlan);
  fastify.put('/memberships/plans/:id', { preHandler: adminOnly }, MembershipController.updatePlan);
  fastify.delete('/memberships/plans/:id', { preHandler: adminOnly }, MembershipController.deletePlan);

  // Applications
  fastify.get('/memberships/applications', { preHandler: adminOnly }, MembershipController.getApplications);
  fastify.post('/memberships/applications', MembershipController.submitApplication);
  fastify.put('/memberships/applications/:id/review', { preHandler: adminOnly }, MembershipController.reviewApplication);

  // Customer Memberships
  fastify.get('/memberships/customer-memberships', { preHandler: adminOnly }, MembershipController.getAllCustomerMemberships);
  fastify.post('/memberships/assign', { preHandler: adminOnly }, MembershipController.assignMembership);
}
