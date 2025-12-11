import { getDatabase } from './database';

export interface Mitarbeiter {
  id?: number;
  ressourcen_id: number;
  vorname: string;
  nachname: string;
  email?: string | null;
  eingestellt_am?: string | null;
  aktiv: number;
}

export class MitarbeiterService {
  async getAll(): Promise<Mitarbeiter[]> {
    const db = getDatabase();
    return await db.query<Mitarbeiter>('SELECT * FROM mitarbeiter ORDER BY nachname, vorname');
  }

  async getById(id: number): Promise<Mitarbeiter | null> {
    const db = getDatabase();
    const results = await db.query<Mitarbeiter>('SELECT * FROM mitarbeiter WHERE id = ?', [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByRessourceId(ressourcenId: number): Promise<Mitarbeiter[]> {
    const db = getDatabase();
    return await db.query<Mitarbeiter>(
      'SELECT * FROM mitarbeiter WHERE ressourcen_id = ? ORDER BY nachname, vorname',
      [ressourcenId]
    );
  }

  async getByEmail(email: string): Promise<Mitarbeiter | null> {
    const db = getDatabase();
    const results = await db.query<Mitarbeiter>('SELECT * FROM mitarbeiter WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  }

  async getActive(): Promise<Mitarbeiter[]> {
    const db = getDatabase();
    return await db.query<Mitarbeiter>(
      'SELECT * FROM mitarbeiter WHERE aktiv = 1 ORDER BY nachname, vorname'
    );
  }

  async create(mitarbeiter: Omit<Mitarbeiter, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO mitarbeiter (ressourcen_id, vorname, nachname, email, eingestellt_am, aktiv) VALUES (?, ?, ?, ?, ?, ?)',
      [
        mitarbeiter.ressourcen_id,
        mitarbeiter.vorname,
        mitarbeiter.nachname,
        mitarbeiter.email,
        mitarbeiter.eingestellt_am,
        mitarbeiter.aktiv
      ]
    );
    return result.lastID;
  }

  async update(id: number, mitarbeiter: Partial<Omit<Mitarbeiter, 'id'>>): Promise<boolean> {
    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (mitarbeiter.ressourcen_id !== undefined) {
      fields.push('ressourcen_id = ?');
      values.push(mitarbeiter.ressourcen_id);
    }
    if (mitarbeiter.vorname !== undefined) {
      fields.push('vorname = ?');
      values.push(mitarbeiter.vorname);
    }
    if (mitarbeiter.nachname !== undefined) {
      fields.push('nachname = ?');
      values.push(mitarbeiter.nachname);
    }
    if (mitarbeiter.email !== undefined) {
      fields.push('email = ?');
      values.push(mitarbeiter.email);
    }
    if (mitarbeiter.eingestellt_am !== undefined) {
      fields.push('eingestellt_am = ?');
      values.push(mitarbeiter.eingestellt_am);
    }
    if (mitarbeiter.aktiv !== undefined) {
      fields.push('aktiv = ?');
      values.push(mitarbeiter.aktiv);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const result = await db.run(
      `UPDATE mitarbeiter SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM mitarbeiter WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async deactivate(id: number): Promise<boolean> {
    return this.update(id, { aktiv: 0 });
  }

  async activate(id: number): Promise<boolean> {
    return this.update(id, { aktiv: 1 });
  }
}
