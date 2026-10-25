import { z } from 'zod';

const text = (max = 2000) => z.string().trim().min(1).max(max);
export const createCaseSchema = z.object({
  premise: z.string().trim().min(30).max(2000),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  caseLength: z.enum(['short', 'standard']).default('standard'),
  tone: z.enum(['cozy', 'noir', 'thriller', 'lighthearted']).default('noir'),
  language: z.literal('en').default('en'),
  evidencePreferences: z.array(z.enum(['chat', 'image', 'cctv', 'document', 'witness', 'forensic'])).min(1).max(6).default(['chat', 'image', 'cctv', 'document', 'witness', 'forensic'])
}).strict();

export const generatedCaseSchema = z.object({
  schemaVersion: z.literal('1.0'),
  title: text(120), summary: text(500), setting: text(200), briefing: text(3000),
  difficulty: z.enum(['easy', 'medium', 'hard']), tone: z.enum(['cozy', 'noir', 'thriller', 'lighthearted']),
  suspects: z.array(z.object({ id: text(40), name: text(100), role: text(120), bio: text(500), publicMotiveHint: text(300), alibi: text(500), avatarDescription: z.string().max(300).optional() }).strict()).min(3).max(6),
  evidence: z.array(z.object({ id: text(40), type: z.enum(['chat', 'image', 'cctv', 'document', 'witness', 'forensic']), title: text(120), summary: text(300), content: text(2500), createdAtInStory: z.string().max(100).optional(), sourceLabel: text(120), mediaStatus: z.enum(['text_simulation', 'prompt_only', 'generated']), mediaPrompt: z.string().max(500).optional(), mediaUrl: z.string().url().optional(), clueRole: z.enum(['supporting', 'contradicting', 'red_herring', 'context']), linkedSuspectIds: z.array(text(40)).max(6) }).strict()).min(5).max(10),
  timeline: z.array(z.object({ id: text(40), timeLabel: text(80), description: text(500), linkedEvidenceIds: z.array(text(40)).max(10) }).strict()).min(4).max(15),
  solution: z.object({ culpritSuspectId: text(40), motive: text(1000), method: text(1000), opportunity: text(1000), summary: text(2500), evidenceChain: z.array(z.object({ evidenceId: text(40), explanation: text(1000) }).strict()).min(2).max(10), redHerringExplanations: z.array(z.object({ evidenceId: text(40), explanation: text(800) }).strict()).max(10) }).strict(),
  contentNotes: z.array(z.string().max(300)).max(10)
}).strict();

export function validateGeneratedCase(value, request) {
  const parsed = generatedCaseSchema.parse(value);
  const suspectIds = parsed.suspects.map((item) => item.id);
  const evidenceIds = parsed.evidence.map((item) => item.id);
  if (new Set(suspectIds).size !== suspectIds.length || new Set(evidenceIds).size !== evidenceIds.length) throw new Error('Generated identifiers must be unique.');
  if (!suspectIds.includes(parsed.solution.culpritSuspectId)) throw new Error('The canonical culprit must be a listed suspect.');
  if (parsed.evidence.some((item) => item.linkedSuspectIds.some((id) => !suspectIds.includes(id)))) throw new Error('Evidence references a missing suspect.');
  if (parsed.evidence.some((item) => item.mediaUrl || item.mediaStatus === 'generated')) throw new Error('External media must not be published without server-side media generation.');
  if (parsed.timeline.some((item) => item.linkedEvidenceIds.some((id) => !evidenceIds.includes(id)))) throw new Error('Timeline references missing evidence.');
  if ([...parsed.solution.evidenceChain, ...parsed.solution.redHerringExplanations].some((item) => !evidenceIds.includes(item.evidenceId))) throw new Error('Solution references missing evidence.');
  if (request.caseLength === 'short' && (parsed.suspects.length !== 3 || parsed.evidence.length !== 5 || parsed.timeline.length < 4)) throw new Error('Generated case does not meet short case targets.');
  if (request.caseLength === 'standard' && (parsed.suspects.length < 4 || parsed.evidence.length < 7 || parsed.timeline.length < 5)) throw new Error('Generated case does not meet standard case targets.');
  return parsed;
}

export function toPublicCase(generated) {
  return { schemaVersion: generated.schemaVersion, title: generated.title, summary: generated.summary, setting: generated.setting, briefing: generated.briefing, difficulty: generated.difficulty, tone: generated.tone,
    suspects: generated.suspects.map(({ id, name, role, bio, publicMotiveHint, alibi, avatarDescription }) => ({ id, name, role, bio, publicMotiveHint, alibi, avatarDescription })),
    evidence: generated.evidence.map(({ id, type, title, summary, content, createdAtInStory, sourceLabel, mediaStatus, mediaPrompt, linkedSuspectIds }) => ({ id, type, title, summary, content, createdAtInStory, sourceLabel, mediaStatus, mediaPrompt, linkedSuspectIds })),
    timeline: generated.timeline };
}
