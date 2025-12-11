import { describe, it, expect } from 'vitest';
import { materialVerbrauchService } from './materialVerbrauchService';

describe('materialVerbrauchService', () => {
  describe('getAll', () => {
    it('should return an array of materialVerbrauch', async () => {
      const result = await materialVerbrauchService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return materialVerbrauch with correct structure', async () => {
      const result = await materialVerbrauchService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('arbeitsgangId');
      expect(first).toHaveProperty('materialId');
      expect(first).toHaveProperty('menge');
      expect(typeof first.arbeitsgangId).toBe('number');
      expect(typeof first.materialId).toBe('number');
      expect(typeof first.menge).toBe('number');
    });
  });

  describe('getByArbeitsgang', () => {
    it('should return materialVerbrauch for a given arbeitsgang', async () => {
      const all = await materialVerbrauchService.getAll();
      const arbeitsgangId = all[0].arbeitsgangId;

      const result = await materialVerbrauchService.getByArbeitsgang(arbeitsgangId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((verbrauch) => {
        expect(verbrauch.arbeitsgangId).toBe(arbeitsgangId);
      });
    });

    it('should return empty array when no verbrauch exists for arbeitsgang', async () => {
      const result = await materialVerbrauchService.getByArbeitsgang(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByMaterial', () => {
    it('should return materialVerbrauch for a given material', async () => {
      const all = await materialVerbrauchService.getAll();
      const materialId = all[0].materialId;

      const result = await materialVerbrauchService.getByMaterial(materialId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((verbrauch) => {
        expect(verbrauch.materialId).toBe(materialId);
      });
    });

    it('should return empty array when no verbrauch exists for material', async () => {
      const result = await materialVerbrauchService.getByMaterial(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
