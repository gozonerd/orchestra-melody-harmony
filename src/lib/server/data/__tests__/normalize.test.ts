import { describe, it, expect } from 'vitest';
import {
	normalizeOpenRouterModel,
	mergeWithHuggingFaceBenchmarks,
	buildHuggingFaceMap
} from '../normalize';
import type { OpenRouterModel } from '../../external/openrouter';
import type { HuggingFaceModel } from '../../external/huggingface';

describe('normalize', () => {
	const mockOpenRouterModel: OpenRouterModel = {
		id: 'openai/gpt-4',
		name: 'GPT-4',
		description: 'Advanced language model',
		pricing: {
			prompt: '0.003', // $0.003 per 1K tokens
			completion: '0.006'
		},
		context_length: 8192
	};

	const mockHuggingFaceModel: HuggingFaceModel = {
		Model: 'openai/gpt-4',
		'Average ⬆️': 86.4,
		'ARC ⬆️': 96.3,
		'HellaSwag ⬆️': 95.3,
		'MMLU ⬆️': 86.4,
		'TruthfulQA ⬆️': 59.0,
		'Winogrande ⬆️': 91.6,
		'GSM8K ⬆️': 92.0
	};

	describe('normalizeOpenRouterModel', () => {
		it('should normalize OpenRouter model data', () => {
			const result = normalizeOpenRouterModel(mockOpenRouterModel);

			expect(result.externalId).toBe('openai/gpt-4');
			expect(result.name).toBe('GPT-4');
			expect(result.provider).toBe('openai');
			expect(result.description).toBe('Advanced language model');
			expect(result.contextWindow).toBe(8192);
		});

		it('should convert pricing to cents per million tokens', () => {
			const result = normalizeOpenRouterModel(mockOpenRouterModel);

			// $0.003 per 1K = $0.003 * 1000 per 1M = $3 per 1M = 300 cents
			expect(result.inputPricePerMil).toBe(300);
			// $0.006 per 1K = 600 cents
			expect(result.outputPricePerMil).toBe(600);
		});

		it('should be integer-only (no floating point)', () => {
			const result = normalizeOpenRouterModel(mockOpenRouterModel);

			expect(Number.isInteger(result.inputPricePerMil)).toBe(true);
			expect(Number.isInteger(result.outputPricePerMil)).toBe(true);
		});

		it('should detect vision capability', () => {
			const visionModel: OpenRouterModel = {
				id: 'openai/gpt-4-vision',
				name: 'GPT-4 Vision'
			};
			const result = normalizeOpenRouterModel(visionModel);
			expect(result.supportsVision).toBe(true);

			const nonVisionModel: OpenRouterModel = {
				id: 'openai/gpt-3.5-turbo',
				name: 'GPT-3.5 Turbo'
			};
			const result2 = normalizeOpenRouterModel(nonVisionModel);
			expect(result2.supportsVision).toBe(false);
		});

		it('should detect function calling capability', () => {
			const fcModel: OpenRouterModel = {
				id: 'openai/gpt-4',
				name: 'GPT-4'
			};
			const result = normalizeOpenRouterModel(fcModel);
			expect(result.supportsFunctionCalling).toBe(true);
		});

		it('should handle missing pricing gracefully', () => {
			const modelNoPricing: OpenRouterModel = {
				id: 'test/model',
				name: 'Test Model'
			};
			const result = normalizeOpenRouterModel(modelNoPricing);
			expect(result.inputPricePerMil).toBe(0);
			expect(result.outputPricePerMil).toBe(0);
		});

		it('should handle invalid pricing strings', () => {
			const modelBadPricing: OpenRouterModel = {
				id: 'test/model',
				name: 'Test Model',
				pricing: {
					prompt: 'invalid',
					completion: 'bad'
				}
			};
			const result = normalizeOpenRouterModel(modelBadPricing);
			expect(result.inputPricePerMil).toBe(0);
			expect(result.outputPricePerMil).toBe(0);
		});
	});

	describe('mergeWithHuggingFaceBenchmarks', () => {
		it('should merge HuggingFace benchmarks into normalized model', () => {
			const normalized = normalizeOpenRouterModel(mockOpenRouterModel);
			const hfMap = new Map([['openai/gpt-4', mockHuggingFaceModel]]);

			const result = mergeWithHuggingFaceBenchmarks(normalized, hfMap);

			expect(result.benchmarkChat).toBe(86.4); // Average score
			expect(result.benchmarkReasoning).toBe(96.3); // ARC
			expect(result.benchmarkMath).toBe(92.0); // GSM8K
		});

		it('should return unmodified model if HF data not found', () => {
			const normalized = normalizeOpenRouterModel(mockOpenRouterModel);
			const emptyMap = new Map();

			const result = mergeWithHuggingFaceBenchmarks(normalized, emptyMap);

			expect(result.benchmarkChat).toBeNull();
			expect(result.benchmarkReasoning).toBeNull();
		});

		it('should set vision benchmark if vision is supported', () => {
			const visionModel: OpenRouterModel = {
				id: 'openai/gpt-4-vision',
				name: 'GPT-4 Vision',
				pricing: { prompt: '0.01', completion: '0.03' }
			};
			const normalized = normalizeOpenRouterModel(visionModel);
			const hfMap = new Map([['openai/gpt-4-vision', mockHuggingFaceModel]]);

			const result = mergeWithHuggingFaceBenchmarks(normalized, hfMap);

			expect(result.benchmarkVision).toBe(86.4);
		});

		it('should not set vision benchmark if vision is not supported', () => {
			const normalized = normalizeOpenRouterModel(mockOpenRouterModel);
			const hfMap = new Map([['openai/gpt-4', mockHuggingFaceModel]]);

			const result = mergeWithHuggingFaceBenchmarks(normalized, hfMap);

			expect(result.benchmarkVision).toBeNull();
		});
	});

	describe('buildHuggingFaceMap', () => {
		it('should build map from HuggingFace models', () => {
			const models = [mockHuggingFaceModel];
			const map = buildHuggingFaceMap(models);

			expect(map.size).toBeGreaterThan(0);
			expect(map.has('openai/gpt-4')).toBe(true);
		});

		it('should normalize model names to lowercase', () => {
			const modelWithSpaces: HuggingFaceModel = {
				...mockHuggingFaceModel,
				Model: 'mistralai/Mistral-7B-Instruct'
			};
			const map = buildHuggingFaceMap([modelWithSpaces]);

			expect(map.has('mistralai/mistral-7b-instruct')).toBe(true);
		});

		it('should handle multiple models', () => {
			const models = [
				mockHuggingFaceModel,
				{
					...mockHuggingFaceModel,
					Model: 'anthropic/claude-3-opus'
				}
			];
			const map = buildHuggingFaceMap(models);

			expect(map.size).toBeGreaterThanOrEqual(2);
		});
	});
});
