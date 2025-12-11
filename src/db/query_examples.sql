-- ============================================================================
-- Query Examples for Star Wars Project Database
-- Common queries for exploring and analyzing the data
-- ============================================================================

-- ============================================================================
-- BASIC QUERIES
-- ============================================================================

-- List all facilities with resource counts
SELECT 
    s.code,
    s.name as facility,
    COUNT(r.id) as resource_count
FROM standorte s
LEFT JOIN ressourcen r ON r.standort_id = s.id
GROUP BY s.id;

-- List all projects with date ranges
SELECT 
    code,
    name,
    start_geplant,
    ende_geplant,
    JULIANDAY(ende_geplant) - JULIANDAY(start_geplant) as duration_days
FROM projekte
ORDER BY start_geplant;

-- View all employees with their resources and facilities
SELECT 
    m.vorname || ' ' || m.nachname as employee,
    m.email,
    r.name as resource,
    s.name as facility
FROM mitarbeiter m
JOIN ressourcen r ON r.id = m.ressourcen_id
JOIN standorte s ON s.id = r.standort_id
WHERE m.aktiv = 1
ORDER BY s.name, r.name, m.nachname;

-- ============================================================================
-- PROJECT ANALYSIS
-- ============================================================================

-- Project overview with network and operation counts
SELECT 
    p.code,
    p.name,
    COUNT(DISTINCT n.id) as networks,
    COUNT(DISTINCT v.id) as operations,
    p.start_geplant,
    p.ende_geplant
FROM projekte p
LEFT JOIN netzplaene n ON n.projekt_id = p.id
LEFT JOIN vorgaenge v ON v.netzplan_id = n.id
GROUP BY p.id
ORDER BY p.start_geplant;

-- Operations by status across all projects
SELECT 
    v.status,
    COUNT(*) as count,
    ROUND(AVG(v.fortschritt_pct), 2) as avg_progress
FROM vorgaenge v
GROUP BY v.status
ORDER BY count DESC;

-- ============================================================================
-- NETWORK PLANNING
-- ============================================================================

-- Detailed view of operations for a specific project (use project code)
SELECT 
    p.code as project,
    n.code as network,
    v.code as operation,
    v.name,
    v.start_zeit,
    v.ende_zeit,
    v.status,
    v.fortschritt_pct,
    r.name as resource
FROM vorgaenge v
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
JOIN ressourcen r ON r.id = v.ressourcen_id
WHERE p.code = 'DS1-RECON'
ORDER BY n.code, v.start_zeit;

-- Operation dependencies (predecessor/successor relationships)
SELECT 
    p.code as project,
    n.code as network,
    v1.code || ': ' || v1.name as predecessor,
    a.typ as relationship_type,
    a.puffer as buffer,
    v2.code || ': ' || v2.name as successor
FROM anordnungsbeziehungen a
JOIN vorgaenge v1 ON v1.id = a.vorgaenger_id
JOIN vorgaenge v2 ON v2.id = a.nachfolger_id
JOIN netzplaene n ON n.id = v1.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
WHERE p.code = 'DS1-RECON'
ORDER BY n.code, v1.start_zeit;

-- Find critical path candidates (operations with most dependencies)
SELECT 
    v.code,
    v.name,
    COUNT(DISTINCT a1.id) as predecessors,
    COUNT(DISTINCT a2.id) as successors,
    COUNT(DISTINCT a1.id) + COUNT(DISTINCT a2.id) as total_dependencies
FROM vorgaenge v
LEFT JOIN anordnungsbeziehungen a1 ON a1.nachfolger_id = v.id
LEFT JOIN anordnungsbeziehungen a2 ON a2.vorgaenger_id = v.id
WHERE v.netzplan_id = 1
GROUP BY v.id
ORDER BY total_dependencies DESC
LIMIT 10;

-- ============================================================================
-- RESOURCE MANAGEMENT
-- ============================================================================

-- Resource utilization overview
SELECT 
    s.name as facility,
    r.code,
    r.name as resource,
    COUNT(v.id) as total_operations,
    COUNT(CASE WHEN v.status = 'in_arbeit' THEN 1 END) as active_operations,
    COUNT(CASE WHEN v.status = 'geplant' THEN 1 END) as planned_operations
FROM ressourcen r
JOIN standorte s ON s.id = r.standort_id
LEFT JOIN vorgaenge v ON v.ressourcen_id = r.id
GROUP BY r.id
ORDER BY total_operations DESC;

-- Find resource conflicts (should be none due to triggers)
SELECT 
    r.name as resource,
    v1.code as op1,
    v1.start_zeit as op1_start,
    v1.ende_zeit as op1_end,
    v2.code as op2,
    v2.start_zeit as op2_start,
    v2.ende_zeit as op2_end
FROM vorgaenge v1
JOIN vorgaenge v2 ON v1.ressourcen_id = v2.ressourcen_id AND v1.id < v2.id
JOIN ressourcen r ON r.id = v1.ressourcen_id
WHERE v1.start_zeit < v2.ende_zeit AND v2.start_zeit < v1.ende_zeit;

-- Resource timeline for a specific resource
SELECT 
    v.code,
    v.name,
    v.start_zeit,
    v.ende_zeit,
    ROUND((JULIANDAY(v.ende_zeit) - JULIANDAY(v.start_zeit)) * 24, 2) as duration_hours,
    v.status,
    p.code as project
FROM vorgaenge v
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
WHERE v.ressourcen_id = 1
ORDER BY v.start_zeit;

-- ============================================================================
-- EMPLOYEE WORKLOAD
-- ============================================================================

-- Employee workload summary
SELECT 
    m.vorname || ' ' || m.nachname as employee,
    r.name as resource,
    COUNT(z.id) as total_assignments,
    ROUND(AVG(z.anteil_pct), 2) as avg_capacity_pct,
    COUNT(DISTINCT n.projekt_id) as projects_involved
