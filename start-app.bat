@echo off
title DesignForge Studio (Figma + Claude Design Hybrid)
color 0b
cls
echo ================================================================
echo    DesignForge Studio - Offline / Hybrid AI Design Studio
echo ================================================================
echo.
echo 1. Verificando directorio...
cd /d "%~dp0client"

echo 2. Abriendo navegador en http://localhost:5173/ ...
start "" http://localhost:5173/

echo 3. Iniciando servidor local...
echo.
echo Presiona Ctrl+C para detener el servidor cuando termines.
echo ================================================================
echo.
call npm run dev -- --port 5173 --host

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Ocurrio un error al iniciar. Intentando modo preview compilado...
    call npm run preview -- --port 5173 --host
)

pause
