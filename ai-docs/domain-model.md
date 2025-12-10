# Data Services Documentation

This document describes the business domain model for a production planning and scheduling system. The services simulate API endpoints for accessing production data.

## Business Domain Overview

This system manages the complete production process including:
- Production projects and their workflows
- Manufacturing operations (Arbeitsgänge)
- Material flows and inventory
- Resource allocation (machines, equipment)
- Personnel scheduling and qualifications
- Order dependencies and constraints

### Time Representation
- All time points are represented as integers (days)
- Day 0 is the earliest time point, subsequent days are numbered sequentially
- A value of -1 indicates "not applicable" or "not yet planned"
- Durations are also expressed in days

---

## Core Entities

### AnOrdBez (Precedence Relationships / Dependencies)
**File:** `anOrdBezService.ts`

Represents dependencies between production elements (Anordnungsbeziehungen). Links a predecessor to a successor according to a dependency type.

**Fields:**
- `id`: Unique identifier
- `quelleId`: ID of the source/predecessor element
- `quelleElement`: Type of source element (Arbeitsgang or FertObjekt)
- `zielId`: ID of the target/successor element
- `zielElement`: Type of target element (Arbeitsgang or FertObjekt)
- `typ`: Dependency type (see below)
- `abstand`: Time offset in days (default: 0)
- `abstandExakt`: If true, the offset must be exact; if false, it's a minimum

**Dependency Types:**
- `EndeAnfang` (Finish-to-Start): Successor can only start when predecessor is complete
- `AnfangAnfang` (Start-to-Start): Successor can only start when predecessor has started
- `EndeEnde` (Finish-to-Finish): Successor can only finish when predecessor is finished
- `AnfangEnde` (Start-to-Finish): Successor can only finish when predecessor has started

**Business Purpose:** Forms the basis for throughput scheduling (Durchlaufterminierung) which creates the temporal structure of production by chaining operations together.

---

### Arbeitsgang (Work Operation / Manufacturing Step)
**File:** `arbeitsgangService.ts`

Represents a single manufacturing operation or work step in the production process.

**Fields:**
- `id`: Unique identifier
- `bezeichnung`: Description/name of the operation
- `ressourceId`: ID of the resource (machine/equipment) this operation runs on
- `ressourceBedarf`: Required working minutes on the resource
- `parentFertObjId`: ID of the parent production object this operation belongs to
- `dauer`: Duration in days (or -1 if not set)
- `start`: Scheduled start day (or -1 if not scheduled)
- `ende`: Scheduled end day (or -1 if not scheduled)
- `fruehesterStart`: Earliest possible start day
- `spaetesterStart`: Latest possible start day
- `fruehestesEnde`: Earliest possible end day
- `spaetestesEnde`: Latest possible end day

**Business Purpose:** Operations consume material and are executed on resources. The early/late dates provide scheduling constraints from throughput scheduling calculations.

---

### Bestellung (Order / Purchase Order)
**File:** `bestellungService.ts`

Represents incoming material orders/deliveries into the system.

**Fields:**
- `id`: Unique identifier
- `materialId`: ID of the material being ordered
- `verfuegbarTag`: Day when material becomes available (or -1 if not scheduled)
- `menge`: Quantity of material
- `fix`: If true, this order is unchangeable in the schedule

**Business Purpose:** Brings material into the system. Fixed orders cannot be rescheduled, while flexible orders allow optimization of material availability timing.

---

### FertObjekt (Production Object)
**File:** `fertObjektService.ts`

Represents hierarchical production objects that structure the manufacturing process.

**Fields:**
- `id`: Unique identifier
- `bezeichnung`: Description/name
- `typ`: Type of production object (see below)
- `parentFertObjektId`: ID of parent object (creates hierarchy)
- `zieltermin`: Target/due date (or -1 if not set)
- `dauer`: Duration in days (or -1 if not set)
- `start`: Scheduled start day (or -1 if not scheduled)
- `ende`: Scheduled end day (or -1 if not scheduled)

**Production Object Types:**
- `Montageauftrag`: Assembly order
- `Fertigungsauftrag`: Manufacturing order
- `Unternetzplan`: Sub-network plan
- `Netzplan`: Network plan
- `Projekt`: Project

