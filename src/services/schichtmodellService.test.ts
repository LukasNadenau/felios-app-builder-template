import { describe, it, expect } from 'vitest';
import { schichtmodellService } from './schichtmodellService';

describe('schichtmodellService', () => {
  describe('getAll', () => {
    it('should return an array of schichtmodelle', async () => {
      const result = await schichtmodellService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return schichtmodelle with correct structure', async () => {
      const result = await schichtmodellService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('typ');
      expect(first).toHaveProperty('bezeichnung');
      expect(first).toHaveProperty('kuerzel');
      expect(first).toHaveProperty('start');
      expect(first).toHaveProperty('ende');
    });
  });

  describe('getById', () => {
    it('should return a schichtmodell when given a valid id', async () => {
      const all = await schichtmodellService.getAll();
      const first = all[0];

      const result = await schichtmodellService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await schichtmodellService.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe('getByTyp', () => {
    it('should return schichtmodelle for a given typ', async () => {
      const all = await schichtmodellService.getAll();
      const typ = all[0].typ;

      const result = await schichtmodellService.getByTyp(typ);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((schichtmodell) => {
        expect(schichtmodell.typ).toBe(typ);
      });
    });

    it('should return empty array when no schichtmodelle exist for typ', async () => {
      const result = await schichtmodellService.getByTyp('NONEXISTENT');

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
