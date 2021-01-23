const { contextBridge, ipcRenderer } = require('electron')
const Events = require('./events')

module.exports = {
  async wmCreateWindow(config, url) {
    return await ipcRenderer.invoke(Events.CREATE_WINDOW, config, url)
  },
  async wmSendMessage(windowId, message) {
    return await ipcRenderer.invoke(Events.SEND_MESSAGE, windowId, message)
  },
  async wmGetWindowIds() {
    return await ipcRenderer.invoke(Events.GET_WINDOW_IDS)
  },
  onUpdateMessage(cb) {
    ipcRenderer.on(Events.UPDATE_MESSAGE, cb)
  },
  onUpdateWindowIds(cb) {
    ipcRenderer.on(Events.UPDATE_WINDOW_IDS, cb)
  }
}
