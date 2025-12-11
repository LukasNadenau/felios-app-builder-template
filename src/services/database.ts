// Database connection utilities
export interface DatabaseConnection {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  run(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }>;
  close(): Promise<void>;
}

class MockDatabase implements DatabaseConnection {
  private data: Map<string, any[]> = new Map();

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Mock implementation for development
    console.log('Query:', sql, params);
    return [];
  }

  async run(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> {
    console.log('Run:', sql, params);
    return { lastID: 1, changes: 1 };
  }

  async close(): Promise<void> {
    console.log('Database connection closed');
  }
}

let dbInstance: DatabaseConnection | null = null;

export function getDatabase(): DatabaseConnection {
  if (!dbInstance) {
    dbInstance = new MockDatabase();
  }
  return dbInstance;
}

export function setDatabase(db: DatabaseConnection): void {
  dbInstance = db;
}
