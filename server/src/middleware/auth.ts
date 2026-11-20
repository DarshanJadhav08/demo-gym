import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../database/db.js';
import { generateId } from '../utils/idGenerator.js';

export interface AuthPayload {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'trainer' | 'customer';
  username: string;
  customer_id?: string;
  trainer_id?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized: Missing or invalid token format.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = (await (request.server as any).jwt.verify(token)) as AuthPayload;
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized: Session expired or invalid token.' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized: Authentication required.' });
    }
    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({ error: `Forbidden: Required role(s) [${allowedRoles.join(', ')}]. Your role is ${request.user.role}.` });
    }
  };
}

export function logAudit(userId: string | null, action: string, entityType: string, entityId?: string, details?: any) {
  try {
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      generateId('aud'),
      userId || null,
      action,
      entityType,
      entityId || null,
      typeof details === 'object' ? JSON.stringify(details) : details || null
    );
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}
