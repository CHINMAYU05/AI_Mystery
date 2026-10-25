import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { MysteryCase } from '../models/MysteryCase.js';
import { PrivateSolution } from '../models/PrivateSolution.js';
import { validateGeneratedCase, toPublicCase } from '../../../shared/schemas/case.js';
import { mockProvider } from './ai/mockProvider.js';
import { createGeminiProvider } from './ai/geminiProvider.js';

const provider = env.AI_PROVIDER === 'gemini' ? createGeminiProvider({ apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL, timeoutMs: env.AI_REQUEST_TIMEOUT_MS }) : mockProvider;
const hashToken = (token) => createHash('sha256').update(`${env.CASE_ACCESS_SECRET}:${token}`).digest('hex');

export function hasCaseAccess(storedHash, token) {
  if (!storedHash || !token) return false;
  const expected = Buffer.from(storedHash, 'hex');
  const actual = Buffer.from(hashToken(token), 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function beginCase(request) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = env.CASE_TTL_DAYS ? new Date(Date.now() + env.CASE_TTL_DAYS * 86400000) : undefined;
  const record = await MysteryCase.create({ state: 'generating', accessTokenHash: hashToken(token), request, expiresAt, generation: { attemptCount: 0, promptVersion: '1.0', model: provider.name } });
  void generateAndPublish(record._id.toString(), request);
  return { id: record._id.toString(), accessToken: token, state: record.state };
}

async function generateAndPublish(caseId, request) {
  const errors = [];
  for (let attempt = 0; attempt <= env.AI_MAX_REPAIR_ATTEMPTS; attempt += 1) {
    try {
      const raw = await provider.generate(request, errors);
      const generated = validateGeneratedCase(raw, request);
      const publicCase = toPublicCase(generated);
      await PrivateSolution.create({ caseId, solution: generated.solution });
      await MysteryCase.findByIdAndUpdate(caseId, { state: 'ready', publicCase, 'generation.attemptCount': attempt + 1 });
      return;
    } catch (error) {
      errors.push(error.message);
      if (attempt === env.AI_MAX_REPAIR_ATTEMPTS) {
        await MysteryCase.findByIdAndUpdate(caseId, { state: 'failed', 'generation.attemptCount': attempt + 1, 'generation.lastErrorCategory': error.name === 'ZodError' ? 'validation' : 'provider' });
      }
    }
  }
}

export function isValidCaseId(id) { return mongoose.isValidObjectId(id); }

export async function getCase(id) { return MysteryCase.findById(id).select('+accessTokenHash').lean(); }

export async function submitAccusation(id, suspectId) {
  const record = await MysteryCase.findOneAndUpdate({ _id: id, state: 'ready', accusation: null, 'publicCase.suspects.id': suspectId }, { $set: { accusation: { suspectId, submittedAt: new Date() }, state: 'completed' } }, { new: true }).lean();
  if (!record) return null;
  const privateRecord = await PrivateSolution.findOne({ caseId: id }).lean();
  if (!privateRecord) throw new Error('Private solution record is missing.');
  return { record, solution: privateRecord.solution };
}

export async function getSolution(id) { return PrivateSolution.findOne({ caseId: id }).lean(); }
