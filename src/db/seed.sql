-- ============================================================================
-- Datei: seed.sql
-- Zweck: Star Wars themed sample data for projekt_netzplan database
-- 50 Projects (01.01.2025 - 01.01.2027)
-- 2 Facilities with 10 resources each
-- Realistic employee assignments
-- ============================================================================

BEGIN TRANSACTION;

-- ----------------------------------------
-- Standorte (Facilities) - Star Wars Locations
-- ----------------------------------------
INSERT INTO standorte (id, code, name, beschreibung) VALUES
(1, 'YAVIN', 'Yavin IV Base', 'Rebel Alliance primary operations center'),
(2, 'HOTH', 'Echo Base Hoth', 'Hidden Rebel outpost in ice planet');

-- ----------------------------------------
-- Ressourcen (Resources) - Star Wars Equipment/Stations
-- ----------------------------------------
-- Yavin IV Resources
INSERT INTO ressourcen (id, standort_id, code, name, kapazitaet, beschreibung) VALUES
(1, 1, 'XWING-A1', 'X-Wing Squadron Alpha', 5, 'Primary fighter squadron'),
(2, 1, 'YWING-B1', 'Y-Wing Squadron Beta', 4, 'Bomber squadron'),
(3, 1, 'HANGAR-01', 'Main Hangar Bay', 10, 'Primary maintenance facility'),
(4, 1, 'COMM-CTR', 'Communications Center', 8, 'Strategic communications hub'),
(5, 1, 'MED-BAY', 'Medical Bay', 6, 'Medical treatment facility'),
(6, 1, 'ENG-SHOP', 'Engineering Workshop', 8, 'Technical development center'),
(7, 1, 'DROID-SVC', 'Droid Service Station', 5, 'Droid maintenance and repair'),
(8, 1, 'INTEL-CTR', 'Intelligence Center', 6, 'Intelligence gathering and analysis'),
(9, 1, 'TRAIN-GRD', 'Training Grounds', 12, 'Combat and flight training'),
(10, 1, 'SUPPLY-WH', 'Supply Warehouse', 8, 'Logistics and supply management');

-- Hoth Resources
INSERT INTO ressourcen (id, standort_id, code, name, kapazitaet, beschreibung) VALUES
(11, 2, 'SNOWSP-S1', 'Snowspeeder Squadron', 6, 'Cold weather fighter squadron'),
(12, 2, 'SHIELD-GEN', 'Shield Generator Station', 8, 'Planetary shield operations'),
(13, 2, 'ICE-HANGAR', 'Ice Hangar', 10, 'Underground hangar facility'),
(14, 2, 'CMD-CTR', 'Command Center', 10, 'Strategic command operations'),
(15, 2, 'SENSOR-AR', 'Sensor Array', 5, 'Long-range detection system'),
(16, 2, 'PWR-GEN', 'Power Generator', 6, 'Base power generation'),
(17, 2, 'EVAC-BAY', 'Evacuation Bay', 8, 'Emergency evacuation coordination'),
(18, 2, 'TAUNTAUN-S', 'Tauntaun Stables', 4, 'Ground transport operations'),
(19, 2, 'ICE-TUNNEL', 'Ice Tunnel Construction', 7, 'Base expansion operations'),
(20, 2, 'DEFENSE-T', 'Defense Turrets', 6, 'Perimeter defense systems');

