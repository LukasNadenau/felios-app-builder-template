import { describe, it, expect } from 'vitest';
import { tagService } from './tagService';

describe('tagService', () => {
  describe('getAll', () => {
    it('should return an array of tage', async () => {
      const result = await tagService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return tage with correct structure', async () => {
      const result = await tagService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('index');
      expect(first).toHaveProperty('datum');
      expect(typeof first.index).toBe('number');
      expect(typeof first.datum).toBe('string');
    });
  });

  describe('getByIndex', () => {
    it('should return a tag when given a valid index', async () => {
      const all = await tagService.getAll();
      const first = all[0];

      const result = await tagService.getByIndex(first.index);

      expect(result).toBeDefined();
      expect(result?.index).toBe(first.index);
      expect(result?.datum).toBe(first.datum);
    });

    it('should return undefined when given an invalid index', async () => {
      const result = await tagService.getByIndex(999999);

      expect(result).toBeUndefined();
    });
  });
});
