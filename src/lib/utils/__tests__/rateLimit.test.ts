import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimit, clearAllRateLimits } from '../rateLimit';

describe('rateLimit', () => {
	beforeEach(() => {
		clearAllRateLimits();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		clearAllRateLimits();
	});

	describe('checkRateLimit', () => {
		it('should allow requests within limit', () => {
			const ip = '192.168.1.1';
			const limit = 5;

			for (let i = 0; i < limit; i++) {
				const result = checkRateLimit(ip, limit);
				expect(result.isLimited).toBe(false);
				expect(result.remainingRequests).toBe(limit - i - 1);
			}
		});

		it('should block request when limit exceeded', () => {
			const ip = '192.168.1.1';
			const limit = 3;

			// Make limit requests
			for (let i = 0; i < limit; i++) {
				checkRateLimit(ip, limit);
			}

			// Next request should be limited
			const result = checkRateLimit(ip, limit);
			expect(result.isLimited).toBe(true);
			expect(result.remainingRequests).toBe(0);
		});

		it('should reset counter after time window expires', () => {
			const ip = '192.168.1.1';
			const limit = 3;

			// Make limit requests
			for (let i = 0; i < limit; i++) {
				checkRateLimit(ip, limit);
			}

			// Verify limited
			let result = checkRateLimit(ip, limit);
			expect(result.isLimited).toBe(true);

			// Advance time past reset window (1 minute)
			vi.advanceTimersByTime(61_000);

			// Should allow new requests
			result = checkRateLimit(ip, limit);
			expect(result.isLimited).toBe(false);
		});

		it('should track different IPs separately', () => {
			const ip1 = '192.168.1.1';
			const ip2 = '192.168.1.2';
			const limit = 2;

			// Use up limit for ip1
			checkRateLimit(ip1, limit);
			checkRateLimit(ip1, limit);

			// ip1 should be limited
			let result = checkRateLimit(ip1, limit);
			expect(result.isLimited).toBe(true);

			// ip2 should not be limited
			result = checkRateLimit(ip2, limit);
			expect(result.isLimited).toBe(false);
		});

		it('should return correct reset time', () => {
			const ip = '192.168.1.1';
			const result = checkRateLimit(ip);
			const now = Date.now();
			const oneMinute = 60_000;

			expect(result.resetAt).toBe(now + oneMinute);
		});

		it('should use default limit of 30 requests per minute', () => {
			const ip = '192.168.1.1';

			// Make 30 requests without specifying limit
			for (let i = 0; i < 30; i++) {
				const result = checkRateLimit(ip);
				expect(result.isLimited).toBe(false);
			}

			// 31st request should be limited
			const result = checkRateLimit(ip);
			expect(result.isLimited).toBe(true);
		});

		it('should handle edge case of limit = 1', () => {
			const ip = '192.168.1.1';
			const limit = 1;

			const result1 = checkRateLimit(ip, limit);
			expect(result1.isLimited).toBe(false);

			const result2 = checkRateLimit(ip, limit);
			expect(result2.isLimited).toBe(true);
		});
	});

	describe('resetRateLimit', () => {
		it('should reset counter for specific IP', () => {
			const ip = '192.168.1.1';
			const limit = 2;

			// Use up limit
			checkRateLimit(ip, limit);
			checkRateLimit(ip, limit);
			let result = checkRateLimit(ip, limit);
			expect(result.isLimited).toBe(true);

			// Reset and verify
			resetRateLimit(ip);
			result = checkRateLimit(ip, limit);
			expect(result.isLimited).toBe(false);
		});

		it('should not affect other IPs', () => {
			const ip1 = '192.168.1.1';
			const ip2 = '192.168.1.2';
			const limit = 2;

			// Use up limit for both
			checkRateLimit(ip1, limit);
			checkRateLimit(ip1, limit);
			checkRateLimit(ip2, limit);
			checkRateLimit(ip2, limit);

			// Reset ip1 only
			resetRateLimit(ip1);

			// ip1 should be reset, ip2 should still be limited
			expect(checkRateLimit(ip1, limit).isLimited).toBe(false);
			expect(checkRateLimit(ip2, limit).isLimited).toBe(true);
		});
	});

	describe('clearAllRateLimits', () => {
		it('should clear all rate limits', () => {
			const ip1 = '192.168.1.1';
			const ip2 = '192.168.1.2';
			const limit = 2;

			// Use up limits for both
			checkRateLimit(ip1, limit);
			checkRateLimit(ip1, limit);
			checkRateLimit(ip2, limit);
			checkRateLimit(ip2, limit);

			// Verify both are limited
			expect(checkRateLimit(ip1, limit).isLimited).toBe(true);
			expect(checkRateLimit(ip2, limit).isLimited).toBe(true);

			// Clear all
			clearAllRateLimits();

			// Both should be reset
			expect(checkRateLimit(ip1, limit).isLimited).toBe(false);
			expect(checkRateLimit(ip2, limit).isLimited).toBe(false);
		});
	});

	describe('cleanup interval', () => {
		it('should automatically clean up expired entries', () => {
			const ip = '192.168.1.1';

			// Create an entry
			checkRateLimit(ip);

			// Advance time past reset window
			vi.advanceTimersByTime(61_000);

			// Advance again to trigger cleanup interval (60 seconds)
			vi.advanceTimersByTime(1_000);

			// The entry should be cleaned up, so new request should not be limited
			const result = checkRateLimit(ip);
			expect(result.isLimited).toBe(false);
		});
	});

	describe('concurrent requests', () => {
		it('should handle multiple requests from same IP sequentially', () => {
			const ip = '192.168.1.1';
			const limit = 5;

			const results = [];
			for (let i = 0; i < 6; i++) {
				results.push(checkRateLimit(ip, limit));
			}

			// First 5 should not be limited
			results.slice(0, 5).forEach((result) => {
				expect(result.isLimited).toBe(false);
			});

			// 6th should be limited
			expect(results[5].isLimited).toBe(true);
		});
	});
});
