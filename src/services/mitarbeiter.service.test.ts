import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MitarbeiterService, Mitarbeiter } from './mitarbeiter.service';
import { setDatabase, DatabaseConnection } from './database';

describe('MitarbeiterService', () => {
  let service: MitarbeiterService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new MitarbeiterService();
  });

  describe('getAll', () => {
    it('should return all mitarbeiter', async () => {
      const mockMitarbeiter: Mitarbeiter[] = [
        { id: 1, ressourcen_id: 1, vorname: 'John', nachname: 'Doe', email: 'john@test.com', eingestellt_am: '2024-01-01', aktiv: 1 },
        { id: 2, ressourcen_id: 1, vorname: 'Jane', nachname: 'Smith', email: null, eingestellt_am: null, aktiv: 1 },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockMitarbeiter);

      const result = await service.getAll();

      expect(result).toEqual(mockMitarbeiter);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM mitarbeiter ORDER BY nachname, vorname');
    });
  });

  describe('getById', () => {
    it('should return a mitarbeiter by id', async () => {
      const mockMitarbeiter: Mitarbeiter = { id: 1, ressourcen_id: 1, vorname: 'John', nachname: 'Doe', email: 'john@test.com', eingestellt_am: '2024-01-01', aktiv: 1 };
      vi.mocked(mockDb.query).mockResolvedValue([mockMitarbeiter]);

      const result = await service.getById(1);

      expect(result).toEqual(mockMitarbeiter);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM mitarbeiter WHERE id = ?', [1]);
    });

    it('should return null if mitarbeiter not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByRessourceId', () => {
    it('should return mitarbeiter by ressource id', async () => {
      const mockMitarbeiter: Mitarbeiter[] = [
        { id: 1, ressourcen_id: 1, vorname: 'John', nachname: 'Doe', email: 'john@test.com', eingestellt_am: '2024-01-01', aktiv: 1 },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockMitarbeiter);

      const result = await service.getByRessourceId(1);

      expect(result).toEqual(mockMitarbeiter);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM mitarbeiter WHERE ressourcen_id = ? ORDER BY nachname, vorname',
        [1]
      );
    });
  });

  describe('getByEmail', () => {
    it('should return a mitarbeiter by email', async () => {
      const mockMitarbeiter: Mitarbeiter = { id: 1, ressourcen_id: 1, vorname: 'John', nachname: 'Doe', email: 'john@test.com', eingestellt_am: '2024-01-01', aktiv: 1 };
      vi.mocked(mockDb.query).mockResolvedValue([mockMitarbeiter]);

      const result = await service.getByEmail('john@test.com');

      expect(result).toEqual(mockMitarbeiter);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM mitarbeiter WHERE email = ?', ['john@test.com']);
    });
  });

  describe('getActive', () => {
    it('should return active mitarbeiter', async () => {
      const mockMitarbeiter: Mitarbeiter[] = [
        { id: 1, ressourcen_id: 1, vorname: 'John', nachname: 'Doe', email: 'john@test.com', eingestellt_am: '2024-01-01', aktiv: 1 },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockMitarbeiter);

      const result = await service.getActive();

      expect(result).toEqual(mockMitarbeiter);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM mitarbeiter WHERE aktiv = 1 ORDER BY nachname, vorname'
      );
    });
  });

  describe('create', () => {
    it('should create a new mitarbeiter', async () => {
      const newMitarbeiter: Omit<Mitarbeiter, 'id'> = {
        ressourcen_id: 1,
        vorname: 'Jane',
        nachname: 'Smith',
        email: 'jane@test.com',
        eingestellt_am: '2024-02-01',
        aktiv: 1,
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newMitarbeiter);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        'INSERT INTO mitarbeiter (ressourcen_id, vorname, nachname, email, eingestellt_am, aktiv) VALUES (?, ?, ?, ?, ?, ?)',
        [1, 'Jane', 'Smith', 'jane@test.com', '2024-02-01', 1]
      );
    });
  });

  describe('update', () => {
    it('should update a mitarbeiter', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { vorname: 'Updated Name', email: 'updated@test.com' });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE mitarbeiter SET vorname = ?, email = ? WHERE id = ?',
        ['Updated Name', 'updated@test.com', 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a mitarbeiter', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM mitarbeiter WHERE id = ?', [1]);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a mitarbeiter', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.deactivate(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE mitarbeiter SET aktiv = ? WHERE id = ?',
        [0, 1]
      );
    });
  });

  describe('activate', () => {
    it('should activate a mitarbeiter', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.activate(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE mitarbeiter SET aktiv = ? WHERE id = ?',
        [1, 1]
      );
    });
  });
});
