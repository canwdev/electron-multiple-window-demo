const {BrowserWindow} = require('electron')
const path = require('path')
// const ipc = require('electron').ipcMain;

const createWindow = () => {
  let win
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: false,
    transparent: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, '../../preload-node.js')
    },
    icon: path.join(__dirname, '../../../build/256x256.png')
  });
  win.setResizable(true);
  win.loadURL(
    'file://' + __dirname + '/index.html'
  );
  win.on('closed', () => (win = null));
  win.webContents.on('did-finish-load', () => {
    win.show();
  });
  // win.webContents.openDevTools()

  // win.webContents.on('dom-ready', e => {
  //   // 插入api脚本
  //   const apiPath = encodeURIComponent(path.join(__dirname, '../../utils/electron-api'))
  //   win.webContents.executeJavaScript(`window.electronAPI = require(decodeURIComponent('${apiPath}'));console.log('api injected')`)
  // })

  return win
};

module.exports = createWindow
