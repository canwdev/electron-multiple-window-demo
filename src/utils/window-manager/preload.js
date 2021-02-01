const {remote, ipcRenderer} = require('electron')
const Events = require('./events')

module.exports = {
  // 创建窗口
  async wmCreateWindow(config, url) {
    return await ipcRenderer.invoke(Events.CREATE_WINDOW, config, url)
  },
  // 向窗口发送消息
  async wmSendMessage(windowId, message) {
    return await ipcRenderer.invoke(Events.SEND_MESSAGE, windowId, message)
  },
  // 向所有窗口发送广播消息
  async wmSendBroadcastMessage(message) {
    return await ipcRenderer.invoke(Events.SEND_BROADCAST_MESSAGE, message)
  },
  // 获取所有窗口ids
  async wmGetWindowIds() {
    return await ipcRenderer.invoke(Events.GET_WINDOW_IDS)
  },
  async wmWindowAction(windowId, action, params) {
    return await ipcRenderer.invoke(Events.WINDOW_ACTION, windowId, action, params)
  },
  /**
   * 监听消息更新事件
   * @param channel
   * @param listener 回调函数
   */
  onChannelMessage(channel = Events.UPDATE_MESSAGE, listener) {
    ipcRenderer.on(channel, listener)
  },
  offChannelMessage(channel = Events.UPDATE_MESSAGE, listener) {
    ipcRenderer.off(channel, listener)
  },
  /**
   * 监听窗口变化事件
   * @param listener 回调函数
   */
  onUpdateWindowIds(listener) {
    ipcRenderer.on(Events.UPDATE_WINDOW_IDS, listener)
  },
  // 当前窗口事件监听
  windowEventListener(name, callback) {
    remote.getCurrentWindow().on(name, callback)
  },
  // 当前窗口事件取消监听
  windowEventListenerOff(name, callback) {
    remote.getCurrentWindow().off(name, callback)
  },
  // 窗口最小化
  minWindow() {
    remote.getCurrentWindow().minimize()
  },
  // 获取 isMaximized
  getIsMaximized() {
    return remote.getCurrentWindow().isMaximized()
  },
  // 获取 isResizable
  getIsResizable() {
    return remote.getCurrentWindow().isResizable()
  },
  getWindowId() {
    return remote.getCurrentWindow().id
  },
  // 窗口最大化
  maxWindow(isMaxed) {
    const browserWindow = remote.getCurrentWindow()
    if (!isMaxed) {
      browserWindow.unmaximize()
    } else {
      browserWindow.maximize()
    }
  },
  // 窗口关闭
  closeWindow() {
    remote.getCurrentWindow().hide() // 防止卡顿，先隐藏窗口
    remote.getCurrentWindow().close()
  },
  // 窗口隐藏
  hideWindow() {
    remote.getCurrentWindow().hide()
  },
  // 窗口显示
  showWindow() {
    remote.getCurrentWindow().show()
  },
}
