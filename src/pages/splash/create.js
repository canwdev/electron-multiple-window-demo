const {BrowserWindow} = require('electron')
const path = require('path')
// const ipc = require('electron').ipcMain;

const createWindow = () => {
  let win
  win = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, '../../../build/256x256.png')
  });
  win.setResizable(false);
  win.loadURL(
    'file://' + __dirname + '/index.html'
  );
  win.on('closed', () => (win = null));
  win.webContents.on('did-finish-load', () => {
    win.show();
  });
  // win.webContents.openDevTools()
  // ipc.on('get-cpu-info', function (event, arg) {
  //   event.sender.send('cpu-info-reply', '1111')
  // })

  return win
};

module.exports = createWindow