**Business Purpose:** Creates a hierarchical structure for organizing production. Assembly and manufacturing orders can generate materials. Can have target dates that must be met.

---

### KundenAufPos (Customer Order Position)
**File:** `kundenAufPosService.ts`

Represents customer order line items that drive production requirements.

**Fields:**
- `id`: Unique identifier
- `materialId`: ID of the material to be delivered
- `menge`: Quantity required
- `zieltermin`: Target delivery date (or -1 if not set)

**Business Purpose:** Customer demands that must be fulfilled. Materials flow out of the system through customer order positions.

---

### MatBewegung (Material Movement)
**File:** `matBewegungService.ts`

Represents the flow of materials through the production process, connecting sources and sinks.

**Fields:**
- `id`: Unique identifier
- `matBewegungArt`: Movement type - "Zugang" (inbound/freed) or "Abgang" (outbound/consumed)
- `materialId`: ID of the material
- `menge`: Quantity of material
- `upoTyp`: Type of source/sink object (see below)
- `upoId`: ID of the source/sink object
- `tag`: Day when movement occurs (or -1 if not scheduled)
- `fix`: If true, this movement is fixed/unchangeable

**UPO Types (UniPlanObjekt = Universal Planning Object):**
- `Arbeitsgang`: Work operation
- `FertObjekt`: Production object
- `KundenAufPos`: Customer order position
- `BestellPos`: Order position
- `BestellVorschlag`: Order proposal
- `Bestand`: Inventory

**Business Purpose:** Tracks material flow. "Zugang" means material becomes available, "Abgang" means material is consumed/reserved.

---

### MatBewegungLink (Material Movement Link)
**File:** `matBewegungLinkService.ts`

Connects material movements, linking inbound and outbound material flows.

**Fields:**
- `id`: Unique identifier
- `matBewegungZugangId`: ID of the inbound material movement
- `matBewegungAbgangId`: ID of the outbound material movement
- `menge`: Quantity flowing from inbound to outbound
- `fix`: If true, this connection is fixed/unchangeable

**Business Purpose:** Creates the supply chain by connecting material sources to their destinations. Shows which incoming material supplies which consumption.

---

### Material (Material / Part)
**File:** `materialService.ts`

Represents materials, parts, or products in the system.

**Fields:**
- `id`: Unique identifier
- `bezeichnung`: Description/name
- `einheit`: Unit of measure (e.g., "Stk" = pieces, "kg" = kilograms, "Pkg" = packages)
- `wiederbeschaffungszeit`: Replenishment lead time in days

**Business Purpose:** Basic master data for all materials used or produced. Lead time is critical for planning reorders.

---

### MaterialErzeugung (Material Generation)
**File:** `materialErzeugungService.ts`

Defines which materials are produced by assembly and manufacturing orders.

**Fields:**
- `fertObjektId`: ID of the production object (Montageauftrag or Fertigungsauftrag)
- `materialId`: ID of the material being generated
- `menge`: Quantity produced

**Business Purpose:** Links production orders to their output materials. Only assembly and manufacturing order types generate materials.

---

### MaterialVerbrauch (Material Consumption)
**File:** `materialVerbrauchService.ts`

Defines which materials are consumed by work operations.

**Fields:**
- `arbeitsgangId`: ID of the work operation
- `materialId`: ID of the material being consumed
- `menge`: Quantity consumed

**Business Purpose:** Bill of materials for operations - specifies what materials each operation needs to execute.

---

### Mitarbeiter (Employee / Worker)
**File:** `mitarbeiterService.ts`

Represents personnel in the production system.

**Fields:**
- `id`: Unique identifier
- `name`: Employee name
- `stundenprofil`: Weekly hour profile (normal working hours per weekday)
- `stundenprofilUeberstunden`: Weekly overtime hour profile (maximum hours including overtime per weekday)

**Hour Profile Structure:** Dictionary mapping days of week to hours
```typescript
{
  Monday: 8,
  Tuesday: 8,
  Wednesday: 8,
  Thursday: 8,
  Friday: 8,
  Saturday: 0,
  Sunday: 0
}
```

**Business Purpose:** Employees provide working capacity to resources. The system can plan with or without overtime using the respective profiles.

