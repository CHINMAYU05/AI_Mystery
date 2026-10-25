import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../server/src/app.js';

describe('API boundary', () => {
  it('exposes a minimal health response without configuration details', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('rejects an invalid premise before generation', async () => {
    const response = await request(app).post('/api/v1/cases').send({ premise: 'Too short' });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error).not.toHaveProperty('request');
  });

  it('does not reveal whether malformed case identifiers exist', async () => {
    const response = await request(app).get('/api/v1/cases/not-an-object-id');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('CASE_NOT_FOUND');
  });
});
