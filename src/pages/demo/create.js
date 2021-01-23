const {BrowserWindow} = require('electron')
const path = require('path')
// const ipc = require('electron').ipcMain;

const createWindow = () => {
  let win
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    transparent: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, '../../preload-node.js')
    },
    icon: path.join(__dirname, '../../../build/256x256.png')
  });
  win.setResizable(true);
  win.loadURL('http://localhost:4999');
  win.on('closed', () => (win = null));
  win.webContents.on('did-finish-load', () => {
    win.show();
  });
  // win.webContents.openDevTools()

  return win
};

module.exports = createWindow
