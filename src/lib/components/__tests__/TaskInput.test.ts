import { describe, it, expect } from 'vitest';

describe('TaskInput validation logic', () => {
	// Test character count calculation
	it('calculates character count correctly', () => {
		const taskInput = 'Hello world';
		const charCount = taskInput.length;
		expect(charCount).toBe(11);
	});

	it('handles empty string character count', () => {
		const taskInput = '';
		const charCount = taskInput.length;
		expect(charCount).toBe(0);
	});

	// Test validity check: empty string
	it('marks empty string as invalid', () => {
		const taskInput = '';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(false);
	});

	// Test validity check: whitespace only
	it('marks whitespace-only string as invalid', () => {
		const taskInput = '   ';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(false);
	});

	// Test validity check: valid string
	it('marks valid string as valid', () => {
		const taskInput = 'Build a chatbot for customer support';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true);
	});

	// Test validity check: max length (2000 chars)
	it('marks exactly 2000 character string as valid', () => {
		const taskInput = 'a'.repeat(2000);
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true);
	});

	// Test validity check: over max length
	it('marks string over 2000 characters as invalid', () => {
		const taskInput = 'a'.repeat(2001);
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(false);
	});

	// Test validity check: leading/trailing whitespace
	it('validates based on trimmed content but counts all characters', () => {
		const taskInput = '  valid task  ';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true); // trimmed is > 0
		expect(taskInput.length).toBe(14); // includes whitespace
	});

	// Test validity check: multiline valid input
	it('marks multiline string as valid', () => {
		const taskInput = 'Build a chatbot\nfor customer support\nwith AI';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true);
	});

	// Test edge case: single character
	it('marks single character as valid', () => {
		const taskInput = 'A';
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true);
	});

	// Test edge case: char count boundary
	it('correctly counts chars at 1999 as valid', () => {
		const taskInput = 'a'.repeat(1999);
		const isValid = taskInput.trim().length > 0 && taskInput.length <= 2000;
		expect(isValid).toBe(true);
		expect(taskInput.length).toBe(1999);
	});
});
