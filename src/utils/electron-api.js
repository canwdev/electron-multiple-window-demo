// for render process
const pkg = require('../../package.json')
const {ipcSendEventSync} = require('./ipc/ipc-helper-render')
const {
  IPC_EVENT_START_WINDOW,
  IPC_EVENT_GET_APP_PATH
} = require('../enum/events')
const wmPreload = require('./window-manager/preload')

module.exports = {
  ...wmPreload,
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
