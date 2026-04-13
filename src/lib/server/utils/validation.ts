/**
 * Validation utilities for data ingestion
 */

/**
 * Validate that a price is a valid non-negative integer
 */
export function isValidPrice(price: number): boolean {
	return Number.isInteger(price) && price >= 0;
}

/**
 * Validate that a benchmark score is in valid range (0-100)
 */
export function isValidBenchmarkScore(score: unknown): score is number {
	return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * Validate model name
 */
export function isValidModelName(name: unknown): name is string {
	return typeof name === 'string' && name.length > 0 && name.length <= 255;
}

/**
 * Validate provider name
 */
export function isValidProvider(provider: unknown): provider is string {
	return typeof provider === 'string' && provider.length > 0 && provider.length <= 50;
}

/**
 * Validate context window
 */
export function isValidContextWindow(window: unknown): window is number {
	return typeof window === 'number' && Number.isInteger(window) && window > 0 && window <= 1000000;
}

/**
 * Validate model data completeness
 */
export interface ModelValidationResult {
	valid: boolean;
	errors: string[];
}

export function validateModelData(model: {
	name?: unknown;
	provider?: unknown;
	inputPricePerMil?: unknown;
	outputPricePerMil?: unknown;
	contextWindow?: unknown;
}): ModelValidationResult {
	const errors: string[] = [];

	if (!isValidModelName(model.name)) {
		errors.push('Invalid model name');
	}

	if (!isValidProvider(model.provider)) {
		errors.push('Invalid provider');
	}

	if (model.inputPricePerMil !== undefined && !isValidPrice(model.inputPricePerMil as number)) {
		errors.push('Invalid input price');
	}

	if (model.outputPricePerMil !== undefined && !isValidPrice(model.outputPricePerMil as number)) {
		errors.push('Invalid output price');
	}

	if (model.contextWindow !== undefined && !isValidContextWindow(model.contextWindow)) {
		errors.push('Invalid context window');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
