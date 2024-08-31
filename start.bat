@echo off
:start
node index.js
echo [ERROR] The bot will restart in 15 seconds.
timeout /t 15 /nobreak >nul
goto start