
-- ============================================================================
-- Datei: projekt_netzplan_schema_sqlite.sql
-- Zweck: Komplettes SQLite-Schema für Projekte → Netzpläne → Vorgänge und
--        Standorte → Ressourcen → Mitarbeiter inkl. Anordnungsbeziehungen
--        und Zuweisungen. Enthält Integritäts-Trigger für
--        - gleiche Ressource bei Zuweisungen (Mitarbeiter ↔ Vorgang)
--        - Nicht-Überlappung von Vorgängen je Ressource
-- Dialekt: SQLite 3 (empfohlen ≥ 3.31)
-- Hinweis zu Zeitfeldern: Zeiten als ISO‑8601 (UTC) speichern, z. B. "2025-12-15T08:00:00Z".
-- ============================================================================

BEGIN TRANSACTION;

PRAGMA foreign_keys = ON;          -- FK-Prüfung aktivieren (pro Verbindung notwendig)
PRAGMA journal_mode = WAL;         -- optional: bessere Schreib-Performance
PRAGMA synchronous = NORMAL;       -- optional: Performance/Robustheit-Abwägung

-- ----------------------------------------
-- Cleanup (neuaufsetzen): Views / Trigger / Tabellen
-- ----------------------------------------
DROP VIEW IF EXISTS v_vorgang_details;

DROP TRIGGER IF EXISTS trg_zuweisung_selbe_ressource_ins;
DROP TRIGGER IF EXISTS trg_zuweisung_selbe_ressource_upd;
DROP TRIGGER IF EXISTS trg_vorgang_no_overlap_ins;
DROP TRIGGER IF EXISTS trg_vorgang_no_overlap_upd;

DROP TABLE IF EXISTS zuweisungen;
DROP TABLE IF EXISTS anordnungsbeziehungen;
DROP TABLE IF EXISTS vorgaenge;
DROP TABLE IF EXISTS netzplaene;
DROP TABLE IF EXISTS projekte;
DROP TABLE IF EXISTS mitarbeiter;
DROP TABLE IF EXISTS ressourcen;
DROP TABLE IF EXISTS standorte;

-- ----------------------------------------
-- Stammdaten: Standorte, Ressourcen, Mitarbeiter
-- ----------------------------------------
CREATE TABLE standorte (
    id              INTEGER PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    beschreibung    TEXT
);

CREATE TABLE ressourcen (
    id              INTEGER PRIMARY KEY,
    standort_id     INTEGER NOT NULL,
    code            TEXT NOT NULL,
    name            TEXT NOT NULL,
    kapazitaet      INTEGER,               -- optional, derzeit nicht im Trigger berücksichtigt
    beschreibung    TEXT,
    UNIQUE (standort_id, code),
    FOREIGN KEY (standort_id) REFERENCES standorte(id) ON DELETE CASCADE
);
CREATE INDEX idx_ressourcen_standort ON ressourcen(standort_id);

CREATE TABLE mitarbeiter (
    id              INTEGER PRIMARY KEY,
    ressourcen_id   INTEGER NOT NULL,
    vorname         TEXT NOT NULL,
    nachname        TEXT NOT NULL,
    email           TEXT UNIQUE,
    eingestellt_am  TEXT,                  -- ISO-8601 Datum (YYYY-MM-DD) empfohlen
    aktiv           INTEGER NOT NULL DEFAULT 1,  -- 1=true, 0=false
    FOREIGN KEY (ressourcen_id) REFERENCES ressourcen(id) ON DELETE CASCADE
);
CREATE INDEX idx_mitarbeiter_ressource ON mitarbeiter(ressourcen_id);

-- ----------------------------------------
-- Projektstruktur: Projekte, Netzpläne, Vorgänge
-- ----------------------------------------
CREATE TABLE projekte (
    id              INTEGER PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    beschreibung    TEXT,
    start_geplant   TEXT,                  -- ISO-8601 Datum
    ende_geplant    TEXT                   -- ISO-8601 Datum
);

CREATE TABLE netzplaene (
    id              INTEGER PRIMARY KEY,
    projekt_id      INTEGER NOT NULL,
    code            TEXT NOT NULL,
    name            TEXT NOT NULL,
    beschreibung    TEXT,
    UNIQUE (projekt_id, code),
    FOREIGN KEY (projekt_id) REFERENCES projekte(id) ON DELETE CASCADE
);
CREATE INDEX idx_netzplaene_projekt ON netzplaene(projekt_id);

