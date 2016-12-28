@ECHO OFF

where npm >nul 2>nul
IF %errorlevel%==1 goto needsNode
IF %errorlevel%==0 goto ask

:needsNode
  ECHO npm not found in path.
  ECHO install node js - https://nodejs.org/en/
  PAUSE
  EXIT /B 0

:installNode
  ECHO Installing node modules
  npm install
  EXIT /B 0

:ask
  ECHO Select which platform to deploy for
  ECHO w32 - For windows 32bit
  ECHO w64 - For windows 64bit
  SET /P INPUT= "Platform: "
  If /I "%INPUT%"=="w32" goto w32
  If /I "%INPUT%"=="w64" goto w64
  ECHO Invalid Platform
  goto ask

:beforeBuild
  IF NOT EXIST node_modules CALL :installNode
  EXIT /B 0

:afterBuild
  ECHO Building complete
  IF EXIST compiled RD /s /q compiled
  EXIT /B 0

:w32
  CALL :beforeBuild
  ECHO Building Windows 32bit App
  CALL npm run build-w32
  CALL :afterBuild
  PAUSE
  EXIT /B 0

:w64
  CALL :beforeBuild
  ECHO Building Windows 64bit App
  CALL npm run build-w64
  CALL :afterBuild
  PAUSE
  EXIT /B 0