---

### MitarbeiterEignung (Employee Qualification)
**File:** `mitarbeiterEignungService.ts`

Defines employee qualifications for working on specific resources.

**Fields:**
- `ressourceId`: ID of the resource
- `mitarbeiterId`: ID of the employee
- `eignung`: Qualification level (efficiency factor)

**Qualification Levels:**
- `1.0`: Highest qualification (100% efficient)
- `0.0`: Lowest qualification (0% efficient)
- `0.0 to 1.0`: Partial qualification
- Negative values (down to `-1.25`): For trainees who need additional supervision time

**Business Purpose:** Employees can only be assigned to resources they're qualified for. The qualification level affects effective working time - a 0.7 qualification means 10 hours of work produces 7 hours of effective output.

---

### MitarbeiterRessourceBedarfLink (Employee-Resource Demand Link)
**File:** `mitarbeiterRessourceBedarfLinkService.ts`

Records actual employee assignments to work operations.

**Fields:**
- `mitarbeiterId`: ID of the employee
- `arbeitsgangId`: ID of the work operation
- `tag`: Day of the assignment
- `minuten`: Minutes the employee works on this operation on this day

**Business Purpose:** Captures the scheduled allocation of employees to specific operations. Shows the daily breakdown of who works on what.

---

### MitarbeiterSpeEintragungsgrundLink (Employee Shift Assignment Link)
**File:** `mitarbeiterSpeEintragungsgrundLinkService.ts`

Records shift assignments for employees.

**Fields:**
- `mitarbeiterId`: ID of the employee
- `schichtmodellId`: ID of the shift model
- `tag`: Day of the assignment

**Business Purpose:** Assigns employees to shifts (or absences) on specific days. One shift per employee per day maximum.

---

### Ressource (Resource / Machine / Equipment)
**File:** `ressourceService.ts`

Represents production resources such as machines, equipment, or work centers.

**Fields:**
- `id`: Unique identifier
- `bezeichnung`: Description/name
- `anzahlPlaetze`: Number of operations that can be processed simultaneously
- `parallelitaetsfaktor`: Number of employees that can work simultaneously on one operation
- `usesGemeinsameBearbeitung`: If true, the above parameters are considered in scheduling
- `tageskapazitaet`: Daily capacity profile (standard working minutes per weekday)
- `tageskapazitaetMax`: Maximum daily capacity profile (with overtime, per weekday)

**Capacity Profile Structure:** Dictionary mapping days of week to minutes
```typescript
{
  Monday: 480,    // 8 hours
  Tuesday: 480,
  Wednesday: 480,
  Thursday: 480,
  Friday: 480,
  Saturday: 240,  // 4 hours
  Sunday: 0       // closed
}
```

**Business Purpose:** Resources execute operations. Capacity is fundamentally determined by available workforce but can be limited or reduced (e.g., weekends). Multiple operations can run in parallel based on `anzahlPlaetze`.

---

### Schichtmodell (Shift Model)
**File:** `schichtmodellService.ts`

Defines shift patterns and absence types for employee scheduling.

**Fields:**
- `id`: Unique identifier
- `typ`: Type - "On" (working shift) or "Off" (absence)
- `bezeichnung`: Description/name (e.g., "Frühschicht" = Early Shift)
- `kuerzel`: Abbreviation (e.g., "F" for Frühschicht)
- `start`: Start time (as time string, e.g., "06:00:00")
- `ende`: End time (as time string, e.g., "14:00:00")
- `pause`: Break duration in minutes
- `dauer`: Net working duration in minutes (end - start - pause)

**Shift Types:**
- `On`: Working shift (duration determines available working time)
- `Off`: Absence (sick leave, vacation, etc.)

**Business Purpose:** Defines when employees work and for how long. Shift assignment determines daily working time available from each employee.

---

### Tag (Day / Calendar Day)
**File:** `tagService.ts`

Maps calendar dates to integer day indices used throughout the system.

**Fields:**
- `index`: Integer day number (0 = first day)
- `datum`: Actual calendar date/time

**Business Purpose:** Provides the mapping between the integer-based scheduling system and real calendar dates. Essential for converting between internal scheduling (day numbers) and user-facing dates.

