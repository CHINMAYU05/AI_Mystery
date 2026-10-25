import { randomUUID } from 'node:crypto';

export function requestId(req, res, next) {
  req.requestId = randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
}

export function notFound(_req, res) {
  return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'That route could not be found.' } });
}

export function errorHandler(error, req, res, _next) {
  const status = error.status || (error.name === 'ZodError' ? 400 : 500);
  const code = error.code || (error.name === 'ZodError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR');
  if (status >= 500) console.error(JSON.stringify({ timestamp: new Date().toISOString(), requestId: req.requestId, route: req.path, operation: req.method, errorCategory: error.name || 'Error' }));
  return res.status(status).json({ error: { code, message: status >= 500 ? 'Something went wrong. Please try again.' : error.message, requestId: req.requestId } });
}
