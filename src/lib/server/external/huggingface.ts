/**
 * HuggingFace Open LLM Leaderboard API client
 * Fetches benchmark data for model evaluation
 */

export interface HuggingFaceModel {
	Model: string;
	'Average ⬆️': number; // Overall benchmark score
	'ARC ⬆️': number;
	'HellaSwag ⬆️': number;
	'MMLU ⬆️': number;
	'TruthfulQA ⬆️': number;
	'Winogrande ⬆️': number;
	'GSM8K ⬆️': number;
	[key: string]: string | number; // Allow other fields
}

export interface HuggingFaceLeaderboardResponse {
	rows: HuggingFaceModel[];
}

/**
 * Fetch models from HuggingFace Open LLM Leaderboard
 * Uses the public leaderboard data endpoint
 */
export async function fetchHuggingFaceLeaderboard(): Promise<HuggingFaceModel[]> {
	const url =
		'https://huggingface.co/api/datasets/openllm-leaderboard/open_llm_leaderboard/data?config=default&split=train';

	const response = await fetch(url, {
		headers: {
			'User-Agent': 'Orchestra-Melody-Harmony/1.0'
		}
	});

	if (!response.ok) {
		throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
	}

	const data: HuggingFaceLeaderboardResponse = await response.json();
	return data.rows || [];
}

/**
 * Normalize HuggingFace benchmark scores (0-100 scale)
 * HF scores are typically 0-100, we store as-is
 */
export function normalizeHuggingFaceBenchmarks(model: HuggingFaceModel): {
	overall: number;
	arc: number;
	hellaswag: number;
	mmlu: number;
	truthfulqa: number;
	winogrande: number;
	gsm8k: number;
} {
	return {
		overall: Math.round((model['Average ⬆️'] || 0) * 100) / 100,
		arc: Math.round((model['ARC ⬆️'] || 0) * 100) / 100,
		hellaswag: Math.round((model['HellaSwag ⬆️'] || 0) * 100) / 100,
		mmlu: Math.round((model['MMLU ⬆️'] || 0) * 100) / 100,
		truthfulqa: Math.round((model['TruthfulQA ⬆️'] || 0) * 100) / 100,
		winogrande: Math.round((model['Winogrande ⬆️'] || 0) * 100) / 100,
		gsm8k: Math.round((model['GSM8K ⬆️'] || 0) * 100) / 100
	};
}
