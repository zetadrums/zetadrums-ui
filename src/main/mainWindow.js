import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
const isDev = process.env.NODE_ENV === 'development'

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

const winHandler = new BrowserWinHandler({
  height: 1080,
  width: 1920,
  frame: false,
  fullscreen: !isDev,
  alwaysOnTop: !isDev,
  show: false
})

winHandler.onCreated(browserWindow => {
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  else browserWindow.loadFile(INDEX_PATH)
})

export default winHandler
