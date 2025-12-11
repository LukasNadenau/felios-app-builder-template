export interface Standort {
  id?: number;
  code: string;
  name: string;
  beschreibung?: string | null;
}

const STANDORTE_DATA: Standort[] = [
  { id: 1, code: 'DS-01', name: 'Death Star', beschreibung: 'Imperial battle station and headquarters' },
  { id: 2, code: 'YAV-01', name: 'Yavin IV Base', beschreibung: 'Rebel Alliance command center' },
  { id: 3, code: 'HOT-01', name: 'Hoth Base', beschreibung: 'Echo Base - Ice planet outpost' },
  { id: 4, code: 'END-01', name: 'Endor Station', beschreibung: 'Forest moon operational base' }
];

export class StandorteService {
  private nextId = 5;

  async getAll(): Promise<Standort[]> {
    return [...STANDORTE_DATA];
  }

  async getById(id: number): Promise<Standort | null> {
    return STANDORTE_DATA.find(s => s.id === id) || null;
  }

  async getByCode(code: string): Promise<Standort | null> {
    return STANDORTE_DATA.find(s => s.code === code) || null;
  }

  async create(standort: Omit<Standort, 'id'>): Promise<number> {
    const newId = this.nextId++;
    STANDORTE_DATA.push({ ...standort, id: newId });
    return newId;
  }

  async update(id: number, standort: Partial<Omit<Standort, 'id'>>): Promise<boolean> {
    const index = STANDORTE_DATA.findIndex(s => s.id === id);
    if (index === -1) return false;
    STANDORTE_DATA[index] = { ...STANDORTE_DATA[index], ...standort };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = STANDORTE_DATA.findIndex(s => s.id === id);
    if (index === -1) return false;
    STANDORTE_DATA.splice(index, 1);
    return true;
  }
}
