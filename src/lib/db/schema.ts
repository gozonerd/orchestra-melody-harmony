import { sql } from 'drizzle-orm';
import { integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';

// Model: Represents an AI model with benchmarks and pricing
export const models = sqliteTable('models', {
	id: integer('id').primaryKey(),
	name: text('name').notNull().unique(),
	provider: text('provider').notNull(), // e.g., "OpenAI", "Anthropic", "Meta", etc.
	description: text('description'),

	// Benchmarks (stored as normalized scores 0-100)
	benchmarkCoding: real('benchmark_coding'),
	benchmarkReasoning: real('benchmark_reasoning'),
	benchmarkMath: real('benchmark_math'),
	benchmarkChat: real('benchmark_chat'),
	benchmarkVision: real('benchmark_vision'),

	// Pricing (in cents per 1000 tokens)
	inputPricePerMil: integer('input_price_per_mil').notNull(), // cents per 1M tokens
	outputPricePerMil: integer('output_price_per_mil').notNull(), // cents per 1M tokens

	// Model characteristics
	contextWindow: integer('context_window'), // tokens
	speedTokensPerSec: real('speed_tokens_per_sec'),

	// Capabilities
	supportsVision: integer('supports_vision').default(0),
	supportsFunctionCalling: integer('supports_function_calling').default(0),

	// Metadata
	releaseDate: text('release_date'),
	lastUpdated: integer('last_updated')
		.notNull()
		.default(sql`(unixepoch('now'))`),
	externalId: text('external_id') // OpenRouter or HF ID for reference
});

// Task: Represents a user's task description and parsed subtasks
export const tasks = sqliteTable('tasks', {
	id: integer('id').primaryKey(),
	userInput: text('user_input').notNull(),
	category: text('category'), // coding, writing, analysis, etc.
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(unixepoch('now'))`)
});

// Recommendation: Stores a recommendation result
export const recommendations = sqliteTable('recommendations', {
	id: integer('id').primaryKey(),
	taskId: integer('task_id'),
	melodyModelId: integer('melody_model_id'),

	// JSON-encoded harmony models (array of { subtask, modelId, reasoning })
	harmonyModelsJson: text('harmony_models_json'),

	// Reasoning text
	overallReasoning: text('overall_reasoning'),

	// Cost estimates at 4 scales (in cents)
	costPer10: integer('cost_per_10'),
	costPer100: integer('cost_per_100'),
	costPer1k: integer('cost_per_1k'),
	costPer10k: integer('cost_per_10k'),

	createdAt: integer('created_at')
		.notNull()
		.default(sql`(unixepoch('now'))`)
});

// DataSnapshot: Tracks when data was last refreshed
export const dataSnapshots = sqliteTable('data_snapshots', {
	id: integer('id').primaryKey(),
	source: text('source').notNull(), // "openrouter" or "huggingface"
	timestamp: integer('timestamp')
		.notNull()
		.default(sql`(unixepoch('now'))`),
	modelCount: integer('model_count'),
	status: text('status').notNull() // "success" or "failed"
});
