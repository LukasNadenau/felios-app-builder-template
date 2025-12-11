import { describe, it, expect } from 'vitest';
import { mitarbeiterEignungService } from './mitarbeiterEignungService';

describe('mitarbeiterEignungService', () => {
  describe('getAll', () => {
    it('should return an array of mitarbeiterEignung', async () => {
      const result = await mitarbeiterEignungService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return mitarbeiterEignung with correct structure', async () => {
      const result = await mitarbeiterEignungService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('ressourceId');
      expect(first).toHaveProperty('mitarbeiterId');
      expect(first).toHaveProperty('eignung');
      expect(typeof first.ressourceId).toBe('number');
      expect(typeof first.mitarbeiterId).toBe('number');
      expect(typeof first.eignung).toBe('number');
    });
  });

  describe('getByMitarbeiterAndRessource', () => {
    it('should return mitarbeiterEignung when given valid ids', async () => {
      const all = await mitarbeiterEignungService.getAll();
      const first = all[0];

      const result = await mitarbeiterEignungService.getByMitarbeiterAndRessource(
        first.mitarbeiterId,
        first.ressourceId
      );

      expect(result).toBeDefined();
      expect(result?.mitarbeiterId).toBe(first.mitarbeiterId);
      expect(result?.ressourceId).toBe(first.ressourceId);
    });

    it('should return undefined when combination does not exist', async () => {
      const result = await mitarbeiterEignungService.getByMitarbeiterAndRessource(
        999999,
        999999
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getByMitarbeiter', () => {
    it('should return mitarbeiterEignung for a given mitarbeiter', async () => {
      const all = await mitarbeiterEignungService.getAll();
      const mitarbeiterId = all[0].mitarbeiterId;

      const result = await mitarbeiterEignungService.getByMitarbeiter(mitarbeiterId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((eignung) => {
        expect(eignung.mitarbeiterId).toBe(mitarbeiterId);
      });
    });

    it('should return empty array when no eignung exists for mitarbeiter', async () => {
      const result = await mitarbeiterEignungService.getByMitarbeiter(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByRessource', () => {
    it('should return mitarbeiterEignung for a given ressource', async () => {
      const all = await mitarbeiterEignungService.getAll();
      const ressourceId = all[0].ressourceId;

      const result = await mitarbeiterEignungService.getByRessource(ressourceId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((eignung) => {
        expect(eignung.ressourceId).toBe(ressourceId);
      });
    });

    it('should return empty array when no eignung exists for ressource', async () => {
      const result = await mitarbeiterEignungService.getByRessource(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
