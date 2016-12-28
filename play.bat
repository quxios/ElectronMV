@ECHO OFF

where npm >nul 2>nul
IF %errorlevel%==1 GOTO needsNode
IF %errorlevel%==0 GOTO runElectron

:needsNode
  ECHO npm not found in path.
  ECHO install node js - https://nodejs.org/en/
  PAUSE
  EXIT /B 0

:installNode
  ECHO Installing node modules
  npm install && electron . --dev && exit
  EXIT /B 0

:runElectron
  IF NOT EXIST node_modules GOTO :installNode
  electron . --dev && exit
  EXIT /B 0
