/**
 * Cost calculations for model ensembles.
 * All values in cents (integer) — no floating point.
 */

export interface ModelCost {
	modelId: number;
	modelName: string;
	inputPricePerMil: number; // cents per 1M input tokens
	outputPricePerMil: number; // cents per 1M output tokens
	estimatedInputTokens?: number;
	estimatedOutputTokens?: number;
}

export interface CostEstimate {
	totalCents: number;
	breakdown: {
		modelId: number;
		modelName: string;
		inputCost: number;
		outputCost: number;
		totalCost: number;
	}[];
}

/**
 * Estimate cost for a single model and token count.
 * Uses standard assumptions: input:output ratio of 2:1 unless specified.
 *
 * @param model - Model cost data
 * @param totalTokens - Total tokens (combined input + output)
 * @param inputRatio - Ratio of input tokens (0-1), default 0.66 (2:1 ratio)
 * @returns Cost in cents
 */
export function estimateModelCost(
	model: ModelCost,
	totalTokens: number,
	inputRatio: number = 0.66
): number {
	const inputTokens = Math.round(totalTokens * inputRatio);
	const outputTokens = totalTokens - inputTokens;

	// Cost = (tokens / 1_000_000) * price_per_mil
	const inputCost = Math.round((inputTokens / 1_000_000) * model.inputPricePerMil);
	const outputCost = Math.round((outputTokens / 1_000_000) * model.outputPricePerMil);

	return inputCost + outputCost;
}

/**
 * Estimate total cost for an ensemble (melody + harmonies).
 *
 * @param models - Array of models in the ensemble
 * @param runsPerScale - Number of runs (10, 100, 1000, or 10000)
 * @param tokensPerRun - Average tokens per run (default 1000)
 * @param inputRatio - Ratio of input to total tokens
 * @returns CostEstimate with breakdown
 */
export function estimateEnsembleCost(
	models: ModelCost[],
	runsPerScale: number,
	tokensPerRun: number = 1000,
	inputRatio: number = 0.66
): CostEstimate {
	const totalTokens = runsPerScale * tokensPerRun;

	const breakdown = models.map((model) => {
		const totalCost = estimateModelCost(model, totalTokens, inputRatio);
		const inputTokens = Math.round(totalTokens * inputRatio);
		const outputTokens = totalTokens - inputTokens;
		const inputCost = Math.round((inputTokens / 1_000_000) * model.inputPricePerMil);
		const outputCost = Math.round((outputTokens / 1_000_000) * model.outputPricePerMil);

		return {
			modelId: model.modelId,
			modelName: model.modelName,
			inputCost,
			outputCost,
			totalCost
		};
	});

	const totalCents = breakdown.reduce((sum, item) => sum + item.totalCost, 0);

	return {
		totalCents,
		breakdown
	};
}

/**
 * Format cost in cents as a human-readable string.
 *
 * @param cents - Cost in cents
 * @returns Formatted string (e.g., "$12.34")
 */
export function formatCost(cents: number): string {
	const dollars = Math.floor(cents / 100);
	const remainingCents = cents % 100;
	return `$${dollars}.${String(remainingCents).padStart(2, '0')}`;
}

/**
 * Parse formatted cost string back to cents.
 *
 * @param formatted - Formatted cost (e.g., "$12.34")
 * @returns Cost in cents
 */
export function parseCost(formatted: string): number {
	const cleaned = formatted.replace(/[^0-9.]/g, '');
	const [dollars, cents] = cleaned.split('.');
	return parseInt(dollars || '0') * 100 + parseInt((cents || '0').padEnd(2, '0'));
}
