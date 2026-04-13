import { describe, it, expect } from 'vitest';
import { normalizeHuggingFaceBenchmarks } from '../huggingface';
import type { HuggingFaceModel } from '../huggingface';

describe('huggingface', () => {
	describe('normalizeHuggingFaceBenchmarks', () => {
		const mockModel: HuggingFaceModel = {
			Model: 'test/model',
			'Average ⬆️': 86.4,
			'ARC ⬆️': 96.3,
			'HellaSwag ⬆️': 95.3,
			'MMLU ⬆️': 86.4,
			'TruthfulQA ⬆️': 59.0,
			'Winogrande ⬆️': 91.6,
			'GSM8K ⬆️': 92.0
		};

		it('should normalize all benchmark scores', () => {
			const result = normalizeHuggingFaceBenchmarks(mockModel);

			expect(result.overall).toBe(86.4);
			expect(result.arc).toBe(96.3);
			expect(result.hellaswag).toBe(95.3);
			expect(result.mmlu).toBe(86.4);
			expect(result.truthfulqa).toBe(59.0);
			expect(result.winogrande).toBe(91.6);
			expect(result.gsm8k).toBe(92.0);
		});

		it('should handle missing benchmark scores', () => {
			const modelMissingScores = {
				Model: 'test/model'
			} as HuggingFaceModel;

			const result = normalizeHuggingFaceBenchmarks(modelMissingScores);

			expect(result.overall).toBe(0);
			expect(result.arc).toBe(0);
			expect(result.gsm8k).toBe(0);
		});

		it('should preserve decimal precision', () => {
			const modelWithDecimals: HuggingFaceModel = {
				Model: 'test/model',
				'Average ⬆️': 86.456789,
				'ARC ⬆️': 96.123456,
				'HellaSwag ⬆️': 95.987654,
				'MMLU ⬆️': 86.4,
				'TruthfulQA ⬆️': 59.0,
				'Winogrande ⬆️': 91.6,
				'GSM8K ⬆️': 92.0
			};

			const result = normalizeHuggingFaceBenchmarks(modelWithDecimals);

			expect(result.overall).toBe(86.46);
			expect(result.arc).toBe(96.12);
			expect(result.hellaswag).toBe(95.99);
		});

		it('should handle extreme values', () => {
			const modelExtremes: HuggingFaceModel = {
				Model: 'test/model',
				'Average ⬆️': 100.0,
				'ARC ⬆️': 0.0,
				'HellaSwag ⬆️': 50.5,
				'MMLU ⬆️': 1.0,
				'TruthfulQA ⬆️': 99.99,
				'Winogrande ⬆️': 0.01,
				'GSM8K ⬆️': 75.75
			};

			const result = normalizeHuggingFaceBenchmarks(modelExtremes);

			expect(result.overall).toBe(100.0);
			expect(result.arc).toBe(0.0);
			expect(result.truthfulqa).toBe(99.99);
			expect(result.winogrande).toBe(0.01);
		});
	});
});
