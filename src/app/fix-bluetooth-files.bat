@echo off
REM RakshaNet - Bluetooth Configuration Fix Script (Windows)
REM This script automatically fixes the _headers file if it becomes a directory

echo.
echo ========================================================
echo    RakshaNet Bluetooth Configuration Checker ^& Fixer
echo ========================================================
echo.

REM Check if public\_headers exists and what type it is
if exist "public\_headers\" (
    echo [ERROR] public\_headers is a DIRECTORY ^(should be a file^)
    echo [FIX] Deleting directory and recreating as file...
    
    REM Delete the directory
    rmdir /s /q "public\_headers"
    
    REM Create as proper file
    (
        echo /*
        echo   Permissions-Policy: bluetooth=^(self^), geolocation=^(self^), camera=^(self^), microphone=^(self^)
        echo   Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
    ) > "public\_headers"
    
    echo [FIXED] public\_headers is now a proper file
    echo.
) else if exist "public\_headers" (
    echo [OK] public\_headers is correctly a FILE
    
    REM Check content
    findstr /C:"Permissions-Policy" "public\_headers" >nul
    if errorlevel 1 (
        echo [WARNING] Content might be incorrect
        echo [FIX] Recreating with correct content...
        
        (
            echo /*
            echo   Permissions-Policy: bluetooth=^(self^), geolocation=^(self^), camera=^(self^), microphone=^(self^)
            echo   Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
        ) > "public\_headers"
        
        echo [FIXED] Content corrected!
    ) else (
        echo [OK] Content is correct
    )
    echo.
) else (
    echo [ERROR] public\_headers does not exist
    echo [FIX] Creating now...
    
    (
        echo /*
        echo   Permissions-Policy: bluetooth=^(self^), geolocation=^(self^), camera=^(self^), microphone=^(self^)
        echo   Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
    ) > "public\_headers"
    
    echo [FIXED] Created public\_headers as proper file
    echo.
)

REM Check .htaccess
if exist ".htaccess" (
    echo [OK] .htaccess exists
    
    findstr /C:"Permissions-Policy" ".htaccess" >nul
    if errorlevel 1 (
        echo [WARNING] .htaccess content might be incorrect
        echo [FIX] Recreating with correct content...
        
        (
            echo ^<IfModule mod_headers.c^>
            echo     Header set Permissions-Policy "bluetooth=^(self^), geolocation=^(self^), camera=^(self^), microphone=^(self^)"
            echo     Header set Feature-Policy "bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'"
            echo ^</IfModule^>
        ) > ".htaccess"
        
        echo [FIXED] .htaccess corrected!
    ) else (
        echo [OK] .htaccess content is correct
    )
    echo.
) else (
    echo [WARNING] .htaccess does not exist
    echo [FIX] Creating now...
    
    (
        echo ^<IfModule mod_headers.c^>
        echo     Header set Permissions-Policy "bluetooth=^(self^), geolocation=^(self^), camera=^(self^), microphone=^(self^)"
        echo     Header set Feature-Policy "bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'"
        echo ^</IfModule^>
    ) > ".htaccess"
    
    echo [FIXED] .htaccess created!
    echo.
)

echo ========================================================
echo    All Bluetooth configuration files are correct!
echo ========================================================
echo.
echo File Status:
if exist "public\_headers" (
    echo    [OK] public\_headers ^(file^)
) else (
    echo    [ERROR] public\_headers missing
)
if exist ".htaccess" (
    echo    [OK] .htaccess ^(file^)
) else (
    echo    [ERROR] .htaccess missing
)
if exist "vercel.json" (
    echo    [OK] vercel.json
) else (
    echo    [INFO] vercel.json missing ^(only needed for Vercel^)
)
if exist "netlify.toml" (
    echo    [OK] netlify.toml
) else (
    echo    [INFO] netlify.toml missing ^(only needed for Netlify^)
)
echo.
echo ========================================================
echo Next Steps:
echo    1. Test locally: npm run dev
echo    2. Deploy: git add . ^&^& git commit -m "Fix Bluetooth config" ^&^& git push
echo    3. Connect your smartwatch!
echo.
echo See CONNECT_SMARTWATCH_GUIDE.md for detailed instructions
echo ========================================================
echo.
pause
