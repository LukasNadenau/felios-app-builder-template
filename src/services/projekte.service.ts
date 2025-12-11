export interface Projekt {
  id?: number;
  code: string;
  name: string;
  beschreibung?: string | null;
  start_geplant?: string | null;
  ende_geplant?: string | null;
}

const PROJEKTE_DATA: Projekt[] = [
  {
    id: 1,
    code: 'DS-CONST',
    name: 'Death Star Construction',
    beschreibung: 'Complete construction and testing of the Imperial battle station',
    start_geplant: '2025-01-15',
    ende_geplant: '2025-08-30'
  },
  {
    id: 2,
    code: 'YAVIN-DEF',
    name: 'Battle of Yavin Defense',
    beschreibung: 'Defend Yavin IV base and destroy the Death Star',
    start_geplant: '2025-08-15',
    ende_geplant: '2025-09-15'
  },
  {
    id: 3,
    code: 'HOTH-EVAC',
    name: 'Hoth Base Evacuation',
    beschreibung: 'Establish Echo Base and plan evacuation procedures',
    start_geplant: '2025-10-01',
    ende_geplant: '2026-03-30'
  },
  {
    id: 4,
    code: 'ENDOR-OPS',
    name: 'Endor Shield Generator Mission',
    beschreibung: 'Destroy shield generator and second Death Star',
    start_geplant: '2026-04-01',
    ende_geplant: '2026-12-31'
  }
];

export class ProjekteService {
  private nextId = 5;

  async getAll(): Promise<Projekt[]> {
    return [...PROJEKTE_DATA].sort((a, b) => a.code.localeCompare(b.code));
  }

  async getById(id: number): Promise<Projekt | null> {
    return PROJEKTE_DATA.find(p => p.id === id) || null;
  }

  async getByCode(code: string): Promise<Projekt | null> {
    return PROJEKTE_DATA.find(p => p.code === code) || null;
  }

  async create(projekt: Omit<Projekt, 'id'>): Promise<number> {
    const newId = this.nextId++;
    PROJEKTE_DATA.push({ ...projekt, id: newId });
    return newId;
  }

  async update(id: number, projekt: Partial<Omit<Projekt, 'id'>>): Promise<boolean> {
    const index = PROJEKTE_DATA.findIndex(p => p.id === id);
    if (index === -1) return false;
    PROJEKTE_DATA[index] = { ...PROJEKTE_DATA[index], ...projekt };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = PROJEKTE_DATA.findIndex(p => p.id === id);
    if (index === -1) return false;
    PROJEKTE_DATA.splice(index, 1);
    return true;
  }
}
