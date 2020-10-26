@echo off

rem just a basic dependencie installer LMFAO

echo Welcome and Thanks for using NightWatch

ping localhost -n 2 >nul

cls

GOTO :start

:start

SET /P UPDATE=Are you sure you want to update/install all dependencies? (Y/N)

IF /I %UPDATE% NEQ "Y" GOTO updater

if /I %UPDATE% NEQ "N" GOTO closer

:updater 

cls

echo Please wait while everything installs.....

ping localhost -n 2 >nul

cls 

npm install

:closer

echo Thanks for using NightWatch

ping localhost -n 2 >nul

cls

exit