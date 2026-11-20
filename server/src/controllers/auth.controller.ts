import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as any;
      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required.' });
      }

      const jwtSign = (payload: any) => (request.server as any).jwt.sign(payload);
      const result = await AuthService.login(email, password, jwtSign);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Login failed.' });
    }
  }

  static async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      if (!body.email || !body.password || !body.full_name || !body.mobile_number) {
        return reply.status(400).send({ error: 'All fields (name, email, password, mobile) are required.' });
      }

      const jwtSign = (payload: any) => (request.server as any).jwt.sign(payload);
      const result = await AuthService.registerCustomer(body, jwtSign);
      return reply.status(201).send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Registration failed.' });
    }
  }

  static async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
      const profile = AuthService.getProfile(request.user.id);
      return reply.send({ user: profile });
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  }
}
