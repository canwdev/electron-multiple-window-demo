const WindowManager = require('@canwdev/electron-window-manager')
const path = require('path')

// 全局唯一 wm 实例
const wm = new WindowManager({
  preloadDir: path.join(__dirname, '../')
})

module.exports = wm
