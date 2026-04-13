/**
 * OpenRouter API client
 * Fetches latest model data from OpenRouter /api/v1/models endpoint
 */

export interface OpenRouterModel {
	id: string;
	name: string;
	description?: string;
	pricing?: {
		prompt: string; // cents per 1K tokens as string
		completion: string; // cents per 1K tokens as string
	};
	context_length?: number;
	[key: string]: unknown; // Allow other fields from API
}

export interface OpenRouterModelsResponse {
	data: OpenRouterModel[];
}

/**
 * Fetch models from OpenRouter API
 */
export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		throw new Error('OPENROUTER_API_KEY not configured');
	}

	const url = 'https://openrouter.io/api/v1/models';
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'HTTP-Referer': 'https://orchestra-melody-harmony.vercel.app',
			'X-Title': 'Orchestra Melody & Harmony'
		}
	});

	if (!response.ok) {
		throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
	}

	const data: OpenRouterModelsResponse = await response.json();
	return data.data || [];
}

/**
 * Normalize OpenRouter price string to cents per million tokens
 * OpenRouter returns price as string (e.g., "0.0001" = $0.0001 per 1K tokens)
 * We need cents per 1M tokens
 * $0.0001 per 1K = $0.0001 * 1000 = $0.1 per 1M = 10 cents per 1M
 */
export function normalizeOpenRouterPrice(pricePerThousand: string): number {
	const priceNum = parseFloat(pricePerThousand);
	if (isNaN(priceNum)) return 0;
	// Convert $/1K to cents/1M: multiply by 1000, then multiply by 100 to get cents
	return Math.round(priceNum * 1000 * 100);
}
