const {app} = require('electron')
const path = require('path')
const {
  ipcOnEventSync,
  ipcOnEventAsync
} = require('./ipc/ipc-helper-main')
const {
  IPC_EVENT_GET_APP_PATH,
  IPC_EVENT_START_WINDOW
} = require('../enum/events')

// 获取一些基础 路径
ipcOnEventSync(IPC_EVENT_GET_APP_PATH, (type = 'userData') => {
  return app.getPath(type)
})

// 启动窗口
ipcOnEventSync(IPC_EVENT_START_WINDOW, (name = 'demo') => {
  try {
    const createWindow = require(`../pages/${name}/create`)
    createWindow()
    return true
  } catch (e) {
    console.log(e)
    return false
  }
})
