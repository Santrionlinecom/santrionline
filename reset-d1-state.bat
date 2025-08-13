@echo off
SETLOCAL ENABLEEXTENSIONS

:: reset-d1-state.bat
:: Clean (delete) local Cloudflare Wrangler / Miniflare D1 state folder.
:: Usage:
::   reset-d1-state.bat            -> delete .wrangler\state\v3\d1 only (recreated on next `npm run dev`)
::   reset-d1-state.bat FULL       -> delete entire .wrangler\state (all local persisted state)
::   reset-d1-state.bat KILL       -> attempt to kill wrangler/miniflare dev processes, then delete d1 only
::   reset-d1-state.bat KILL FULL  -> kill then delete full state
::
:: Exit codes:
::   0 success
::   1 deletion failed (locked)
::   2 unexpected error

set MODE=PARTIAL
set DO_KILL=0

for %%A in (%*) do (
  if /I "%%A"=="FULL" set MODE=FULL
  if /I "%%A"=="KILL" set DO_KILL=1
)

set D1_FOLDER=.wrangler\state\v3\d1
set STATE_FOLDER=.wrangler\state

echo ============================================
echo  Cloudflare D1 Local State Reset Utility
echo  Mode: %MODE%   KillProcesses: %DO_KILL%
echo ============================================

if %DO_KILL%==1 (
  echo Attempting to terminate wrangler/miniflare dev processes (best effort)...
  powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" ^| Where-Object { $_.CommandLine -match 'wrangler(\\.c?js)?( |$)' -or $_.CommandLine -match 'miniflare' } ^| ForEach-Object { Write-Host ('Killing PID ' + $_.ProcessId + ' - ' + $_.CommandLine); Stop-Process -Id $_.ProcessId -Force }" 2>nul
)

if /I "%MODE%"=="FULL" (
  call :DeletePath "%STATE_FOLDER%"
  goto :EOF
) else (
  call :DeletePath "%D1_FOLDER%"
  goto :EOF
)

:: -------------------------------------------
:: DeletePath (helper)
:: %1 path
:DeletePath
set TARGET=%~1
if not exist "%TARGET%" (
  echo [OK] %TARGET% does not exist (already clean)
  exit /b 0
)

:: Retry loop to handle transient locks
set /a MAX_RETRIES=6
set /a COUNT=0
:RETRY_DELETE
set /a COUNT+=1
powershell -NoProfile -Command "try { Remove-Item -Recurse -Force -ErrorAction Stop '%TARGET%' ; $true } catch { Start-Sleep -Milliseconds 300; $false }" >nul 2>nul
if exist "%TARGET%" (
  if %COUNT% GEQ %MAX_RETRIES% (
    echo [FAIL] Could not delete "%TARGET%" (locked). Close dev server (npm run dev) and retry.
    exit /b 1
  ) else (
    echo [INFO] Delete attempt %COUNT% failed (likely locked). Retrying...
    goto :RETRY_DELETE
  )
) else (
  echo [OK] Deleted %TARGET%
  exit /b 0
)

:EOF
ENDLOCAL
