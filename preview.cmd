@echo off
REM 本地整站预览：http://localhost:4000
setlocal
cd /d %~dp0
set NODE=C:\Users\strugglexiang\AppData\Roaming\nvm\v24.15.0\node.exe
if not exist "%NODE%" set NODE=node

start "" http://localhost:4000
"%NODE%" node_modules\hexo\bin\hexo server
