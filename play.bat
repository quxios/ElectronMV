@ECHO OFF
where npm >nul 2>nul
IF %errorlevel%==1 (
  ECHO npm not found in path.
  ECHO install node js - https://nodejs.org/en/
  PAUSE
) ELSE (
  IF NOT EXIST node_modules (
    ECHO Adding node modules
    npm install
    electron . --dev
  ) ELSE (
    electron . --dev
  )
)
