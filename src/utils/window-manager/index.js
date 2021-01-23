const {BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Events = require('./events')

/**
 * 窗口管理器
 * 在主进程创建实例，渲染进程需要配合 preload 方法使用
 * 支持功能：
 * - 管理创建的窗口
 * - 向单独窗口发送消息
 */
class WindowManager {
  constructor() {
    // Current window list.
    this.windows = new Map()
    // A value indicating that an IPC events has been initialized.
    this.initialized = false

    this.onCreateWindow = (ev, config, url) => {
      this.createWindow(config, url)
    }
    this.onSendMessage = (ev, windowId, message) => {
      ev.sender.send(Events.SEND_MESSAGE, this.sendMessage(windowId, message))
    }

    this.initializeIpcEvents()
  }

  initializeIpcEvents() {
    if (this.initialized) {
      return
    }

    ipcMain.handle(Events.CREATE_WINDOW, this.onCreateWindow)
    ipcMain.handle(Events.SEND_MESSAGE, this.onSendMessage)
    ipcMain.handle(Events.GET_WINDOW_IDS, this.getWindowIds)

    this.initialized = true
  }
  releaseIpcEvents() {
    if (this.initialized) {
      ipcMain.removeAllListeners(Events.CREATE_WINDOW)
      ipcMain.removeAllListeners(Events.SEND_MESSAGE)
      ipcMain.removeAllListeners(Events.GET_WINDOW_IDS)
    }
    this.initialized = false
  }



  createWindow(config = {}, url = 'http://localhost:4999') {
    const {
      width = 800,
      height = 600,
      minWidth = 480,
      minHeight = 320,
      frame = false,
      transparent = false,
      resizable = true,
      // custom config
      isDevTools = true,
    } = config
    const window = new BrowserWindow({
      width,
      height,
      minWidth,
      minHeight,
      frame,
      transparent,
      resizable,
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, '../../preload-node.js')
      },
      icon: path.join(__dirname, '../../../build/256x256.png')
    });
    const windowId = window.id
    window.on('closed', () => {
      console.log(`Window was closed, id = ${windowId}`)
      this.windows.delete(windowId)
      this.notifyUpdateWindowIDs(windowId)
    })

    if (isDevTools) {
      window.webContents.openDevTools()
    }

    window.loadURL(url);
    this.windows.set(windowId, window)
    this.notifyUpdateWindowIDs(windowId)
    return window
  }

  notifyUpdateWindowIDs(windowId) {
    const windowIds = Array.from(this.windows.keys())
    this.windows.forEach(win => {
      if (win.id === windowId) {
        return
      }

      win.webContents.send(Events.UPDATE_WINDOW_IDS, windowIds)
    })
  }

  sendMessage(windowId, message) {
    const window = this.windows.get(windowId)
    if (window) {
      window.webContents.send(Events.UPDATE_MESSAGE, message)
      return true
    }
    return false
  }

  getWindowIds() {
    return Array.from(this.windows.keys())
  }
}

module.exports = WindowManager