CREATE TABLE vorgaenge (
    id              INTEGER PRIMARY KEY,
    netzplan_id     INTEGER NOT NULL,
    ressourcen_id   INTEGER NOT NULL,
    code            TEXT NOT NULL,
    name            TEXT NOT NULL,
    start_zeit      TEXT NOT NULL,         -- ISO-8601 Zeitstempel (UTC), z. B. 2025-12-15T08:00:00Z
    ende_zeit       TEXT NOT NULL,         -- gleiches Format wie start_zeit
    fortschritt_pct REAL NOT NULL DEFAULT 0.0,   -- 0..100
    status          TEXT NOT NULL DEFAULT 'geplant',
    beschreibung    TEXT,
    CHECK (start_zeit < ende_zeit),        -- gültiges Intervall (bei identischem Format)
    UNIQUE (netzplan_id, code),
    FOREIGN KEY (netzplan_id) REFERENCES netzplaene(id) ON DELETE CASCADE,
    FOREIGN KEY (ressourcen_id) REFERENCES ressourcen(id)
);
CREATE INDEX idx_vorgaenge_netzplan   ON vorgaenge(netzplan_id);
CREATE INDEX idx_vorgaenge_ressource  ON vorgaenge(ressourcen_id);
CREATE INDEX idx_vorgaenge_start_ende ON vorgaenge(start_zeit, ende_zeit);

-- ----------------------------------------
-- Anordnungsbeziehungen zwischen Vorgängen
-- ----------------------------------------
CREATE TABLE anordnungsbeziehungen (
    id              INTEGER PRIMARY KEY,
    vorgaenger_id   INTEGER NOT NULL,
    nachfolger_id   INTEGER NOT NULL,
    typ             TEXT NOT NULL CHECK (typ IN ('FS','SS','FF','SF')),
    puffer          TEXT DEFAULT 'PT0S',   -- ISO-8601 Dauer (informativ), z. B. "PT30M"; rein textuell
    bemerkung       TEXT,
    CHECK (vorgaenger_id <> nachfolger_id),
    UNIQUE (vorgaenger_id, nachfolger_id, typ),
    FOREIGN KEY (vorgaenger_id) REFERENCES vorgaenge(id) ON DELETE CASCADE,
    FOREIGN KEY (nachfolger_id) REFERENCES vorgaenge(id) ON DELETE CASCADE
);
CREATE INDEX idx_anordnungen_vorgaenger ON anordnungsbeziehungen(vorgaenger_id);
CREATE INDEX idx_anordnungen_nachfolger ON anordnungsbeziehungen(nachfolger_id);

-- ----------------------------------------
-- Zuweisungen: Mitarbeiter ↔ Vorgänge
-- ----------------------------------------
CREATE TABLE zuweisungen (
    id              INTEGER PRIMARY KEY,
    vorgang_id      INTEGER NOT NULL,
    mitarbeiter_id  INTEGER NOT NULL,
    rolle           TEXT,
    anteil_pct      REAL,                  -- optional: Kapazitätsanteil in %
    zugewiesen_am   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    UNIQUE (vorgang_id, mitarbeiter_id),
    FOREIGN KEY (vorgang_id) REFERENCES vorgaenge(id) ON DELETE CASCADE,
    FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter(id) ON DELETE CASCADE
);
CREATE INDEX idx_zuweisungen_vorgang     ON zuweisungen(vorgang_id);
CREATE INDEX idx_zuweisungen_mitarbeiter ON zuweisungen(mitarbeiter_id);

-- ----------------------------------------
-- Trigger: Mitarbeiter muss zur Ressource des Vorgangs gehören
-- ----------------------------------------
CREATE TRIGGER trg_zuweisung_selbe_ressource_ins
BEFORE INSERT ON zuweisungen
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'Zuweisung ungültig: Mitarbeiter gehört nicht zur Ressource des Vorgangs')
    WHERE (
        (SELECT ressourcen_id FROM mitarbeiter WHERE id = NEW.mitarbeiter_id) IS NULL
        OR (SELECT ressourcen_id FROM vorgaenge    WHERE id = NEW.vorgang_id)   IS NULL
        OR (SELECT ressourcen_id FROM mitarbeiter WHERE id = NEW.mitarbeiter_id)
           <> (SELECT ressourcen_id FROM vorgaenge WHERE id = NEW.vorgang_id)
    );
END;

