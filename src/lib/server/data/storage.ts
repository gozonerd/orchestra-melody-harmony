/**
 * Data storage: Save normalized models to Turso via Drizzle ORM
 */

import { eq } from 'drizzle-orm';
import { getDb } from '$lib/db/client';
import { models, dataSnapshots } from '$lib/db/schema';
import type { NormalizedModel } from './normalize';

/**
 * Save normalized models to database, replacing existing records
 */
export async function saveModelsToDatabase(
	normalizedModels: NormalizedModel[]
): Promise<{ inserted: number; updated: number }> {
	const db = getDb();
	let inserted = 0;
	let updated = 0;

	for (const model of normalizedModels) {
		// Check if model exists
		const existing = await db.select().from(models).where(eq(models.name, model.name)).limit(1);

		if (existing.length > 0) {
			// Update
			await db
				.update(models)
				.set({
					provider: model.provider,
					description: model.description,
					benchmarkCoding: model.benchmarkCoding,
					benchmarkReasoning: model.benchmarkReasoning,
					benchmarkMath: model.benchmarkMath,
					benchmarkChat: model.benchmarkChat,
					benchmarkVision: model.benchmarkVision,
					inputPricePerMil: model.inputPricePerMil,
					outputPricePerMil: model.outputPricePerMil,
					contextWindow: model.contextWindow,
					speedTokensPerSec: model.speedTokensPerSec,
					supportsVision: model.supportsVision ? 1 : 0,
					supportsFunctionCalling: model.supportsFunctionCalling ? 1 : 0,
					externalId: model.externalId,
					lastUpdated: Math.floor(Date.now() / 1000)
				})
				.where(eq(models.name, model.name));
			updated++;
		} else {
			// Insert
			await db.insert(models).values({
				name: model.name,
				provider: model.provider,
				description: model.description,
				benchmarkCoding: model.benchmarkCoding,
				benchmarkReasoning: model.benchmarkReasoning,
				benchmarkMath: model.benchmarkMath,
				benchmarkChat: model.benchmarkChat,
				benchmarkVision: model.benchmarkVision,
				inputPricePerMil: model.inputPricePerMil,
				outputPricePerMil: model.outputPricePerMil,
				contextWindow: model.contextWindow,
				speedTokensPerSec: model.speedTokensPerSec,
				supportsVision: model.supportsVision ? 1 : 0,
				supportsFunctionCalling: model.supportsFunctionCalling ? 1 : 0,
				externalId: model.externalId
			});
			inserted++;
		}
	}

	return { inserted, updated };
}

/**
 * Record a data refresh snapshot
 */
export async function recordDataSnapshot(
	source: 'openrouter' | 'huggingface' | 'combined',
	status: 'success' | 'failed',
	modelCount: number
): Promise<void> {
	const db = getDb();
	await db.insert(dataSnapshots).values({
		source,
		status,
		modelCount
	});
}
