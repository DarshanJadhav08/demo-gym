import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const defaultDbPath = fs.existsSync(path.resolve(process.cwd(), 'server', 'database'))
  ? path.resolve(process.cwd(), 'server', 'database', 'apex_gym.db')
  : path.resolve(process.cwd(), 'database', 'apex_gym.db');

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'apex_elite_super_secure_jwt_secret_key_2026_!@#$',
  dbPath: process.env.DB_PATH || defaultDbPath,
  gymName: 'APEX ELITE FITNESS',
  adminEmail: 'admin@apexelite.com',
};
