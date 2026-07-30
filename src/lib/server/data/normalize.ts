/**
 * Data normalization: Combines OpenRouter and HuggingFace data into unified model records
 */

import { type OpenRouterModel, normalizeOpenRouterPrice } from '../external/openrouter';
import { type HuggingFaceModel, normalizeHuggingFaceBenchmarks } from '../external/huggingface';

export interface NormalizedModel {
	externalId: string; // OpenRouter model ID
	name: string;
	provider: string;
	description: string | null;

	// Pricing in cents per 1M tokens
	inputPricePerMil: number;
	outputPricePerMil: number;

	// Benchmarks (0-100 scale)
	benchmarkCoding: number | null;
	benchmarkReasoning: number | null;
	benchmarkMath: number | null;
	benchmarkChat: number | null;
	benchmarkVision: number | null;

	// Model characteristics
	contextWindow: number | null;
	speedTokensPerSec: number | null;

	// Capabilities
	supportsVision: boolean;
	supportsFunctionCalling: boolean;

	releaseDate: string | null;
}

/**
 * Normalize OpenRouter model data
 */
export function normalizeOpenRouterModel(model: OpenRouterModel): NormalizedModel {
	const provider = extractProvider(model.id);
	const pricing = model.pricing || { prompt: '0', completion: '0' };

	return {
		externalId: model.id,
		name: model.name || model.id,
		provider,
		description: model.description || null,

		inputPricePerMil: normalizeOpenRouterPrice((pricing as Record<string, string>).prompt || '0'),
		outputPricePerMil: normalizeOpenRouterPrice(
			(pricing as Record<string, string>).completion || '0'
		),

		// Benchmarks null until matched with HF data
		benchmarkCoding: null,
		benchmarkReasoning: null,
		benchmarkMath: null,
		benchmarkChat: null,
		benchmarkVision: null,

		contextWindow: model.context_length || null,
		speedTokensPerSec: null,

		supportsVision: detectVision(model.id),
		supportsFunctionCalling: detectFunctionCalling(model.id),

		releaseDate: null
	};
}

/**
 * Extract provider name from OpenRouter model ID
 * Examples: "openai/gpt-4" -> "openai", "anthropic/claude-3-opus" -> "anthropic"
 */
function extractProvider(modelId: string): string {
	const parts = modelId.split('/');
	return parts[0] || 'unknown';
}

/**
 * Detect vision capability from model ID or name
 */
function detectVision(modelId: string): boolean {
	const visionKeywords = ['vision', 'gpt-4-vision', 'claude-3', 'llava', 'gemini-pro-vision'];
	return visionKeywords.some((keyword) => modelId.toLowerCase().includes(keyword));
}

/**
 * Detect function calling capability from model ID
 */
function detectFunctionCalling(modelId: string): boolean {
	const fcKeywords = ['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'function-calling'];
	return fcKeywords.some((keyword) => modelId.toLowerCase().includes(keyword));
}

/**
 * Match and merge OpenRouter model with HuggingFace benchmarks
 * Uses fuzzy matching on model names
 */
export function mergeWithHuggingFaceBenchmarks(
	normalizedModel: NormalizedModel,
	hfModels: Map<string, HuggingFaceModel>
): NormalizedModel {
	// Try exact match first
	let hfModel = hfModels.get(normalizedModel.externalId);

	// Try fuzzy match on model name
	if (!hfModel) {
		hfModel = hfModels.get(normalizedModel.name);
	}

	if (!hfModel) {
		return normalizedModel;
	}

	const benchmarks = normalizeHuggingFaceBenchmarks(hfModel);

	return {
		...normalizedModel,
		benchmarkCoding: benchmarks.gsm8k, // Use GSM8K as coding proxy
		benchmarkReasoning: benchmarks.arc,
		benchmarkMath: benchmarks.gsm8k,
		benchmarkChat: benchmarks.overall,
		benchmarkVision: detectVision(normalizedModel.externalId) ? benchmarks.overall : null
	};
}

/**
 * Build a map of HuggingFace models by ID for fast lookup
 */
export function buildHuggingFaceMap(hfModels: HuggingFaceModel[]): Map<string, HuggingFaceModel> {
	const map = new Map<string, HuggingFaceModel>();

	for (const model of hfModels) {
		// Try to normalize model name to match OpenRouter IDs
		const modelId = normalizeHfModelName(model.Model);
		map.set(modelId, model);
		map.set(model.Model, model); // Also store original name
	}

	return map;
}

/**
 * Normalize HuggingFace model name to match OpenRouter format
 * E.g., "mistralai/Mistral-7B-Instruct-v0.1" -> "mistral/mistral-7b-instruct-v0.1"
 */
function normalizeHfModelName(name: string): string {
	return name.toLowerCase().replace(/_/g, '-');
}
