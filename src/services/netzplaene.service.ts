export interface Netzplan {
  id?: number;
  projekt_id: number;
  code: string;
  name: string;
  beschreibung?: string | null;
}

const NETZPLAENE_DATA: Netzplan[] = [
  // Death Star Construction phases
  { id: 1, projekt_id: 1, code: 'DS-P1', name: 'Structural Framework', beschreibung: 'Build main superstructure and hull' },
  { id: 2, projekt_id: 1, code: 'DS-P2', name: 'Superlaser Installation', beschreibung: 'Install primary weapon systems' },
  { id: 3, projekt_id: 1, code: 'DS-P3', name: 'Systems Testing', beschreibung: 'Test all operational systems' },

  // Yavin Defense phases
  { id: 4, projekt_id: 2, code: 'YAV-P1', name: 'Intelligence Gathering', beschreibung: 'Obtain Death Star plans' },
  { id: 5, projekt_id: 2, code: 'YAV-P2', name: 'Attack Preparation', beschreibung: 'Analyze plans and brief pilots' },
  { id: 6, projekt_id: 2, code: 'YAV-P3', name: 'Assault Mission', beschreibung: 'Execute trench run attack' },

  // Hoth Evacuation phases
  { id: 7, projekt_id: 3, code: 'HOT-P1', name: 'Base Establishment', beschreibung: 'Set up Echo Base infrastructure' },
  { id: 8, projekt_id: 3, code: 'HOT-P2', name: 'Defense Preparation', beschreibung: 'Deploy shield generator and ion cannon' },

  // Endor Mission phases
  { id: 9, projekt_id: 4, code: 'END-P1', name: 'Reconnaissance', beschreibung: 'Scout shield generator location' },
  { id: 10, projekt_id: 4, code: 'END-P2', name: 'Ground Assault', beschreibung: 'Destroy shield generator bunker' },
  { id: 11, projekt_id: 4, code: 'END-P3', name: 'Space Battle', beschreibung: 'Attack second Death Star' }
];

export class NetzplaeneService {
  private nextId = 12;

  async getAll(): Promise<Netzplan[]> {
    return [...NETZPLAENE_DATA].sort((a, b) => a.code.localeCompare(b.code));
  }

  async getById(id: number): Promise<Netzplan | null> {
    return NETZPLAENE_DATA.find(n => n.id === id) || null;
  }

  async getByProjektId(projektId: number): Promise<Netzplan[]> {
    return NETZPLAENE_DATA
      .filter(n => n.projekt_id === projektId)
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  async getByCode(projektId: number, code: string): Promise<Netzplan | null> {
    return NETZPLAENE_DATA.find(n => n.projekt_id === projektId && n.code === code) || null;
  }

  async create(netzplan: Omit<Netzplan, 'id'>): Promise<number> {
    const newId = this.nextId++;
    NETZPLAENE_DATA.push({ ...netzplan, id: newId });
    return newId;
  }

  async update(id: number, netzplan: Partial<Omit<Netzplan, 'id'>>): Promise<boolean> {
    const index = NETZPLAENE_DATA.findIndex(n => n.id === id);
    if (index === -1) return false;
    NETZPLAENE_DATA[index] = { ...NETZPLAENE_DATA[index], ...netzplan };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = NETZPLAENE_DATA.findIndex(n => n.id === id);
    if (index === -1) return false;
    NETZPLAENE_DATA.splice(index, 1);
    return true;
  }
}
