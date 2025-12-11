import { getDatabase } from './database';

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

export class VorgaengeService {
  async getAll(): Promise<Vorgang[]> {
    const db = getDatabase();
    return await db.query<Vorgang>('SELECT * FROM vorgaenge ORDER BY start_zeit');
  }

  async getById(id: number): Promise<Vorgang | null> {
    const db = getDatabase();
    const results = await db.query<Vorgang>('SELECT * FROM vorgaenge WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByNetzplanId(netzplanId: number): Promise<Vorgang[]> {
    const db = getDatabase();
    return await db.query<Vorgang>(
      'SELECT * FROM vorgaenge WHERE netzplan_id = ? ORDER BY start_zeit',
      [netzplanId]
    );
  }

  async getByRessourceId(ressourcenId: number): Promise<Vorgang[]> {
    const db = getDatabase();
    return await db.query<Vorgang>(
      'SELECT * FROM vorgaenge WHERE ressourcen_id = ? ORDER BY start_zeit',
      [ressourcenId]
    );
  }

  async getByStatus(status: string): Promise<Vorgang[]> {
    const db = getDatabase();
    return await db.query<Vorgang>(
      'SELECT * FROM vorgaenge WHERE status = ? ORDER BY start_zeit',
      [status]
    );
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Vorgang[]> {
    const db = getDatabase();
    return await db.query<Vorgang>(
      'SELECT * FROM vorgaenge WHERE start_zeit >= ? AND ende_zeit <= ? ORDER BY start_zeit',
      [startDate, endDate]
    );
  }

  async getByCode(netzplanId: number, code: string): Promise<Vorgang | null> {
    const db = getDatabase();
    const results = await db.query<Vorgang>(
      'SELECT * FROM vorgaenge WHERE netzplan_id = ? AND code = ?',
      [netzplanId, code]
    );
    return results.length > 0 ? results[0] : null;
  }

  async create(vorgang: Omit<Vorgang, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      `INSERT INTO vorgaenge (netzplan_id, ressourcen_id, code, name, start_zeit, ende_zeit, 
       fortschritt_pct, status, beschreibung) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vorgang.netzplan_id,
        vorgang.ressourcen_id,
        vorgang.code,
        vorgang.name,
        vorgang.start_zeit,
        vorgang.ende_zeit,
        vorgang.fortschritt_pct,
        vorgang.status,
        vorgang.beschreibung
      ]
    );
    return result.lastID;
  }

  async update(id: number, vorgang: Partial<Omit<Vorgang, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (vorgang.netzplan_id !== undefined) {
      fields.push('netzplan_id = ?');
      values.push(vorgang.netzplan_id);
    }
    if (vorgang.ressourcen_id !== undefined) {
      fields.push('ressourcen_id = ?');
      values.push(vorgang.ressourcen_id);
    }
    if (vorgang.code !== undefined) {
      fields.push('code = ?');
      values.push(vorgang.code);
    }
    if (vorgang.name !== undefined) {
      fields.push('name = ?');
      values.push(vorgang.name);
    }
    if (vorgang.start_zeit !== undefined) {
      fields.push('start_zeit = ?');
      values.push(vorgang.start_zeit);
    }
    if (vorgang.ende_zeit !== undefined) {
      fields.push('ende_zeit = ?');
      values.push(vorgang.ende_zeit);
    }
    if (vorgang.fortschritt_pct !== undefined) {
      fields.push('fortschritt_pct = ?');
      values.push(vorgang.fortschritt_pct);
    }
    if (vorgang.status !== undefined) {
      fields.push('status = ?');
      values.push(vorgang.status);
    }
    if (vorgang.beschreibung !== undefined) {
      fields.push('beschreibung = ?');
      values.push(vorgang.beschreibung);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE vorgaenge SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM vorgaenge WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async updateProgress(id: number, progress: number): Promise<boolean> {
    return this.update(id, { fortschritt_pct: progress });
  }

  async updateStatus(id: number, status: string): Promise<boolean> {
    return this.update(id, { status });
  }
}
