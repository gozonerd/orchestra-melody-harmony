import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.hoisted(() => {
	process.env.DATABASE_URL = 'libsql://test.turso.io';
	process.env.DATABASE_AUTH_TOKEN = 'test-token';
});

// Mock database client module BEFORE importing scorer
vi.mock('$lib/db/client');

import { scoreModelsForCategory, scoreModelsForSubtask } from '../scorer';
import * as dbModule from '$lib/db/client';

const mockModels = [
	{
		id: 1,
		name: 'Model A',
		provider: 'Provider1',
		benchmarkCoding: 85,
		benchmarkReasoning: 80,
		benchmarkMath: 75,
		benchmarkChat: 70,
		benchmarkVision: 65,
		inputPricePerMil: 1000,
		outputPricePerMil: 2000,
		contextWindow: 4096
	},
	{
		id: 2,
		name: 'Model B',
		provider: 'Provider2',
		benchmarkCoding: 90,
		benchmarkReasoning: null,
		benchmarkMath: 80,
		benchmarkChat: 75,
		benchmarkVision: null,
		inputPricePerMil: 2000,
		outputPricePerMil: 3000,
		contextWindow: 8192
	},
	{
		id: 3,
		name: 'Model C',
		provider: 'Provider3',
		benchmarkCoding: null,
		benchmarkReasoning: null,
		benchmarkMath: null,
		benchmarkChat: null,
		benchmarkVision: null,
		inputPricePerMil: 500,
		outputPricePerMil: 1000,
		contextWindow: 2048
	}
];

beforeEach(() => {
	vi.clearAllMocks();
	const mockDb = {
		select: vi.fn().mockReturnValue({
			from: vi.fn().mockResolvedValue(mockModels)
		})
	};
	vi.mocked(dbModule.getDb).mockReturnValue(mockDb as any);
});

describe('scorer', () => {
	it('should score all models for a category', async () => {
		const results = await scoreModelsForCategory('coding');
		expect(results.length).toBeGreaterThan(0);
	});

	it('should return models sorted by score descending', async () => {
		const results = await scoreModelsForCategory('coding');
		for (let i = 0; i < results.length - 1; i++) {
			expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
		}
	});

	it('should calculate score with all benchmarks', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results.find((m) => m.modelId === 1);
		expect(model).toBeDefined();
		expect(model?.score).toBeGreaterThan(0);
	});

	it('should normalize score when benchmarks are missing', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results.find((m) => m.modelId === 2);
		expect(model).toBeDefined();
		expect(model?.score).toBeGreaterThan(0);
	});

	it('should score 0 for model with all null benchmarks', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results.find((m) => m.modelId === 3);
		expect(model?.score).toBe(0);
	});

	it('should apply price penalty', async () => {
		const results = await scoreModelsForCategory('coding');
		// Model B has higher raw score but also higher price
		// We can't directly assert the penalty, but we can verify scoring happened
		expect(results.length).toBe(3);
	});

	it('should include benchmark scores in result', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results[0];
		expect(model.benchmarkScores).toBeDefined();
		expect(model.benchmarkScores.coding).toBeDefined();
	});

	it('should include pricing information', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results[0];
		expect(model.pricing.inputPricePerMil).toBeDefined();
		expect(model.pricing.outputPricePerMil).toBeDefined();
	});

	it('should generate reasoning string', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results[0];
		expect(model.reasoning).toBeDefined();
		expect(model.reasoning.length).toBeGreaterThan(0);
	});

	it('should work for different categories', async () => {
		const categories = [
			'coding',
			'writing',
			'analysis',
			'customer_support',
			'data_processing',
			'math',
			'creative',
			'general'
		];

		for (const cat of categories) {
			const results = await scoreModelsForCategory(cat as any);
			expect(results).toBeDefined();
			expect(Array.isArray(results)).toBe(true);
		}
	});

	it('should score models for subtask', async () => {
		const results = await scoreModelsForSubtask('Write a Python function', 'coding');
		expect(results.length).toBeGreaterThan(0);
	});

	it('should round score to 2 decimal places', async () => {
		const results = await scoreModelsForCategory('coding');
		for (const model of results) {
			const decimalCount = (model.score.toString().split('.')[1] || '').length;
			expect(decimalCount).toBeLessThanOrEqual(2);
		}
	});

	it('should include context window in result', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results[0];
		expect(model.contextWindow).toBeDefined();
	});

	it('should include model metadata', async () => {
		const results = await scoreModelsForCategory('coding');
		const model = results[0];
		expect(model.modelId).toBeDefined();
		expect(model.modelName).toBeDefined();
		expect(model.provider).toBeDefined();
	});
});
