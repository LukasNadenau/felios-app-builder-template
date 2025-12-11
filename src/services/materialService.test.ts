import { describe, it, expect } from 'vitest';
import { materialService, Material } from './materialService';

describe('materialService', () => {
  describe('getAll', () => {
    it('should return an array of materials', async () => {
      const result = await materialService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return materials with correct structure', async () => {
      const result = await materialService.getAll();
      const firstMaterial = result[0];

      expect(firstMaterial).toHaveProperty('id');
      expect(firstMaterial).toHaveProperty('bezeichnung');
      expect(firstMaterial).toHaveProperty('einheit');
      expect(firstMaterial).toHaveProperty('wiederbeschaffungszeit');
      expect(typeof firstMaterial.id).toBe('number');
      expect(typeof firstMaterial.bezeichnung).toBe('string');
      expect(typeof firstMaterial.einheit).toBe('string');
      expect(typeof firstMaterial.wiederbeschaffungszeit).toBe('number');
    });
  });

  describe('getById', () => {
    it('should return a material when given a valid id', async () => {
      const allMaterials = await materialService.getAll();
      const firstMaterial = allMaterials[0];

      const result = await materialService.getById(firstMaterial.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(firstMaterial.id);
      expect(result?.bezeichnung).toBe(firstMaterial.bezeichnung);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await materialService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
