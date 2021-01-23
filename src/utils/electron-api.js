// for render process
const {remote} = require('electron')
const pkg = require('../../package.json')
const {ipcSendEventSync} = require('./ipc/ipc-helper-render')
const {
  IPC_EVENT_START_WINDOW,
  IPC_EVENT_GET_APP_PATH
} = require('../enum/events')
const wmPreload = require('./window-manager/preload')

module.exports = {
  ...wmPreload,
  // 窗口最小化
  minWindow() {
    remote.getCurrentWindow().minimize();
  },
  // 是否最大化
  getIsMaximized() {
    return remote.getCurrentWindow().isMaximized();
  },
  // 窗口最大化
  maxWindow(isMaxed) {
    const browserWindow = remote.getCurrentWindow();
    if (!isMaxed) {
      browserWindow.unmaximize();
    } else {
      browserWindow.maximize();
    }
  },
  // 窗口关闭
  closeWindow() {
    remote.getCurrentWindow().close()
    // remote.getCurrentWindow().hide()
  },
  //当前窗口时间监听
  windowEventListener(name, callback) {
    const browserWindow = remote.getCurrentWindow();
    browserWindow.on(name, callback)
  },
  getAppPath() {
    return ipcSendEventSync(IPC_EVENT_GET_APP_PATH)
  },
  getVersion() {
    return pkg.version
  },
  // 原生创建窗口方法
  createWindow(name) {
    return ipcSendEventSync(IPC_EVENT_START_WINDOW, name)
  },

}
