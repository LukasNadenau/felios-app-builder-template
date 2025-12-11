import { getDatabase } from './database';
import { Projekt } from './projekte.service';
import { Netzplan } from './netzplaene.service';
import { Vorgang } from './vorgaenge.service';

export interface NetzplanMitVorgaenge extends Netzplan {
  vorgaenge: Vorgang[];
}

export interface ProjektStruktur extends Projekt {
  netzplaene: NetzplanMitVorgaenge[];
}

export class ProjektStrukturService {
  async getByProjektId(projektId: number): Promise<ProjektStruktur | null> {
    const db = getDatabase();
    
    const projekte = await db.query<Projekt>(
      'SELECT * FROM projekte WHERE id = ?',
      [projektId]
    );
    
    if (projekte.length === 0) return null;
    
    const projekt = projekte[0];
    const netzplaene = await db.query<Netzplan>(
      'SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code',
      [projektId]
    );
    
    const netzplaeneMitVorgaenge: NetzplanMitVorgaenge[] = await Promise.all(
      netzplaene.map(async (netzplan) => {
        const vorgaenge = await db.query<Vorgang>(
          'SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit',
          [netzplan.id!]
        );
        return {
          ...netzplan,
          vorgaenge
        };
      })
    );
    
    return {
      ...projekt,
      netzplaene: netzplaeneMitVorgaenge
    };
  }

  async getByProjektCode(projektCode: string): Promise<ProjektStruktur | null> {
    const db = getDatabase();
    
    const projekte = await db.query<Projekt>(
      'SELECT * FROM projekte WHERE code = ?',
      [projektCode]
    );
    
    if (projekte.length === 0) return null;
    
    return this.getByProjektId(projekte[0].id!);
  }

  async getAll(): Promise<ProjektStruktur[]> {
    const db = getDatabase();
    const projekte = await db.query<Projekt>('SELECT * FROM projekte ORDER BY code');
    
    return Promise.all(
      projekte.map(projekt => this.getByProjektId(projekt.id!))
    ).then(results => results.filter((p): p is ProjektStruktur => p !== null));
  }
}
