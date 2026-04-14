import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.hoisted(() => {
  process.env.DATABASE_URL = 'libsql://test.turso.io';
  process.env.DATABASE_AUTH_TOKEN = 'test-token';
});

vi.mock('$lib/server/engine/recommend');
vi.mock('$lib/utils/rateLimit');

import { POST } from '../+server';
import * as recommendModule from '$lib/server/engine/recommend';
import * as rateLimitModule from '$lib/utils/rateLimit';

const mockRecommendation = {
  task: {
    originalInput: 'Write a Python function',
    category: 'coding' as const,
    subtasks: ['Write the code', 'Test the implementation'],
    keywordMatches: { coding: 5, writing: 0, analysis: 0, customer_support: 0, data_processing: 0, math: 0, creative: 0, general: 0 }
  },
  melody: {
    modelId: 1,
    modelName: 'Model A',
    provider: 'Provider1',
    score: 85.5,
    benchmarkScores: {
      coding: 90,
      reasoning: 85,
      math: 80,
      chat: 75,
      vision: 70
    },
    pricing: {
      inputPricePerMil: 1000,
      outputPricePerMil: 2000
    },
    contextWindow: 4096,
    reasoning: 'Strong in coding and reasoning'
  },
  harmony: [
    {
      subtask: 'Write the code',
      modelId: 1,
      modelName: 'Model A',
      provider: 'Provider1',
      score: 85.5,
      reasoning: 'Best for coding'
    }
  ],
  costEstimates: {
    per10: { totalCents: 3000, breakdown: [{ modelId: 1, cents: 3000 }] },
    per100: { totalCents: 30000, breakdown: [{ modelId: 1, cents: 30000 }] },
    per1k: { totalCents: 300000, breakdown: [{ modelId: 1, cents: 300000 }] },
    per10k: { totalCents: 3000000, breakdown: [{ modelId: 1, cents: 3000000 }] }
  },
  overallReasoning: 'For coding tasks, Model A by Provider1 leads as the Melody'
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(rateLimitModule.checkRateLimit).mockReturnValue({
    isLimited: false,
    remainingRequests: 29,
    resetAt: Date.now() + 60000
  });
  vi.mocked(recommendModule.getRecommendation).mockResolvedValue(mockRecommendation);
});

describe('POST /api/recommend', () => {
  it('should return 200 with recommendation for valid task', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a Python function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.recommendation).toBeDefined();
    expect(data.recommendation.melody).toBeDefined();
    expect(data.recommendation.harmony).toBeDefined();
  });

  it('should return 400 for missing task field', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required field');
  });

  it('should return 400 for non-string task', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 123 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required field');
  });

  it('should return 400 for invalid JSON body', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Invalid JSON');
  });

  it('should return 429 when rate limited', async () => {
    vi.mocked(rateLimitModule.checkRateLimit).mockReturnValue({
      isLimited: true,
      remainingRequests: 0,
      resetAt: Date.now() + 60000
    });

    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('should return 400 for empty task string', async () => {
    vi.mocked(recommendModule.getRecommendation).mockRejectedValue(
      new Error('Task description cannot be empty')
    );

    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: '' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(400);
  });

  it('should return 500 for server errors', async () => {
    vi.mocked(recommendModule.getRecommendation).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain('Failed to generate recommendation');
  });

  it('should include rate limit headers in success response', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a Python function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    expect(response.headers.get('X-RateLimit-Remaining')).toBe('29');
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
  });

  it('should pass IP address to rate limiter', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    await POST({
      request,
      getClientAddress: () => '192.168.1.100'
    } as any);

    expect(vi.mocked(rateLimitModule.checkRateLimit)).toHaveBeenCalledWith('192.168.1.100');
  });

  it('should return properly formatted recommendation object', async () => {
    const request = new Request('http://localhost/api/recommend', {
      method: 'POST',
      body: JSON.stringify({ task: 'Write a Python function' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST({
      request,
      getClientAddress: () => '127.0.0.1'
    } as any);

    const data = await response.json();
    expect(data.recommendation.task.input).toBeDefined();
    expect(data.recommendation.task.category).toBeDefined();
    expect(data.recommendation.task.subtasks).toBeDefined();
    expect(data.recommendation.melody.modelId).toBeDefined();
    expect(data.recommendation.melody.score).toBeDefined();
    expect(data.recommendation.costEstimates.per10).toBeDefined();
    expect(data.recommendation.costEstimates.per100).toBeDefined();
    expect(data.recommendation.costEstimates.per1k).toBeDefined();
    expect(data.recommendation.costEstimates.per10k).toBeDefined();
  });
});