-- ----------------------------------------
-- Mitarbeiter (Employees) - Star Wars Characters
-- ----------------------------------------
-- Yavin IV Staff
INSERT INTO mitarbeiter (id, ressourcen_id, vorname, nachname, email, eingestellt_am, aktiv) VALUES
-- X-Wing Squadron
(1, 1, 'Luke', 'Skywalker', 'luke.skywalker@rebellion.org', '2024-01-15', 1),
(2, 1, 'Wedge', 'Antilles', 'wedge.antilles@rebellion.org', '2023-06-10', 1),
(3, 1, 'Biggs', 'Darklighter', 'biggs.darklighter@rebellion.org', '2024-02-01', 1),
(4, 1, 'Jek', 'Porkins', 'jek.porkins@rebellion.org', '2024-01-20', 1),
-- Y-Wing Squadron
(5, 2, 'Jon', 'Vander', 'jon.vander@rebellion.org', '2023-08-15', 1),
(6, 2, 'Davish', 'Krail', 'davish.krail@rebellion.org', '2023-09-01', 1),
(7, 2, 'Keyan', 'Farlander', 'keyan.farlander@rebellion.org', '2024-03-10', 1),
-- Main Hangar
(8, 3, 'Chief', 'Bren Derlin', 'bren.derlin@rebellion.org', '2023-05-01', 1),
(9, 3, 'Toryn', 'Farr', 'toryn.farr@rebellion.org', '2023-07-15', 1),
(10, 3, 'Elyhek', 'Rue', 'elyhek.rue@rebellion.org', '2024-01-05', 1),
(11, 3, 'Barlon', 'Hightower', 'barlon.hightower@rebellion.org', '2023-11-20', 1),
-- Communications
(12, 4, 'Princess Leia', 'Organa', 'leia.organa@rebellion.org', '2023-01-10', 1),
(13, 4, 'Mon', 'Mothma', 'mon.mothma@rebellion.org', '2022-12-01', 1),
(14, 4, 'Admiral', 'Ackbar', 'gial.ackbar@rebellion.org', '2023-02-15', 1),
(15, 4, 'Crix', 'Madine', 'crix.madine@rebellion.org', '2023-04-20', 1),
-- Medical Bay
(16, 5, 'Dr. Evazan', 'Reformed', 'evazan@rebellion.org', '2024-06-01', 1),
(17, 5, 'Nurse', 'Hestia', 'hestia@rebellion.org', '2023-10-15', 1),
(18, 5, 'Medic', 'Kade', 'kade@rebellion.org', '2024-02-20', 1),
-- Engineering
(19, 6, 'Chief', 'Engineer Vanden', 'vanden@rebellion.org', '2023-03-01', 1),
(20, 6, 'Tech', 'Specialist Raan', 'raan@rebellion.org', '2023-08-20', 1),
(21, 6, 'Systems', 'Expert Thane', 'thane@rebellion.org', '2024-01-15', 1),
(22, 6, 'Weapons', 'Tech Kalonia', 'kalonia@rebellion.org', '2023-12-01', 1),
-- Droid Service
(23, 7, 'R2', 'Unit-D2', 'r2d2@rebellion.org', '2023-01-01', 1),
(24, 7, 'C', '3PO', 'c3po@rebellion.org', '2023-01-01', 1),
(25, 7, 'Droid Tech', 'Huyang', 'huyang@rebellion.org', '2023-05-10', 1),
-- Intelligence
(26, 8, 'General', 'Dodonna', 'jan.dodonna@rebellion.org', '2023-01-05', 1),
(27, 8, 'Intel Officer', 'Braylen', 'braylen@rebellion.org', '2023-06-15', 1),
(28, 8, 'Analyst', 'Korr Sella', 'korr.sella@rebellion.org', '2023-09-20', 1),
-- Training
(29, 9, 'Flight Instructor', 'Narra', 'narra@rebellion.org', '2023-02-01', 1),
(30, 9, 'Combat Trainer', 'Tycho Celchu', 'tycho.celchu@rebellion.org', '2023-04-15', 1),
(31, 9, 'Tactical Officer', 'Carlist Rieekan', 'carlist.rieekan@rebellion.org', '2023-03-10', 1),
(32, 9, 'Simulator Tech', 'Hobbie Klivian', 'hobbie.klivian@rebellion.org', '2023-07-01', 1),
-- Supply
(33, 10, 'Quartermaster', 'Vanden Willard', 'vanden.willard@rebellion.org', '2023-01-15', 1),
(34, 10, 'Logistics Officer', 'Hera Syndulla', 'hera.syndulla@rebellion.org', '2023-02-20', 1),
(35, 10, 'Supply Tech', 'Sabine Wren', 'sabine.wren@rebellion.org', '2023-05-15', 1);

