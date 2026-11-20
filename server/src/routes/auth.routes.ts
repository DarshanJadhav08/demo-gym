import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', AuthController.login);
  fastify.post('/auth/register', AuthController.register);
  fastify.get('/auth/me', { preHandler: [authenticate] }, AuthController.me);
}
