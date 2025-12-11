import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RessourcenService, Ressource } from './ressourcen.service';
import { setDatabase, DatabaseConnection } from './database';

describe('RessourcenService', () => {
  let service: RessourcenService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new RessourcenService();
  });

  describe('getAll', () => {
    it('should return all ressourcen', async () => {
      const mockRessourcen: Ressource[] = [
        { id: 1, standort_id: 1, code: 'R01', name: 'Ressource 1', kapazitaet: 10, beschreibung: 'Test' },
        { id: 2, standort_id: 1, code: 'R02', name: 'Ressource 2', kapazitaet: 20, beschreibung: null },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockRessourcen);

      const result = await service.getAll();

      expect(result).toEqual(mockRessourcen);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM ressourcen ORDER BY code');
    });
  });

  describe('getById', () => {
    it('should return a ressource by id', async () => {
      const mockRessource: Ressource = { id: 1, standort_id: 1, code: 'R01', name: 'Ressource 1', kapazitaet: 10, beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockRessource]);

      const result = await service.getById(1);

      expect(result).toEqual(mockRessource);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM ressourcen WHERE id = ?', [1]);
    });

    it('should return null if ressource not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByStandortId', () => {
    it('should return ressourcen by standort id', async () => {
      const mockRessourcen: Ressource[] = [
        { id: 1, standort_id: 1, code: 'R01', name: 'Ressource 1', kapazitaet: 10, beschreibung: 'Test' },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockRessourcen);

      const result = await service.getByStandortId(1);

      expect(result).toEqual(mockRessourcen);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM ressourcen WHERE standort_id = ? ORDER BY code', [1]);
    });
  });

  describe('getByCode', () => {
    it('should return a ressource by standort id and code', async () => {
      const mockRessource: Ressource = { id: 1, standort_id: 1, code: 'R01', name: 'Ressource 1', kapazitaet: 10, beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockRessource]);

      const result = await service.getByCode(1, 'R01');

      expect(result).toEqual(mockRessource);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM ressourcen WHERE standort_id = ? AND code = ?',
        [1, 'R01']
      );
    });
  });

  describe('create', () => {
    it('should create a new ressource', async () => {
      const newRessource: Omit<Ressource, 'id'> = {
        standort_id: 1,
        code: 'R03',
        name: 'Ressource 3',
        kapazitaet: 30,
        beschreibung: 'New resource',
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newRessource);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO ressourcen (standort_id, code, name, kapazitaet, beschreibung) VALUES (?, ?, ?, ?, ?)',
        [1, 'R03', 'Ressource 3', 30, 'New resource']
      );
    });
  });

  describe('update', () => {
    it('should update a ressource', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { name: 'Updated Name', kapazitaet: 50 });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE ressourcen SET name = ?, kapazitaet = ? WHERE id = ?',
        ['Updated Name', 50, 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a ressource', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM ressourcen WHERE id = ?', [1]);
    });

    it('should return false if ressource not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});
