@echo off
REM One-click build + deploy. Must use Node 12: newer Node produces 0-byte files (see notes).
cd /d %~dp0
set NODE=C:\Users\strugglexiang\AppData\Roaming\nvm\v12.22.12\node64.exe

"%NODE%" node_modules\hexo\bin\hexo clean
if errorlevel 1 goto :error
"%NODE%" node_modules\hexo\bin\hexo generate
if errorlevel 1 goto :error
"%NODE%" node_modules\hexo\bin\hexo deploy
if errorlevel 1 goto :error

echo.
echo Build OK - check public\index.html is not 0 bytes.
echo Deployed to https://strugglexiang.github.io/
goto :eof

:error
echo.
echo FAILED. If public\index.html is 0 bytes, the build ran on the wrong Node version.
pause
exit /b 1
