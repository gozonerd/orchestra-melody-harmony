/**
 * Rate limiting for API routes.
 * Uses in-memory store with IP-based limits.
 * Production should use Redis for distributed caching.
 */

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Configuration
const DEFAULT_REQUESTS_PER_MINUTE = 30;
const CLEANUP_INTERVAL = 60_000; // Clean up old entries every minute

// Clean up expired entries periodically
setInterval(() => {
	const now = Date.now();
	for (const [ip, entry] of store.entries()) {
		if (entry.resetAt < now) {
			store.delete(ip);
		}
	}
}, CLEANUP_INTERVAL);

/**
 * Check if request from IP is rate limited.
 *
 * @param ip - Client IP address
 * @param limit - Max requests per minute (default: 30)
 * @returns Object with { isLimited, remainingRequests, resetAt }
 */
export function checkRateLimit(
	ip: string,
	limit: number = DEFAULT_REQUESTS_PER_MINUTE
): {
	isLimited: boolean;
	remainingRequests: number;
	resetAt: number;
} {
	const now = Date.now();
	const entry = store.get(ip);

	if (!entry || entry.resetAt < now) {
		// Create new entry
		const newEntry: RateLimitEntry = {
			count: 1,
			resetAt: now + 60_000 // 1 minute from now
		};
		store.set(ip, newEntry);
		return {
			isLimited: false,
			remainingRequests: limit - 1,
			resetAt: newEntry.resetAt
		};
	}

	// Increment existing entry
	entry.count++;
	const isLimited = entry.count > limit;

	return {
		isLimited,
		remainingRequests: Math.max(0, limit - entry.count),
		resetAt: entry.resetAt
	};
}

/**
 * Reset rate limit for an IP (for testing).
 */
export function resetRateLimit(ip: string): void {
	store.delete(ip);
}

/**
 * Clear all rate limits (for testing).
 */
export function clearAllRateLimits(): void {
	store.clear();
}
