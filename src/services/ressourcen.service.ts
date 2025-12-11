import { getDatabase } from './database';

export interface Ressource {
  id?: number;
  standort_id: number;
  code: string;
  name: string;
  kapazitaet?: number | null;
  beschreibung?: string | null;
}

export class RessourcenService {
  async getAll(): Promise<Ressource[]> {
    const db = getDatabase();
    return await db.query<Ressource>('SELECT * FROM ressourcen ORDER BY code');
  }

  async getById(id: number): Promise<Ressource | null> {
    const db = getDatabase();
    const results = await db.query<Ressource>('SELECT * FROM ressourcen WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByStandortId(standortId: number): Promise<Ressource[]> {
    const db = getDatabase();
    return await db.query<Ressource>('SELECT * FROM ressourcen WHERE standort_id = ? ORDER BY code', [standortId]);
  }

  async getByCode(standortId: number, code: string): Promise<Ressource | null> {
    const db = getDatabase();
    const results = await db.query<Ressource>(
      'SELECT * FROM ressourcen WHERE standort_id = ? AND code = ?',
      [standortId, code]
    );
    return results.length > 0 ? results[0] : null;
  }

  async create(ressource: Omit<Ressource, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO ressourcen (standort_id, code, name, kapazitaet, beschreibung) VALUES (?, ?, ?, ?, ?)',
      [ressource.standort_id, ressource.code, ressource.name, ressource.kapazitaet, ressource.beschreibung]
    );
    return result.lastID;
  }

  async update(id: number, ressource: Partial<Omit<Ressource, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (ressource.standort_id !== undefined) {
      fields.push('standort_id = ?');
      values.push(ressource.standort_id);
    }
    if (ressource.code !== undefined) {
      fields.push('code = ?');
      values.push(ressource.code);
    }
    if (ressource.name !== undefined) {
      fields.push('name = ?');
      values.push(ressource.name);
    }
    if (ressource.kapazitaet !== undefined) {
      fields.push('kapazitaet = ?');
      values.push(ressource.kapazitaet);
    }
    if (ressource.beschreibung !== undefined) {
      fields.push('beschreibung = ?');
      values.push(ressource.beschreibung);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE ressourcen SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM ressourcen WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
