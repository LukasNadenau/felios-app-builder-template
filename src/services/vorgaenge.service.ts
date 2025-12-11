export interface Vorgang {
  id?: number;
  netzplan_id: number;
  ressourcen_id: number;
  code: string;
  name: string;
  start_zeit: string;
  ende_zeit: string;
  fortschritt_pct: number;
  status: string;
  beschreibung?: string | null;
}

const VORGAENGE_DATA: Vorgang[] = [
  // Death Star Construction - Structural Framework (DS-P1)
  { id: 1, netzplan_id: 1, ressourcen_id: 1, code: 'DS-P1-T1', name: 'Hull Assembly', start_zeit: '2025-01-15', ende_zeit: '2025-03-30', fortschritt_pct: 100, status: 'completed', beschreibung: 'Construct outer hull sections' },
  { id: 2, netzplan_id: 1, ressourcen_id: 1, code: 'DS-P1-T2', name: 'Core Systems Integration', start_zeit: '2025-04-01', ende_zeit: '2025-05-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Install reactor and power systems' },

  // Death Star - Superlaser Installation (DS-P2)
  { id: 3, netzplan_id: 2, ressourcen_id: 1, code: 'DS-P2-T1', name: 'Weapon Platform Construction', start_zeit: '2025-05-16', ende_zeit: '2025-07-10', fortschritt_pct: 100, status: 'completed', beschreibung: 'Build superlaser focusing array' },
  { id: 4, netzplan_id: 2, ressourcen_id: 2, code: 'DS-P2-T2', name: 'Targeting System Calibration', start_zeit: '2025-07-11', ende_zeit: '2025-08-05', fortschritt_pct: 100, status: 'completed', beschreibung: 'Calibrate planetary targeting' },

  // Death Star - Systems Testing (DS-P3)
  { id: 5, netzplan_id: 3, ressourcen_id: 2, code: 'DS-P3-T1', name: 'Alderaan Demonstration', start_zeit: '2025-08-06', ende_zeit: '2025-08-20', fortschritt_pct: 100, status: 'completed', beschreibung: 'Full power test on planetary target' },

  // Yavin - Intelligence Gathering (YAV-P1)
  { id: 6, netzplan_id: 4, ressourcen_id: 5, code: 'YAV-P1-T1', name: 'Acquire Death Star Plans', start_zeit: '2025-08-15', ende_zeit: '2025-08-25', fortschritt_pct: 100, status: 'completed', beschreibung: 'Retrieve technical readouts from Scarif' },

  // Yavin - Attack Preparation (YAV-P2)
  { id: 7, netzplan_id: 5, ressourcen_id: 5, code: 'YAV-P2-T1', name: 'Analyze Weakness', start_zeit: '2025-08-26', ende_zeit: '2025-08-28', fortschritt_pct: 100, status: 'completed', beschreibung: 'Identify thermal exhaust port vulnerability' },
  { id: 8, netzplan_id: 5, ressourcen_id: 4, code: 'YAV-P2-T2', name: 'Pilot Briefing', start_zeit: '2025-08-29', ende_zeit: '2025-08-30', fortschritt_pct: 100, status: 'completed', beschreibung: 'Brief Red Squadron on attack plan' },

  // Yavin - Assault Mission (YAV-P3)
  { id: 9, netzplan_id: 6, ressourcen_id: 4, code: 'YAV-P3-T1', name: 'Trench Run Attack', start_zeit: '2025-08-31', ende_zeit: '2025-09-01', fortschritt_pct: 100, status: 'completed', beschreibung: 'Execute attack on thermal exhaust port' },
  { id: 10, netzplan_id: 6, ressourcen_id: 4, code: 'YAV-P3-T2', name: 'Death Star Destruction', start_zeit: '2025-09-01', ende_zeit: '2025-09-01', fortschritt_pct: 100, status: 'completed', beschreibung: 'Successful station destruction' },

  // Hoth - Base Establishment (HOT-P1)
  { id: 11, netzplan_id: 7, ressourcen_id: 7, code: 'HOT-P1-T1', name: 'Site Survey', start_zeit: '2025-10-01', ende_zeit: '2025-10-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Survey ice caverns for base location' },
  { id: 12, netzplan_id: 7, ressourcen_id: 7, code: 'HOT-P1-T2', name: 'Power Generator Installation', start_zeit: '2025-10-16', ende_zeit: '2025-12-01', fortschritt_pct: 100, status: 'completed', beschreibung: 'Install main power systems' },
  { id: 13, netzplan_id: 7, ressourcen_id: 7, code: 'HOT-P1-T3', name: 'Hangar Construction', start_zeit: '2025-12-02', ende_zeit: '2026-01-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Build main hangar and launch bays' },

  // Hoth - Defense Preparation (HOT-P2)
  { id: 14, netzplan_id: 8, ressourcen_id: 6, code: 'HOT-P2-T1', name: 'Shield Generator Deployment', start_zeit: '2026-01-16', ende_zeit: '2026-02-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Deploy planetary shield generator' },
  { id: 15, netzplan_id: 8, ressourcen_id: 6, code: 'HOT-P2-T2', name: 'Ion Cannon Setup', start_zeit: '2026-02-16', ende_zeit: '2026-03-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Install v-150 planet defender ion cannon' },
  { id: 16, netzplan_id: 8, ressourcen_id: 6, code: 'HOT-P2-T3', name: 'Evacuation Drill', start_zeit: '2026-03-16', ende_zeit: '2026-03-25', fortschritt_pct: 75, status: 'in_progress', beschreibung: 'Practice emergency evacuation procedures' },

  // Endor - Reconnaissance (END-P1)
  { id: 17, netzplan_id: 9, ressourcen_id: 8, code: 'END-P1-T1', name: 'Bothan Intelligence', start_zeit: '2026-04-01', ende_zeit: '2026-05-15', fortschritt_pct: 100, status: 'completed', beschreibung: 'Gather intelligence on shield generator' },
  { id: 18, netzplan_id: 9, ressourcen_id: 8, code: 'END-P1-T2', name: 'Moon Landing Reconnaissance', start_zeit: '2026-05-16', ende_zeit: '2026-06-30', fortschritt_pct: 100, status: 'completed', beschreibung: 'Scout landing zone and bunker location' },

  // Endor - Ground Assault (END-P2)
  { id: 19, netzplan_id: 10, ressourcen_id: 8, code: 'END-P2-T1', name: 'Strike Team Infiltration', start_zeit: '2026-07-01', ende_zeit: '2026-08-15', fortschritt_pct: 60, status: 'in_progress', beschreibung: 'Infiltrate Imperial bunker complex' },
  { id: 20, netzplan_id: 10, ressourcen_id: 8, code: 'END-P2-T2', name: 'Ewok Alliance', start_zeit: '2026-08-16', ende_zeit: '2026-09-30', fortschritt_pct: 40, status: 'in_progress', beschreibung: 'Establish alliance with native Ewoks' },
  { id: 21, netzplan_id: 10, ressourcen_id: 8, code: 'END-P2-T3', name: 'Generator Destruction', start_zeit: '2026-10-01', ende_zeit: '2026-11-15', fortschritt_pct: 0, status: 'pending', beschreibung: 'Destroy shield generator facility' },

  // Endor - Space Battle (END-P3)
  { id: 22, netzplan_id: 11, ressourcen_id: 8, code: 'END-P3-T1', name: 'Fleet Mobilization', start_zeit: '2026-11-01', ende_zeit: '2026-11-20', fortschritt_pct: 25, status: 'in_progress', beschreibung: 'Assemble Rebel fleet at Sullust' },
  { id: 23, netzplan_id: 11, ressourcen_id: 8, code: 'END-P3-T2', name: 'Reactor Core Attack', start_zeit: '2026-11-21', ende_zeit: '2026-12-15', fortschritt_pct: 0, status: 'pending', beschreibung: 'Attack Death Star II reactor core' },
  { id: 24, netzplan_id: 11, ressourcen_id: 8, code: 'END-P3-T3', name: 'Final Victory', start_zeit: '2026-12-16', ende_zeit: '2026-12-31', fortschritt_pct: 0, status: 'pending', beschreibung: 'Destroy second Death Star and celebrate' }
];

