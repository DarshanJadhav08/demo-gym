import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'apex_elite_super_secure_jwt_secret_key_2026_!@#$',
  dbPath: process.env.DB_PATH || path.resolve(process.cwd(), 'database', 'apex_gym.db'),
  gymName: 'APEX ELITE FITNESS',
  adminEmail: 'admin@apexelite.com',
};
