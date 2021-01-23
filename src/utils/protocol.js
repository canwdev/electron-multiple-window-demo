// 唤起协议
const {app} = require('electron')
const PROTOCOL = 'myapp' // 协议名
const urlParse = require('url');
const args = [];
// 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
// args.push(path.resolve(process.argv[1]))
// 加一个 `--` 以确保后面的参数不被 Electron 处理
args.push('--')


// 对当前主机进行注册/写入协议
app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)

//win读取数据
function handleArgv(argv, mainWindow) {
    const prefix = `${PROTOCOL}:`;
    const url = argv.find((arg, i) => arg.startsWith(prefix));
    if (url) handleUrl(url, mainWindow);
}
//url解析参数
function handleUrl(url = '', mainWindow) {
    let objData = urlParse.parse(url, true).query
    mainWindow.webContents.send('wakeData', objData)
}
module.exports = {handleArgv, handleUrl}
