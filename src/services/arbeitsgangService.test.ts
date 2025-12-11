import { describe, it, expect } from 'vitest';
import { arbeitsgangService } from './arbeitsgangService';

describe('arbeitsgangService', () => {
  describe('getAll', () => {
    it('should return an array of arbeitsgaenge', async () => {
      const result = await arbeitsgangService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return arbeitsgaenge with correct structure', async () => {
      const result = await arbeitsgangService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('bezeichnung');
      expect(first).toHaveProperty('ressourceId');
      expect(first).toHaveProperty('ressourceBedarf');
      expect(first).toHaveProperty('parentFertObjId');
    });
  });

  describe('getById', () => {
    it('should return an arbeitsgang when given a valid id', async () => {
      const all = await arbeitsgangService.getAll();
      const first = all[0];

      const result = await arbeitsgangService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await arbeitsgangService.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe('getByRessource', () => {
    it('should return arbeitsgaenge for a given ressource', async () => {
      const all = await arbeitsgangService.getAll();
      const ressourceId = all[0].ressourceId;

      const result = await arbeitsgangService.getByRessource(ressourceId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((arbeitsgang) => {
        expect(arbeitsgang.ressourceId).toBe(ressourceId);
      });
    });

    it('should return empty array when no arbeitsgaenge exist for ressource', async () => {
      const result = await arbeitsgangService.getByRessource(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
