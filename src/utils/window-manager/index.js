const {BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Events = require('./events')
const WindowStateManager = require('electron-window-state-manager')

/**
 * 窗口管理器
 * 在主进程创建实例，渲染进程需要配合 preload 方法使用
 * 支持功能：
 * - 管理创建的窗口
 * - 向单独窗口发送消息
 * - 窗口状态管理
 * - 广播消息
 */
class WindowManager {
  constructor() {
    // 当前窗口列表
    this.windows = new Map()
    // 用来判断 IPC 事件是否初始化的值
    this.initialized = false

    // 监听事件
    this.onCreateWindow = (ev, config, url) => {
      this.createWindow(config, url)
    }
    this.onSendMessage = (ev, windowId, message) => {
      ev.sender.send(Events.SEND_MESSAGE, this.sendMessage(windowId, message))
    }
    this.onSendBroadcastMessage = (ev, message) => {
      return this.sendBroadcastMassage(message)
    }
    this.onGetWindowIds = () => {
      return this.getWindowIds()
    }

    /**
     * 调用 window 函数
     * @param ev
     * @param windowId
     * @param action 可以是函数或属性
     * @returns {void|*}
     */
    this.handleWindowAction = (ev, windowId, action) => {
      if (!action) {
        throw new Error('action can not be empty')
      }
      const window = this.getWindowById(windowId)
      switch (action) {
        case 'hideWindow':
          window.hide()
          return window.setSkipTaskbar(true)
        case 'showWindow':
          window.show()
          return window.setSkipTaskbar(false)
        default:
          const val = window[action]
          const isFunction = typeof val === 'function'
          return isFunction ? window[action]() : val
      }
    }

    this.initializeIpcEvents()
  }

  // 初始化 IPC 事件
  initializeIpcEvents() {
    if (this.initialized) {
      return
    }

    ipcMain.handle(Events.CREATE_WINDOW, this.onCreateWindow)
    ipcMain.handle(Events.SEND_MESSAGE, this.onSendMessage)
    ipcMain.handle(Events.SEND_BROADCAST_MESSAGE, this.onSendBroadcastMessage)
    ipcMain.handle(Events.GET_WINDOW_IDS, this.onGetWindowIds)
    ipcMain.handle(Events.WINDOW_ACTION, this.handleWindowAction)

    this.initialized = true
  }

  // 释放 IPC 事件
  releaseIpcEvents() {
    if (this.initialized) {
      ipcMain.removeAllListeners(Events.CREATE_WINDOW)
      ipcMain.removeAllListeners(Events.SEND_MESSAGE)
      ipcMain.removeAllListeners(Events.SEND_BROADCAST_MESSAGE)
      ipcMain.removeAllListeners(Events.GET_WINDOW_IDS)
      ipcMain.removeAllListeners(Events.WINDOW_ACTION)
    }
    this.initialized = false
  }

  /**
   * 创建窗口
   * @param config 窗口配置
   * @param url 窗口内容 loadUrl
   * @returns {Electron.BrowserWindow}
   */
  createWindow(config = {}, url = 'http://localhost:3001') {
    const {
      width = 800,
      height = 600,
      x,
      y,
      minWidth,
      minHeight,
      show = true,
      frame = false,
      transparent = false,
      resizable = true,
      icon = path.join(__dirname, '../../../build/256x256.png'),
      // webPreferences
      spellcheck = false,
      devTools = true,
      nodeIntegration = true,
      enableRemoteModule = true,
      preload,
      contextIsolation = false,
      nodeIntegrationInWorker = false,
      // custom config
      isOpenDevTools = false, // 是否自动开启调试工具
      saveWindowStateName,
      isCloseHide = false, // 点击关闭最小化到任务栏而不是关闭窗口
    } = config

    let mPreload
    if (!preload) {
      const preloadName = (!nodeIntegration && contextIsolation) ? 'preload.js' : 'preload-node.js'
      mPreload = path.join(__dirname, `../../${preloadName}`)
    }

    let mainWindowState

    if (saveWindowStateName) {
      // 保存窗口位置和大小
      mainWindowState = new WindowStateManager(saveWindowStateName, {
        defaultWidth: width,
        defaultHeight: height
      })
    } else {
      mainWindowState = {
        width: width,
        height: height,
        x: x,
        y: y,
      }
    }

    // console.log('[wm] mainWindowState', mainWindowState)

    const window = new BrowserWindow({
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      minWidth,
      minHeight,
      show,
      frame,
      transparent,
      resizable,
      icon,
      webPreferences: {
        spellcheck,
        devTools,
        nodeIntegration,
        enableRemoteModule,
        preload: mPreload,
        contextIsolation,
        nodeIntegrationInWorker,
      }
    });
    window.loadURL(url);

    const windowId = window.id
    console.log(`[wm] window id=${windowId} create`)

    window.on('close', (event) => {
      console.log(`[wm] window id=${windowId} on close`)
      if (saveWindowStateName) {
        mainWindowState.saveState(window)
      }

      if (isCloseHide) {
        window.hide();
        window.setSkipTaskbar(true);
        event.preventDefault();
        console.log(`[wm] window id=${windowId} hide`)
      }
    })

    window.on('closed', (event) => {
      console.log(`[wm] window id=${windowId} was closed`)

      this.windows.delete(windowId)
      this.notifyUpdateWindowIDs(windowId)

    })

    if (isOpenDevTools) {
      window.webContents.openDevTools()
    }

    if (mainWindowState.maximized) {
      window.maximize();
    }

    this.windows.set(windowId, window)
    this.notifyUpdateWindowIDs(windowId)
    return window
  }

  /**
   * 通知窗口 ids 更新
   * @param windowId
   */
  notifyUpdateWindowIDs(windowId) {
    const windowIds = Array.from(this.windows.keys())
    this.windows.forEach(win => {
      if (win.id === windowId) {
        return
      }

      win.webContents.send(Events.UPDATE_WINDOW_IDS, windowIds)
    })
  }

  /**
   * 向窗口发送消息
   * @param windowId
   * @param message
   * @returns {boolean} 是否发送成功
   */
  sendMessage(windowId, message) {
    // console.log('sendMessage', windowId, message)
    const window = this.getWindowById(windowId)
    // console.log('window', this.windows, window)
    if (window) {
      window.webContents.send(Events.UPDATE_MESSAGE, message)
      return true
    }
    return false
  }

  /**
   * 向所有窗口发送广播消息
   * @param message
   */
  sendBroadcastMassage(message) {
    // 遍历 Map
    this.windows.forEach(window => {
      window.webContents.send(Events.UPDATE_MESSAGE, message)
    })
  }

  /**
   * 获取当前所有窗口 id 数组
   * @returns []
   */
  getWindowIds() {
    return Array.from(this.windows.keys())
  }

  getWindowById(windowId) {
    return this.windows.get(Number(windowId))
  }
}

module.exports = WindowManager
