// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const httpServer = require('http-server/lib/http-server')
const portfinder = require('portfinder')
const createSplash = require('./pages/splash/create')
const path = require('path')

require('./utils/ipc-main')
const wm = require('./utils/wm')

let port = 3000 //默认端口
const host = 'localhost'
const isDev = isElectionDevMode() // 如果要在开发模式测试打包后的运行环境，请设为 false

let mainWindow;
let splashWindow

//保存窗口记录
const createWindow = () => {
  mainWindow = wm.createWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      frame: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
      customConfig: {
        isOpenDevTools: isDev,
        saveWindowStateName: 'mainWindow',
      }
    },
    `http://${host}:${port}`
  )

  /// keep listening on the did-finish-load event, when the mainWindow content has loaded
  mainWindow.webContents.on('did-finish-load', () => {
    /// then close the loading screen window and show the main window
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close()
      splashWindow.destroy()
    }
    mainWindow.show();
  });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  splashWindow = createSplash()
  splashWindow.webContents.on('did-finish-load', () => {
    if (isDev) {
      createWindow()
    } else {
      startClientProd(path.join(__dirname, '../public'))
    }
  })
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

function startClientProd(publicPath) {
  console.log('starting client prod...', publicPath)

  portfinder.basePort = port;
  portfinder.getPort(function (err, portfinder) {
    if (err) {
      createServer()
      throw new Error('端口扫描失败')
    } else {
      port = portfinder
      createServer(portfinder)
    }
  });

  function createServer() {
    const server = httpServer.createServer({
      proxy: `http://${host}:${port}?`,
      cache: -1,
      root: publicPath,
    });
    server.listen(port, host, createWindow)
  }
}

function isElectionDevMode() {
  const electron = require('electron');

  const app = electron.app || electron.remote.app;

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
}
