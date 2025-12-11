export interface Ressource {
  id?: number;
  standort_id: number;
  code: string;
  name: string;
  kapazitaet?: number | null;
  beschreibung?: string | null;
}

const RESSOURCEN_DATA: Ressource[] = [
  // Death Star resources
  { id: 1, standort_id: 1, code: 'DS-ENG', name: 'Engineering Division', kapazitaet: 50, beschreibung: 'Main engineering and construction team' },
  { id: 2, standort_id: 1, code: 'DS-TAC', name: 'Tactical Operations', kapazitaet: 30, beschreibung: 'Strategic planning and command' },
  { id: 3, standort_id: 1, code: 'DS-SEC', name: 'Security Forces', kapazitaet: 100, beschreibung: 'Station security and defense' },

  // Yavin Base resources
  { id: 4, standort_id: 2, code: 'YAV-FLT', name: 'Red Squadron', kapazitaet: 12, beschreibung: 'Elite fighter pilot squadron' },
  { id: 5, standort_id: 2, code: 'YAV-CMD', name: 'Rebel Command', kapazitaet: 15, beschreibung: 'Strategic command center' },

  // Hoth Base resources
  { id: 6, standort_id: 3, code: 'HOT-DEF', name: 'Defense Systems', kapazitaet: 20, beschreibung: 'Shield generators and defense' },
  { id: 7, standort_id: 3, code: 'HOT-LOG', name: 'Logistics Team', kapazitaet: 25, beschreibung: 'Supply and evacuation planning' },

  // Endor resources
  { id: 8, standort_id: 4, code: 'END-SPE', name: 'Strike Team', kapazitaet: 8, beschreibung: 'Special operations forces' }
];

export class RessourcenService {
  private nextId = 9;

  async getAll(): Promise<Ressource[]> {
    return [...RESSOURCEN_DATA];
  }

  async getById(id: number): Promise<Ressource | null> {
    return RESSOURCEN_DATA.find(r => r.id === id) || null;
  }

  async getByStandortId(standortId: number): Promise<Ressource[]> {
    return RESSOURCEN_DATA.filter(r => r.standort_id === standortId);
  }

  async getByCode(standortId: number, code: string): Promise<Ressource | null> {
    return RESSOURCEN_DATA.find(r => r.standort_id === standortId && r.code === code) || null;
  }

  async create(ressource: Omit<Ressource, 'id'>): Promise<number> {
    const newId = this.nextId++;
    RESSOURCEN_DATA.push({ ...ressource, id: newId });
    return newId;
  }

  async update(id: number, ressource: Partial<Omit<Ressource, 'id'>>): Promise<boolean> {
    const index = RESSOURCEN_DATA.findIndex(r => r.id === id);
    if (index === -1) return false;
    RESSOURCEN_DATA[index] = { ...RESSOURCEN_DATA[index], ...ressource };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = RESSOURCEN_DATA.findIndex(r => r.id === id);
    if (index === -1) return false;
    RESSOURCEN_DATA.splice(index, 1);
    return true;
  }
}
