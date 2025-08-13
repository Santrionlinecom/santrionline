import { describe, it, expect } from 'vitest';

// Simple pure function for test demonstration
function sum(a: number, b: number) { return a + b; }

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