FROM mitarbeiter m
LEFT JOIN zuweisungen z ON z.mitarbeiter_id = m.id
LEFT JOIN vorgaenge v ON v.id = z.vorgang_id
LEFT JOIN netzplaene n ON n.id = v.netzplan_id
JOIN ressourcen r ON r.id = m.ressourcen_id
WHERE m.aktiv = 1
GROUP BY m.id
ORDER BY total_assignments DESC;

-- Find overloaded employees (assigned to many concurrent operations)
SELECT 
    m.vorname || ' ' || m.nachname as employee,
    COUNT(DISTINCT z.id) as concurrent_ops,
    v.start_zeit,
    v.ende_zeit
FROM mitarbeiter m
JOIN zuweisungen z1 ON z1.mitarbeiter_id = m.id
JOIN vorgaenge v ON v.id = z1.vorgang_id
JOIN zuweisungen z ON z.mitarbeiter_id = m.id
JOIN vorgaenge v2 ON v2.id = z.vorgang_id
WHERE v2.start_zeit < v.ende_zeit 
  AND v.start_zeit < v2.ende_zeit
  AND m.aktiv = 1
GROUP BY m.id, v.start_zeit, v.ende_zeit
HAVING concurrent_ops > 5
ORDER BY concurrent_ops DESC;

-- Employee role distribution
SELECT 
    z.rolle as role,
    COUNT(*) as assignments,
    COUNT(DISTINCT z.mitarbeiter_id) as unique_employees
FROM zuweisungen z
GROUP BY z.rolle
ORDER BY assignments DESC;

-- ============================================================================
-- TIME-BASED ANALYSIS
-- ============================================================================

-- Operations by month (2025-2027)
SELECT 
    STRFTIME('%Y-%m', v.start_zeit) as month,
    COUNT(*) as operations_starting,
    COUNT(DISTINCT v.netzplan_id) as active_networks,
    COUNT(DISTINCT n.projekt_id) as active_projects
FROM vorgaenge v
JOIN netzplaene n ON n.id = v.netzplan_id
GROUP BY month
ORDER BY month;

-- Busiest resources by time period
SELECT 
    r.name as resource,
    STRFTIME('%Y-%m', v.start_zeit) as month,
    COUNT(*) as operations
FROM vorgaenge v
JOIN ressourcen r ON r.id = v.ressourcen_id
GROUP BY r.id, month
ORDER BY operations DESC
LIMIT 20;

-- Project timeline with operation counts
SELECT 
    p.code,
    p.name,
    p.start_geplant,
    p.ende_geplant,
    COUNT(v.id) as total_operations,
    MIN(v.start_zeit) as first_op_start,
    MAX(v.ende_zeit) as last_op_end
FROM projekte p
LEFT JOIN netzplaene n ON n.projekt_id = p.id
LEFT JOIN vorgaenge v ON v.netzplan_id = n.id
GROUP BY p.id
ORDER BY p.start_geplant;

-- ============================================================================
-- STAR WARS THEMED QUERIES
-- ============================================================================

-- X-Wing Squadron missions
SELECT 
    v.code,
    v.name,
    v.start_zeit,
    v.status,
    p.name as project
FROM vorgaenge v
JOIN ressourcen r ON r.id = v.ressourcen_id
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
WHERE r.code = 'XWING-A1'
ORDER BY v.start_zeit;

-- Luke Skywalker's assignments
SELECT 
    v.code,
    v.name as operation,
    p.name as project,
    z.rolle as role,
    v.start_zeit,
    v.ende_zeit,
    v.status
FROM zuweisungen z
JOIN mitarbeiter m ON m.id = z.mitarbeiter_id
JOIN vorgaenge v ON v.id = z.vorgang_id
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
WHERE m.vorname = 'Luke' AND m.nachname = 'Skywalker'
ORDER BY v.start_zeit;

-- Death Star related projects
SELECT 
    code,
    name,
    beschreibung,
    start_geplant,
    ende_geplant
FROM projekte
WHERE name LIKE '%Death Star%'
ORDER BY start_geplant;

-- Hoth base operations overview
SELECT 
    r.name as resource,
    COUNT(v.id) as operations,
    COUNT(DISTINCT m.id) as assigned_employees
FROM ressourcen r
JOIN standorte s ON s.id = r.standort_id
LEFT JOIN vorgaenge v ON v.ressourcen_id = r.id
LEFT JOIN zuweisungen z ON z.vorgang_id = v.id
LEFT JOIN mitarbeiter m ON m.id = z.mitarbeiter_id
WHERE s.code = 'HOTH'
GROUP BY r.id
ORDER BY operations DESC;

-- ============================================================================
-- QUALITY CHECKS
-- ============================================================================

-- Check for operations without assignments
SELECT 
    p.code as project,
    n.code as network,
    v.code as operation,
    v.name
FROM vorgaenge v
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
LEFT JOIN zuweisungen z ON z.vorgang_id = v.id
WHERE z.id IS NULL;

-- Verify all employees are assigned to operations
SELECT 
    m.vorname || ' ' || m.nachname as employee,
    r.name as resource,
    COUNT(z.id) as assignments
FROM mitarbeiter m
JOIN ressourcen r ON r.id = m.ressourcen_id
LEFT JOIN zuweisungen z ON z.mitarbeiter_id = m.id
WHERE m.aktiv = 1
GROUP BY m.id
HAVING assignments = 0;

-- Check relationship type distribution
SELECT 
    typ as relationship_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM anordnungsbeziehungen), 2) as percentage
FROM anordnungsbeziehungen
GROUP BY typ
ORDER BY count DESC;
