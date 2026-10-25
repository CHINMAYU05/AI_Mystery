import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string().default('development'), PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'), MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/ai-mystery-room'),
  AI_PROVIDER: z.enum(['mock', 'gemini']).default('mock'), GEMINI_API_KEY: z.string().optional(), GEMINI_MODEL: z.string().default('gemini-flash-latest'),
  CASE_ACCESS_SECRET: z.string().min(32).default('local-development-secret-change-this-value'), AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
  AI_MAX_REPAIR_ATTEMPTS: z.coerce.number().int().min(0).max(2).default(2), RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000), RATE_LIMIT_MAX_CASES: z.coerce.number().int().positive().default(5),
  CASE_TTL_DAYS: z.preprocess((value) => value === '' ? undefined : value, z.coerce.number().positive().optional())
});

export const env = schema.parse(process.env);
if (env.AI_PROVIDER === 'gemini' && !env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is required when AI_PROVIDER=gemini.');
