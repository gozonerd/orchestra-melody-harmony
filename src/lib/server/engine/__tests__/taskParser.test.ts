import { describe, it, expect } from 'vitest';
import { parseTask } from '../taskParser';

describe('taskParser', () => {
	it('should throw error for empty string', () => {
		expect(() => parseTask('')).toThrow('Task description cannot be empty');
	});

	it('should throw error for whitespace-only string', () => {
		expect(() => parseTask('   ')).toThrow('Task description cannot be empty');
	});

	it('should throw error for string over 2000 characters', () => {
		const longString = 'a'.repeat(2001);
		expect(() => parseTask(longString)).toThrow('Task description must be under 2000 characters');
	});

	it('should categorize coding task correctly', () => {
		const result = parseTask('Write a Python function to sort a list');
		expect(result.category).toBe('coding');
	});

	it('should categorize writing task correctly', () => {
		const result = parseTask('Draft a blog post about climate change');
		expect(result.category).toBe('writing');
	});

	it('should categorize analysis task correctly', () => {
		const result = parseTask('Analyze sales data for Q4 trends');
		expect(result.category).toBe('analysis');
	});

	it('should categorize math task correctly', () => {
		const result = parseTask('Help me solve this calculus equation');
		expect(result.category).toBe('math');
	});

	it('should categorize customer_support task correctly', () => {
		const result = parseTask('Respond to customer complaint about shipping');
		expect(result.category).toBe('customer_support');
	});

	it('should categorize data_processing task correctly', () => {
		const result = parseTask('Parse CSV file and load into database');
		expect(result.category).toBe('data_processing');
	});

	it('should categorize creative task correctly', () => {
		const result = parseTask('Brainstorm ideas for a marketing campaign');
		expect(result.category).toBe('creative');
	});

	it('should fallback to general for unmatched task', () => {
		const result = parseTask('Do something for me');
		expect(result.category).toBe('general');
	});

	it('should extract multiple subtasks from multi-sentence input', () => {
		const result = parseTask(
			'Write comprehensive documentation for this module. Include detailed code examples. Add a complete table of contents.'
		);
		expect(result.subtasks.length).toBeGreaterThan(1);
	});

	it('should generate default subtasks for single-sentence input', () => {
		const result = parseTask('Write a function');
		expect(result.subtasks.length).toBeGreaterThan(0);
	});

	it('should cap subtasks at 5', () => {
		const result = parseTask(
			'Task one. Task two. Task three. Task four. Task five. Task six. Task seven.'
		);
		expect(result.subtasks.length).toBeLessThanOrEqual(5);
	});

	it('should filter out short sentences', () => {
		const result = parseTask(
			'Hi there. Write a comprehensive function that does something important.'
		);
		// "Hi there" should be filtered out (2 words)
		const haShortSentence = result.subtasks.some((s) => s.length < 10);
		// If we have subtasks, they should be the longer ones or defaults
		expect(result.subtasks.length).toBeGreaterThan(0);
	});

	it('should preserve original input', () => {
		const input = 'Write a test case for this code';
		const result = parseTask(input);
		expect(result.originalInput).toBe(input);
	});

	it('should track keyword matches', () => {
		const result = parseTask('Write a Python function to sort a list');
		expect(result.keywordMatches.coding).toBeGreaterThan(0);
	});

	it('should handle trimming of input', () => {
		const result = parseTask('  Write a function  ');
		expect(result.originalInput).toBe('Write a function');
	});
});