export class VorgaengeService {
  private nextId = 25;

  async getAll(): Promise<Vorgang[]> {
    return [...VORGAENGE_DATA].sort((a, b) => a.start_zeit.localeCompare(b.start_zeit));
  }

  async getById(id: number): Promise<Vorgang | null> {
    return VORGAENGE_DATA.find(v => v.id === id) || null;
  }

  async getByNetzplanId(netzplanId: number): Promise<Vorgang[]> {
    return VORGAENGE_DATA
      .filter(v => v.netzplan_id === netzplanId)
      .sort((a, b) => a.start_zeit.localeCompare(b.start_zeit));
  }

  async getByRessourceId(ressourcenId: number): Promise<Vorgang[]> {
    return VORGAENGE_DATA
      .filter(v => v.ressourcen_id === ressourcenId)
      .sort((a, b) => a.start_zeit.localeCompare(b.start_zeit));
  }

  async getByStatus(status: string): Promise<Vorgang[]> {
    return VORGAENGE_DATA
      .filter(v => v.status === status)
      .sort((a, b) => a.start_zeit.localeCompare(b.start_zeit));
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Vorgang[]> {
    return VORGAENGE_DATA
      .filter(v => v.start_zeit >= startDate && v.ende_zeit <= endDate)
      .sort((a, b) => a.start_zeit.localeCompare(b.start_zeit));
  }

  async getByCode(netzplanId: number, code: string): Promise<Vorgang | null> {
    return VORGAENGE_DATA.find(v => v.netzplan_id === netzplanId && v.code === code) || null;
  }

  async create(vorgang: Omit<Vorgang, 'id'>): Promise<number> {
    const newId = this.nextId++;
    VORGAENGE_DATA.push({ ...vorgang, id: newId });
    return newId;
  }

  async update(id: number, vorgang: Partial<Omit<Vorgang, 'id'>>): Promise<boolean> {
    const index = VORGAENGE_DATA.findIndex(v => v.id === id);
    if (index === -1) return false;
    VORGAENGE_DATA[index] = { ...VORGAENGE_DATA[index], ...vorgang };
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const index = VORGAENGE_DATA.findIndex(v => v.id === id);
    if (index === -1) return false;
    VORGAENGE_DATA.splice(index, 1);
    return true;
  }

  async updateProgress(id: number, progress: number): Promise<boolean> {
    return this.update(id, { fortschritt_pct: progress });
  }

  async updateStatus(id: number, status: string): Promise<boolean> {
    return this.update(id, { status });
  }
}
