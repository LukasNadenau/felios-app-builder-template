import { describe, it, expect } from 'vitest';
import { materialErzeugungService } from './materialErzeugungService';

describe('materialErzeugungService', () => {
  describe('getAll', () => {
    it('should return an array of materialErzeugung', async () => {
      const result = await materialErzeugungService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return materialErzeugung with correct structure', async () => {
      const result = await materialErzeugungService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('fertObjektId');
      expect(first).toHaveProperty('materialId');
      expect(first).toHaveProperty('menge');
      expect(typeof first.fertObjektId).toBe('number');
      expect(typeof first.materialId).toBe('number');
      expect(typeof first.menge).toBe('number');
    });
  });

  describe('getByFertObjekt', () => {
    it('should return materialErzeugung for a given fertObjekt', async () => {
      const all = await materialErzeugungService.getAll();
      const fertObjektId = all[0].fertObjektId;

      const result = await materialErzeugungService.getByFertObjekt(fertObjektId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((erzeugung) => {
        expect(erzeugung.fertObjektId).toBe(fertObjektId);
      });
    });

    it('should return empty array when no erzeugung exists for fertObjekt', async () => {
      const result = await materialErzeugungService.getByFertObjekt(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByMaterial', () => {
    it('should return materialErzeugung for a given material', async () => {
      const all = await materialErzeugungService.getAll();
      const materialId = all[0].materialId;

      const result = await materialErzeugungService.getByMaterial(materialId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((erzeugung) => {
        expect(erzeugung.materialId).toBe(materialId);
      });
    });

    it('should return empty array when no erzeugung exists for material', async () => {
      const result = await materialErzeugungService.getByMaterial(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
