import { getDb } from '$lib/db/client';
import { models } from '$lib/db/schema';
import type { TaskCategory } from './taskParser';
import { CATEGORY_WEIGHTS } from './weights';

export interface ScoredModel {
	modelId: number;
	modelName: string;
	provider: string;
	score: number;
	benchmarkScores: {
		coding: number | null;
		reasoning: number | null;
		math: number | null;
		chat: number | null;
		vision: number | null;
	};
	pricing: {
		inputPricePerMil: number;
		outputPricePerMil: number;
	};
	contextWindow: number | null;
	reasoning: string;
}

export async function scoreModelsForCategory(category: TaskCategory): Promise<ScoredModel[]> {
	const db = getDb();
	const allModels = await db.select().from(models);

	const weights = CATEGORY_WEIGHTS[category];
	const scored = allModels.map((model) => scoreModel(model, weights));

	// Sort descending by score
	return scored.sort((a, b) => b.score - a.score);
}

export async function scoreModelsForSubtask(
	subtask: string,
	parentCategory: TaskCategory
): Promise<ScoredModel[]> {
	// For now, use the parent category's weights
	// In a more sophisticated implementation, we'd categorize the subtask
	return scoreModelsForCategory(parentCategory);
}

function scoreModel(
	model: {
		id: number;
		name: string;
		provider: string;
		benchmarkCoding: number | null;
		benchmarkReasoning: number | null;
		benchmarkMath: number | null;
		benchmarkChat: number | null;
		benchmarkVision: number | null;
		inputPricePerMil: number;
		outputPricePerMil: number;
		contextWindow: number | null;
	},
	weights: {
		coding: number;
		reasoning: number;
		math: number;
		chat: number;
		vision: number;
	}
): ScoredModel {
	const benchmarks = {
		coding: model.benchmarkCoding,
		reasoning: model.benchmarkReasoning,
		math: model.benchmarkMath,
		chat: model.benchmarkChat,
		vision: model.benchmarkVision
	};

	// Calculate weighted score
	let score = 0;
	let totalWeight = 0;

	type BenchmarkKey = keyof typeof benchmarks;
	const benchmarkKeys: BenchmarkKey[] = ['coding', 'reasoning', 'math', 'chat', 'vision'];

	for (const key of benchmarkKeys) {
		if (benchmarks[key] !== null && benchmarks[key] !== undefined) {
			const value = benchmarks[key] as number;
			score += weights[key] * value;
			totalWeight += weights[key];
		}
	}

	// Normalize by available weight
	if (totalWeight > 0) {
		score = score / totalWeight;
	} else {
		score = 0;
	}

	// Apply price penalty
	const priceSum = model.inputPricePerMil + model.outputPricePerMil;
	const pricePenalty = Math.min(10, priceSum / 100000);
	score = Math.max(0, score - pricePenalty);

	// Generate reasoning string
	const topBenchmarks = benchmarkKeys
		.filter((key) => benchmarks[key] !== null)
		.sort((a, b) => (benchmarks[b] || 0) - (benchmarks[a] || 0))
		.slice(0, 2);

	const topBenchmarkTexts = topBenchmarks.map((key) => {
		const label = key.charAt(0).toUpperCase() + key.slice(1);
		const value = (benchmarks[key] || 0).toFixed(1);
		return `${label} (${value})`;
	});

	const contextWindowText = model.contextWindow
		? ` ${model.contextWindow.toLocaleString()} token context.`
		: '.';

	const reasoning = `Strong in ${topBenchmarkTexts.join(' and ')}. ${model.provider} model with${contextWindowText} Priced at $${(model.inputPricePerMil / 1000000).toFixed(6)}/M input, $${(model.outputPricePerMil / 1000000).toFixed(6)}/M output.`;

	return {
		modelId: model.id,
		modelName: model.name,
		provider: model.provider,
		score: Math.round(score * 100) / 100,
		benchmarkScores: benchmarks,
		pricing: {
			inputPricePerMil: model.inputPricePerMil,
			outputPricePerMil: model.outputPricePerMil
		},
		contextWindow: model.contextWindow,
		reasoning
	};
}
