import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StandorteService, Standort } from './standorte.service';
import { setDatabase, DatabaseConnection } from './database';

describe('StandorteService', () => {
  let service: StandorteService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new StandorteService();
  });

  describe('getAll', () => {
    it('should return all standorte', async () => {
      const mockStandorte: Standort[] = [
        { id: 1, code: 'ST01', name: 'Standort 1', beschreibung: 'Test' },
        { id: 2, code: 'ST02', name: 'Standort 2', beschreibung: null },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockStandorte);

      const result = await service.getAll();

      expect(result).toEqual(mockStandorte);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM standorte ORDER BY code');
    });
  });

  describe('getById', () => {
    it('should return a standort by id', async () => {
      const mockStandort: Standort = { id: 1, code: 'ST01', name: 'Standort 1', beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockStandort]);

      const result = await service.getById(1);

      expect(result).toEqual(mockStandort);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM standorte WHERE id = ?', [1]);
    });

    it('should return null if standort not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByCode', () => {
    it('should return a standort by code', async () => {
      const mockStandort: Standort = { id: 1, code: 'ST01', name: 'Standort 1', beschreibung: 'Test' };
      vi.mocked(mockDb.query).mockResolvedValue([mockStandort]);

      const result = await service.getByCode('ST01');

      expect(result).toEqual(mockStandort);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM standorte WHERE code = ?', ['ST01']);
    });

    it('should return null if standort not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getByCode('INVALID');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new standort', async () => {
      const newStandort: Omit<Standort, 'id'> = {
        code: 'ST03',
        name: 'Standort 3',
        beschreibung: 'New location',
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newStandort);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO standorte (code, name, beschreibung) VALUES (?, ?, ?)',
        ['ST03', 'Standort 3', 'New location']
      );
    });
  });

  describe('update', () => {
    it('should update a standort', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { name: 'Updated Name' });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE standorte SET name = ? WHERE id = ?',
        ['Updated Name', 1]
      );
    });

    it('should update multiple fields', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, {
        code: 'NEW',
        name: 'New Name',
        beschreibung: 'New description',
      });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE standorte SET code = ?, name = ?, beschreibung = ? WHERE id = ?',
        ['NEW', 'New Name', 'New description', 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });

    it('should return false if standort not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.update(999, { name: 'Updated' });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a standort', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM standorte WHERE id = ?', [1]);
    });

    it('should return false if standort not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});
