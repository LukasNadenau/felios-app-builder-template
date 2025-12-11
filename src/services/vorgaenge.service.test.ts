import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VorgaengeService, Vorgang } from './vorgaenge.service';
import { setDatabase, DatabaseConnection } from './database';

describe('VorgaengeService', () => {
  let service: VorgaengeService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new VorgaengeService();
  });

  describe('getAll', () => {
    it('should return all vorgaenge', async () => {
      const mockVorgaenge: Vorgang[] = [
        {
          id: 1,
          netzplan_id: 1,
          ressourcen_id: 1,
          code: 'OP01',
          name: 'Vorgang 1',
          start_zeit: '2024-01-01T08:00:00Z',
          ende_zeit: '2024-01-02T17:00:00Z',
          fortschritt_pct: 50,
          status: 'in_arbeit',
          beschreibung: 'Test',
        },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockVorgaenge);

      const result = await service.getAll();

      expect(result).toEqual(mockVorgaenge);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM vorgaenge ORDER BY start_zeit');
    });
  });

  describe('getById', () => {
    it('should return a vorgang by id', async () => {
      const mockVorgang: Vorgang = {
        id: 1,
        netzplan_id: 1,
        ressourcen_id: 1,
        code: 'OP01',
        name: 'Vorgang 1',
        start_zeit: '2024-01-01T08:00:00Z',
        ende_zeit: '2024-01-02T17:00:00Z',
        fortschritt_pct: 50,
        status: 'in_arbeit',
        beschreibung: 'Test',
      };
      vi.mocked(mockDb.query).mockResolvedValue([mockVorgang]);

      const result = await service.getById(1);

      expect(result).toEqual(mockVorgang);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM vorgaenge WHERE id = ?', [1]);
    });

    it('should return null if vorgang not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByNetzplanId', () => {
    it('should return vorgaenge by netzplan id', async () => {
      const mockVorgaenge: Vorgang[] = [
        {
          id: 1,
          netzplan_id: 1,
          ressourcen_id: 1,
          code: 'OP01',
          name: 'Vorgang 1',
          start_zeit: '2024-01-01T08:00:00Z',
          ende_zeit: '2024-01-02T17:00:00Z',
          fortschritt_pct: 50,
          status: 'in_arbeit',
          beschreibung: 'Test',
        },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockVorgaenge);

      const result = await service.getByNetzplanId(1);

      expect(result).toEqual(mockVorgaenge);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit',
        [1]
      );
    });
  });

  describe('getByRessourceId', () => {
    it('should return vorgaenge by ressource id', async () => {
      const mockVorgaenge: Vorgang[] = [
        {
          id: 1,
          netzplan_id: 1,
          ressourcen_id: 1,
          code: 'OP01',
          name: 'Vorgang 1',
          start_zeit: '2024-01-01T08:00:00Z',
          ende_zeit: '2024-01-02T17:00:00Z',
          fortschritt_pct: 50,
          status: 'in_arbeit',
          beschreibung: 'Test',
        },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockVorgaenge);

      const result = await service.getByRessourceId(1);

      expect(result).toEqual(mockVorgaenge);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM vorgaenge WHERE ressourcen_id = ? ORDER BY start_zeit',
        [1]
      );
    });
  });

  describe('getByStatus', () => {
    it('should return vorgaenge by status', async () => {
      const mockVorgaenge: Vorgang[] = [
        {
          id: 1,
          netzplan_id: 1,
          ressourcen_id: 1,
          code: 'OP01',
          name: 'Vorgang 1',
          start_zeit: '2024-01-01T08:00:00Z',
          ende_zeit: '2024-01-02T17:00:00Z',
          fortschritt_pct: 50,
          status: 'in_arbeit',
          beschreibung: 'Test',
        },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockVorgaenge);

      const result = await service.getByStatus('in_arbeit');

      expect(result).toEqual(mockVorgaenge);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM vorgaenge WHERE status = ? ORDER BY start_zeit',
        ['in_arbeit']
      );
    });
  });

  describe('getByDateRange', () => {
    it('should return vorgaenge by date range', async () => {
      const mockVorgaenge: Vorgang[] = [
        {
          id: 1,
          netzplan_id: 1,
          ressourcen_id: 1,
          code: 'OP01',
          name: 'Vorgang 1',
          start_zeit: '2024-01-01T08:00:00Z',
          ende_zeit: '2024-01-02T17:00:00Z',
          fortschritt_pct: 50,
          status: 'in_arbeit',
          beschreibung: 'Test',
        },
      ];
      vi.mocked(mockDb.query).mockResolvedValue(mockVorgaenge);

      const result = await service.getByDateRange('2024-01-01T00:00:00Z', '2024-01-31T23:59:59Z');

      expect(result).toEqual(mockVorgaenge);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM vorgaenge WHERE start_zeit >= ? AND ende_zeit <= ? ORDER BY start_zeit',
        ['2024-01-01T00:00:00Z', '2024-01-31T23:59:59Z']
      );
    });
  });

  describe('getByCode', () => {
    it('should return a vorgang by netzplan id and code', async () => {
      const mockVorgang: Vorgang = {
        id: 1,
        netzplan_id: 1,
        ressourcen_id: 1,
        code: 'OP01',
        name: 'Vorgang 1',
        start_zeit: '2024-01-01T08:00:00Z',
        ende_zeit: '2024-01-02T17:00:00Z',
        fortschritt_pct: 50,
        status: 'in_arbeit',
        beschreibung: 'Test',
      };
      vi.mocked(mockDb.query).mockResolvedValue([mockVorgang]);

      const result = await service.getByCode(1, 'OP01');

      expect(result).toEqual(mockVorgang);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT * FROM vorgaenge WHERE netzplan_id = ? AND code = ?',
        [1, 'OP01']
      );
    });
  });

  describe('create', () => {
    it('should create a new vorgang', async () => {
      const newVorgang: Omit<Vorgang, 'id'> = {
        netzplan_id: 1,
        ressourcen_id: 1,
        code: 'OP03',
        name: 'Vorgang 3',
        start_zeit: '2024-03-01T08:00:00Z',
        ende_zeit: '2024-03-02T17:00:00Z',
        fortschritt_pct: 0,
        status: 'geplant',
        beschreibung: 'New operation',
      };
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 3, changes: 1 });

      const result = await service.create(newVorgang);

      expect(result).toBe(3);
      expect(mockDb.run).toHaveBeenCalledWith(
        `INSERT INTO vorgaenge (netzplan_id, ressourcen_id, code, name, start_zeit, ende_zeit, 
       fortschritt_pct, status, beschreibung) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, 1, 'OP03', 'Vorgang 3', '2024-03-01T08:00:00Z', '2024-03-02T17:00:00Z', 0, 'geplant', 'New operation']
      );
    });
  });

  describe('update', () => {
    it('should update a vorgang', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.update(1, { name: 'Updated Name', fortschritt_pct: 75 });

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE vorgaenge SET name = ?, fortschritt_pct = ? WHERE id = ?',
        ['Updated Name', 75, 1]
      );
    });

    it('should return false if no fields to update', async () => {
      const result = await service.update(1, {});

      expect(result).toBe(false);
      expect(mockDb.run).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a vorgang', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM vorgaenge WHERE id = ?', [1]);
    });

    it('should return false if vorgang not found', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 0 });

      const result = await service.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('updateProgress', () => {
    it('should update vorgang progress', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.updateProgress(1, 85);

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE vorgaenge SET fortschritt_pct = ? WHERE id = ?',
        [85, 1]
      );
    });
  });

  describe('updateStatus', () => {
    it('should update vorgang status', async () => {
      vi.mocked(mockDb.run).mockResolvedValue({ lastID: 0, changes: 1 });

      const result = await service.updateStatus(1, 'abgeschlossen');

      expect(result).toBe(true);
      expect(mockDb.run).toHaveBeenCalledWith(
        'UPDATE vorgaenge SET status = ? WHERE id = ?',
        ['abgeschlossen', 1]
      );
    });
  });
});
