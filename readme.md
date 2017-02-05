## ElectronMV v1.1.X
[Electron](http://electron.atom.io/) wrapper for RPG Maker MV. Wrapping MV with Electron gives a handful of benefits. One of the main benefits includes in this wrapper is being able to remember the window position, size and if it was full screened the next time it's opened. See example here:
[twitter link](https://twitter.com/QuasiXi/status/802891839040733184)

[RPG Maker Web thread](http://forums.rpgmakerweb.com/index.php?threads/electronmv.71778/)

## Installing
1. Download or clone the repo
2. Copy your projects files into the app folder. Do not accept to overwrite files, if copying into the app folder. Your project should have 5 new files; `app/js/electronMain.js`, `app/js/electronRenderer.js`, `app/data/winData.json`, `app/index.html`, `app/package.json`. Do not rename the app folder unless you know what you're doing.

## Running Project with Electron
1. Install [Node.js](https://nodejs.org/en/download/)
2. Open the folder containing the first package.json. ( Not the second package.json inside the app folder )
3. Install the dependencies, on first time use

 `npm install`
4. Once they are installed you can run electron with

 macOS / Linux

 `./node_modules/.bin/electron . --dev`

 Windows:

 `.\\node_modules\\.bin\\electron . --dev`

 Or by running the included play.bat.

Notes

- If you don't know how to use the cli, I included a `play.bat` file. Just double click that and it will do the steps 3-4 for you.
- Hitting play test in the MV Editor will start with nw.js, but the new index.html will close nw.js and restart it with Electron. So you can also play by using the test play in the editor.
- I haven't tested running on macOS or Linux, so not sure if you have to escape the /. Also the play.bat runs the windows command, so play.bat only works for windows right now.

## Building your game
If you build you game with the RPG Maker MV editor through deployment, it will be built with nw.js. To build with electron you can use [Electron builder](https://github.com/electron-userland/electron-builder). Which is already added in the dev dependencies. It is also configured to build windows 32 and 64bit apps, just run the following cli:

`npm run build-w32` for windows 32
`npm run build-w64` for windows 64

Notes

- If you don't know how to use the cli, I included a `deploy.bat` file. Run that file and it will help you build it.
- Builder isn't configed for Linux or macOS. If someone can set them up and push the change that would be awesome.

## Configuring
You will need to configure 2 files. `app/package.json` and `app/data/winData.json`.

*app/package.json*

This file contains data for the exe file when built. In this file you will need to change the values for:

1. name - This is the name of the .exe when built
2. version - The current version of the game build in x.y.z format
3. description - the description of the .exe / app
4. author - author of the app
5. license - license of the app

*app/data/winData.json*

This file contains data for the window settings. You will need to change the following values:

1. res - The resolution of the game in the format: [width, height]
2. resizable - If the window is resizable, set to true or false
3. fullscreen - If the window starts fullscreen on first run, set to true or false.

## Terms
Free to use for all projects.
