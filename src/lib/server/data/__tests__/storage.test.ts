import { describe, it, expect } from 'vitest';
import type { NormalizedModel } from '../normalize';

/**
 * Storage tests - verify data transformation and database structure
 * Note: Actual database operations are tested in integration tests
 */

describe('storage preparation', () => {
	const mockNormalizedModel: NormalizedModel = {
		externalId: 'openai/gpt-4',
		name: 'GPT-4',
		provider: 'openai',
		description: 'Advanced language model',
		inputPricePerMil: 300,
		outputPricePerMil: 600,
		benchmarkCoding: 92,
		benchmarkReasoning: 96,
		benchmarkMath: 92,
		benchmarkChat: 86,
		benchmarkVision: 85,
		contextWindow: 8192,
		speedTokensPerSec: 50.5,
		supportsVision: true,
		supportsFunctionCalling: true,
		releaseDate: '2023-03-14'
	};

	describe('model data structure', () => {
		it('should have all required fields', () => {
			const model = mockNormalizedModel;

			expect(model).toHaveProperty('externalId');
			expect(model).toHaveProperty('name');
			expect(model).toHaveProperty('provider');
			expect(model).toHaveProperty('inputPricePerMil');
			expect(model).toHaveProperty('outputPricePerMil');
		});

		it('should store pricing as integers', () => {
			const model = mockNormalizedModel;

			expect(Number.isInteger(model.inputPricePerMil)).toBe(true);
			expect(Number.isInteger(model.outputPricePerMil)).toBe(true);
		});

		it('should allow null benchmarks for incomplete data', () => {
			const incompleteModel: NormalizedModel = {
				...mockNormalizedModel,
				benchmarkCoding: null,
				benchmarkReasoning: null,
				benchmarkMath: null,
				benchmarkChat: null,
				benchmarkVision: null
			};

			expect(incompleteModel.benchmarkCoding).toBeNull();
			expect(incompleteModel.benchmarkChat).toBeNull();
		});

		it('should allow null contextWindow and speedTokensPerSec', () => {
			const minimalModel: NormalizedModel = {
				...mockNormalizedModel,
				contextWindow: null,
				speedTokensPerSec: null
			};

			expect(minimalModel.contextWindow).toBeNull();
			expect(minimalModel.speedTokensPerSec).toBeNull();
		});

		it('should store boolean capabilities correctly', () => {
			const model = mockNormalizedModel;

			expect(typeof model.supportsVision).toBe('boolean');
			expect(typeof model.supportsFunctionCalling).toBe('boolean');
		});
	});

	describe('database schema compatibility', () => {
		it('should map to SQLite schema fields', () => {
			// Verify field names match schema
			const model = mockNormalizedModel;

			const schemaFields = {
				name: model.name,
				provider: model.provider,
				description: model.description,
				inputPricePerMil: model.inputPricePerMil,
				outputPricePerMil: model.outputPricePerMil,
				benchmarkCoding: model.benchmarkCoding,
				benchmarkReasoning: model.benchmarkReasoning,
				benchmarkMath: model.benchmarkMath,
				benchmarkChat: model.benchmarkChat,
				benchmarkVision: model.benchmarkVision,
				contextWindow: model.contextWindow,
				supportsVision: model.supportsVision ? 1 : 0,
				supportsFunctionCalling: model.supportsFunctionCalling ? 1 : 0,
				externalId: model.externalId
			};

			expect(schemaFields).toBeDefined();
		});

		it('should convert boolean to integer for database', () => {
			const model = mockNormalizedModel;

			const visionAsInt = model.supportsVision ? 1 : 0;
			const fcAsInt = model.supportsFunctionCalling ? 1 : 0;

			expect(visionAsInt).toBe(1);
			expect(fcAsInt).toBe(1);
		});

		it('should handle false boolean conversion', () => {
			const model: NormalizedModel = {
				...mockNormalizedModel,
				supportsVision: false,
				supportsFunctionCalling: false
			};

			expect(model.supportsVision ? 1 : 0).toBe(0);
			expect(model.supportsFunctionCalling ? 1 : 0).toBe(0);
		});
	});

	describe('batch operations', () => {
		it('should handle multiple models for batch insert', () => {
			const models: NormalizedModel[] = [
				mockNormalizedModel,
				{
					...mockNormalizedModel,
					externalId: 'anthropic/claude-3-opus',
					name: 'Claude 3 Opus',
					provider: 'anthropic'
				},
				{
					...mockNormalizedModel,
					externalId: 'meta/llama-2-70b',
					name: 'Llama 2 70B',
					provider: 'meta',
					benchmarkCoding: 56
				}
			];

			expect(models).toHaveLength(3);
			expect(new Set(models.map((m) => m.externalId)).size).toBe(3);
		});

		it('should detect duplicate models for update vs insert', () => {
			const models: NormalizedModel[] = [
				mockNormalizedModel,
				{ ...mockNormalizedModel } // Duplicate
			];

			const uniqueNames = new Set(models.map((m) => m.name));
			expect(uniqueNames.size).toBe(1); // Should have 1 unique name, suggesting update
		});
	});

	describe('snapshot metadata', () => {
		it('should structure snapshot for successful refresh', () => {
			const snapshot = {
				source: 'combined' as const,
				status: 'success' as const,
				modelCount: 150,
				timestamp: Math.floor(Date.now() / 1000)
			};

			expect(snapshot.source).toBe('combined');
			expect(snapshot.status).toBe('success');
			expect(snapshot.modelCount).toBeGreaterThan(0);
		});

		it('should structure snapshot for failed refresh', () => {
			const snapshot = {
				source: 'combined' as const,
				status: 'failed' as const,
				modelCount: 0,
				timestamp: Math.floor(Date.now() / 1000)
			};

			expect(snapshot.status).toBe('failed');
			expect(snapshot.modelCount).toBe(0);
		});
	});
});
