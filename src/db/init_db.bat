@echo off
echo ============================================
echo SQLite Database Setup - Star Wars Edition
echo ============================================
echo.

cd /d "%~dp0"

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Generating database with sample data...
python generate_operations.py

if errorlevel 1 (
    echo.
    echo ERROR: Database generation failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo Database setup complete!
echo Database location: %~dp0projekt_netzplan.db
echo ============================================
echo.
pause
