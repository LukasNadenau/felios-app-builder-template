import { describe, it, expect } from 'vitest';
import { fertObjektService } from './fertObjektService';

describe('fertObjektService', () => {
  describe('getAll', () => {
    it('should return an array of fertObjekte', async () => {
      const result = await fertObjektService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return fertObjekte with correct structure', async () => {
      const result = await fertObjektService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('bezeichnung');
      expect(first).toHaveProperty('typ');
      expect(first).toHaveProperty('parentFertObjektId');
      expect(first).toHaveProperty('zieltermin');
    });
  });

  describe('getById', () => {
    it('should return a fertObjekt when given a valid id', async () => {
      const all = await fertObjektService.getAll();
      const first = all[0];

      const result = await fertObjektService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await fertObjektService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
