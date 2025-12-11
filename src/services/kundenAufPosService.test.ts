import { describe, it, expect } from 'vitest';
import { kundenAufPosService } from './kundenAufPosService';

describe('kundenAufPosService', () => {
  describe('getAll', () => {
    it('should return an array of kundenAufPos', async () => {
      const result = await kundenAufPosService.getAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return kundenAufPos with correct structure', async () => {
      const result = await kundenAufPosService.getAll();
      const first = result[0];

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('materialId');
      expect(first).toHaveProperty('menge');
      expect(first).toHaveProperty('zieltermin');
    });
  });

  describe('getById', () => {
    it('should return a kundenAufPos when given a valid id', async () => {
      const all = await kundenAufPosService.getAll();
      const first = all[0];

      const result = await kundenAufPosService.getById(first.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(first.id);
    });

    it('should return undefined when given an invalid id', async () => {
      const result = await kundenAufPosService.getById(999999);

      expect(result).toBeUndefined();
    });
  });
});
