import { describe, it, expect } from 'vitest';
import { mitarbeiterSpeEintragungsgrundLinkService } from './mitarbeiterSpeEintragungsgrundLinkService';

describe('mitarbeiterSpeEintragungsgrundLinkService', () => {
  describe('getAll', () => {
    it('should return an array of mitarbeiterSpeEintragungsgrundLinks', async () => {
      const result = await mitarbeiterSpeEintragungsgrundLinkService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return mitarbeiterSpeEintragungsgrundLinks with correct structure', async () => {
      const result = await mitarbeiterSpeEintragungsgrundLinkService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('mitarbeiterId');
      expect(first).toHaveProperty('schichtmodellId');
      expect(first).toHaveProperty('tag');
      expect(typeof first.mitarbeiterId).toBe('number');
      expect(typeof first.schichtmodellId).toBe('number');
      expect(typeof first.tag).toBe('number');
    });
  });

  describe('getBySchichtmodell', () => {
    it('should return links for a given schichtmodell', async () => {
      const all = await mitarbeiterSpeEintragungsgrundLinkService.getAll();
      const schichtmodellId = all[0].schichtmodellId;

      const result = await mitarbeiterSpeEintragungsgrundLinkService.getBySchichtmodell(
        schichtmodellId
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.schichtmodellId).toBe(schichtmodellId);
      });
    });

    it('should return empty array when no links exist for schichtmodell', async () => {
      const result = await mitarbeiterSpeEintragungsgrundLinkService.getBySchichtmodell(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByMitarbeiter', () => {
    it('should return links for a given mitarbeiter', async () => {
      const all = await mitarbeiterSpeEintragungsgrundLinkService.getAll();
      const mitarbeiterId = all[0].mitarbeiterId;

      const result = await mitarbeiterSpeEintragungsgrundLinkService.getByMitarbeiter(
        mitarbeiterId
      );

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.mitarbeiterId).toBe(mitarbeiterId);
      });
    });

    it('should return empty array when no links exist for mitarbeiter', async () => {
      const result = await mitarbeiterSpeEintragungsgrundLinkService.getByMitarbeiter(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
