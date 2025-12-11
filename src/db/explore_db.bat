@echo off
echo ============================================
echo Star Wars Project Database Explorer
echo ============================================
echo.
echo Opening SQLite database in interactive mode...
echo.
echo Useful commands:
echo   .tables           - List all tables
echo   .schema [table]   - Show table structure
echo   .mode column      - Enable column mode for better formatting
echo   .headers on       - Show column headers
echo   .read query_examples.sql - Load example queries (commented)
echo   .quit             - Exit
echo.
echo Or just type SQL queries directly!
echo.
pause
cd /d "%~dp0"
sqlite3 projekt_netzplan.db
