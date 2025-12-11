# Star Wars Project Database - Complete Index

> A comprehensive SQLite database for project network planning with Star Wars themed sample data

## 🎯 Quick Navigation

- **New to this project?** → Start with [QUICKSTART.md](QUICKSTART.md)
- **Want detailed docs?** → Read [README.md](README.md)
- **Ready to explore?** → See [query_examples.sql](query_examples.sql)
- **Need to setup?** → Run `init_db.bat` (Windows) or `python generate_operations.py`

## 📊 Database Stats

```
✓ Projects: 50
✓ Networks: 176
✓ Operations: 4,341
✓ Relationships: 8,051
✓ Assignments: 8,179
✓ Employees: 61
✓ Resources: 20
✓ Facilities: 2
```

## 📁 File Reference

### 🎮 Executable Scripts

| File | Description | Usage |
|------|-------------|-------|
| `init_db.bat` | Windows setup script | Double-click or run in cmd |
| `explore_db.bat` | Open SQLite shell (Windows) | Double-click or run in cmd |
| `generate_operations.py` | Create/regenerate database | `python generate_operations.py` |
| `verify_db.py` | Verify database contents | `python verify_db.py` |

### 📄 Database Files

| File | Description | Size |
|------|-------------|------|
| `projekt_netzplan.db` | Main SQLite database | ~2.8 MB |
| `projekt_netzplan_schema_sqlite.sql` | Database schema | 11 KB |
| `seed.sql` | Initial seed data | 15 KB |

### 📚 Documentation

| File | Description | Audience |
|------|-------------|----------|
| `INDEX.md` | This file - navigation hub | Everyone |
| `QUICKSTART.md` | Get started in 5 minutes | Beginners |
| `README.md` | Complete documentation | Detailed reference |
| `query_examples.sql` | 50+ example SQL queries | SQL learners |

## 🚀 Common Tasks

### Setup (First Time)

**Windows:**
```bash
init_db.bat
```

**Linux/Mac:**
```bash
python generate_operations.py
```

### Verify Database

```bash
python verify_db.py
```

### Explore Data

**Windows:**
```bash
explore_db.bat
```

**Linux/Mac:**
```bash
sqlite3 projekt_netzplan.db
```

### Regenerate with Fresh Data

```bash
python generate_operations.py
```

## 📖 Learning Paths

### Path 1: Quick Explorer (5 minutes)
1. Run `init_db.bat`
2. Run `verify_db.py`
3. Browse the output
4. Done! You've seen the data structure

### Path 2: SQL Learner (30 minutes)
1. Setup database (above)
2. Open `query_examples.sql`
3. Run queries in SQLite shell
4. Modify and experiment
5. Master SQL JOINs!

### Path 3: Developer (1 hour)
1. Read `README.md` for schema details
2. Study `projekt_netzplan_schema_sqlite.sql`
3. Understand triggers and constraints
4. Connect from your application
5. Build something awesome!

### Path 4: Data Analyst (2 hours)
1. Setup database
2. Run all queries in `query_examples.sql`
3. Create custom analytical queries
4. Export data to CSV
5. Build visualizations

## 🎭 Star Wars Characters in Database

### Yavin IV Base (35 characters)
- **Pilots**: Luke Skywalker, Wedge Antilles, Biggs Darklighter, Jek Porkins
- **Leadership**: Princess Leia, Mon Mothma, Admiral Ackbar, General Dodonna
- **Support**: R2-D2, C-3PO, and 25+ more

### Echo Base Hoth (26 characters)
- **Pilots**: Luke (Commander role), Dack Ralter, Zev Senesca
- **Command**: General Rieekan, Han Solo
- **Technical**: Various engineers and specialists

## 🏗️ Database Structure

```
standorte (Facilities)
    ├── ressourcen (Resources)
    │   ├── mitarbeiter (Employees)
    │   │   └── zuweisungen (Assignments) → vorgaenge
    │   └── vorgaenge (Operations)
    └── vorgaenge (Operations)

projekte (Projects)
    └── netzplaene (Networks)
        └── vorgaenge (Operations)
            ├── zuweisungen (Assignments) ← mitarbeiter
            └── anordnungsbeziehungen (Relationships)
```

## 🔍 Sample Projects

| Code | Name | Timeline |
|------|------|----------|
| DS1-RECON | Death Star I Reconnaissance | Jan-Mar 2025 |
| SCARIF-PLANS | Scarif Data Retrieval | Feb-Apr 2025 |
| HOTH-SETUP | Echo Base Establishment | May-Sep 2025 |
| TRENCH-RUN | Death Star Assault Planning | Mar-May 2025 |
| ... | 46 more missions | 2025-2027 |

## 🛠️ Technical Details

- **Database**: SQLite 3.31+
- **Language**: SQL + Python 3.8+
- **Size**: ~2.8 MB (fully populated)
- **Tables**: 7 core tables + 1 view
- **Triggers**: 4 (data integrity)
- **Indexes**: 10 (performance)

## 🎓 Key Features

### Data Integrity
- Foreign key constraints
- Unique constraints on codes
- Check constraints on dates
- Triggers prevent resource conflicts
- Cascade deletes maintain consistency

### Realistic Scheduling
- No overlapping operations per resource
- Realistic time distributions (2-48 hour operations)
- Complex dependency networks (FS, SS, FF, SF)
- Random but reasonable progress values

### Rich Relationships
- Projects → Networks (1:many)
- Networks → Operations (1:many)
- Operations → Dependencies (many:many)
- Operations → Employees (many:many)
- Resources → Operations (1:many)
- Resources → Employees (1:many)

## 🔗 Integration Examples

### Python
```python
import sqlite3
conn = sqlite3.connect('projekt_netzplan.db')
cursor = conn.cursor()
cursor.execute("SELECT * FROM projekte LIMIT 5")
for row in cursor.fetchall():
    print(row)
```

### Node.js
```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('projekt_netzplan.db');
db.all("SELECT * FROM projekte LIMIT 5", (err, rows) => {
    console.log(rows);
});
```

### C# (.NET)
```csharp
using Microsoft.Data.Sqlite;
var connection = new SqliteConnection("Data Source=projekt_netzplan.db");
connection.Open();
var command = connection.CreateCommand();
command.CommandText = "SELECT * FROM projekte LIMIT 5";
// Execute and read...
```

## 💡 Use Cases

- **Project Management Systems**: Real scheduling data
- **Learning SQL**: Complex multi-table queries
- **Resource Planning**: Allocation and conflicts
- **Network Analysis**: Critical path, dependencies
- **Testing Applications**: Realistic test data
- **Demonstrations**: Impressive sample dataset
- **Education**: Database design patterns

## 🤝 Support

- Questions about setup? → See [QUICKSTART.md](QUICKSTART.md)
- Need query help? → Check [query_examples.sql](query_examples.sql)
- Want schema details? → Read [README.md](README.md)
- Found an issue? → Check file integrity with `verify_db.py`

## 📝 License Note

This is sample data for development and learning purposes. Star Wars and all related properties are trademarks of Lucasfilm Ltd.

---

**May the Force be with you!** ⭐

*Last updated: December 2025*
