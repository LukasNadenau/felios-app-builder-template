#!/usr/bin/env python3
"""
Generate detailed operations data for Star Wars themed project database.
Creates networks, operations, relationships, and assignments for 50 projects.
"""

import random
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

# Star Wars themed operation names
OPERATION_TEMPLATES = [
    "Reconnaissance Mission", "Equipment Maintenance", "Training Session", 
    "Supply Transport", "System Diagnostics", "Communication Setup",
    "Defensive Positioning", "Patrol Route", "Equipment Testing",
    "Briefing Session", "Data Analysis", "Repair Operations",
    "Sensor Calibration", "Weapon Systems Check", "Shield Testing",
    "Navigation Planning", "Tactical Review", "Personnel Assignment",
    "Resource Allocation", "Status Reporting", "Emergency Drill",
    "Intelligence Gathering", "Security Patrol", "System Integration",
    "Performance Evaluation", "Mission Debriefing", "Protocol Training",
    "Equipment Upgrade", "Inspection Round", "Coordination Meeting"
]

OPERATION_PREFIXES = [
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
    "Primary", "Secondary", "Advanced", "Basic", "Critical", "Routine",
    "Emergency", "Scheduled", "Priority", "Standard", "Special", "Tactical"
]

NETWORK_NAMES = [
    "Reconnaissance Phase", "Preparation Phase", "Execution Phase", 
    "Support Operations", "Logistics Phase", "Defense Operations",
    "Training Phase", "Maintenance Cycle", "Development Phase",
    "Intelligence Operations", "Tactical Phase", "Strategic Planning"
]

ROLES = [
    "Lead Technician", "Support Crew", "Pilot", "Coordinator", 
    "Analyst", "Specialist", "Operator", "Commander", "Assistant",
    "Chief Engineer", "Tactical Officer", "Communications Officer"
]

def generate_operation_name():
    """Generate a unique operation name."""
    return f"{random.choice(OPERATION_PREFIXES)} {random.choice(OPERATION_TEMPLATES)}"

def generate_time_range(project_start, project_end, duration_hours):
    """Generate a random time range within project bounds."""
    project_start_dt = datetime.fromisoformat(project_start)
    project_end_dt = datetime.fromisoformat(project_end)
    
    # Random start within project timeline (leaving room for operation duration)
    max_start = project_end_dt - timedelta(hours=duration_hours)
    if max_start <= project_start_dt:
        max_start = project_start_dt + timedelta(days=1)
    
    time_span = (max_start - project_start_dt).total_seconds()
    random_offset = random.uniform(0, time_span)
    
    start_time = project_start_dt + timedelta(seconds=random_offset)
    end_time = start_time + timedelta(hours=duration_hours)
    
    return (
        start_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
        end_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    )

def get_employees_for_resource(conn, resource_id):
    """Get all employees for a given resource."""
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM mitarbeiter WHERE ressourcen_id = ? AND aktiv = 1",
        (resource_id,)
    )
    return [row[0] for row in cursor.fetchall()]

def find_non_overlapping_slot(conn, resource_id, project_start, project_end, duration_hours, max_attempts=50):
    """Find a time slot that doesn't overlap with existing operations on the resource."""
    cursor = conn.cursor()
    
    for _ in range(max_attempts):
        start_str, end_str = generate_time_range(project_start, project_end, duration_hours)
        
        # Check for overlaps
        cursor.execute("""
            SELECT COUNT(*) FROM vorgaenge 
            WHERE ressourcen_id = ? 
            AND ? < ende_zeit 
            AND start_zeit < ?
        """, (resource_id, start_str, end_str))
        
        count = cursor.fetchone()[0]
        if count == 0:
            return start_str, end_str
    
    # If we can't find a non-overlapping slot, just return a slot anyway
    # (might happen with very crowded schedules)
    return generate_time_range(project_start, project_end, duration_hours)

