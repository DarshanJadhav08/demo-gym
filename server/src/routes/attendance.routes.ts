import { FastifyInstance } from 'fastify';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export async function attendanceRoutes(fastify: FastifyInstance) {
  const staffOrAdmin = [authenticate, requireRole(['superadmin', 'admin', 'trainer'])];

  fastify.get('/attendance/today', { preHandler: staffOrAdmin }, AttendanceController.getToday);
  fastify.get('/attendance/history', { preHandler: staffOrAdmin }, AttendanceController.getHistory);
  fastify.post('/attendance/check-in', { preHandler: staffOrAdmin }, AttendanceController.checkIn);
  fastify.post('/attendance/check-out/:id', { preHandler: staffOrAdmin }, AttendanceController.checkOut);
}
