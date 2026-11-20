import { FastifyInstance } from 'fastify';
import { ContentController } from '../controllers/content.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function contentRoutes(fastify: FastifyInstance) {
  const adminOnly = [authenticate, requireRole(['superadmin', 'admin'])];

  // Public Home & Sections
  fastify.get('/content/home-data', ContentController.getPublicHomeData);
  fastify.get('/content/services', ContentController.getServices);
  fastify.get('/content/classes', ContentController.getClasses);
  fastify.get('/content/gallery', ContentController.getGallery);
  fastify.get('/content/settings', ContentController.getSettings);
  fastify.post('/content/newsletter', ContentController.subscribeNewsletter);

  // Admin Settings
  fastify.put('/content/settings', { preHandler: adminOnly }, ContentController.updateSettings);
}
