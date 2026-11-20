import { FastifyInstance } from 'fastify';
import { WorkoutController } from '../controllers/workout.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function workoutRoutes(fastify: FastifyInstance) {
  const staffOrAdmin = [authenticate, requireRole(['superadmin', 'admin', 'trainer'])];

  fastify.get('/workouts', { preHandler: [authenticate] }, WorkoutController.getAll);
  fastify.get('/workouts/:id', { preHandler: [authenticate] }, WorkoutController.getById);
  fastify.post('/workouts', { preHandler: staffOrAdmin }, WorkoutController.create);
  fastify.post('/workouts/assign', { preHandler: staffOrAdmin }, WorkoutController.assign);
}
