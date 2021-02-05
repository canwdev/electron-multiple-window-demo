const wm = require('../../utils/wm')
const path = require('path')

const createWindow = () => {
  const splashUrl = `file://${path.join(__dirname, 'index.html')}`
  return wm.createWindow({
    width: 400,
    height: 200,
    resizable: false,
    transparent: true,
  }, splashUrl)
}

module.exports = createWindow

