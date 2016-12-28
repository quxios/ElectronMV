const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

const root = path.join(__dirname, '../')
process.env.PRODUCTION = path.extname(root) === '.asar'
const devMode = (process.argv || []).indexOf('--dev') !== -1
process.env.DEV = devMode

let win

const defaultWinDataPath = path.join(root, './data/WinData.json')
let winDataPath = ''
if (path.extname(root) === '.asar') {
  winDataPath = path.join(root, '../save/winData.rpgsave')
} else {
  winDataPath = path.join(root, './save/winData.rpgsave')
}
let defaultWinData = JSON.parse(fs.readFileSync(defaultWinDataPath, 'utf8'))
let winData = Object.assign({}, defaultWinData)

function start () {
  fs.readFile(winDataPath, 'utf8', (err, data) => {
    if (!err) {
      data = Buffer.from(data, 'base64').toString('utf8');
      winData = Object.assign(JSON.parse(data), defaultWinData);
      winData.fullscreen = JSON.parse(data).fullscreen;
    }
    if (!winData.width || !winData.height) {
      winData.width = defaultWinData.res[0]
      winData.height = defaultWinData.res[1]
    }
    createWindow();
  })
}

function createWindow () {
  win = new BrowserWindow({
    width: winData.width,
    height: winData.height,
    resizable: winData.resizable || true,
    useContentSize: true,
    webPreferences: {
      devTools: devMode && process.env.PRODUCTION !== 'true'
    }
  })

  win.loadURL(url.format({
    pathname: path.join(root, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.setMenu(null)
  win.setContentSize(winData.width, winData.height)
  if (winData.x && winData.y) {
    win.setPosition(winData.x, winData.y)
  }

  win.on('closed', () => {
    win = null
  })
  win.on('move', () => {
    winData.x = win.getPosition()[0]
    winData.y = win.getPosition()[1]
  })
  win.on('resize', () => {
    winData.width  = win.getContentSize()[0]
    winData.height = win.getContentSize()[1]
  })
  win.webContents.openDevTools({
    mode: 'detach'
  })
  win.webContents.once('devtools-opened', () => {
    win.focus()
  })
  win.setFullScreen(winData.fullscreen || false)
}

app.on('ready', start)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    start()
  }
})

ipcMain.on('get-WinData', (e) => {
  e.returnValue = Object.assign({}, winData, { fullscreen: win.isFullScreen() })
})

ipcMain.on('open-DevTools', () => {
  win.openDevTools({
    detach: true
  })
})

ipcMain.on('set-fullscreen', (e) => {
  win.setFullScreen(!win.isFullScreen())
})
