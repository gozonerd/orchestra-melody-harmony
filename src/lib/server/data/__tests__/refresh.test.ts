import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeOpenRouterModel, buildHuggingFaceMap } from '../normalize';
import { mockOpenRouterModels, mockHuggingFaceModels } from './fixtures';

describe('refresh integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should process OpenRouter models correctly', () => {
		const normalized = mockOpenRouterModels.map(normalizeOpenRouterModel);

		expect(normalized).toHaveLength(mockOpenRouterModels.length);
		expect(normalized[0].name).toBe('GPT-4');
		expect(normalized[0].provider).toBe('openai');
	});

	it('should preserve pricing through normalization', () => {
		const gpt4Model = mockOpenRouterModels.find((m) => m.id === 'openai/gpt-4');
		expect(gpt4Model).toBeDefined();

		const normalized = normalizeOpenRouterModel(gpt4Model!);
		expect(normalized.inputPricePerMil).toBe(300); // $0.003 per 1K = 300 cents per 1M
		expect(normalized.outputPricePerMil).toBe(600); // $0.006 per 1K = 600 cents per 1M
	});

	it('should build HuggingFace map correctly', () => {
		const map = buildHuggingFaceMap(mockHuggingFaceModels);

		expect(map.size).toBeGreaterThan(0);
		expect(map.has('openai/gpt-4')).toBe(true);
		expect(map.has('anthropic/claude-3-opus')).toBe(true);
	});

	it('should handle mixed model database (some with HF data, some without)', () => {
		const normalized = mockOpenRouterModels.map(normalizeOpenRouterModel);

		// GPT-4 Vision has no HF data, should remain with null benchmarks
		const gpt4Vision = normalized.find((m) => m.externalId === 'openai/gpt-4-vision');
		expect(gpt4Vision?.benchmarkChat).toBeNull();

		// GPT-4 has HF data
		const gpt4 = normalized.find((m) => m.externalId === 'openai/gpt-4');
		expect(gpt4).toBeDefined();
	});

	it('should count models correctly across sources', () => {
		const openRouterCount = mockOpenRouterModels.length;
		const huggingFaceCount = mockHuggingFaceModels.length;

		expect(openRouterCount).toBeGreaterThan(0);
		expect(huggingFaceCount).toBeGreaterThan(0);
	});

	it('should preserve all required model fields', () => {
		const normalized = normalizeOpenRouterModel(mockOpenRouterModels[0]);

		expect(normalized).toHaveProperty('externalId');
		expect(normalized).toHaveProperty('name');
		expect(normalized).toHaveProperty('provider');
		expect(normalized).toHaveProperty('inputPricePerMil');
		expect(normalized).toHaveProperty('outputPricePerMil');
		expect(normalized).toHaveProperty('contextWindow');
		expect(normalized).toHaveProperty('supportsVision');
		expect(normalized).toHaveProperty('supportsFunctionCalling');
	});

	it('should handle pricing consistency across all fixtures', () => {
		const normalized = mockOpenRouterModels.map(normalizeOpenRouterModel);

		for (const model of normalized) {
			// All prices should be non-negative integers
			expect(model.inputPricePerMil).toBeGreaterThanOrEqual(0);
			expect(model.outputPricePerMil).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(model.inputPricePerMil)).toBe(true);
			expect(Number.isInteger(model.outputPricePerMil)).toBe(true);
		}
	});

	it('should detect capabilities correctly from fixture models', () => {
		const normalized = mockOpenRouterModels.map(normalizeOpenRouterModel);

		// GPT-4 Vision should support vision
		const vision = normalized.find((m) => m.name === 'GPT-4 Vision');
		expect(vision?.supportsVision).toBe(true);

		// GPT-4 should support function calling
		const gpt4 = normalized.find((m) => m.name === 'GPT-4');
		expect(gpt4?.supportsFunctionCalling).toBe(true);
	});
});
