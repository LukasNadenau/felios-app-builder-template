import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjekteService, Projekt } from './projekte.service';
import { setDatabase, DatabaseConnection } from './database';

describe('ProjekteService', () => {
  let service: ProjekteService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new ProjekteService();
  });

  describe('getAll', () => {
    it('should return all projekte', async () => {
      const mockProjekte: Projekt[] = [
        { id: 1, code: 'P01', name: 'Projekt 1', beschreibung: 'Test', start_geplant: '2024-01-01', ende_geplant: '2024-12-31' },
        { id: 2, code: 'P02', name: 'Projekt 2', beschreibung: null, start_geplant: null, ende_geplant: null },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockProjekte);

      const result = await service.getAll();

      expect(result).toEqual(mockProjekte);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte ORDER BY code');
    });
  });

  describe('getById', () => {
    it('should return a projekt by id', async () => {
      const mockProjekt: Projekt = { id: 1, code: 'P01', name: 'Projekt 1', beschreibung: 'Test', start_geplant: '2024-01-01', ende_geplant: '2024-12-31' };
      vi.mocked(mockDb.query).mockResolvedValue([mockProjekt]);

      const result = await service.getById(1);

      expect(result).toEqual(mockProjekt);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE id = ?', [1]);
    });

    it('should return null if projekt not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByCode', () => {
    it('should return a projekt by code', async () => {
      const mockProjekt: Projekt = { id: 1, code: 'P01', name: 'Projekt 1', beschreibung: 'Test', start_geplant: '2024-01-01', ende_geplant: '2024-12-31' };
      vi.mocked(mockDb.query).mockResolvedValue([mockProjekt]);

      const result = await service.getByCode('P01');

      expect(result).toEqual(mockProjekt);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE code = ?', ['P01']);
    });
  });

  describe('create', () => {
    it('should create a new projekt', async () => {
      const newProjekt: Omit<Projekt, 'id'> = {
        code: 'P03',
        name: 'Projekt 3',
        beschreibung: 'New project',
        start_geplant: '2024-03-01',
        ende_geplant: '2024-09-30',
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newProjekt);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO projekte (code, name, beschreibung, start_geplant, ende_geplant) VALUES (?, ?, ?, ?, ?)',
        ['P03', 'Projekt 3', 'New project', '2024-03-01', '2024-09-30']
      );
    });
  });

  describe('update', () => {
    it('should update a projekt', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { name: 'Updated Name', ende_geplant: '2024-11-30' });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE projekte SET name = ?, ende_geplant = ? WHERE id = ?',
        ['Updated Name', '2024-11-30', 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });

    it('should return false if projekt not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.update(999, { name: 'Updated' });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a projekt', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM projekte WHERE id = ?', [1]);
    });

    it('should return false if projekt not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });
});
