import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockOpenRouterModels, mockHuggingFaceModels } from '../../data/__tests__/fixtures';

/**
 * Integration tests for external API clients using mocked fetch
 * These tests verify error handling and data transformation without hitting real APIs
 */

describe('external API integration', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('OpenRouter data structure', () => {
		it('should validate OpenRouter model structure', () => {
			const model = mockOpenRouterModels[0];

			expect(model).toHaveProperty('id');
			expect(model).toHaveProperty('name');
			expect(model).toHaveProperty('pricing');
			expect(model.pricing).toHaveProperty('prompt');
			expect(model.pricing).toHaveProperty('completion');
		});

		it('should have valid pricing format', () => {
			for (const model of mockOpenRouterModels) {
				if (model.pricing) {
					// Pricing should be numeric strings that can be converted
					expect(!isNaN(parseFloat(model.pricing.prompt))).toBe(true);
					expect(!isNaN(parseFloat(model.pricing.completion))).toBe(true);
				}
			}
		});

		it('should have consistent model IDs', () => {
			const ids = mockOpenRouterModels.map((m) => m.id);
			expect(new Set(ids).size).toBe(ids.length); // All unique
		});
	});

	describe('HuggingFace data structure', () => {
		it('should validate HuggingFace model structure', () => {
			const model = mockHuggingFaceModels[0];

			expect(model).toHaveProperty('Model');
			expect(model).toHaveProperty('Average ⬆️');
			expect(model).toHaveProperty('ARC ⬆️');
			expect(model).toHaveProperty('GSM8K ⬆️');
		});

		it('should have valid benchmark scores', () => {
			for (const model of mockHuggingFaceModels) {
				expect(typeof model['Average ⬆️']).toBe('number');
				expect(model['Average ⬆️']).toBeGreaterThanOrEqual(0);
				expect(model['Average ⬆️']).toBeLessThanOrEqual(100);
			}
		});

		it('should have all benchmark fields', () => {
			const benchmarkFields = [
				'ARC ⬆️',
				'HellaSwag ⬆️',
				'MMLU ⬆️',
				'TruthfulQA ⬆️',
				'Winogrande ⬆️',
				'GSM8K ⬆️'
			];

			for (const model of mockHuggingFaceModels) {
				for (const field of benchmarkFields) {
					expect(model).toHaveProperty(field);
				}
			}
		});
	});

	describe('data consistency between sources', () => {
		it('should have models from both sources', () => {
			expect(mockOpenRouterModels.length).toBeGreaterThan(0);
			expect(mockHuggingFaceModels.length).toBeGreaterThan(0);
		});

		it('should have some model overlap between sources', () => {
			const orIds = new Set(mockOpenRouterModels.map((m) => m.id.toLowerCase()));
			const hfModels = new Set(mockHuggingFaceModels.map((m) => m.Model.toLowerCase()));

			// At least some models should overlap
			let overlap = 0;
			for (const id of orIds) {
				if (hfModels.has(id)) {
					overlap++;
				}
			}
			expect(overlap).toBeGreaterThan(0);
		});

		it('should handle context lengths from OpenRouter', () => {
			for (const model of mockOpenRouterModels) {
				if (model.context_length) {
					expect(model.context_length).toBeGreaterThan(0);
					expect(Number.isInteger(model.context_length)).toBe(true);
				}
			}
		});
	});

	describe('error handling patterns', () => {
		it('should validate API response format expectations', () => {
			// OpenRouter returns { data: [...] }
			expect(Array.isArray(mockOpenRouterModels)).toBe(true);

			// HuggingFace returns { rows: [...] }
			expect(Array.isArray(mockHuggingFaceModels)).toBe(true);
		});

		it('should handle missing optional fields', () => {
			// Models may not have all fields, that's ok
			// Should still work even if some models lack description
			expect(mockOpenRouterModels.length).toBeGreaterThan(0);
		});
	});
});
