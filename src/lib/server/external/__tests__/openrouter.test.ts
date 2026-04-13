import { describe, it, expect } from 'vitest';
import { normalizeOpenRouterPrice } from '../openrouter';

describe('openrouter', () => {
	describe('normalizeOpenRouterPrice', () => {
		it('should convert price per 1K to cents per 1M', () => {
			// $0.0001 per 1K = $0.0001 * 1000 per 1M = $0.1 per 1M = 10 cents
			const result = normalizeOpenRouterPrice('0.0001');
			expect(result).toBe(10);
		});

		it('should handle standard pricing tiers', () => {
			// $0.001 per 1K = 100 cents per 1M
			expect(normalizeOpenRouterPrice('0.001')).toBe(100);

			// $0.003 per 1K = 300 cents per 1M
			expect(normalizeOpenRouterPrice('0.003')).toBe(300);

			// $0.01 per 1K = 1000 cents per 1M
			expect(normalizeOpenRouterPrice('0.01')).toBe(1000);
		});

		it('should round to nearest integer cent', () => {
			// $0.00015 per 1K = 15.0 cents per 1M
			const result = normalizeOpenRouterPrice('0.00015');
			expect(result).toBe(15);
			expect(Number.isInteger(result)).toBe(true);
		});

		it('should handle edge cases', () => {
			expect(normalizeOpenRouterPrice('0')).toBe(0);
			expect(normalizeOpenRouterPrice('0.0')).toBe(0);
		});

		it('should handle invalid input gracefully', () => {
			expect(normalizeOpenRouterPrice('invalid')).toBe(0);
			expect(normalizeOpenRouterPrice('')).toBe(0);
			expect(normalizeOpenRouterPrice('abc123')).toBe(0);
		});

		it('should return integer only', () => {
			const result = normalizeOpenRouterPrice('0.001');
			expect(Number.isInteger(result)).toBe(true);
		});
	});
});
