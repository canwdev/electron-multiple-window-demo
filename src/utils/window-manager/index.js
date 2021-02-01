const {BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const Events = require('./events')
const WindowStateManager = require('electron-window-state-manager')
const deepmerge = require('deepmerge')

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
      return this.createWindow(config, url).id
    }
    this.onSendMessage = (ev, windowId, messageItem) => {
      ev.sender.send(Events.SEND_MESSAGE, this.sendMessage(windowId, messageItem))
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
     * @param params 传输函数的参数（数组）
     * @returns {void|*}
     */
    this.handleWindowAction = (ev, windowId, action, params = []) => {
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
          return (typeof window[action] === 'function')
            ? window[action](...params) : window[action]
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
   * @param windowConfig 窗口配置
   * @param url 窗口内容 loadUrl
   * @returns {Electron.BrowserWindow}
   */
  createWindow(windowConfig = {}, url = 'http://localhost:3001') {
    // 融合默认配置
    const config = deepmerge({
      width: 800,
      height: 600,
      show: true,
      frame: false,
      transparent: false,
      resizable: true,
      icon: path.join(__dirname, '../../../build/256x256.png'),
      webPreferences: {
        spellcheck: false,
        devTools: true,
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
        nodeIntegrationInWorker: false,
      },
      // 传入自定义设置
      customConfig: {
        isOpenDevTools: false, // 是否自动开启调试工具
        saveWindowStateName: undefined, // 如果要保存窗口状态，传入区分窗口的字符串
        isCloseHide: false, // 点击关闭最小化到任务栏而不是关闭窗口
      }
    }, windowConfig)

    // 自定义配置
    const customConfig = config.customConfig
    delete config.customConfig

    // 重写 webPreferences 默认配置
    const webPreferences = config.webPreferences

    // 指定 preload 文件
    if (!webPreferences.preload) {
      const {nodeIntegration, contextIsolation} = webPreferences
      const preloadName = (!nodeIntegration && contextIsolation) ? 'preload.js' : 'preload-node.js'
      webPreferences.preload = path.join(__dirname, `../../${preloadName}`)
    }

    let windowState

    if (customConfig.saveWindowStateName) {
      // 保存窗口位置和大小
      windowState = new WindowStateManager(customConfig.saveWindowStateName, {
        defaultWidth: config.width,
        defaultHeight: config.height
      })
    } else {
      windowState = {
        width: config.width,
        height: config.height,
        x: config.x,
        y: config.y,
      }
    }

    // console.log('[wm] mainWindowState', mainWindowState)
    const window = new BrowserWindow(deepmerge(config, {
      width: windowState.width,
      height: windowState.height,
      x: windowState.x,
      y: windowState.y,
    }))
    window.loadURL(url)

    const windowId = window.id
    console.log(`[wm] window id=${windowId} create`)

    window.on('close', (event) => {
      console.log(`[wm] window id=${windowId} on close`)
      if (customConfig.saveWindowStateName) {
        windowState.saveState(window)
      }

      if (customConfig.isCloseHide) {
        window.hide()
        window.setSkipTaskbar(true)
        event.preventDefault()
        console.log(`[wm] window id=${windowId} hide`)
      }
    })

    window.on('closed', (event) => {
      console.log(`[wm] window id=${windowId} was closed`)

      this.windows.delete(windowId)
      this.notifyUpdateWindowIDs(windowId)

    })

    if (customConfig.isOpenDevTools) {
      window.webContents.openDevTools()
    }

    if (windowState.maximized) {
      window.maximize()
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
    const windowIds = this.getWindowIds()
    this.windows.forEach(win => {
      if (win.id === windowId) {
        return
      }

      win.webContents.send(Events.UPDATE_WINDOW_IDS, windowIds)
    })
  }

  send(window, message) {
    let channel, data

    if (typeof message === 'string') {
      channel = Events.UPDATE_MESSAGE
      data = message
    } else {
      channel = message.channel
      data = message.data
    }

    return window.webContents.send(channel, data)
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
      this.send(window, message)
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
      this.send(window, message)
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
