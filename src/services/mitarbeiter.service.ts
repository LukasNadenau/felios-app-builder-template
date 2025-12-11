export interface Mitarbeiter {
  id?: number;
  ressourcen_id: number;
  vorname: string;
  nachname: string;
  email?: string | null;
  eingestellt_am?: string | null;
  aktiv: number;
}

const MITARBEITER_DATA: Mitarbeiter[] = [
  // Imperial - Death Star
  { id: 1, ressourcen_id: 2, vorname: 'Wilhuff', nachname: 'Tarkin', email: 'w.tarkin@empire.gov', eingestellt_am: '2024-06-15', aktiv: 1 },
  { id: 2, ressourcen_id: 1, vorname: 'Orson', nachname: 'Krennic', email: 'o.krennic@empire.gov', eingestellt_am: '2024-03-10', aktiv: 1 },
  { id: 3, ressourcen_id: 3, vorname: 'Maximilian', nachname: 'Veers', email: 'm.veers@empire.gov', eingestellt_am: '2024-08-22', aktiv: 1 },

  // Rebels - Yavin
  { id: 4, ressourcen_id: 5, vorname: 'Leia', nachname: 'Organa', email: 'l.organa@rebellion.org', eingestellt_am: '2024-01-05', aktiv: 1 },
  { id: 5, ressourcen_id: 4, vorname: 'Luke', nachname: 'Skywalker', email: 'l.skywalker@rebellion.org', eingestellt_am: '2025-02-18', aktiv: 1 },
  { id: 6, ressourcen_id: 4, vorname: 'Han', nachname: 'Solo', email: 'h.solo@rebellion.org', eingestellt_am: '2025-02-20', aktiv: 1 },
  { id: 7, ressourcen_id: 5, vorname: 'Mon', nachname: 'Mothma', email: 'm.mothma@rebellion.org', eingestellt_am: '2024-01-05', aktiv: 1 },
  { id: 8, ressourcen_id: 4, vorname: 'Wedge', nachname: 'Antilles', email: 'w.antilles@rebellion.org', eingestellt_am: '2024-11-12', aktiv: 1 },

  // Rebels - Hoth
  { id: 9, ressourcen_id: 6, vorname: 'Carlist', nachname: 'Rieekan', email: 'c.rieekan@rebellion.org', eingestellt_am: '2025-06-01', aktiv: 1 },
  { id: 10, ressourcen_id: 7, vorname: 'Toryn', nachname: 'Farr', email: 't.farr@rebellion.org', eingestellt_am: '2025-06-15', aktiv: 1 },

  // Rebels - Endor
  { id: 11, ressourcen_id: 8, vorname: 'Lando', nachname: 'Calrissian', email: 'l.calrissian@rebellion.org', eingestellt_am: '2026-01-10', aktiv: 1 },
  { id: 12, ressourcen_id: 8, vorname: 'Gial', nachname: 'Ackbar', email: 'g.ackbar@rebellion.org', eingestellt_am: '2025-03-15', aktiv: 1 }
];

export class MitarbeiterService {
  private nextId = 13;

  async getAll(): Promise<Mitarbeiter[]> {
    return [...MITARBEITER_DATA].sort((a, b) =>
      a.nachname.localeCompare(b.nachname) || a.vorname.localeCompare(b.vorname)
    );
  }

  async getById(id: number): Promise<Mitarbeiter | null> {
    return MITARBEITER_DATA.find(m => m.id === id) || null;
  }

  async getByRessourceId(ressourcenId: number): Promise<Mitarbeiter[]> {
    return MITARBEITER_DATA
      .filter(m => m.ressourcen_id === ressourcenId)
      .sort((a, b) => a.nachname.localeCompare(b.nachname) || a.vorname.localeCompare(b.vorname));
  }

  async getByEmail(email: string): Promise<Mitarbeiter | null> {
    return MITARBEITER_DATA.find(m => m.email === email) || null;
  }

  async getActive(): Promise<Mitarbeiter[]> {
    return MITARBEITER_DATA
      .filter(m => m.aktiv === 1)
      .sort((a, b) => a.nachname.localeCompare(b.nachname) || a.vorname.localeCompare(b.vorname));
  }

  async create(mitarbeiter: Omit<Mitarbeiter, 'id'>): Promise<number> {
    const newId = this.nextId++;
    MITARBEITER_DATA.push({ ...mitarbeiter, id: newId });
    return newId;
  }

  async update(id: number, mitarbeiter: Partial<Omit<Mitarbeiter, 'id'>>): Promise<boolean> {
    const index = MITARBEITER_DATA.findIndex(m => m.id === id);
    if (index === -1) return false;
    MITARBEITER_DATA[index] = { ...MITARBEITER_DATA[index], ...mitarbeiter };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = MITARBEITER_DATA.findIndex(m => m.id === id);
    if (index === -1) return false;
    MITARBEITER_DATA.splice(index, 1);
    return true;
  }

  async deactivate(id: number): Promise<boolean> {
    return this.update(id, { aktiv: 0 });
  }

  async activate(id: number): Promise<boolean> {
    return this.update(id, { aktiv: 1 });
  }
}
