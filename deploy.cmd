@echo off
REM One-click build + deploy. Requires Node 20+ (Hexo 8).
cd /d %~dp0
set NODE=C:\Users\strugglexiang\AppData\Roaming\nvm\v24.15.0\node.exe
if not exist "%NODE%" set NODE=node

"%NODE%" node_modules\hexo\bin\hexo clean
if errorlevel 1 goto :error
"%NODE%" node_modules\hexo\bin\hexo generate
if errorlevel 1 goto :error
"%NODE%" node_modules\hexo\bin\hexo deploy
if errorlevel 1 goto :error

echo.
echo Build OK - deployed to https://strugglexiang.github.io/
goto :eof

:error
echo.
echo FAILED. Check the output above.
pause
exit /b 1
