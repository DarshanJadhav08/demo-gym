import { FastifyRequest, FastifyReply } from 'fastify';
import { ContentRepository } from '../repositories/content.repository.js';
import { TrainerRepository } from '../repositories/trainer.repository.js';
import { MembershipRepository } from '../repositories/membership.repository.js';
import { logAudit } from '../middleware/auth.js';

export class ContentController {
  static async getPublicHomeData(request: FastifyRequest, reply: FastifyReply) {
    try {
      const services = ContentRepository.getServices(true);
      const programs = ContentRepository.getPrograms(true);
      const classes = ContentRepository.getClasses(true);
      const testimonials = ContentRepository.getTestimonials();
      const gallery = ContentRepository.getGallery();
      const settings = ContentRepository.getSettings();
      const trainers = TrainerRepository.getAll({ status: 'active' });
      const membershipPlans = MembershipRepository.getAllPlans(true);

      return reply.send({
        settings,
        services,
        programs,
        classes,
        testimonials,
        gallery,
        trainers,
        membershipPlans
      });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getServices(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(ContentRepository.getServices());
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getClasses(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(ContentRepository.getClasses());
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getGallery(request: FastifyRequest, reply: FastifyReply) {
    try {
      const q = request.query as any;
      return reply.send(ContentRepository.getGallery(q.category));
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async getSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send(ContentRepository.getSettings());
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  }

  static async updateSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      const updated = ContentRepository.updateSettings(body);
      logAudit(request.user?.id || null, 'UPDATE_SETTINGS', 'gym_settings', 'settings', body);
      return reply.send(updated);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  static async subscribeNewsletter(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = request.body as { email: string };
      if (!email || !email.includes('@')) {
        return reply.status(400).send({ error: 'A valid email address is required.' });
      }
      const res = ContentRepository.subscribeNewsletter(email);
      return reply.send(res);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
