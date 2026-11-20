import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config/index.js';
import { registerRoutes } from './routes/index.js';
import { initializeSchema } from './database/schema.js';

const app = Fastify({
  logger: false,
});

async function bootstrap() {
  // Initialize Database Schema
  initializeSchema();

  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register JWT
  await app.register(fastifyJwt, {
    secret: config.jwtSecret,
  });

  // Register API Routes
  await registerRoutes(app);

  // Serve Client Static Build if available
  const clientDistCandidates = [
    path.resolve(process.cwd(), 'client', 'dist'),
    path.resolve(process.cwd(), '..', 'client', 'dist'),
  ];
  const clientDist = clientDistCandidates.find((p) => fs.existsSync(p));
  if (clientDist) {
    await app.register(fastifyStatic, {
      root: clientDist,
      prefix: '/',
    });

    // SPA fallback: send index.html for non-api routes
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api')) {
        return reply.status(404).send({ error: 'Endpoint not found' });
      }
      return reply.sendFile('index.html');
    });
    console.log(`📦 Serving production client build from: ${clientDist}`);
  }

  // Global Error Handler
  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: error.message || 'Internal Server Error',
      statusCode,
    });
  });

  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`\n🚀 APEX ELITE FITNESS PLATFORM RUNNING AT: http://localhost:${config.port}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🏋️ Public Website: http://localhost:${config.port}/`);
    console.log(`👑 Admin Dashboard: http://localhost:${config.port}/admin`);
    console.log(`👤 Customer Portal: http://localhost:${config.port}/portal`);
    console.log(`💪 Trainer Portal: http://localhost:${config.port}/trainer\n`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
