import { describe, it, expect } from 'vitest';
import { mitarbeiterService } from './mitarbeiterService';

describe('mitarbeiterService', () => {
  describe('getAll', () => {
    it('should return an array of mitarbeiter', async () => {
      const result = await mitarbeiterService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return mitarbeiter with correct structure', async () => {
      const result = await mitarbeiterService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('stundenprofil');
      expect(first).toHaveProperty('stundenprofilUeberstunden');
      expect(typeof first.id).toBe('number');
      expect(typeof first.name).toBe('string');
      expect(first.stundenprofil).toHaveProperty('Monday');
    });
  });

  describe('getById', () => {
    it('should return a mitarbeiter when given a valid id', async () => {
      const all = await mitarbeiterService.getAll();
      const first = all[0];

      const result = await mitarbeiterService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
      expect(result?.name).toBe(first.name);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await mitarbeiterService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
