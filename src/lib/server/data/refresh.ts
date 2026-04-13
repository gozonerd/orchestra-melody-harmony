/**
 * Data refresh orchestrator
 * Fetches data from OpenRouter and HuggingFace, normalizes, and stores in Turso
 */

import { fetchOpenRouterModels } from '../external/openrouter';
import { fetchHuggingFaceLeaderboard } from '../external/huggingface';
import {
	normalizeOpenRouterModel,
	mergeWithHuggingFaceBenchmarks,
	buildHuggingFaceMap
} from './normalize';
import { saveModelsToDatabase, recordDataSnapshot } from './storage';

export interface RefreshResult {
	success: boolean;
	openRouterCount: number;
	huggingFaceCount: number;
	mergedCount: number;
	inserted: number;
	updated: number;
	error?: string;
}

/**
 * Execute full data refresh: fetch, normalize, merge, and store
 */
export async function refreshModelData(): Promise<RefreshResult> {
	try {
		// Fetch data from both sources
		const orModels = await fetchOpenRouterModels();
		const hfModels = await fetchHuggingFaceLeaderboard();

		// Normalize OpenRouter models
		const normalizedModels = orModels.map(normalizeOpenRouterModel);

		// Build HuggingFace lookup map
		const hfMap = buildHuggingFaceMap(hfModels);

		// Merge benchmarks
		const mergedModels = normalizedModels.map((model) =>
			mergeWithHuggingFaceBenchmarks(model, hfMap)
		);

		// Save to database
		const { inserted, updated } = await saveModelsToDatabase(mergedModels);

		// Record snapshot
		await recordDataSnapshot('combined', 'success', mergedModels.length);

		return {
			success: true,
			openRouterCount: orModels.length,
			huggingFaceCount: hfModels.length,
			mergedCount: mergedModels.length,
			inserted,
			updated
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		// Record failure
		await recordDataSnapshot('combined', 'failed', 0).catch(() => {
			// Ignore snapshot recording failures
		});

		return {
			success: false,
			openRouterCount: 0,
			huggingFaceCount: 0,
			mergedCount: 0,
			inserted: 0,
			updated: 0,
			error: errorMessage
		};
	}
}
