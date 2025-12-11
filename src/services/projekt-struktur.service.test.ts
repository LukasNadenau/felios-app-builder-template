import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjektStrukturService, ProjektStruktur, NetzplanMitVorgaenge } from './projekt-struktur.service';
import { setDatabase, DatabaseConnection } from './database';
import { Projekt } from './projekte.service';
import { Netzplan } from './netzplaene.service';
import { Vorgang } from './vorgaenge.service';

describe('ProjektStrukturService', () => {
  let service: ProjektStrukturService;
  let mockDb: DatabaseConnection;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    };
    setDatabase(mockDb);
    service = new ProjektStrukturService();
  });

  describe('getByProjektId', () => {
    it('should return a complete project structure', async () => {
      const mockProjekt: Projekt = {
        id: 1,
        code: 'P01',
        name: 'Projekt 1',
        beschreibung: 'Test project',
        start_geplant: '2024-01-01',
        ende_geplant: '2024-12-31'
      };

      const mockNetzplaene: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'N01', name: 'Netzplan 1', beschreibung: 'Test netzplan 1' },
        { id: 2, projekt_id: 1, code: 'N02', name: 'Netzplan 2', beschreibung: 'Test netzplan 2' }
      ];

      const mockVorgaenge1: Vorgang[] = [
        { id: 1, netzplan_id: 1, ressourcen_id: 1, code: 'V01', name: 'Vorgang 1', start_zeit: '2024-01-01', ende_zeit: '2024-01-10', fortschritt_pct: 50, status: 'in_progress', beschreibung: 'Test' },
        { id: 2, netzplan_id: 1, ressourcen_id: 2, code: 'V02', name: 'Vorgang 2', start_zeit: '2024-01-11', ende_zeit: '2024-01-20', fortschritt_pct: 0, status: 'planned', beschreibung: null }
      ];

      const mockVorgaenge2: Vorgang[] = [
        { id: 3, netzplan_id: 2, ressourcen_id: 1, code: 'V03', name: 'Vorgang 3', start_zeit: '2024-02-01', ende_zeit: '2024-02-10', fortschritt_pct: 100, status: 'completed', beschreibung: 'Done' }
      ];

      vi.mocked(mockDb.query)
        .mockResolvedValueOnce([mockProjekt])
        .mockResolvedValueOnce(mockNetzplaene)
        .mockResolvedValueOnce(mockVorgaenge1)
        .mockResolvedValueOnce(mockVorgaenge2);

      const result = await service.getByProjektId(1);

      expect(result).toEqual({
        ...mockProjekt,
        netzplaene: [
          { ...mockNetzplaene[0], vorgaenge: mockVorgaenge1 },
          { ...mockNetzplaene[1], vorgaenge: mockVorgaenge2 }
        ]
      });

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE id = ?', [1]);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code', [1]);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit', [1]);
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit', [2]);
    });

    it('should return null if projekt not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getByProjektId(999);

      expect(result).toBeNull();
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE id = ?', [999]);
    });

    it('should return project with empty netzplaene array if no netzplaene exist', async () => {
      const mockProjekt: Projekt = {
        id: 1,
        code: 'P01',
        name: 'Projekt 1',
        beschreibung: 'Test project',
        start_geplant: '2024-01-01',
        ende_geplant: '2024-12-31'
      };

      vi.mocked(mockDb.query)
        .mockResolvedValueOnce([mockProjekt])
        .mockResolvedValueOnce([]);

      const result = await service.getByProjektId(1);

      expect(result).toEqual({
        ...mockProjekt,
        netzplaene: []
      });
    });

    it('should return netzplaene with empty vorgaenge array if no vorgaenge exist', async () => {
      const mockProjekt: Projekt = {
        id: 1,
        code: 'P01',
        name: 'Projekt 1',
        beschreibung: 'Test project',
        start_geplant: '2024-01-01',
        ende_geplant: '2024-12-31'
      };

      const mockNetzplaene: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'N01', name: 'Netzplan 1', beschreibung: 'Test netzplan' }
      ];

      vi.mocked(mockDb.query)
        .mockResolvedValueOnce([mockProjekt])
        .mockResolvedValueOnce(mockNetzplaene)
        .mockResolvedValueOnce([]);

      const result = await service.getByProjektId(1);

      expect(result).toEqual({
        ...mockProjekt,
        netzplaene: [
          { ...mockNetzplaene[0], vorgaenge: [] }
        ]
      });
    });
  });

  describe('getByProjektCode', () => {
    it('should return a complete project structure by code', async () => {
      const mockProjekt: Projekt = {
        id: 1,
        code: 'P01',
        name: 'Projekt 1',
        beschreibung: 'Test project',
        start_geplant: '2024-01-01',
        ende_geplant: '2024-12-31'
      };

      const mockNetzplaene: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'N01', name: 'Netzplan 1', beschreibung: 'Test' }
      ];

      const mockVorgaenge: Vorgang[] = [
        { id: 1, netzplan_id: 1, ressourcen_id: 1, code: 'V01', name: 'Vorgang 1', start_zeit: '2024-01-01', ende_zeit: '2024-01-10', fortschritt_pct: 50, status: 'in_progress', beschreibung: 'Test' }
      ];

      vi.mocked(mockDb.query)
        .mockResolvedValueOnce([mockProjekt])
        .mockResolvedValueOnce([mockProjekt])
        .mockResolvedValueOnce(mockNetzplaene)
        .mockResolvedValueOnce(mockVorgaenge);

      const result = await service.getByProjektCode('P01');

      expect(result).toEqual({
        ...mockProjekt,
        netzplaene: [
          { ...mockNetzplaene[0], vorgaenge: mockVorgaenge }
        ]
      });

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE code = ?', ['P01']);
    });

    it('should return null if projekt code not found', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getByProjektCode('INVALID');

      expect(result).toBeNull();
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte WHERE code = ?', ['INVALID']);
    });
  });

  describe('getAll', () => {
    it('should return all projects with their structures', async () => {
      const mockProjekte: Projekt[] = [
        { id: 1, code: 'P01', name: 'Projekt 1', beschreibung: 'Test 1', start_geplant: '2024-01-01', ende_geplant: '2024-12-31' },
        { id: 2, code: 'P02', name: 'Projekt 2', beschreibung: 'Test 2', start_geplant: '2024-02-01', ende_geplant: '2024-11-30' }
      ];

      const mockNetzplaene1: Netzplan[] = [
        { id: 1, projekt_id: 1, code: 'N01', name: 'Netzplan 1', beschreibung: 'Test' }
      ];

      const mockNetzplaene2: Netzplan[] = [
        { id: 2, projekt_id: 2, code: 'N02', name: 'Netzplan 2', beschreibung: 'Test' }
      ];

      const mockVorgaenge1: Vorgang[] = [
        { id: 1, netzplan_id: 1, ressourcen_id: 1, code: 'V01', name: 'Vorgang 1', start_zeit: '2024-01-01', ende_zeit: '2024-01-10', fortschritt_pct: 50, status: 'in_progress', beschreibung: null }
      ];

      const mockVorgaenge2: Vorgang[] = [
        { id: 2, netzplan_id: 2, ressourcen_id: 1, code: 'V02', name: 'Vorgang 2', start_zeit: '2024-02-01', ende_zeit: '2024-02-10', fortschritt_pct: 0, status: 'planned', beschreibung: null }
      ];

      vi.mocked(mockDb.query).mockImplementation((sql: string, params?: any[]) => {
        if (sql === 'SELECT * FROM projekte ORDER BY code') {
          return Promise.resolve(mockProjekte);
        }
        if (sql === 'SELECT * FROM projekte WHERE id = ?' && params?.[0] === 1) {
          return Promise.resolve([mockProjekte[0]]);
        }
        if (sql === 'SELECT * FROM projekte WHERE id = ?' && params?.[0] === 2) {
          return Promise.resolve([mockProjekte[1]]);
        }
        if (sql === 'SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code' && params?.[0] === 1) {
          return Promise.resolve(mockNetzplaene1);
        }
        if (sql === 'SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code' && params?.[0] === 2) {
          return Promise.resolve(mockNetzplaene2);
        }
        if (sql === 'SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit' && params?.[0] === 1) {
          return Promise.resolve(mockVorgaenge1);
        }
        if (sql === 'SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit' && params?.[0] === 2) {
          return Promise.resolve(mockVorgaenge2);
        }
        return Promise.resolve([]);
      });

      const result = await service.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...mockProjekte[0],
        netzplaene: [{ ...mockNetzplaene1[0], vorgaenge: mockVorgaenge1 }]
      });
      expect(result[1]).toEqual({
        ...mockProjekte[1],
        netzplaene: [{ ...mockNetzplaene2[0], vorgaenge: mockVorgaenge2 }]
      });

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM projekte ORDER BY code');
    });

    it('should return empty array if no projects exist', async () => {
      vi.mocked(mockDb.query).mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });
});