-- Hoth Staff
INSERT INTO mitarbeiter (id, ressourcen_id, vorname, nachname, email, eingestellt_am, aktiv) VALUES
-- Snowspeeder Squadron
(36, 11, 'Commander', 'Skywalker', 'luke.commander@rebellion.org', '2024-06-01', 1),
(37, 11, 'Dack', 'Ralter', 'dack.ralter@rebellion.org', '2024-06-15', 1),
(38, 11, 'Zev', 'Senesca', 'zev.senesca@rebellion.org', '2024-07-01', 1),
(39, 11, 'Derek', 'Klivian', 'derek.klivian@rebellion.org', '2024-06-20', 1),
-- Shield Generator
(40, 12, 'Shield Tech', 'Toryn Farr', 'toryn.farr.hoth@rebellion.org', '2024-05-15', 1),
(41, 12, 'Generator Chief', 'Cal Alder', 'cal.alder@rebellion.org', '2024-06-01', 1),
(42, 12, 'Power Systems', 'Trey Callum', 'trey.callum@rebellion.org', '2024-06-10', 1),
-- Ice Hangar
(43, 13, 'Hangar Chief', 'Zal Dinnes', 'zal.dinnes@rebellion.org', '2024-05-20', 1),
(44, 13, 'Maintenance', 'Shawn Valdez', 'shawn.valdez@rebellion.org', '2024-06-05', 1),
(45, 13, 'Tech', 'Dorn Haslip', 'dorn.haslip@rebellion.org', '2024-06-15', 1),
-- Command Center
(46, 14, 'General', 'Rieekan', 'carlist.rieekan.cmd@rebellion.org', '2024-05-10', 1),
(47, 14, 'Major', 'Bren Derlin', 'bren.derlin.cmd@rebellion.org', '2024-05-15', 1),
(48, 14, 'Captain', 'Han Solo', 'han.solo@rebellion.org', '2024-07-01', 1),
(49, 14, 'Officer', 'Leia Organa', 'leia.organa.cmd@rebellion.org', '2024-05-10', 1),
-- Sensor Array
(50, 15, 'Sensor Chief', 'Toryn Farr', 'toryn.farr.sensor@rebellion.org', '2024-05-25', 1),
(51, 15, 'Tech', 'Tigran Jamiro', 'tigran.jamiro@rebellion.org', '2024-06-10', 1),
-- Power Generator
(52, 16, 'Power Chief', 'K-3PO', 'k3po@rebellion.org', '2024-05-15', 1),
(53, 16, 'Engineer', 'Jes Gistang', 'jes.gistang@rebellion.org', '2024-06-01', 1),
-- Evacuation Bay
(54, 17, 'Evac Coordinator', 'Cesi Eirriss', 'cesi.eirriss@rebellion.org', '2024-05-20', 1),
(55, 17, 'Flight Ops', 'Wes Janson', 'wes.janson@rebellion.org', '2024-06-15', 1),
-- Tauntaun Stables
(56, 18, 'Tauntaun Handler', 'Han Solo', 'han.solo.tauntaun@rebellion.org', '2024-06-01', 1),
(57, 18, 'Scout Leader', 'Olin Garn', 'olin.garn@rebellion.org', '2024-06-20', 1),
-- Ice Tunnel
(58, 19, 'Construction Chief', 'Harns Gluffe', 'harns.gluffe@rebellion.org', '2024-05-10', 1),
(59, 19, 'Engineer', 'Tarn Mison', 'tarn.mison@rebellion.org', '2024-05-25', 1),
-- Defense Turrets
(60, 20, 'Defense Chief', 'Beryl Chiffonage', 'beryl.chiffonage@rebellion.org', '2024-05-15', 1),
(61, 20, 'Gunner', 'Wes Janson', 'wes.janson.gunner@rebellion.org', '2024-06-01', 1);

