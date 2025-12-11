import { getDatabase } from './database';

export interface Standort {
  id?: number;
  code: string;
  name: string;
  beschreibung?: string | null;
}

export class StandorteService {
  async getAll(): Promise<Standort[]> {
    const db = getDatabase();
    return await db.query<Standort>('SELECT * FROM standorte ORDER BY code');
  }

  async getById(id: number): Promise<Standort | null> {
    const db = getDatabase();
    const results = await db.query<Standort>('SELECT * FROM standorte WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByCode(code: string): Promise<Standort | null> {
    const db = getDatabase();
    const results = await db.query<Standort>('SELECT * FROM standorte WHERE code = ?', [code]);
    return results.length > 0 ? results[0] : null;
  }

  async create(standort: Omit<Standort, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO standorte (code, name, beschreibung) VALUES (?, ?, ?)',
      [standort.code, standort.name, standort.beschreibung]
    );
    return result.lastID;
  }

  async update(id: number, standort: Partial<Omit<Standort, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (standort.code !== undefined) {
      fields.push('code = ?');
      values.push(standort.code);
    }
    if (standort.name !== undefined) {
      fields.push('name = ?');
      values.push(standort.name);
    }
    if (standort.beschreibung !== undefined) {
      fields.push('beschreibung = ?');
      values.push(standort.beschreibung);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE standorte SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM standorte WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
