# Project Network Planning Database - Star Wars Edition 🚀

This SQLite database contains a comprehensive project management system with Star Wars themed sample data.

## Database Overview

- **Database File**: `projekt_netzplan.db`
- **Schema**: `projekt_netzplan_schema_sqlite.sql`
- **Seed Data**: `seed.sql` (facilities, resources, employees, projects)
- **Generator**: `generate_operations.py` (generates networks, operations, and assignments)

## Quick Start

### Initialize Database

**Windows:**
```bash
init_db.bat
```

**Linux/Mac:**
```bash
python generate_operations.py
```

This will create a fresh database with all sample data.

## Database Statistics

- **Projects**: 50 (spanning 01.01.2025 - 01.01.2027)
- **Networks**: 176 (3-4 per project)
- **Operations**: 4,341 (20-30 per network)
- **Relationships**: 8,051 (operation dependencies)
- **Assignments**: 8,179 (employees assigned to operations)
- **Active Employees**: 61
- **Resources**: 20 (10 per facility)
- **Facilities**: 2 (Yavin IV Base & Echo Base Hoth)

## Schema Structure

### Core Tables

#### Standorte (Facilities)
- Yavin IV Base - Rebel Alliance primary operations center
- Echo Base Hoth - Hidden Rebel outpost

#### Ressourcen (Resources)
10 resources per facility:
- Fighter squadrons (X-Wing, Y-Wing, Snowspeeder)
- Support facilities (Hangar, Medical, Engineering)
- Operational centers (Command, Communications, Intelligence)
- Specialized units (Droid service, Training, Defense)

#### Mitarbeiter (Employees)
61 Star Wars characters assigned to various resources:
- Pilots: Luke Skywalker, Wedge Antilles, Han Solo
- Leadership: Princess Leia, Mon Mothma, Admiral Ackbar
- Technical: R2-D2, C-3PO, various engineers
- Support staff distributed across all facilities

#### Projekte (Projects)
50 mission-themed projects including:
- DS1-RECON: Death Star I Reconnaissance
- SCARIF-PLANS: Scarif Data Retrieval
- HOTH-SETUP: Echo Base Establishment
- And 47 more missions...

#### Netzpläne (Networks)
3-4 networks per project representing different phases:
- Reconnaissance Phase
- Preparation Phase
- Execution Phase
- Support Operations
- And more...

#### Vorgänge (Operations)
20-30 operations per network with:
- Realistic time scheduling (no overlaps per resource)
- Progress tracking (0-100%)
- Status (geplant, in_arbeit, abgeschlossen, pausiert)
- Resource assignments

#### Anordnungsbeziehungen (Relationships)
Dependencies between operations:
- **FS** (Finish-Start): Most common
- **SS** (Start-Start): Parallel operations
- **FF** (Finish-Finish): Synchronized endings
- **SF** (Start-Finish): Rare, special cases
- Buffer times: 0-24 hours

#### Zuweisungen (Assignments)
Employees assigned to operations with:
- Roles (Lead Technician, Pilot, Coordinator, etc.)
- Capacity allocation (25-100%)
- Automatic validation (employee must belong to operation's resource)

## Data Integrity Features

### Triggers

1. **Resource Validation**: Employees can only be assigned to operations using their resource
2. **Non-Overlapping Operations**: Prevents resource conflicts (same resource can't have overlapping operations)

### Constraints

- Foreign key enforcement enabled
- Unique constraints on codes
- Check constraints on time intervals
- Cascade deletes for referential integrity

## Sample Queries

### View all projects
```sql
SELECT code, name, start_geplant, ende_geplant 
FROM projekte 
ORDER BY start_geplant;
```

### View operations with details
```sql
SELECT * FROM v_vorgang_details 
WHERE projekt_code = 'DS1-RECON';
```

### Find employee workload
```sql
SELECT 
    m.vorname || ' ' || m.nachname as mitarbeiter,
    COUNT(z.id) as anzahl_zuweisungen,
    AVG(z.anteil_pct) as durchschnitt_kapazitaet
FROM mitarbeiter m
JOIN zuweisungen z ON z.mitarbeiter_id = m.id
GROUP BY m.id
ORDER BY anzahl_zuweisungen DESC;
```

### Find operation dependencies
```sql
SELECT 
    v1.name as vorgaenger,
    a.typ,
    v2.name as nachfolger,
    a.puffer
FROM anordnungsbeziehungen a
JOIN vorgaenge v1 ON v1.id = a.vorgaenger_id
JOIN vorgaenge v2 ON v2.id = a.nachfolger_id
WHERE v1.netzplan_id = 1;
```

### Resource utilization
```sql
SELECT 
    r.name as ressource,
    COUNT(v.id) as anzahl_vorgaenge,
    s.name as standort
FROM ressourcen r
LEFT JOIN vorgaenge v ON v.ressourcen_id = r.id
JOIN standorte s ON s.id = r.standort_id
GROUP BY r.id
ORDER BY anzahl_vorgaenge DESC;
```

## Star Wars Theme

The database features authentic Star Wars locations, characters, and missions:

- **Locations**: Yavin IV, Hoth, Bespin (in project descriptions)
- **Characters**: Luke Skywalker, Princess Leia, Han Solo, and 58 more
- **Equipment**: X-Wings, Y-Wings, Snowspeeders, Shield Generators
- **Missions**: Death Star reconnaissance, base establishment, intelligence operations

## Technical Details

- **Database**: SQLite 3 (recommended ≥ 3.31)
- **Time Format**: ISO-8601 (UTC), e.g., `2025-12-15T08:00:00Z`
- **Duration Format**: ISO-8601 Duration, e.g., `PT24H` for 24 hours
- **Journal Mode**: WAL (Write-Ahead Logging) for better performance
- **Foreign Keys**: Enabled (must be set per connection)

## Files

- `projekt_netzplan_schema_sqlite.sql` - Complete database schema with triggers
- `seed.sql` - Base data (facilities, resources, employees, projects)
- `generate_operations.py` - Python script to generate operations data
- `init_db.bat` - Windows batch script for easy setup
- `projekt_netzplan.db` - Generated SQLite database file
- `README.md` - This documentation

## Regenerating Data

To recreate the database with fresh random data:

```bash
python generate_operations.py
```

This will delete the existing database and create a new one with different random:
- Operation schedules
- Employee assignments
- Operation dependencies
- Progress values

The base structure (facilities, resources, employees, projects) remains consistent.

## Notes

- All timestamps are in UTC
- Operations are scheduled to avoid resource conflicts
- Employee assignments respect resource boundaries
- Operation dependencies create realistic project networks
- Progress and status values are randomized for realistic scenarios

May the Force be with you! 🌟
