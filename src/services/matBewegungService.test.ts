import { describe, it, expect } from 'vitest';
import { matBewegungService } from './matBewegungService';

describe('matBewegungService', () => {
  describe('getAll', () => {
    it('should return an array of matBewegungen', async () => {
      const result = await matBewegungService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return matBewegungen with correct structure', async () => {
      const result = await matBewegungService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('matBewegungArt');
      expect(first).toHaveProperty('materialId');
      expect(first).toHaveProperty('menge');
      expect(first).toHaveProperty('fix');
    });
  });

  describe('getById', () => {
    it('should return a matBewegung when given a valid id', async () => {
      const all = await matBewegungService.getAll();
      const first = all[0];

      const result = await matBewegungService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await matBewegungService.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe('getByMaterial', () => {
    it('should return matBewegungen for a given material', async () => {
      const all = await matBewegungService.getAll();
      const materialId = all[0].materialId;

      const result = await matBewegungService.getByMaterial(materialId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((matBewegung) => {
        expect(matBewegung.materialId).toBe(materialId);
      });
    });

    it('should return empty array when no matBewegungen exist for material', async () => {
      const result = await matBewegungService.getByMaterial(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
