import { describe, it, expect } from 'vitest';
import {
	estimateModelCost,
	estimateEnsembleCost,
	formatCost,
	parseCost,
	type ModelCost
} from '../costCalculator';

describe('costCalculator', () => {
	const mockModel: ModelCost = {
		modelId: 1,
		modelName: 'test-model',
		inputPricePerMil: 100, // $0.001 per 1K tokens ($0.0001 per token)
		outputPricePerMil: 200 // $0.002 per 1K tokens ($0.0002 per token)
	};

	describe('estimateModelCost', () => {
		it('should calculate cost with default 2:1 input:output ratio', () => {
			// 1000 tokens total: 667 input, 333 output
			const cost = estimateModelCost(mockModel, 1000);
			// Input: 667 / 1_000_000 * 100 ≈ 0.0667 cents
			// Output: 333 / 1_000_000 * 200 ≈ 0.0667 cents
			// Total ≈ 0.13 cents (rounds to 0)
			expect(cost).toBe(0);
		});

		it('should calculate cost with custom input ratio', () => {
			// 1000 tokens, 50:50 ratio: 500 input, 500 output
			const cost = estimateModelCost(mockModel, 1000, 0.5);
			// Input: 500 / 1_000_000 * 100 = 0.05 cents
			// Output: 500 / 1_000_000 * 200 = 0.1 cents
			// Total = 0.15 cents (rounds to 0)
			expect(cost).toBe(0);
		});

		it('should handle large token counts correctly', () => {
			// 1,000,000 tokens: 667,000 input, 333,000 output
			const cost = estimateModelCost(mockModel, 1_000_000);
			// Input: 667_000 / 1_000_000 * 100 = 66.7 cents
			// Output: 333_000 / 1_000_000 * 200 = 66.6 cents
			// Total = 133.3 cents (rounds to 133)
			expect(cost).toBeGreaterThanOrEqual(130);
			expect(cost).toBeLessThanOrEqual(135);
		});

		it('should return integer cents (no floating point)', () => {
			const cost = estimateModelCost(mockModel, 100_000);
			expect(Number.isInteger(cost)).toBe(true);
		});
	});

	describe('estimateEnsembleCost', () => {
		it('should estimate cost for single model', () => {
			const result = estimateEnsembleCost([mockModel], 100);
			expect(result.totalCents).toBeGreaterThanOrEqual(0);
			expect(result.breakdown).toHaveLength(1);
			expect(result.breakdown[0].modelId).toBe(1);
		});

		it('should estimate cost for multiple models', () => {
			const model2: ModelCost = {
				modelId: 2,
				modelName: 'another-model',
				inputPricePerMil: 50,
				outputPricePerMil: 100
			};
			const result = estimateEnsembleCost([mockModel, model2], 100);
			expect(result.breakdown).toHaveLength(2);
			expect(result.totalCents).toBe(result.breakdown[0].totalCost + result.breakdown[1].totalCost);
		});

		it('should handle different scales correctly', () => {
			const result10 = estimateEnsembleCost([mockModel], 10);
			const result100 = estimateEnsembleCost([mockModel], 100);
			const result1000 = estimateEnsembleCost([mockModel], 1000);

			// Cost should increase with more runs
			expect(result100.totalCents).toBeGreaterThanOrEqual(result10.totalCents);
			expect(result1000.totalCents).toBeGreaterThanOrEqual(result100.totalCents);
		});
	});

	describe('formatCost', () => {
		it('should format cents to dollars.cents', () => {
			expect(formatCost(0)).toBe('$0.00');
			expect(formatCost(1)).toBe('$0.01');
			expect(formatCost(100)).toBe('$1.00');
			expect(formatCost(1234)).toBe('$12.34');
		});

		it('should pad cents correctly', () => {
			expect(formatCost(105)).toBe('$1.05');
			expect(formatCost(10)).toBe('$0.10');
		});
	});

	describe('parseCost', () => {
		it('should parse formatted cost back to cents', () => {
			expect(parseCost('$0.00')).toBe(0);
			expect(parseCost('$0.01')).toBe(1);
			expect(parseCost('$1.00')).toBe(100);
			expect(parseCost('$12.34')).toBe(1234);
		});

		it('should handle various formats', () => {
			expect(parseCost('0.00')).toBe(0);
			expect(parseCost('12.34')).toBe(1234);
			expect(parseCost('$12')).toBe(1200);
		});
	});

	describe('round-trip formatting', () => {
		it('should preserve cost through format/parse cycle', () => {
			const original = 1234;
			const formatted = formatCost(original);
			const parsed = parseCost(formatted);
			expect(parsed).toBe(original);
		});
	});
});
