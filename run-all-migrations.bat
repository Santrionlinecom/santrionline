@echo off
echo ========================================
echo EXECUTING ALL MIGRATIONS TO inti-santri
echo ========================================
echo.

echo [1/25] Executing 0000_awal_schema.sql...
wrangler d1 execute inti-santri --file="migrations/0000_awal_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0000_awal_schema.sql
    pause
    exit /b 1
)

echo [2/25] Executing 0002_fitur_inti_lengkap.sql...
wrangler d1 execute inti-santri --file="migrations/0002_fitur_inti_lengkap.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0002_fitur_inti_lengkap.sql
    pause
    exit /b 1
)

echo [3/25] Executing 0003_seed_data_surah_quran.sql...
wrangler d1 execute inti-santri --file="migrations/0003_seed_data_surah_quran.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0003_seed_data_surah_quran.sql
    pause
    exit /b 1
)

echo [4/25] Executing 0005_karya_ditingkatkan_verifikasi.sql...
wrangler d1 execute inti-santri --file="migrations/0005_karya_ditingkatkan_verifikasi.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0005_karya_ditingkatkan_verifikasi.sql
    pause
    exit /b 1
)

echo [5/25] Executing 0006_perbaikan_fitur_biolink.sql...
wrangler d1 execute inti-santri --file="migrations/0006_perbaikan_fitur_biolink.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0006_perbaikan_fitur_biolink.sql
    pause
    exit /b 1
)

echo [6/25] Executing 0007_standarisasi_biolink.sql...
wrangler d1 execute inti-santri --file="migrations/0007_standarisasi_biolink.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0007_standarisasi_biolink.sql
    pause
    exit /b 1
)

echo [7/25] Executing 0008_indeks_terkonsolidasi.sql...
wrangler d1 execute inti-santri --file="migrations/0008_indeks_terkonsolidasi.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0008_indeks_terkonsolidasi.sql
    pause
    exit /b 1
)

echo [8/25] Executing 0009_sertifikat_schema.sql...
wrangler d1 execute inti-santri --file="migrations/0009_sertifikat_schema.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0009_sertifikat_schema.sql
    pause
    exit /b 1
)

echo [9/25] Executing 0010_hafalan_evaluasi.sql...
wrangler d1 execute inti-santri --file="migrations/0010_hafalan_evaluasi.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0010_hafalan_evaluasi.sql
    pause
    exit /b 1
)

echo [10/25] Executing 0011_create_ulama_tables.sql...
wrangler d1 execute inti-santri --file="migrations/0011_create_ulama_tables.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0011_create_ulama_tables.sql
    pause
    exit /b 1
)

echo [11/25] Executing 0011_karya_audit_indexes.sql...
wrangler d1 execute inti-santri --file="migrations/0011_karya_audit_indexes.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0011_karya_audit_indexes.sql
    pause
    exit /b 1
)

echo [12/25] Executing 0012_ulama_audit_soft_delete.sql...
wrangler d1 execute inti-santri --file="migrations/0012_ulama_audit_soft_delete.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0012_ulama_audit_soft_delete.sql
    pause
    exit /b 1
)

echo [13/25] Executing 0013_karya_audit_indexes.sql...
wrangler d1 execute inti-santri --file="migrations/0013_karya_audit_indexes.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0013_karya_audit_indexes.sql
    pause
    exit /b 1
)

echo [14/25] Executing 0014_complete_ulama_module.sql...
wrangler d1 execute inti-santri --file="migrations/0014_complete_ulama_module.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0014_complete_ulama_module.sql
    pause
    exit /b 1
)

echo [15/25] Executing 0015_ulama_category_only.sql...
wrangler d1 execute inti-santri --file="migrations/0015_ulama_category_only.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0015_ulama_category_only.sql
    pause
    exit /b 1
)

echo [16/25] Executing 0016_ulama_table.sql...
wrangler d1 execute inti-santri --file="migrations/0016_ulama_table.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0016_ulama_table.sql
    pause
    exit /b 1
)

echo [17/25] Executing 0017_ulama_work_audit.sql...
wrangler d1 execute inti-santri --file="migrations/0017_ulama_work_audit.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0017_ulama_work_audit.sql
    pause
    exit /b 1
)

echo [18/25] Executing 0018_seed_categories.sql...
wrangler d1 execute inti-santri --file="migrations/0018_seed_categories.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0018_seed_categories.sql
    pause
    exit /b 1
)

echo [19/25] Executing 0019_add_ulama_author.sql...
wrangler d1 execute inti-santri --file="migrations/0019_add_ulama_author.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0019_add_ulama_author.sql
    pause
    exit /b 1
)

echo [20/25] Executing 0020_ulama_seed_fix.sql...
wrangler d1 execute inti-santri --file="migrations/0020_ulama_seed_fix.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0020_ulama_seed_fix.sql
    pause
    exit /b 1
)

echo [21/25] Executing 0021_ulama_final_seed.sql...
wrangler d1 execute inti-santri --file="migrations/0021_ulama_final_seed.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0021_ulama_final_seed.sql
    pause
    exit /b 1
)

echo [22/25] Executing 0022_ulama_seed_with_pragma.sql...
wrangler d1 execute inti-santri --file="migrations/0022_ulama_seed_with_pragma.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 0022_ulama_seed_with_pragma.sql
    pause
    exit /b 1
)

echo [23/25] Executing 20250809_karya_audit_indexes.sql...
wrangler d1 execute inti-santri --file="migrations/20250809_karya_audit_indexes.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 20250809_karya_audit_indexes.sql
    pause
    exit /b 1
)

echo [24/25] Executing 20250811_ulama_seed_with_pragma.sql...
wrangler d1 execute inti-santri --file="migrations/20250811_ulama_seed_with_pragma.sql"
if %errorlevel% neq 0 (
    echo ERROR: Failed to execute 20250811_ulama_seed_with_pragma.sql
    pause
    exit /b 1
)

echo.
echo ========================================
echo ALL MIGRATIONS COMPLETED SUCCESSFULLY!
echo ========================================
echo.

echo Verifying database contents...
wrangler d1 execute inti-santri --command="SELECT COUNT(*) as total_tables FROM sqlite_master WHERE type='table'"
wrangler d1 execute inti-santri --command="SELECT COUNT(*) as total_ulama FROM ulama"
wrangler d1 execute inti-santri --command="SELECT COUNT(*) as total_categories FROM ulama_category"

echo.
echo Migration execution complete!
pause
