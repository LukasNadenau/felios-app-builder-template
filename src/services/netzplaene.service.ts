import { getDatabase } from './database';

export interface Netzplan {
  id?: number;
  projekt_id: number;
  code: string;
  name: string;
  beschreibung?: string | null;
}

export class NetzplaeneService {
  async getAll(): Promise<Netzplan[]> {
    const db = getDatabase();
    return await db.query<Netzplan>('SELECT * FROM netzplaene ORDER BY code');
  }

  async getById(id: number): Promise<Netzplan | null> {
    const db = getDatabase();
    const results = await db.query<Netzplan>('SELECT * FROM netzplaene WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByProjektId(projektId: number): Promise<Netzplan[]> {
    const db = getDatabase();
    return await db.query<Netzplan>(
      'SELECT * FROM netzplaene WHERE projekt_id = ? ORDER BY code',
      [projektId]
    );
  }

  async getByCode(projektId: number, code: string): Promise<Netzplan | null> {
    const db = getDatabase();
    const results = await db.query<Netzplan>(
      'SELECT * FROM netzplaene WHERE projekt_id = ? AND code = ?',
      [projektId, code]
    );
    return results.length > 0 ? results[0] : null;
  }

  async create(netzplan: Omit<Netzplan, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO netzplaene (projekt_id, code, name, beschreibung) VALUES (?, ?, ?, ?)',
      [netzplan.projekt_id, netzplan.code, netzplan.name, netzplan.beschreibung]
    );
    return result.lastID;
  }

  async update(id: number, netzplan: Partial<Omit<Netzplan, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (netzplan.projekt_id !== undefined) {
      fields.push('projekt_id = ?');
      values.push(netzplan.projekt_id);
    }
    if (netzplan.code !== undefined) {
      fields.push('code = ?');
      values.push(netzplan.code);
    }
    if (netzplan.name !== undefined) {
      fields.push('name = ?');
      values.push(netzplan.name);
    }
    if (netzplan.beschreibung !== undefined) {
      fields.push('beschreibung = ?');
      values.push(netzplan.beschreibung);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE netzplaene SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM netzplaene WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
