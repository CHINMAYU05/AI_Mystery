import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { createCaseSchema } from '../../../shared/schemas/case.js';
import { env } from '../config/env.js';
import { beginCase, getCase, getSolution, hasCaseAccess, isValidCaseId, submitAccusation } from '../services/caseService.js';

export const casesRouter = Router();
const createLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX_CASES, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED', message: 'Too many cases were started. Please try again later.' } } });
const sendError = (res, status, code, message) => res.status(status).json({ error: { code, message } });

async function authorizedCase(req, res) {
  if (!isValidCaseId(req.params.caseId)) { sendError(res, 404, 'CASE_NOT_FOUND', 'Case not found.'); return null; }
  const record = await getCase(req.params.caseId);
  if (!record) { sendError(res, 404, 'CASE_NOT_FOUND', 'Case not found.'); return null; }
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!hasCaseAccess(record.accessTokenHash, token)) { sendError(res, 401, 'UNAUTHORIZED', 'This case link is private. Open it in the browser where it was created.'); return null; }
  return record;
}

casesRouter.post('/', createLimiter, async (req, res, next) => {
  try {
    const parsed = createCaseSchema.parse(req.body);
    const created = await beginCase(parsed);
    return res.status(202).json({ caseId: created.id, state: created.state, accessToken: created.accessToken, message: 'Your case file is being assembled.' });
  } catch (error) { next(error); }
});

casesRouter.get('/:caseId/status', async (req, res, next) => {
  try {
    const record = await authorizedCase(req, res); if (!record) return;
    return res.json({ caseId: record._id.toString(), state: record.state, message: ({ generating: 'Cross-checking the evidence…', ready: 'The case file is ready.', completed: 'The investigation is complete.', failed: 'Case generation failed. Please start a new case.' })[record.state], retryAvailable: false });
  } catch (error) { next(error); }
});

casesRouter.get('/:caseId', async (req, res, next) => {
  try {
    const record = await authorizedCase(req, res); if (!record) return;
    return res.json({ caseId: record._id.toString(), state: record.state, ...(record.publicCase ? { case: record.publicCase } : {}) });
  } catch (error) { next(error); }
});

casesRouter.post('/:caseId/accusation', async (req, res, next) => {
  try {
    const record = await authorizedCase(req, res); if (!record) return;
    if (record.state === 'completed') return sendError(res, 409, 'DUPLICATE_ACCUSATION', 'An accusation has already been recorded for this case.');
    if (record.state !== 'ready') return sendError(res, 409, 'CASE_NOT_READY', 'This case is not ready for an accusation yet.');
    const suspectId = req.body?.suspectId;
    if (typeof suspectId !== 'string' || !record.publicCase.suspects.some((suspect) => suspect.id === suspectId)) return sendError(res, 400, 'INVALID_SUSPECT', 'Choose one of the listed suspects.');
    const submitted = await submitAccusation(record._id, suspectId);
    if (!submitted) return sendError(res, 409, 'DUPLICATE_ACCUSATION', 'An accusation has already been recorded for this case.');
    return res.json({ reveal: makeReveal(submitted.record, submitted.solution) });
  } catch (error) { next(error); }
});

casesRouter.get('/:caseId/reveal', async (req, res, next) => {
  try {
    const record = await authorizedCase(req, res); if (!record) return;
    if (record.state !== 'completed') return sendError(res, 409, 'CASE_NOT_COMPLETED', 'Make an accusation before opening the reveal.');
    const privateRecord = await getSolution(record._id);
    if (!privateRecord) return sendError(res, 500, 'SOLUTION_UNAVAILABLE', 'The case reveal is temporarily unavailable.');
    return res.json({ reveal: makeReveal(record, privateRecord.solution) });
  } catch (error) { next(error); }
});

function makeReveal(record, solution) {
  return { isCorrect: record.accusation.suspectId === solution.culpritSuspectId, accusedSuspectId: record.accusation.suspectId, culpritSuspectId: solution.culpritSuspectId,
    motive: solution.motive, method: solution.method, opportunity: solution.opportunity, summary: solution.summary,
    evidenceChain: solution.evidenceChain, redHerringExplanations: solution.redHerringExplanations };
}
