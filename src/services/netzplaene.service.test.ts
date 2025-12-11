import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NetzplaeneService, Netzplan } from './netzplaene.service';
import { setDatabase, DatabaseConnection } from './database';

describe('NetzplaeneService', () => {
  let service: NetzplaeneService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new NetzplaeneService();
  });

  describe('getAll', () => {
    it('should return all netzplaene', async () => {
      const mockNetzplaene: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'NP01', name: 'Netzplan 1', beschreibung: 'Test' },
        { id: 2, projekt_id: 1, code: 'NP02', name: 'Netzplan 2', beschreibung: null },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockNetzplaene);

      const result = await service.getAll();

      expect(result).toEqual(mockNetzplaene);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM netzplaene ORDER BY code');
    });
  });

  describe('getById', () => {
    it('should return a netzplan by id', async () => {
      const mockNetzplan: Netzplan = { id: 1, projekt_id: 1, code: 'NP01', name: 'Netzplan 1', beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockNetzplan]);

      const result = await service.getById(1);

      expect(result).toEqual(mockNetzplan);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM netzplaene WHERE id = ?', [1]);
    });

    it('should return null if netzplan not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByProjektId', () => {
    it('should return netzplaene by projekt id', async () => {
      const mockNetzplaene: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'NP01', name: 'Netzplan 1', beschreibung: 'Test' },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockNetzplaene);

      const result = await service.getByProjektId(1);

      expect(result).toEqual(mockNetzplaene);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code',
        [1]
      );
    });
  });

  describe('getByCode', () => {
    it('should return a netzplan by projekt id and code', async () => {
      const mockNetzplan: Netzplan = { id: 1, projekt_id: 1, code: 'NP01', name: 'Netzplan 1', beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockNetzplan]);

      const result = await service.getByCode(1, 'NP01');

      expect(result).toEqual(mockNetzplan);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM netzplaene WHERE projekt_id = ? AND code = ?',
        [1, 'NP01']
      );
    });
  });

  describe('create', () => {
    it('should create a new netzplan', async () => {
      const newNetzplan: Omit<Netzplan, 'id'> = {
        projekt_id: 1,
        code: 'NP03',
        name: 'Netzplan 3',
        beschreibung: 'New network plan',
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newNetzplan);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO netzplaene (projekt_id, code, name, beschreibung) VALUES (?, ?, ?, ?)',
        [1, 'NP03', 'Netzplan 3', 'New network plan']
      );
    });
  });

  describe('update', () => {
    it('should update a netzplan', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { name: 'Updated Name' });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE netzplaene SET name = ? WHERE id = ?',
        ['Updated Name', 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a netzplan', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM netzplaene WHERE id = ?', [1]);
    });

    it('should return false if netzplan not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});
