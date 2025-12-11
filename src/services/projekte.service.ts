import { getDatabase } from './database';

export interface Projekt {
  id?: number;
  code: string;
  name: string;
  beschreibung?: string | null;
  start_geplant?: string | null;
  ende_geplant?: string | null;
}

export class ProjekteService {
  async getAll(): Promise<Projekt[]> {
    const db = getDatabase();
    return await db.query<Projekt>('SELECT * FROM projekte ORDER BY code');
  }

  async getById(id: number): Promise<Projekt | null> {
    const db = getDatabase();
    const results = await db.query<Projekt>('SELECT * FROM projekte WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByCode(code: string): Promise<Projekt | null> {
    const db = getDatabase();
    const results = await db.query<Projekt>('SELECT * FROM projekte WHERE code = ?', [code]);
    return results.length > 0 ? results[0] : null;
  }

  async create(projekt: Omit<Projekt, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO projekte (code, name, beschreibung, start_geplant, ende_geplant) VALUES (?, ?, ?, ?, ?)',
      [projekt.code, projekt.name, projekt.beschreibung, projekt.start_geplant, projekt.ende_geplant]
    );
    return result.lastID;
  }

  async update(id: number, projekt: Partial<Omit<Projekt, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (projekt.code !== undefined) {
      fields.push('code = ?');
      values.push(projekt.code);
    }
    if (projekt.name !== undefined) {
      fields.push('name = ?');
      values.push(projekt.name);
    }
    if (projekt.beschreibung !== undefined) {
      fields.push('beschreibung = ?');
      values.push(projekt.beschreibung);
    }
    if (projekt.start_geplant !== undefined) {
      fields.push('start_geplant = ?');
      values.push(projekt.start_geplant);
    }
    if (projekt.ende_geplant !== undefined) {
      fields.push('ende_geplant = ?');
      values.push(projekt.ende_geplant);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE projekte SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM projekte WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
