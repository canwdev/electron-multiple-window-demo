const wm = require('../../utils/wm')

const createWindow = () => {
  const url = `http://localhost:3000/#/demo`
  return wm.createWindow({
    width: 800,
    height: 600,
    minWidth: 550,
    minHeight: 350,
    transparent: false,
  }, url)
}

module.exports = createWindow
