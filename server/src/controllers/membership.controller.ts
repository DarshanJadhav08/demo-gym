import { FastifyRequest, FastifyReply } from 'fastify';
import { MembershipRepository } from '../repositories/membership.repository.js';
import { logAudit } from '../middleware/auth.js';

export class MembershipController {
  // Plans
  static async getPlans(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const plans = MembershipRepository.getAllPlans(q.activeOnly === 'true');
      return reply.send(plans);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getPlanById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const plan = MembershipRepository.getPlanById(id);
      if (!plan) return reply.status(404).send({ error: 'Plan not found' });
      return reply.send(plan);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async createPlan(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.name || !body.price) {
        return reply.status(400).send({ error: 'Plan name and price are required.' });
      }
      const plan = MembershipRepository.createPlan(body);
      logAudit(request.user?.id || null, 'CREATE_PLAN', 'membership_plan', plan.id, { name: plan.name });
      return reply.status(201).send(plan);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async updatePlan(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const updated = MembershipRepository.updatePlan(id, body);
      logAudit(request.user?.id || null, 'UPDATE_PLAN', 'membership_plan', id, body);
      return reply.send(updated);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async deletePlan(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      MembershipRepository.deletePlan(id);
      logAudit(request.user?.id || null, 'DELETE_PLAN', 'membership_plan', id);
      return reply.send({ success: true, message: 'Plan deleted' });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  // Applications
  static async getApplications(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const apps = MembershipRepository.getApplications(q.status);
      return reply.send(apps);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async submitApplication(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.full_name || !body.email || !body.mobile_number || !body.plan_id) {
        return reply.status(400).send({ error: 'Name, email, mobile number, and plan selection are required.' });
      }
      const app = MembershipRepository.createApplication(body);
      return reply.status(201).send({
        success: true,
        message: 'Membership application submitted successfully! Our gym advisor will review and confirm your access.',
        application: app
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async reviewApplication(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: 'approved' | 'rejected' };
      const reviewer = request.user?.username || 'Admin';

      const app = MembershipRepository.updateApplicationStatus(id, status, reviewer);
      logAudit(request.user?.id || null, 'REVIEW_APPLICATION', 'membership_application', id, { status });

      return reply.send({ success: true, application: app });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  // Customer Memberships
  static async getAllCustomerMemberships(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      const list = MembershipRepository.getAllCustomerMemberships({ status: q.status, search: q.search });
      return reply.send(list);
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async assignMembership(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.customer_id || !body.plan_id) {
        return reply.status(400).send({ error: 'Customer ID and Plan ID are required.' });
      }
      const mem = MembershipRepository.assignMembership(body);
      logAudit(request.user?.id || null, 'ASSIGN_MEMBERSHIP', 'customer_membership', mem.id, body);
      return reply.status(201).send(mem);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
