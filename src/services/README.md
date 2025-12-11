# Database Services

This directory contains CRUD services for the `projekt_netzplan.db` SQLite database.

## Services

### StandorteService
Manages locations/sites (`standorte` table).

**Methods:**
- `getAll(): Promise<Standort[]>` - Get all locations
- `getById(id: number): Promise<Standort | null>` - Get location by ID
- `getByCode(code: string): Promise<Standort | null>` - Get location by code
- `create(standort: Omit<Standort, 'id'>): Promise<number>` - Create new location
- `update(id: number, standort: Partial<Omit<Standort, 'id'>>): Promise<boolean>` - Update location
- `delete(id: number): Promise<boolean>` - Delete location

### RessourcenService
Manages resources (`ressourcen` table).

**Methods:**
- `getAll(): Promise<Ressource[]>` - Get all resources
- `getById(id: number): Promise<Ressource | null>` - Get resource by ID
- `getByStandortId(standortId: number): Promise<Ressource[]>` - Get resources by location
- `getByCode(standortId: number, code: string): Promise<Ressource | null>` - Get resource by location and code
- `create(ressource: Omit<Ressource, 'id'>): Promise<number>` - Create new resource
- `update(id: number, ressource: Partial<Omit<Ressource, 'id'>>): Promise<boolean>` - Update resource
- `delete(id: number): Promise<boolean>` - Delete resource

### MitarbeiterService
Manages employees (`mitarbeiter` table).

**Methods:**
- `getAll(): Promise<Mitarbeiter[]>` - Get all employees
- `getById(id: number): Promise<Mitarbeiter | null>` - Get employee by ID
- `getByRessourceId(ressourcenId: number): Promise<Mitarbeiter[]>` - Get employees by resource
- `getByEmail(email: string): Promise<Mitarbeiter | null>` - Get employee by email
- `getActive(): Promise<Mitarbeiter[]>` - Get active employees
- `create(mitarbeiter: Omit<Mitarbeiter, 'id'>): Promise<number>` - Create new employee
- `update(id: number, mitarbeiter: Partial<Omit<Mitarbeiter, 'id'>>): Promise<boolean>` - Update employee
- `delete(id: number): Promise<boolean>` - Delete employee
- `deactivate(id: number): Promise<boolean>` - Deactivate employee
- `activate(id: number): Promise<boolean>` - Activate employee

### ProjekteService
Manages projects (`projekte` table).

**Methods:**
- `getAll(): Promise<Projekt[]>` - Get all projects
- `getById(id: number): Promise<Projekt | null>` - Get project by ID
- `getByCode(code: string): Promise<Projekt | null>` - Get project by code
- `create(projekt: Omit<Projekt, 'id'>): Promise<number>` - Create new project
- `update(id: number, projekt: Partial<Omit<Projekt, 'id'>>): Promise<boolean>` - Update project
- `delete(id: number): Promise<boolean>` - Delete project

### NetzplaeneService
Manages network plans (`netzplaene` table).

**Methods:**
- `getAll(): Promise<Netzplan[]>` - Get all network plans
- `getById(id: number): Promise<Netzplan | null>` - Get network plan by ID
- `getByProjektId(projektId: number): Promise<Netzplan[]>` - Get network plans by project
- `getByCode(projektId: number, code: string): Promise<Netzplan | null>` - Get network plan by project and code
- `create(netzplan: Omit<Netzplan, 'id'>): Promise<number>` - Create new network plan
- `update(id: number, netzplan: Partial<Omit<Netzplan, 'id'>>): Promise<boolean>` - Update network plan
- `delete(id: number): Promise<boolean>` - Delete network plan

### VorgaengeService
Manages operations/tasks (`vorgaenge` table).

**Methods:**
- `getAll(): Promise<Vorgang[]>` - Get all operations
- `getById(id: number): Promise<Vorgang | null>` - Get operation by ID
- `getByNetzplanId(netzplanId: number): Promise<Vorgang[]>` - Get operations by network plan
- `getByRessourceId(ressourcenId: number): Promise<Vorgang[]>` - Get operations by resource
- `getByStatus(status: string): Promise<Vorgang[]>` - Get operations by status
- `getByDateRange(startDate: string, endDate: string): Promise<Vorgang[]>` - Get operations by date range
- `getByCode(netzplanId: number, code: string): Promise<Vorgang | null>` - Get operation by network plan and code
- `create(vorgang: Omit<Vorgang, 'id'>): Promise<number>` - Create new operation
- `update(id: number, vorgang: Partial<Omit<Vorgang, 'id'>>): Promise<boolean>` - Update operation
- `delete(id: number): Promise<boolean>` - Delete operation
- `updateProgress(id: number, progress: number): Promise<boolean>` - Update operation progress
- `updateStatus(id: number, status: string): Promise<boolean>` - Update operation status

### ProjektStrukturService
Aggregates project data with nested network plans and operations. Returns complete hierarchical project structure.

**Methods:**
- `getByProjektId(projektId: number): Promise<ProjektStruktur | null>` - Get complete project structure by ID
- `getByProjektCode(projektCode: string): Promise<ProjektStruktur | null>` - Get complete project structure by code
- `getAll(): Promise<ProjektStruktur[]>` - Get all projects with their complete structure

**Types:**
- `ProjektStruktur` - Project with nested `netzplaene` array
- `NetzplanMitVorgaenge` - Network plan with nested `vorgaenge` array

## Usage Example

```typescript
import {
  StandorteService,
  ProjekteService,
  VorgaengeService,
  ProjektStrukturService
} from './services';

// Create service instances
const standorteService = new StandorteService();
const projekteService = new ProjekteService();
const vorgaengeService = new VorgaengeService();
const projektStrukturService = new ProjektStrukturService();

// Get all locations
const standorte = await standorteService.getAll();

// Create a new project
const projektId = await projekteService.create({
  code: 'PROJ-001',
  name: 'New Project',
  beschreibung: 'Project description',
  start_geplant: '2024-01-01',
  ende_geplant: '2024-12-31'
});

// Get operations by status
const activeOps = await vorgaengeService.getByStatus('in_arbeit');

// Update operation progress
await vorgaengeService.updateProgress(1, 75);

// Get complete project structure with nested data
const projektStruktur = await projektStrukturService.getByProjektCode('PROJ-001');
// Returns: { ...projekt, netzplaene: [{ ...netzplan, vorgaenge: [...] }] }
```

## Database Connection

The services use a database abstraction layer through `getDatabase()` from `database.ts`. By default, a mock database is used for development. To use a real SQLite database, implement the `DatabaseConnection` interface and set it using `setDatabase()`:

```typescript
import { setDatabase, DatabaseConnection } from './services/database';

// Implement your real database connection
const realDb: DatabaseConnection = {
  query: async (sql, params) => { /* your implementation */ },
  run: async (sql, params) => { /* your implementation */ },
  close: async () => { /* your implementation */ }
};

setDatabase(realDb);
```

## Testing

All services have comprehensive unit tests. Run tests with:

```bash
npm test src/services
```

Tests cover:
- All CRUD operations
- Edge cases (not found, empty results)
- Partial updates
- Specialized query methods

## Database Schema

The database follows this structure:

- **standorte**: Locations/sites
- **ressourcen**: Resources (linked to standorte)
- **mitarbeiter**: Employees (linked to ressourcen)
- **projekte**: Projects
- **netzplaene**: Network plans (linked to projekte)
- **vorgaenge**: Operations/tasks (linked to netzplaene and ressourcen)

All services respect foreign key relationships and CASCADE delete operations where configured.
