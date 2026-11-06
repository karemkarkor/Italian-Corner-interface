import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('GET /api/health returns the API status', async () => {
  const response = await request(app)
    .get('/api/health')
    .expect(200)
    .expect('Content-Type', /json/);

  assert.deepEqual(response.body, {
    status: 'ok',
    service: 'italian-corner-api',
  });
});