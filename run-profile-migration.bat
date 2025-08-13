@echo off
echo Running profile fields migration...

REM Check if local database exists
if exist "app/db/local.db" (
    echo Updating local database...
    sqlite3 app/db/local.db < add-profile-fields.sql
    echo Local database updated successfully!
) else (
    echo Local database not found, skipping...
)

echo.
echo Migration completed!
echo.
echo New profile fields added:
echo - phone
echo - address  
echo - date_of_birth
echo - education
echo - institution
echo - updated_at
echo.
echo You can now access the profile page at: http://localhost:5174/dashboard/profil
pause
