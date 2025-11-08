@echo off
echo ========================================
echo Underground Club Manager - Build Script
echo ========================================
echo.
echo This script will build the Windows executable.
echo.
echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building the executable...
call npm run build-exe
if %errorlevel% neq 0 (
    echo Error: Failed to build executable
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build complete!
echo ========================================
echo.
echo The installer has been created in the 'dist' folder:
echo   dist\Underground Club Manager Setup 0.1.0.exe
echo.
echo You can now run the installer to install and play the game!
echo.
pause
