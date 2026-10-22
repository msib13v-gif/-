@echo off
setlocal
cd /d "%~dp0"
set "BILTO_NODE=node"
if exist "%LOCALAPPDATA%\Programs\GapGPT\resources\bin\node.exe" set "BILTO_NODE=%LOCALAPPDATA%\Programs\GapGPT\resources\bin\node.exe"
echo Bilto - Open http://localhost:4173 in your browser.
echo Keep this window open while using the application.
"%BILTO_NODE%" server.mjs
pause