CREATE TRIGGER trg_zuweisung_selbe_ressource_upd
BEFORE UPDATE ON zuweisungen
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'Zuweisung ungültig: Mitarbeiter gehört nicht zur Ressource des Vorgangs')
    WHERE (
        (SELECT ressourcen_id FROM mitarbeiter WHERE id = NEW.mitarbeiter_id) IS NULL
        OR (SELECT ressourcen_id FROM vorgaenge    WHERE id = NEW.vorgang_id)   IS NULL
        OR (SELECT ressourcen_id FROM mitarbeiter WHERE id = NEW.mitarbeiter_id)
           <> (SELECT ressourcen_id FROM vorgaenge WHERE id = NEW.vorgang_id)
    );
END;

-- ----------------------------------------
-- Trigger: Nicht-Überlappung je Ressource (INSERT/UPDATE)
-- Hinweis: setzt ISO-8601 Zeitspeicherung voraus, damit Textvergleich chronologisch ist.
-- ----------------------------------------
CREATE TRIGGER trg_vorgang_no_overlap_ins
BEFORE INSERT ON vorgaenge
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'Konflikt: Vorgang überlappt auf derselben Ressource mit bestehendem Vorgang')
    WHERE EXISTS (
        SELECT 1 FROM vorgaenge v
        WHERE v.ressourcen_id = NEW.ressourcen_id
          AND NEW.start_zeit < v.ende_zeit
          AND v.start_zeit   < NEW.ende_zeit
    );
END;

CREATE TRIGGER trg_vorgang_no_overlap_upd
BEFORE UPDATE ON vorgaenge
FOR EACH ROW
BEGIN
    SELECT RAISE(ABORT, 'Konflikt: Vorgang überlappt auf derselben Ressource mit bestehendem Vorgang')
    WHERE EXISTS (
        SELECT 1 FROM vorgaenge v
        WHERE v.ressourcen_id = NEW.ressourcen_id
          AND v.id <> NEW.id
          AND NEW.start_zeit < v.ende_zeit
          AND v.start_zeit   < NEW.ende_zeit
    );
END;

-- ----------------------------------------
-- Sicht: Vorgang mit Projekt/Netzplan/Ressource/Standort
-- ----------------------------------------
CREATE VIEW v_vorgang_details AS
SELECT
    v.id              AS vorgang_id,
    v.code            AS vorgang_code,
    v.name            AS vorgang_name,
    v.start_zeit,
    v.ende_zeit,
    v.status,
    np.id             AS netzplan_id,
    np.code           AS netzplan_code,
    p.id              AS projekt_id,
    p.code            AS projekt_code,
    r.id              AS ressourcen_id,
    r.name            AS ressourcen_name,
    s.id              AS standort_id,
    s.name            AS standort_name
FROM vorgaenge v
JOIN netzplaene np ON np.id = v.netzplan_id
JOIN projekte  p  ON p.id  = np.projekt_id
JOIN ressourcen r ON r.id  = v.ressourcen_id
JOIN standorte s  ON s.id  = r.standort_id;

COMMIT;

-- ============================================================================
-- OPTIONAL: Minimalbeispiel (auskommentiert). Zum Testen der Constraints einfach
-- die Zeilen unten ent-kommentieren.
-- ============================================================================
-- INSERT INTO standorte (code, name) VALUES ('AC', 'Aachen');
-- INSERT INTO ressourcen (standort_id, code, name) VALUES (1, 'MACH-01', 'Maschine 01');
-- INSERT INTO mitarbeiter (ressourcen_id, vorname, nachname, email) VALUES
--   (1, 'Anna', 'Muster', 'anna@example.com'),
--   (1, 'Ben',  'Beispiel', 'ben@example.com');
-- INSERT INTO projekte (code, name) VALUES ('PRJ-001', 'Demo-Projekt');
-- INSERT INTO netzplaene (projekt_id, code, name) VALUES (1, 'NP-01', 'Netzplan 01');
-- INSERT INTO vorgaenge (netzplan_id, ressourcen_id, code, name, start_zeit, ende_zeit) VALUES
--   (1, 1, 'A', 'Vorbereitung', '2025-12-15T08:00:00Z', '2025-12-15T12:00:00Z'),
--   (1, 1, 'B', 'Fertigung',    '2025-12-15T12:30:00Z', '2025-12-15T16:30:00Z');
-- INSERT INTO anordnungsbeziehungen (vorgaenger_id, nachfolger_id, typ, puffer)
-- VALUES (1, 2, 'FS', 'PT30M');
-- INSERT INTO zuweisungen (vorgang_id, mitarbeiter_id, rolle, anteil_pct) VALUES
--   (1, 1, 'Ausführung', 100.0),
--   (2, 2, 'Ausführung', 100.0);
