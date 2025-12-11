#!/usr/bin/env python3
"""Verify the database contents with sample queries."""

import sqlite3
from pathlib import Path

def verify_database():
    db_path = Path(__file__).parent / 'projekt_netzplan.db'
    
    if not db_path.exists():
        print("❌ Database not found. Run generate_operations.py first.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print('=' * 60)
    print('DATABASE VERIFICATION - Star Wars Project Database')
    print('=' * 60)
    print()

    # Check facilities
    print('🏢 FACILITIES:')
    cursor.execute('SELECT code, name FROM standorte')
    for row in cursor.fetchall():
        print(f'  • {row[0]}: {row[1]}')

    print('\n🚀 SAMPLE PROJECTS (first 5):')
    cursor.execute('SELECT code, name, start_geplant FROM projekte LIMIT 5')
    for row in cursor.fetchall():
        print(f'  • {row[0]}: {row[1]} (starts {row[2]})')

    print('\n👥 SAMPLE EMPLOYEES (from X-Wing Squadron):')
    cursor.execute('''
        SELECT m.vorname, m.nachname, r.name 
        FROM mitarbeiter m 
        JOIN ressourcen r ON r.id = m.ressourcen_id 
        WHERE r.code = "XWING-A1"
    ''')
    for row in cursor.fetchall():
        print(f'  • {row[0]} {row[1]} - {row[2]}')

    print('\n📊 WORKLOAD (Top 5 busiest employees):')
    cursor.execute('''
        SELECT 
            m.vorname || " " || m.nachname as name,
            COUNT(z.id) as assignments
        FROM mitarbeiter m
        JOIN zuweisungen z ON z.mitarbeiter_id = m.id
        GROUP BY m.id
        ORDER BY assignments DESC
        LIMIT 5
    ''')
    for row in cursor.fetchall():
        print(f'  • {row[0]}: {row[1]} assignments')

    print('\n🔗 NETWORK SUMMARY (first project):')
    cursor.execute('''
        SELECT 
            p.code,
            p.name,
            COUNT(DISTINCT n.id) as networks,
            COUNT(DISTINCT v.id) as operations
        FROM projekte p
        JOIN netzplaene n ON n.projekt_id = p.id
        JOIN vorgaenge v ON v.netzplan_id = n.id
        WHERE p.id = 1
        GROUP BY p.id
    ''')
    row = cursor.fetchone()
    print(f'  • Project {row[0]}: {row[1]}')
    print(f'    - {row[2]} networks')
    print(f'    - {row[3]} operations')

    print('\n⏰ SAMPLE OPERATIONS (from first network):')
    cursor.execute('''
        SELECT v.code, v.name, v.status, v.fortschritt_pct
        FROM vorgaenge v
        WHERE v.netzplan_id = 1
        ORDER BY v.start_zeit
        LIMIT 5
    ''')
    for row in cursor.fetchall():
        print(f'  • {row[0]}: {row[1]} [{row[2]}, {row[3]:.1f}%]')

    print('\n🔄 OPERATION RELATIONSHIPS (sample):')
    cursor.execute('''
        SELECT 
            v1.code || ": " || v1.name as predecessor,
            a.typ,
            v2.code || ": " || v2.name as successor
        FROM anordnungsbeziehungen a
        JOIN vorgaenge v1 ON v1.id = a.vorgaenger_id
        JOIN vorgaenge v2 ON v2.id = a.nachfolger_id
        WHERE v1.netzplan_id = 1
        LIMIT 5
    ''')
    for row in cursor.fetchall():
        print(f'  • {row[0]} -{row[1]}-> {row[2]}')

    print('\n📈 RESOURCE UTILIZATION:')
    cursor.execute('''
        SELECT 
            r.name as resource,
            COUNT(v.id) as operations,
            s.name as facility
        FROM ressourcen r
        LEFT JOIN vorgaenge v ON v.ressourcen_id = r.id
        JOIN standorte s ON s.id = r.standort_id
        GROUP BY r.id
        ORDER BY operations DESC
        LIMIT 5
    ''')
    for row in cursor.fetchall():
        print(f'  • {row[0]}: {row[1]} operations ({row[2]})')

    conn.close()
    
    print()
    print('=' * 60)
    print('✅ Database verification complete!')
    print('=' * 60)

if __name__ == '__main__':
    verify_database()
