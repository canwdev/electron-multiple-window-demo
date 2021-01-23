const ipc = require('electron').ipcRenderer;

const msgEl = document.getElementById('msg')
const progressWrapEL = document.getElementById('progressWrap')
const progressEL = document.getElementById('progress')
const progressTextEL = document.getElementById('progressText')

// ipc.send('get-cpu-info');

ipc.on('update-progress', function (event, arg) {
  progressWrapEL.style.opacity = 1
  const {progress, msg} = arg
  msgEl.innerText = msg ? msg : '正在启动...'
  progressEL.style.width = progress + '%'
  progressTextEL.innerText = progress + '%'
})
