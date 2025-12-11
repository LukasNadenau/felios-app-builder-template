# Quick Start Guide 🚀

Get up and running with the Star Wars themed project database in minutes!

## 🎯 What You Get

A fully populated SQLite database with:
- **50 Projects** spanning 2 years (2025-2027)
- **176 Networks** (project phases)
- **4,341 Operations** with realistic scheduling
- **8,051 Dependencies** between operations
- **61 Star Wars Characters** as employees
- **20 Resources** across 2 facilities
- All themed around Star Wars missions!

## 🚀 Quick Setup

### Option 1: Windows Batch Script (Easiest)
```bash
init_db.bat
```

### Option 2: Python Script (Cross-platform)
```bash
python generate_operations.py
```

### Option 3: Manual Steps
```bash
# Create database
sqlite3 projekt_netzplan.db < projekt_netzplan_schema_sqlite.sql

# Load seed data
sqlite3 projekt_netzplan.db < seed.sql

# Generate operations (requires Python)
python generate_operations.py
```

## ✅ Verify Setup

Run the verification script:
```bash
python verify_db.py
```

You should see:
- ✓ 2 Facilities (Yavin IV, Hoth)
- ✓ 50 Projects
- ✓ ~4,300 Operations
- ✓ ~8,000 Relationships
- ✓ 61 Active Employees

## 📊 Explore the Data

### Interactive SQL Shell
```bash
explore_db.bat           # Windows
sqlite3 projekt_netzplan.db  # Linux/Mac
```

### Quick Queries

**List all projects:**
```sql
SELECT code, name, start_geplant FROM projekte LIMIT 10;
```

**View Luke Skywalker's assignments:**
```sql
SELECT v.name, p.name as project, v.start_zeit
FROM zuweisungen z
JOIN mitarbeiter m ON m.id = z.mitarbeiter_id
JOIN vorgaenge v ON v.id = z.vorgang_id
JOIN netzplaene n ON n.id = v.netzplan_id
JOIN projekte p ON p.id = n.projekt_id
WHERE m.vorname = 'Luke' AND m.nachname = 'Skywalker'
ORDER BY v.start_zeit
LIMIT 5;
```

**Resource utilization:**
```sql
SELECT r.name, COUNT(v.id) as operations
FROM ressourcen r
LEFT JOIN vorgaenge v ON v.ressourcen_id = r.id
GROUP BY r.id
ORDER BY operations DESC
LIMIT 5;
```

**See more examples in:** `query_examples.sql`

## 🎮 Use Cases

### 1. Project Management
- View project timelines
- Track operation progress
- Analyze dependencies

### 2. Resource Planning
- Check resource utilization
- Find scheduling conflicts
- Optimize assignments

### 3. Team Management
- Review employee workload
- Track assignments by role
- Analyze capacity

### 4. Learning SQL
- Practice JOINs across multiple tables
- Work with date/time data
- Understand foreign key relationships

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `projekt_netzplan.db` | **Main database file** (SQLite) |
| `projekt_netzplan_schema_sqlite.sql` | Database schema with triggers |
| `seed.sql` | Base data (facilities, employees, projects) |
| `generate_operations.py` | Generates operations & assignments |
| `verify_db.py` | Verify database integrity |
| `query_examples.sql` | 50+ example SQL queries |
| `init_db.bat` | Windows setup script |
| `explore_db.bat` | Windows SQLite shell launcher |
| `README.md` | Full documentation |

## 🔄 Regenerate Data

Want fresh random data?
```bash
python generate_operations.py
```

This will:
1. Delete existing database
2. Recreate schema
3. Load seed data
4. Generate new random operations, assignments, and relationships

The base structure (facilities, employees, projects) stays the same, but all operations and schedules are randomized.

## 💡 Pro Tips

1. **Enable column mode in SQLite:**
   ```sql
   .mode column
   .headers on
   ```

2. **Export query results:**
   ```sql
   .mode csv
   .output results.csv
   SELECT * FROM projekte;
   .output stdout
   ```

3. **Check database size:**
   ```bash
   sqlite3 projekt_netzplan.db "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
   ```

4. **Backup database:**
   ```bash
   copy projekt_netzplan.db projekt_netzplan_backup.db  # Windows
   cp projekt_netzplan.db projekt_netzplan_backup.db    # Linux/Mac
   ```

## 🐛 Troubleshooting

**Database doesn't exist:**
- Run `init_db.bat` or `python generate_operations.py`

**Python not found:**
- Install Python 3.8+ from https://python.org
- Ensure Python is in your PATH

**Permission denied:**
- Close any programs using the database
- Try running as administrator

**Slow queries:**
- Check if foreign_keys is ON: `PRAGMA foreign_keys;`
- Verify indexes exist: `.indexes`

## 🌟 What's Next?

1. **Explore the data** with example queries
2. **Build visualizations** (connect with your favorite tool)
3. **Create reports** based on the data
4. **Integrate** with your application
5. **Learn** SQL and database concepts

## 📚 Learn More

- Full documentation: See `README.md`
- Query examples: See `query_examples.sql`
- Schema details: See `projekt_netzplan_schema_sqlite.sql`

---

**May the Force be with you!** 🌟

Questions or issues? Check the README.md for more details.
