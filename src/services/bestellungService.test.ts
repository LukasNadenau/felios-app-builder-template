import { describe, it, expect } from 'vitest';
import { bestellungService } from './bestellungService';

describe('bestellungService', () => {
  describe('getAll', () => {
    it('should return an array of bestellungen', async () => {
      const result = await bestellungService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return bestellungen with correct structure', async () => {
      const result = await bestellungService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('materialId');
      expect(first).toHaveProperty('verfuegbarTag');
      expect(first).toHaveProperty('menge');
      expect(first).toHaveProperty('fix');
      expect(typeof first.id).toBe('number');
      expect(typeof first.materialId).toBe('number');
      expect(typeof first.fix).toBe('boolean');
    });
  });

  describe('getById', () => {
    it('should return a bestellung when given a valid id', async () => {
      const all = await bestellungService.getAll();
      const first = all[0];

      const result = await bestellungService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
      expect(result?.materialId).toBe(first.materialId);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await bestellungService.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe('getByMaterial', () => {
    it('should return bestellungen for a given material', async () => {
      const all = await bestellungService.getAll();
      const materialId = all[0].materialId;

      const result = await bestellungService.getByMaterial(materialId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((bestellung) => {
        expect(bestellung.materialId).toBe(materialId);
      });
    });

    it('should return empty array when no bestellungen exist for material', async () => {
      const result = await bestellungService.getByMaterial(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
