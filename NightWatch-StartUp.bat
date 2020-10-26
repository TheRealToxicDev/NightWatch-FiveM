@echo off

title NightWatch

echo Starting the bot, Made By: Toxic Dev

ping localhost 3 >nul 

node NightWatch-StartUp.js

cls

IF ERRORLEVEL 0 ECHO It seems the bot failed to start, Contact  ☣ Tσxιƈ Dҽʋ ☣#7308 by joining https://discord.gg/MbjZ7xc

ping localhost -n 20 >nul

exit