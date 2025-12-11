import { describe, it, expect } from 'vitest';
import { mitarbeiterRessourceBedarfLinkService } from './mitarbeiterRessourceBedarfLinkService';

describe('mitarbeiterRessourceBedarfLinkService', () => {
  describe('getAll', () => {
    it('should return an array of mitarbeiterRessourceBedarfLinks', async () => {
      const result = await mitarbeiterRessourceBedarfLinkService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return mitarbeiterRessourceBedarfLinks with correct structure', async () => {
      const result = await mitarbeiterRessourceBedarfLinkService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('mitarbeiterId');
      expect(first).toHaveProperty('arbeitsgangId');
      expect(first).toHaveProperty('tag');
      expect(first).toHaveProperty('minuten');
      expect(typeof first.mitarbeiterId).toBe('number');
      expect(typeof first.arbeitsgangId).toBe('number');
    });
  });

  describe('getByMitarbeiterAndArbeitsgang', () => {
    it('should return links for given mitarbeiter and arbeitsgang', async () => {
      const all = await mitarbeiterRessourceBedarfLinkService.getAll();
      const first = all[0];

      const result = await mitarbeiterRessourceBedarfLinkService.getByMitarbeiterAndArbeitsgang(
        first.mitarbeiterId,
        first.arbeitsgangId
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.mitarbeiterId).toBe(first.mitarbeiterId);
        expect(link.arbeitsgangId).toBe(first.arbeitsgangId);
      });
    });

    it('should return empty array when combination does not exist', async () => {
      const result = await mitarbeiterRessourceBedarfLinkService.getByMitarbeiterAndArbeitsgang(
        999999,
        999999
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByMitarbeiter', () => {
    it('should return links for a given mitarbeiter', async () => {
      const all = await mitarbeiterRessourceBedarfLinkService.getAll();
      const mitarbeiterId = all[0].mitarbeiterId;

      const result = await mitarbeiterRessourceBedarfLinkService.getByMitarbeiter(mitarbeiterId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.mitarbeiterId).toBe(mitarbeiterId);
      });
    });

    it('should return empty array when no links exist for mitarbeiter', async () => {
      const result = await mitarbeiterRessourceBedarfLinkService.getByMitarbeiter(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByArbeitsgang', () => {
    it('should return links for a given arbeitsgang', async () => {
      const all = await mitarbeiterRessourceBedarfLinkService.getAll();
      const arbeitsgangId = all[0].arbeitsgangId;

      const result = await mitarbeiterRessourceBedarfLinkService.getByArbeitsgang(arbeitsgangId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.arbeitsgangId).toBe(arbeitsgangId);
      });
    });

    it('should return empty array when no links exist for arbeitsgang', async () => {
      const result = await mitarbeiterRessourceBedarfLinkService.getByArbeitsgang(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
