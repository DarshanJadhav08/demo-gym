import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes.js';
import { customerRoutes } from './customer.routes.js';
import { trainerRoutes } from './trainer.routes.js';
import { membershipRoutes } from './membership.routes.js';
import { paymentRoutes } from './payment.routes.js';
import { attendanceRoutes } from './attendance.routes.js';
import { workoutRoutes } from './workout.routes.js';
import { dietRoutes } from './diet.routes.js';
import { enquiryRoutes } from './enquiry.routes.js';
import { expenseRoutes } from './expense.routes.js';
import { reportRoutes } from './report.routes.js';
import { contentRoutes } from './content.routes.js';
import { portalRoutes } from './portal.routes.js';

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/api' });
  fastify.register(customerRoutes, { prefix: '/api' });
  fastify.register(trainerRoutes, { prefix: '/api' });
  fastify.register(membershipRoutes, { prefix: '/api' });
  fastify.register(paymentRoutes, { prefix: '/api' });
  fastify.register(attendanceRoutes, { prefix: '/api' });
  fastify.register(workoutRoutes, { prefix: '/api' });
  fastify.register(dietRoutes, { prefix: '/api' });
  fastify.register(enquiryRoutes, { prefix: '/api' });
  fastify.register(expenseRoutes, { prefix: '/api' });
  fastify.register(reportRoutes, { prefix: '/api' });
  fastify.register(contentRoutes, { prefix: '/api' });
  fastify.register(portalRoutes, { prefix: '/api' });

  fastify.get('/api/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString(), platform: 'Apex Elite Gym Management API' };
  });
}
