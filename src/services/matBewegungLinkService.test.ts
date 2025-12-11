import { describe, it, expect } from 'vitest';
import { matBewegungLinkService } from './matBewegungLinkService';

describe('matBewegungLinkService', () => {
  describe('getAll', () => {
    it('should return an array of matBewegungLinks', async () => {
      const result = await matBewegungLinkService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return matBewegungLinks with correct structure', async () => {
      const result = await matBewegungLinkService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('matBewegungZugangId');
      expect(first).toHaveProperty('matBewegungAbgangId');
      expect(first).toHaveProperty('menge');
      expect(first).toHaveProperty('fix');
    });
  });

  describe('getById', () => {
    it('should return a matBewegungLink when given a valid id', async () => {
      const all = await matBewegungLinkService.getAll();
      const first = all[0];

      const result = await matBewegungLinkService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await matBewegungLinkService.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe('getByZugang', () => {
    it('should return matBewegungLinks for a given zugang', async () => {
      const all = await matBewegungLinkService.getAll();
      const zugangId = all[0].matBewegungZugangId;

      const result = await matBewegungLinkService.getByZugang(zugangId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.matBewegungZugangId).toBe(zugangId);
      });
    });

    it('should return empty array when no links exist for zugang', async () => {
      const result = await matBewegungLinkService.getByZugang(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });

  describe('getByAbgang', () => {
    it('should return matBewegungLinks for a given abgang', async () => {
      const all = await matBewegungLinkService.getAll();
      const abgangId = all[0].matBewegungAbgangId;

      const result = await matBewegungLinkService.getByAbgang(abgangId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((link) => {
        expect(link.matBewegungAbgangId).toBe(abgangId);
      });
    });

    it('should return empty array when no links exist for abgang', async () => {
      const result = await matBewegungLinkService.getByAbgang(999999);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(0);
    });
  });
});
