import { describe, it, expect } from 'vitest';
import { CATEGORY_WEIGHTS, categorizeSubtask } from '../weights';

describe('weights', () => {
  it('should have weights for all categories', () => {
    const categories = [
      'coding',
      'writing',
      'analysis',
      'customer_support',
      'data_processing',
      'math',
      'creative',
      'general'
    ];

    for (const cat of categories) {
      expect(CATEGORY_WEIGHTS[cat as keyof typeof CATEGORY_WEIGHTS]).toBeDefined();
    }
  });

  it('should sum to 1.0 for each category', () => {
    for (const [category, weights] of Object.entries(CATEGORY_WEIGHTS)) {
      const sum = weights.coding + weights.reasoning + weights.math + weights.chat + weights.vision;
      expect(sum).toBeCloseTo(1.0, 5);
    }
  });

  it('should categorize coding subtask correctly', () => {
    const result = categorizeSubtask('Write a Python function', 'writing');
    expect(result).toBe('coding');
  });

  it('should categorize math subtask correctly', () => {
    const result = categorizeSubtask('Solve the equation using calculus', 'writing');
    expect(result).toBe('math');
  });

  it('should fallback to parent category when no keywords match', () => {
    const result = categorizeSubtask('Do the thing', 'coding');
    expect(result).toBe('coding');
  });

  it('should categorize analysis subtask correctly', () => {
    const result = categorizeSubtask('Analyze the data for trends and patterns', 'general');
    expect(result).toBe('analysis');
  });

  it('should handle empty subtask string gracefully', () => {
    const result = categorizeSubtask('', 'coding');
    expect(result).toBe('coding');
  });
});
