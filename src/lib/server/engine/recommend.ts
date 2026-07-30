import { parseTask, type ParsedTask } from './taskParser';
import { scoreModelsForCategory, scoreModelsForSubtask, type ScoredModel } from './scorer';
import { categorizeSubtask } from './weights';
import { estimateEnsembleCost, type CostEstimate, type ModelCost } from '$lib/utils/costCalculator';

export interface HarmonyRecommendation {
	subtask: string;
	modelId: number;
	modelName: string;
	provider: string;
	score: number;
	reasoning: string;
}

export interface Recommendation {
	task: ParsedTask;
	melody: ScoredModel;
	harmony: HarmonyRecommendation[];
	costEstimates: {
		per10: CostEstimate;
		per100: CostEstimate;
		per1k: CostEstimate;
		per10k: CostEstimate;
	};
	overallReasoning: string;
}

export async function getRecommendation(userInput: string): Promise<Recommendation> {
	// Parse the task
	const task = parseTask(userInput);

	// Score models for the primary category
	const scoredModels = await scoreModelsForCategory(task.category);

	if (scoredModels.length === 0) {
		throw new Error('No models available. Data may not be loaded yet.');
	}

	// Melody is the highest-scoring model
	const melody = scoredModels[0];

	// Build harmony recommendations for each subtask
	const harmony: HarmonyRecommendation[] = [];
	const usedModelIds = new Set<number>([melody.modelId]);

	for (const subtask of task.subtasks) {
		// Determine category for this subtask
		const subtaskCategory = categorizeSubtask(subtask, task.category);

		// Score models for this subtask
		const subtaskScored = await scoreModelsForSubtask(subtask, subtaskCategory);

		// Pick the highest-scoring model that isn't the melody
		let harmonyModel: ScoredModel | undefined;
		for (const model of subtaskScored) {
			if (model.modelId !== melody.modelId) {
				harmonyModel = model;
				break;
			}
		}

		// If no alternative exists, use the melody model
		if (!harmonyModel) {
			harmonyModel = melody;
		}

		harmony.push({
			subtask,
			modelId: harmonyModel.modelId,
			modelName: harmonyModel.modelName,
			provider: harmonyModel.provider,
			score: harmonyModel.score,
			reasoning: harmonyModel.reasoning
		});

		usedModelIds.add(harmonyModel.modelId);
	}

	// Build cost estimates
	const ensembleModels: ModelCost[] = Array.from(usedModelIds).map((id) => {
		const model =
			scoredModels.find((m) => m.modelId === id) || harmony.find((h) => h.modelId === id);
		if (!model) {
			throw new Error(`Model not found: ${id}`);
		}

		return {
			inputPricePerMil: model.pricing.inputPricePerMil,
			outputPricePerMil: model.pricing.outputPricePerMil
		};
	});

	const costEstimates = {
		per10: estimateEnsembleCost(ensembleModels, 10),
		per100: estimateEnsembleCost(ensembleModels, 100),
		per1k: estimateEnsembleCost(ensembleModels, 1000),
		per10k: estimateEnsembleCost(ensembleModels, 10000)
	};

	// Generate overall reasoning
	const harmonyCount = new Set(harmony.map((h) => h.modelId)).size;
	const overallReasoning = `For ${task.category} tasks, ${melody.modelName} by ${melody.provider} leads as the Melody with a score of ${melody.score}. The Harmony ensemble adds ${harmonyCount} specialized model${harmonyCount === 1 ? '' : 's'} across ${task.subtasks.length} subtask${task.subtasks.length === 1 ? '' : 's'} for comprehensive coverage.`;

	return {
		task,
		melody,
		harmony,
		costEstimates,
		overallReasoning
	};
}
