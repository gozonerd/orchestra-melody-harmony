import { describe, it, expect } from 'vitest';
import {
	isValidPrice,
	isValidBenchmarkScore,
	isValidModelName,
	isValidProvider,
	isValidContextWindow,
	validateModelData
} from '../validation';

describe('validation utilities', () => {
	describe('isValidPrice', () => {
		it('should accept valid prices', () => {
			expect(isValidPrice(0)).toBe(true);
			expect(isValidPrice(100)).toBe(true);
			expect(isValidPrice(1000000)).toBe(true);
		});

		it('should reject negative prices', () => {
			expect(isValidPrice(-1)).toBe(false);
			expect(isValidPrice(-100)).toBe(false);
		});

		it('should reject floating point prices', () => {
			expect(isValidPrice(100.5)).toBe(false);
			expect(isValidPrice(0.01)).toBe(false);
		});

		it('should reject non-numbers', () => {
			expect(isValidPrice(NaN)).toBe(false);
			expect(isValidPrice(Infinity)).toBe(false);
		});
	});

	describe('isValidBenchmarkScore', () => {
		it('should accept valid scores', () => {
			expect(isValidBenchmarkScore(0)).toBe(true);
			expect(isValidBenchmarkScore(50)).toBe(true);
			expect(isValidBenchmarkScore(100)).toBe(true);
			expect(isValidBenchmarkScore(50.5)).toBe(true);
		});

		it('should reject scores below 0', () => {
			expect(isValidBenchmarkScore(-1)).toBe(false);
			expect(isValidBenchmarkScore(-0.1)).toBe(false);
		});

		it('should reject scores above 100', () => {
			expect(isValidBenchmarkScore(100.1)).toBe(false);
			expect(isValidBenchmarkScore(101)).toBe(false);
		});

		it('should reject non-numbers', () => {
			expect(isValidBenchmarkScore('50')).toBe(false);
			expect(isValidBenchmarkScore(null)).toBe(false);
			expect(isValidBenchmarkScore(undefined)).toBe(false);
			expect(isValidBenchmarkScore({})).toBe(false);
		});
	});

	describe('isValidModelName', () => {
		it('should accept valid names', () => {
			expect(isValidModelName('GPT-4')).toBe(true);
			expect(isValidModelName('Claude 3 Opus')).toBe(true);
			expect(isValidModelName('a')).toBe(true);
		});

		it('should reject empty names', () => {
			expect(isValidModelName('')).toBe(false);
		});

		it('should reject names longer than 255 chars', () => {
			const longName = 'a'.repeat(256);
			expect(isValidModelName(longName)).toBe(false);
		});

		it('should reject non-strings', () => {
			expect(isValidModelName(123)).toBe(false);
			expect(isValidModelName(null)).toBe(false);
			expect(isValidModelName(undefined)).toBe(false);
		});

		it('should accept 255 char name', () => {
			const maxName = 'a'.repeat(255);
			expect(isValidModelName(maxName)).toBe(true);
		});
	});

	describe('isValidProvider', () => {
		it('should accept valid providers', () => {
			expect(isValidProvider('openai')).toBe(true);
			expect(isValidProvider('anthropic')).toBe(true);
			expect(isValidProvider('x')).toBe(true);
		});

		it('should reject empty providers', () => {
			expect(isValidProvider('')).toBe(false);
		});

		it('should reject providers longer than 50 chars', () => {
			const longProvider = 'a'.repeat(51);
			expect(isValidProvider(longProvider)).toBe(false);
		});

		it('should reject non-strings', () => {
			expect(isValidProvider(123)).toBe(false);
			expect(isValidProvider(null)).toBe(false);
		});

		it('should accept 50 char provider', () => {
			const maxProvider = 'a'.repeat(50);
			expect(isValidProvider(maxProvider)).toBe(true);
		});
	});

	describe('isValidContextWindow', () => {
		it('should accept valid context windows', () => {
			expect(isValidContextWindow(1024)).toBe(true);
			expect(isValidContextWindow(8192)).toBe(true);
			expect(isValidContextWindow(200000)).toBe(true);
		});

		it('should reject zero', () => {
			expect(isValidContextWindow(0)).toBe(false);
		});

		it('should reject negative values', () => {
			expect(isValidContextWindow(-1)).toBe(false);
		});

		it('should reject floats', () => {
			expect(isValidContextWindow(8192.5)).toBe(false);
		});

		it('should reject values over 1M', () => {
			expect(isValidContextWindow(1000001)).toBe(false);
		});

		it('should reject non-numbers', () => {
			expect(isValidContextWindow('8192')).toBe(false);
			expect(isValidContextWindow(null)).toBe(false);
		});

		it('should accept boundary values', () => {
			expect(isValidContextWindow(1)).toBe(true);
			expect(isValidContextWindow(1000000)).toBe(true);
		});
	});

	describe('validateModelData', () => {
		it('should validate complete valid model', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: 'openai',
				inputPricePerMil: 300,
				outputPricePerMil: 600,
				contextWindow: 8192
			});

			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should report invalid name', () => {
			const result = validateModelData({
				name: '',
				provider: 'openai',
				inputPricePerMil: 300
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid model name');
		});

		it('should report invalid provider', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: '',
				inputPricePerMil: 300
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid provider');
		});

		it('should report invalid input price', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: 'openai',
				inputPricePerMil: -100
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid input price');
		});

		it('should report invalid output price', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: 'openai',
				outputPricePerMil: 100.5
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid output price');
		});

		it('should report invalid context window', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: 'openai',
				contextWindow: 0
			});

			expect(result.valid).toBe(false);
			expect(result.errors).toContain('Invalid context window');
		});

		it('should report multiple errors', () => {
			const result = validateModelData({
				name: '',
				provider: '',
				inputPricePerMil: -1,
				outputPricePerMil: -1
			});

			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});

		it('should allow optional fields', () => {
			const result = validateModelData({
				name: 'GPT-4',
				provider: 'openai'
			});

			expect(result.valid).toBe(true);
		});
	});
});
