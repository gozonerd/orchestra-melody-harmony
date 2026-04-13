/**
 * Test fixtures for data ingestion tests
 * Cached API responses to avoid hitting real APIs during testing
 */

import type { OpenRouterModel } from '../../external/openrouter';
import type { HuggingFaceModel } from '../../external/huggingface';

export const mockOpenRouterModels: OpenRouterModel[] = [
	{
		id: 'openai/gpt-4',
		name: 'GPT-4',
		description: 'Advanced language model',
		pricing: {
			prompt: '0.003',
			completion: '0.006'
		},
		context_length: 8192
	},
	{
		id: 'openai/gpt-4-vision',
		name: 'GPT-4 Vision',
		description: 'GPT-4 with vision',
		pricing: {
			prompt: '0.01',
			completion: '0.03'
		},
		context_length: 128000
	},
	{
		id: 'anthropic/claude-3-opus',
		name: 'Claude 3 Opus',
		description: 'Latest Claude model',
		pricing: {
			prompt: '0.015',
			completion: '0.075'
		},
		context_length: 200000
	},
	{
		id: 'meta/llama-2-70b',
		name: 'Llama 2 70B',
		description: 'Open source model',
		pricing: {
			prompt: '0.0001',
			completion: '0.0001'
		},
		context_length: 4096
	},
	{
		id: 'mistralai/mistral-large',
		name: 'Mistral Large',
		pricing: {
			prompt: '0.008',
			completion: '0.024'
		},
		context_length: 32000
	}
];

export const mockHuggingFaceModels: HuggingFaceModel[] = [
	{
		Model: 'openai/gpt-4',
		'Average ⬆️': 86.4,
		'ARC ⬆️': 96.3,
		'HellaSwag ⬆️': 95.3,
		'MMLU ⬆️': 86.4,
		'TruthfulQA ⬆️': 59.0,
		'Winogrande ⬆️': 91.6,
		'GSM8K ⬆️': 92.0
	},
	{
		Model: 'anthropic/claude-3-opus',
		'Average ⬆️': 85.2,
		'ARC ⬆️': 95.1,
		'HellaSwag ⬆️': 94.8,
		'MMLU ⬆️': 86.3,
		'TruthfulQA ⬆️': 68.9,
		'Winogrande ⬆️': 88.4,
		'GSM8K ⬆️': 88.3
	},
	{
		Model: 'meta/llama-2-70b',
		'Average ⬆️': 73.1,
		'ARC ⬆️': 82.7,
		'HellaSwag ⬆️': 79.1,
		'MMLU ⬆️': 73.5,
		'TruthfulQA ⬆️': 33.0,
		'Winogrande ⬆️': 83.1,
		'GSM8K ⬆️': 56.7
	}
];
