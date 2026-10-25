import { describe, expect, it } from 'vitest';
import { createCaseSchema, toPublicCase, validateGeneratedCase } from '../shared/schemas/case.js';
import { createMockCase } from '../server/src/services/ai/mockProvider.js';

describe('case request and generated case contracts', () => {
  it('rejects premises that are too short and normalizes supported defaults', () => {
    expect(() => createCaseSchema.parse({ premise: 'Too short' })).toThrow();
    const request = createCaseSchema.parse({ premise: 'A locked archive is found open before dawn.' });
    expect(request).toMatchObject({ difficulty: 'medium', caseLength: 'standard', tone: 'noir', language: 'en' });
  });

  it('accepts deterministic mock cases for short and standard play', () => {
    for (const caseLength of ['short', 'standard']) {
      const request = createCaseSchema.parse({ premise: 'A locked archive is found open before dawn.', caseLength });
      expect(validateGeneratedCase(createMockCase(request), request).solution.culpritSuspectId).toBe('suspect-mara');
    }
  });

  it('keeps canonical culprit, private solution, and clue roles out of public case data', () => {
    const request = createCaseSchema.parse({ premise: 'A locked archive is found open before dawn.' });
    const publicCase = toPublicCase(validateGeneratedCase(createMockCase(request), request));
    expect(JSON.stringify(publicCase)).not.toContain('culpritSuspectId');
    expect(JSON.stringify(publicCase)).not.toContain('evidenceChain');
    expect(publicCase.evidence.every((item) => !('clueRole' in item))).toBe(true);
  });

  it('rejects broken evidence references and untrusted externally hosted media', () => {
    const request = createCaseSchema.parse({ premise: 'A locked archive is found open before dawn.' });
    const broken = createMockCase(request);
    broken.solution.evidenceChain[0].evidenceId = 'missing-item';
    expect(() => validateGeneratedCase(broken, request)).toThrow(/references/);
    const withUrl = createMockCase(request);
    withUrl.evidence[0].mediaUrl = 'https://example.com/image.png';
    expect(() => validateGeneratedCase(withUrl, request)).toThrow(/media/);
  });
});