---

## Data Relationships

### Material Flow
```
Bestellung → MatBewegung (Zugang) → MatBewegungLink → MatBewegung (Abgang) → Arbeitsgang
MaterialErzeugung → MatBewegung (Zugang) → MatBewegungLink → MatBewegung (Abgang) → KundenAufPos
```

### Production Hierarchy
```
Projekt
  └── Netzplan/Unternetzplan
      └── Fertigungsauftrag/Montageauftrag
          └── Arbeitsgang
```

### Resource Capacity Chain
```
Mitarbeiter → MitarbeiterEignung → Ressource → Arbeitsgang
Mitarbeiter → MitarbeiterSpeEintragungsgrundLink → Schichtmodell (defines daily hours)
Mitarbeiter → MitarbeiterRessourceBedarfLink → Arbeitsgang (actual assignment)
```

### Dependencies
```
AnOrdBez: Arbeitsgang ↔ Arbeitsgang (operation sequencing)
AnOrdBez: FertObjekt ↔ FertObjekt (project sequencing)
AnOrdBez: FertObjekt ↔ Arbeitsgang (mixed dependencies)
```

---

## Key Business Concepts

### Throughput Scheduling (Durchlaufterminierung)
The system performs combined forward-backward scheduling based on dependencies (AnOrdBez) to calculate:
- Earliest start/end dates for each operation
- Latest start/end dates for each operation

These dates form scheduling constraints and guide production program planning.

### Fixed vs. Flexible Elements
Many entities have a `fix` boolean field:
- **Fixed (true)**: Cannot be changed by planning/optimization (e.g., confirmed orders, specialized parts)
- **Flexible (false)**: Can be adjusted by the planning system to optimize the schedule

### Resource Capacity
Resource capacity comes from:
1. Assigned employees (via MitarbeiterEignung)
2. Employee shift assignments (via MitarbeiterSpeEintragungsgrundLink)
3. Employee qualifications (eignung factor affects effective capacity)
4. Resource parameters (anzahlPlaetze, parallelitaetsfaktor)
5. Daily capacity limits (tageskapazitaet, tageskapazitaetMax)

### Material Consumption vs. Generation
- **Consumption** (MaterialVerbrauch): Operations need materials as inputs
- **Generation** (MaterialErzeugung): Assembly/manufacturing orders produce materials as outputs
- Material flow is tracked through MatBewegung (movements) connected by MatBewegungLink

---

## Usage Examples

### Getting all operations for a specific resource
```typescript
import { arbeitsgangService } from './services';

const operations = await arbeitsgangService.getByRessource(resourceId);
```

### Checking material availability for an operation
```typescript
import { materialVerbrauchService, materialService } from './services';

const consumption = await materialVerbrauchService.getByArbeitsgang(operationId);
for (const item of consumption) {
  const material = await materialService.getById(item.materialId);
  console.log(`Operation needs ${item.menge} ${material.einheit} of ${material.bezeichnung}`);
}
```

### Finding employee qualifications
```typescript
import { mitarbeiterEignungService } from './services';

const qualifications = await mitarbeiterEignungService.getByMitarbeiter(employeeId);
// Returns all resources this employee can work on and their efficiency levels
```

### Tracking material flow
```typescript
import { matBewegungService, matBewegungLinkService } from './services';

// Find where material comes from
const inbound = await matBewegungService.getByMaterial(materialId);
const links = await matBewegungLinkService.getByZugang(inbound[0].id);
// Links show where this material goes
```

---

## Notes for AI Coding Agents

1. **Time Values**: Always check for `-1` which means "not set" or "not applicable"
2. **Fixed Elements**: Respect the `fix` flag - these cannot be modified by optimization algorithms
3. **Hierarchies**: Follow parent relationships (parentFertObjektId) to understand production structure
4. **Dependencies**: AnOrdBez creates a complex constraint network - changes ripple through dependencies
5. **Capacity**: Employee effective capacity = actual hours × qualification (eignung) factor
6. **Material Balance**: Ensure material movements balance - what comes in (Zugang) must go somewhere (Abgang via MatBewegungLink)
7. **Day Indexing**: Day 0 is the planning horizon start, not a specific calendar date - use Tag service to convert
