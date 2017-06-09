window.Imported = {
  QElectron: '1.1.4'
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
};

Utils.isDev = function() {
  return process.env.DEV === 'true';
};

var Alias_Utils_isOptionValid = Utils.isOptionValid;
Utils.isOptionValid = function(name) {
  if (name === 'test') {
    return Utils.isDev();
  } else {
    return Alias_Utils_isOptionValid.call(this, name);
  }
};

//-----------------------------------------------------------------------------
// Input

Input._wrapNwjsAlert = function() {
  // Don't think this is needed
};

//-----------------------------------------------------------------------------
// Graphics

Graphics._switchFullScreen = function() {
  ipcRenderer.send('set-fullscreen');
};

//-----------------------------------------------------------------------------
// StorageManager

StorageManager.localFileDirectoryPath = function() {
  const path = require('path');
  const fs   = require('fs');
  const base = path.dirname(process.mainModule.filename);
  let dir = '';
  if (Utils.inProduction()) {
    // When in production, by default, the files are in an .asar package
    // so we need to save outside the asar by going back 1 path
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
};

let Alias_SceneManager_onKeyDown = SceneManager.onKeyDown;
SceneManager.onKeyDown = function(event) {
  if (!event.ctrlKey && !event.altKey) {
    if (event.keyCode === 119 && Utils.isOptionValid('test')) {
      ipcRenderer.send('open-DevTools');
      return;
    }
  }
  Alias_SceneManager_onKeyDown.call(this, event);
};

//-----------------------------------------------------------------------------
// PluginManager

let Alias_PluginManager_loadScript = PluginManager.loadScript;
PluginManager.loadScript = function(name) {
  if (this.needsRequire(name)) {
    require(`./plugins/${name}`);
  } else {
    Alias_PluginManager_loadScript.call(this, name);
  }
};

// Plugins that in in -req.js are loaded in by requiring them
// instead of loading as a script tag to the dom
PluginManager.needsRequire = function(name) {
  return /-req\.js$/.test(name);
};
