import { describe, it, expect } from 'vitest';
import { anOrdBezService } from './anOrdBezService';

describe('anOrdBezService', () => {
  describe('getAll', () => {
    it('should return an array of anOrdBez', async () => {
      const result = await anOrdBezService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return anOrdBez with correct structure', async () => {
      const result = await anOrdBezService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('quelleId');
      expect(first).toHaveProperty('quelleElement');
      expect(first).toHaveProperty('zielId');
      expect(first).toHaveProperty('zielElement');
      expect(first).toHaveProperty('typ');
      expect(first).toHaveProperty('abstand');
      expect(first).toHaveProperty('abstandExakt');
    });
  });

  describe('getById', () => {
    it('should return an anOrdBez when given a valid id', async () => {
      const all = await anOrdBezService.getAll();
      const first = all[0];

      const result = await anOrdBezService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await anOrdBezService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
