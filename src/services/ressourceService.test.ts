import { describe, it, expect } from 'vitest';
import { ressourceService } from './ressourceService';

describe('ressourceService', () => {
  describe('getAll', () => {
    it('should return an array of ressourcen', async () => {
      const result = await ressourceService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return ressourcen with correct structure', async () => {
      const result = await ressourceService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('bezeichnung');
      expect(first).toHaveProperty('anzahlPlaetze');
      expect(first).toHaveProperty('parallelitaetsfaktor');
      expect(first).toHaveProperty('tageskapazitaet');
      expect(first.tageskapazitaet).toHaveProperty('Monday');
    });
  });

  describe('getById', () => {
    it('should return a ressource when given a valid id', async () => {
      const all = await ressourceService.getAll();
      const first = all[0];

      const result = await ressourceService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await ressourceService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
