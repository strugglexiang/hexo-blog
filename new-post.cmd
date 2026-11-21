@echo off
REM 新建文章：new-post.cmd "文章标题"
REM 生成 source\_posts\标题.md 并用 VS Code 打开。
setlocal
cd /d %~dp0
set NODE=C:\Users\strugglexiang\AppData\Roaming\nvm\v24.15.0\node.exe
if not exist "%NODE%" set NODE=node

if "%~1"=="" (
  echo 用法: new-post.cmd "文章标题"
  pause
  exit /b 1
)

"%NODE%" node_modules\hexo\bin\hexo new post "%~1"
if errorlevel 1 goto :error

for /f "delims=" %%f in ('powershell -NoProfile -Command "Get-ChildItem 'source\_posts\*.md' ^| Sort-Object LastWriteTime -Descending ^| Select-Object -First 1 -ExpandProperty FullName"') do set "NEWPOST=%%f"

if defined NEWPOST (
  where code >nul 2>nul && (code "%NEWPOST%") || (start "" "%NEWPOST%")
  echo.
  echo 已创建: %NEWPOST%
)
goto :eof

:error
echo.
echo 创建失败，请看上面的错误信息。
pause
exit /b 1
