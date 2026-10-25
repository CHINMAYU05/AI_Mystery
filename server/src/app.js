import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { casesRouter } from './routes/cases.js';
import { env } from './config/env.js';
import { errorHandler, notFound, requestId } from './middleware/errors.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, allowedHeaders: ['Content-Type', 'Authorization'], methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '32kb' }));
app.use(requestId);
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/cases', casesRouter);
app.use(notFound);
app.use(errorHandler);
