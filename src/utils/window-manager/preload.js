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
  // 获取所有窗口ids
  async wmGetWindowIds() {
    return await ipcRenderer.invoke(Events.GET_WINDOW_IDS)
  },
  /**
   * 监听消息更新事件
   * @param cb 回调函数
   */
  onUpdateMessage(cb) {
    ipcRenderer.on(Events.UPDATE_MESSAGE, cb)
  },
  /**
   * 监听窗口变化事件
   * @param cb 回调函数
   */
  onUpdateWindowIds(cb) {
    ipcRenderer.on(Events.UPDATE_WINDOW_IDS, cb)
  },
  // 当前窗口事件监听
  windowEventListener(name, callback) {
    const browserWindow = remote.getCurrentWindow();
    browserWindow.on(name, callback)
  },
  // 窗口最小化
  minWindow() {
    remote.getCurrentWindow().minimize();
  },
  // 获取 isMaximized
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
