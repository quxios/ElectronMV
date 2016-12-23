window.Imported = {
  QElectron: '1.0.1'
}

if (!Utils.isNwjs()) {
  throw new Error('Electron is only for desktop / local deployment.');
}

//-----------------------------------------------------------------------------
// constants

const { ipcRenderer } = require('electron');
const winData = ipcRenderer.sendSync('get-WinData');

//-----------------------------------------------------------------------------
// Utils

Utils.inProduction = function() {
  return process.env.PRODUCTION === 'true';
}

//-----------------------------------------------------------------------------
// Input

Input._wrapNwjsAlert = function() {
  // Don't think this is needed
}

//-----------------------------------------------------------------------------
// Graphics

Graphics._switchFullScreen = function() {
  ipcRenderer.send('set-fullscreen');
}

//-----------------------------------------------------------------------------
// StorageManager

StorageManager.localFileDirectoryPath = function() {
    const path = require('path');
    const fs   = require('fs');
    const base = path.dirname(process.mainModule.filename);
    let dir = '';
    if (Utils.inProduction()) {
      dir = path.join(base, '../save/');
    } else {
      dir = path.join(base, './save/');
    }
    return dir;
};

//-----------------------------------------------------------------------------
// SceneManager

SceneManager._screenWidth  = winData.res[0];
SceneManager._screenHeight = winData.res[1];
SceneManager._boxWidth     = winData.res[0];
SceneManager._boxHeight    = winData.res[1];

SceneManager.initNwjs = function() {
  // Not needed, no longer uses nwjs, uses electron instead
}

let Alias_SceneManager_onKeyDown = SceneManager.onKeyDown;
SceneManager.onKeyDown = function(event) {
  if (!event.ctrlKey && !event.altKey) {
    if (event.keyCode === 119) {
      ipcRenderer.send('open-DevTools');
    }
  }
  Alias_SceneManager_onKeyDown.call(this, event);
}

//-----------------------------------------------------------------------------
// PluginManager

let Alias_PluginManager_loadScript = PluginManager.loadScript;
PluginManager.loadScript = function(name) {
  if (this.needsRequire(name)) {
    require(`./plugins/${name}`);
  } else {
    Alias_PluginManager_loadScript.call(this, name);
  }
}

PluginManager.needsRequire = function(name) {
  return /-req\.js$/.test(name);
}

//-----------------------------------------------------------------------------
// Extra Electron stuff

window.onbeforeunload = function() {
  const winData = ipcRenderer.sendSync('get-WinData');
  const path = require('path');
  const fs   = require('fs');
  const base = path.dirname(process.mainModule.filename);
  let dir = '';
  if (Utils.inProduction()) {
    dir = path.join(base, '../save/winData.rpgsave');
  } else {
    dir = path.join(base, './save/winData.rpgsave');
  }
  const data = Buffer.from(JSON.stringify(winData), 'utf8').toString('base64');
  if (!fs.existsSync(path.dirname(dir))) {
    fs.mkdirSync(path.dirname(dir));
  }
  fs.writeFileSync(dir, data);
}