def create_database(db_path):
    """Create and populate the database."""
    print(f"Creating database at {db_path}")
    
    # Remove existing database
    if db_path.exists():
        db_path.unlink()
    
    conn = sqlite3.connect(db_path)
    conn.isolation_level = None  # Autocommit mode
    cursor = conn.cursor()
    
    # Enable foreign keys and WAL mode
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute("PRAGMA journal_mode = WAL")
    cursor.execute("PRAGMA synchronous = NORMAL")
    
    # Execute schema
    print("Executing schema...")
    schema_path = db_path.parent / 'projekt_netzplan_schema_sqlite.sql'
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    # Remove PRAGMA statements and transaction control from schema
    import re
    schema_sql = re.sub(r'PRAGMA\s+\w+\s*=\s*\w+;', '', schema_sql)
    schema_sql = re.sub(r'BEGIN TRANSACTION;', '', schema_sql)
    schema_sql = re.sub(r'COMMIT;', '', schema_sql)
    
    cursor.executescript(schema_sql)
    
    # Execute seed data (facilities, resources, employees, projects)
    print("Loading seed data...")
    seed_path = db_path.parent / 'seed.sql'
    with open(seed_path, 'r', encoding='utf-8') as f:
        seed_sql = f.read()
    cursor.executescript(seed_sql)
    
    # Get all projects
    cursor.execute("SELECT id, code, name, start_geplant, ende_geplant FROM projekte ORDER BY id")
    projects = cursor.fetchall()
    
    # Get all resources
    cursor.execute("SELECT id, standort_id FROM ressourcen ORDER BY id")
    resources = cursor.fetchall()
    resource_ids = [r[0] for r in resources]
    
    print(f"\nGenerating networks and operations for {len(projects)} projects...")
    
    operation_id = 1
    network_id = 1
    relationship_id = 1
    assignment_id = 1
    
    status_options = ['geplant', 'in_arbeit', 'abgeschlossen', 'pausiert']
    relationship_types = ['FS', 'SS', 'FF', 'SF']
    
    for proj_idx, (proj_id, proj_code, proj_name, proj_start, proj_end) in enumerate(projects, 1):
        print(f"  Project {proj_idx}/{len(projects)}: {proj_code}")
        
        # Generate 3-4 networks per project
        num_networks = random.randint(3, 4)
        project_networks = []
        
        for net_idx in range(num_networks):
            net_code = f"NP-{net_idx + 1:02d}"
            net_name = random.choice(NETWORK_NAMES)
            
            cursor.execute(
                "INSERT INTO netzplaene (id, projekt_id, code, name, beschreibung) VALUES (?, ?, ?, ?, ?)",
                (network_id, proj_id, net_code, net_name, f"{net_name} for {proj_name}")
            )
            
            # Generate 20-30 operations per network
            num_operations = random.randint(20, 30)
            network_operations = []
            
            for op_idx in range(num_operations):
                op_code = f"OP-{op_idx + 1:03d}"
                op_name = generate_operation_name()
                
                # Random resource
                resource_id = random.choice(resource_ids)
                
                # Random duration between 2 and 48 hours
                duration = random.uniform(2, 48)
                
                # Find non-overlapping time slot
                start_time, end_time = find_non_overlapping_slot(
                    conn, resource_id, proj_start, proj_end, duration
                )
                
                # Random progress and status
                progress = random.uniform(0, 100)
                status = random.choice(status_options)
                
                cursor.execute("""
                    INSERT INTO vorgaenge 
                    (id, netzplan_id, ressourcen_id, code, name, start_zeit, ende_zeit, 
                     fortschritt_pct, status, beschreibung)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    operation_id, network_id, resource_id, op_code, op_name,
                    start_time, end_time, progress, status,
                    f"{op_name} as part of {net_name}"
                ))
                
                network_operations.append(operation_id)
                
                # Assign 1-3 employees from the resource to this operation
                employees = get_employees_for_resource(conn, resource_id)
                if employees:
                    num_assignments = min(random.randint(1, 3), len(employees))
                    assigned_employees = random.sample(employees, num_assignments)
                    
                    for emp_id in assigned_employees:
                        role = random.choice(ROLES)
                        capacity = random.uniform(25, 100)
                        
                        cursor.execute("""
                            INSERT INTO zuweisungen 
                            (id, vorgang_id, mitarbeiter_id, rolle, anteil_pct)
                            VALUES (?, ?, ?, ?, ?)
                        """, (assignment_id, operation_id, emp_id, role, capacity))
                        
                        assignment_id += 1
                
                operation_id += 1
            
            # Create relationships between operations in this network
            # Each operation has 1-3 predecessors (except the first few)
            for i, op_id in enumerate(network_operations):
                if i > 0:  # Skip first operation (no predecessors)
                    num_predecessors = min(random.randint(1, 3), i)
                    # Choose from earlier operations
                    possible_predecessors = network_operations[:i]
                    predecessors = random.sample(possible_predecessors, num_predecessors)
                    
                    for pred_id in predecessors:
                        rel_type = random.choice(relationship_types)
                        # Random buffer between 0 and 24 hours
                        buffer_hours = random.randint(0, 24)
                        buffer_str = f"PT{buffer_hours}H"
                        
                        cursor.execute("""
                            INSERT INTO anordnungsbeziehungen 
                            (id, vorgaenger_id, nachfolger_id, typ, puffer, bemerkung)
                            VALUES (?, ?, ?, ?, ?, ?)
                        """, (
                            relationship_id, pred_id, op_id, rel_type, buffer_str,
                            f"{rel_type} relationship with {buffer_hours}h buffer"
                        ))
                        
                        relationship_id += 1
            
            project_networks.append(network_id)
            network_id += 1
    
    conn.commit()
    
    # Print statistics
    cursor.execute("SELECT COUNT(*) FROM projekte")
    print(f"\n✓ Projects: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM netzplaene")
    print(f"✓ Networks: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM vorgaenge")
    print(f"✓ Operations: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM anordnungsbeziehungen")
    print(f"✓ Relationships: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM zuweisungen")
    print(f"✓ Assignments: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM mitarbeiter WHERE aktiv = 1")
    print(f"✓ Active Employees: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM ressourcen")
    print(f"✓ Resources: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM standorte")
    print(f"✓ Facilities: {cursor.fetchone()[0]}")
    
    conn.close()
    print(f"\n✓ Database created successfully at {db_path}")

if __name__ == '__main__':
    # Determine database path
    script_dir = Path(__file__).parent
    db_path = script_dir / 'projekt_netzplan.db'
    
    create_database(db_path)
    print("\nMay the Force be with you! 🚀")