-- ----------------------------------------
-- Projekte (Projects) - 50 Star Wars Missions
-- ----------------------------------------
INSERT INTO projekte (id, code, name, beschreibung, start_geplant, ende_geplant) VALUES
(1, 'DS1-RECON', 'Death Star I Reconnaissance', 'Initial surveillance mission of the Empire superweapon', '2025-01-15', '2025-03-20'),
(2, 'SCARIF-PLANS', 'Scarif Data Retrieval', 'Obtain Death Star technical readouts', '2025-02-01', '2025-04-15'),
(3, 'YAVIN-DEF', 'Yavin IV Defense Preparation', 'Fortify main base defenses', '2025-01-10', '2025-05-30'),
(4, 'TRENCH-RUN', 'Death Star Assault Planning', 'Strategic planning for direct assault', '2025-03-01', '2025-05-15'),
(5, 'FLEET-REBUILD', 'Fleet Reconstruction Alpha', 'Rebuild starfighter squadrons', '2025-04-01', '2025-08-30'),
(6, 'HOTH-SETUP', 'Echo Base Establishment', 'Construct and fortify ice base', '2025-05-01', '2025-09-15'),
(7, 'SUPPLY-LINE-1', 'Supply Route Gamma Establishment', 'Secure supply corridors', '2025-03-15', '2025-07-20'),
(8, 'INTEL-NET-1', 'Intelligence Network Expansion', 'Deploy undercover operatives', '2025-02-20', '2025-06-30'),
(9, 'PILOT-TRAIN-1', 'Advanced Flight Training Program', 'Train new pilots on X-Wing tactics', '2025-03-10', '2025-07-15'),
(10, 'DROID-UPGRADE', 'Droid Systems Enhancement', 'Upgrade astromech capabilities', '2025-04-15', '2025-08-20'),
(11, 'COMM-SECURE', 'Communications Security Overhaul', 'Implement encrypted channels', '2025-05-01', '2025-09-30'),
(12, 'MED-EXPAND', 'Medical Facilities Expansion', 'Increase treatment capacity', '2025-06-01', '2025-10-15'),
(13, 'WEAPON-DEV-1', 'Advanced Weapons Development', 'Research improved laser systems', '2025-06-15', '2025-12-20'),
(14, 'SHIELD-TECH', 'Portable Shield Technology', 'Develop mobile shield generators', '2025-07-01', '2025-11-30'),
(15, 'SCOUT-MISSION-1', 'Outer Rim Scouting', 'Search for new base locations', '2025-08-01', '2025-12-15'),
(16, 'ALLIANCE-DIPLO', 'Diplomatic Outreach Campaign', 'Recruit new systems to Alliance', '2025-08-15', '2026-01-30'),
(17, 'FLEET-REORG', 'Fleet Reorganization Initiative', 'Optimize squadron assignments', '2025-09-01', '2026-02-28'),
(18, 'HOTH-SHIELD', 'Planetary Shield Installation', 'Deploy theater shield technology', '2025-10-01', '2026-03-15'),
(19, 'ICE-TUNNEL-EXP', 'Ice Tunnel Expansion Project', 'Extend underground facilities', '2025-10-15', '2026-04-30'),
(20, 'EVAC-DRILL-1', 'Emergency Evacuation Protocol', 'Train and prepare evacuation procedures', '2025-11-01', '2026-02-15'),
(21, 'SUPPLY-LINE-2', 'Supply Route Delta Establishment', 'Alternate supply chain development', '2025-11-15', '2026-05-20'),
(22, 'INTEL-NET-2', 'Deep Cover Operations', 'Infiltrate Imperial installations', '2025-12-01', '2026-06-30'),
(23, 'SNOWSPEEDER-MOD', 'Snowspeeder Combat Modification', 'Adapt speeders for anti-walker combat', '2026-01-01', '2026-04-15'),
(24, 'PROBE-DEFENSE', 'Probe Droid Detection System', 'Early warning network deployment', '2026-01-15', '2026-05-30'),
(25, 'PILOT-TRAIN-2', 'Cold Weather Flight Training', 'Hoth environment pilot training', '2026-02-01', '2026-06-15'),
(26, 'TURRET-UPGRADE', 'Defense Turret Enhancement', 'Upgrade perimeter weapons', '2026-02-15', '2026-07-20'),
(27, 'TAUNTAUN-BREED', 'Tauntaun Breeding Program', 'Expand ground transport capability', '2026-03-01', '2026-08-30'),
(28, 'POWER-BACKUP', 'Backup Power Systems', 'Install redundant generators', '2026-03-15', '2026-08-15'),
(29, 'SENSOR-UPGRADE', 'Long-Range Sensor Array', 'Enhanced detection capability', '2026-04-01', '2026-09-30'),
(30, 'TRANSPORT-OPS', 'Transport Operations Expansion', 'Increase evacuation capacity', '2026-04-15', '2026-10-15'),
(31, 'INTEL-NET-3', 'Imperial Fleet Tracking', 'Monitor Imperial ship movements', '2026-05-01', '2026-11-30'),
(32, 'WEAPON-DEV-2', 'Ion Cannon Development', 'Anti-capital ship weapon system', '2026-05-15', '2026-12-20'),
(33, 'FLEET-REBUILD-2', 'Fleet Reconstruction Beta', 'Replace combat losses', '2026-06-01', '2026-11-15'),
(34, 'MEDICAL-TRAIN', 'Field Medic Training Program', 'Advanced trauma care training', '2026-06-15', '2026-10-30'),
(35, 'SUPPLY-LINE-3', 'Covert Supply Network', 'Smuggler route coordination', '2026-07-01', '2026-12-31'),
(36, 'DROID-UPGRADE-2', 'Protocol Droid Enhancement', 'Improve translation capabilities', '2026-07-15', '2026-11-20'),
(37, 'HOTH-FORTIFY', 'Additional Fortification', 'Strengthen defensive positions', '2026-08-01', '2027-01-15'),
(38, 'SCOUT-MISSION-2', 'Bespin Diplomatic Mission', 'Establish relations with Cloud City', '2026-08-15', '2026-12-30'),
(39, 'COMM-RELAY', 'Communications Relay Network', 'Long-distance comm infrastructure', '2026-09-01', '2027-01-31'),
(40, 'PILOT-TRAIN-3', 'Escort Flight Tactics', 'Transport protection training', '2026-09-15', '2027-02-28'),
(41, 'HANGAR-EXPAND', 'Hangar Bay Expansion', 'Increase fighter capacity', '2026-10-01', '2027-03-15'),
(42, 'INTEL-NET-4', 'Death Star II Intelligence', 'Gather intel on new superweapon', '2026-10-15', '2027-04-30'),
(43, 'FLEET-REORG-2', 'Task Force Restructuring', 'Form specialized units', '2026-11-01', '2027-03-30'),
(44, 'EVAC-DRILL-2', 'Rapid Evacuation Exercise', 'Speed evacuation procedures', '2026-11-15', '2027-02-15'),
(45, 'SHIELD-MAINTAIN', 'Shield Generator Maintenance', 'Preventive maintenance program', '2026-12-01', '2027-04-15'),
(46, 'SUPPLY-CACHE', 'Emergency Supply Cache', 'Establish hidden supply depots', '2026-12-15', '2027-05-30'),
(47, 'WEAPON-TRAIN', 'Weapons Systems Training', 'Advanced gunnery program', '2027-01-01', '2027-05-15'),
(48, 'DROID-NET', 'Droid Communication Network', 'Inter-droid coordination system', '2027-01-15', '2027-06-30'),
(49, 'FINAL-PREP', 'Final Defense Preparations', 'Ready all systems for evacuation', '2027-02-01', '2027-06-15'),
(50, 'DS2-INTEL', 'Death Star II Reconnaissance', 'Deep intelligence gathering mission', '2027-02-15', '2027-07-30');

-- ============================================================================
-- Netzpläne und Vorgänge werden in einem Python-Skript generiert
-- Da die Datenmenge sehr groß ist (50 Projekte × 3-4 Netzpläne × 20-30 Vorgänge)
-- Siehe: generate_operations.py
-- ============================================================================

COMMIT;
