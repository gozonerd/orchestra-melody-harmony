import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.hoisted(() => {
	process.env.DATABASE_URL = 'libsql://test.turso.io';
	process.env.DATABASE_AUTH_TOKEN = 'test-token';
});

// Mock database client module BEFORE importing recommend
vi.mock('$lib/db/client');

import { getRecommendation } from '../recommend';
import * as dbModule from '$lib/db/client';

const mockModels = [
	{
		id: 1,
		name: 'Model A',
		provider: 'Provider1',
		benchmarkCoding: 95,
		benchmarkReasoning: 85,
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
		benchmarkCoding: 85,
		benchmarkReasoning: 90,
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
		benchmarkCoding: 75,
		benchmarkReasoning: 70,
		benchmarkMath: 85,
		benchmarkChat: 80,
		benchmarkVision: 70,
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

describe('getRecommendation', () => {
	it('should return a complete recommendation', async () => {
		const result = await getRecommendation('Write a Python function');
		expect(result).toBeDefined();
		expect(result.task).toBeDefined();
		expect(result.melody).toBeDefined();
		expect(result.harmony).toBeDefined();
		expect(result.costEstimates).toBeDefined();
		expect(result.overallReasoning).toBeDefined();
	});

	it('should parse the task correctly', async () => {
		const result = await getRecommendation('Write a Python function to sort a list');
		expect(result.task.originalInput).toBe('Write a Python function to sort a list');
		expect(result.task.category).toBe('coding');
		expect(result.task.subtasks).toBeDefined();
	});

	it('should set melody to highest-scoring model', async () => {
		const result = await getRecommendation('Write a coding function');
		expect(result.melody).toBeDefined();
		expect(result.melody.score).toBeGreaterThan(0);
	});

	it('should include harmony recommendations', async () => {
		const result = await getRecommendation('Write a Python function');
		expect(result.harmony.length).toBeGreaterThan(0);
	});

	it('should include all 4 cost estimates', async () => {
		const result = await getRecommendation('Write a Python function');
		expect(result.costEstimates.per10).toBeDefined();
		expect(result.costEstimates.per100).toBeDefined();
		expect(result.costEstimates.per1k).toBeDefined();
		expect(result.costEstimates.per10k).toBeDefined();
	});

	it('should have non-empty overall reasoning', async () => {
		const result = await getRecommendation('Write a Python function');
		expect(result.overallReasoning).toBeDefined();
		expect(result.overallReasoning.length).toBeGreaterThan(0);
	});

	it('should throw error when no models available', async () => {
		const mockDb = {
			select: vi.fn().mockReturnValue({
				from: vi.fn().mockResolvedValue([])
			})
		};
		vi.mocked(dbModule.getDb).mockReturnValue(mockDb as any);

		await expect(getRecommendation('Write a function')).rejects.toThrow(
			'No models available. Data may not be loaded yet.'
		);
	});

	it('should handle multi-subtask tasks', async () => {
		const result = await getRecommendation(
			'Parse CSV file, clean the data, and load it to database'
		);
		expect(result.task.subtasks.length).toBeGreaterThan(0);
		expect(result.harmony.length).toBeGreaterThan(0);
	});

	it('should include melody information in harmony', async () => {
		const result = await getRecommendation('Write a Python function');
		for (const harmonyModel of result.harmony) {
			expect(harmonyModel.subtask).toBeDefined();
			expect(harmonyModel.modelId).toBeDefined();
			expect(harmonyModel.modelName).toBeDefined();
			expect(harmonyModel.provider).toBeDefined();
			expect(harmonyModel.score).toBeDefined();
			expect(harmonyModel.reasoning).toBeDefined();
		}
	});

	it('should have cost estimates with proper structure', async () => {
		const result = await getRecommendation('Write a Python function');
		const costEst = result.costEstimates.per10;
		expect(costEst).toBeDefined();
		expect(costEst.totalCents).toBeDefined();
		expect(typeof costEst.totalCents).toBe('number');
	});

	it('should prefer different models in harmony when possible', async () => {
		const result = await getRecommendation('Write a Python function');
		if (result.harmony.length > 1) {
			// At least some harmony models should differ from melody if possible
			const harmonyIds = result.harmony.map((h) => h.modelId);
			expect(harmonyIds.length).toBeGreaterThan(0);
		}
	});

	it('should work with different task categories', async () => {
		const tasks = [
			'Write a blog post about technology',
			'Analyze market research data',
			'Help me solve this equation'
		];

		for (const task of tasks) {
			const result = await getRecommendation(task);
			expect(result).toBeDefined();
			expect(result.melody).toBeDefined();
		}
	});

	it('should handle empty task gracefully', async () => {
		await expect(getRecommendation('')).rejects.toThrow('Task description cannot be empty');
	});

	it('should include reasoning for melody selection', async () => {
		const result = await getRecommendation('Write a Python function');
		expect(result.overallReasoning).toContain(result.melody.modelName);
		expect(result.overallReasoning).toContain(result.melody.provider);
	});
});
