import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'

const isDev = process.env.NODE_ENV === 'development'

const Store = require('electron-store')
const yaml = require('js-yaml');
const store = new Store({
    cwd: process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(),
    name: 'config',
	fileExtension: 'yaml',
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad
});

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

const winHandler = new BrowserWinHandler({
  height: 1080,
  width: 1920,
  frame: false,
  fullscreen: store.get('config.fullscreen', true),
  alwaysOnTop: store.get('config.alwaysOnTop', true),
  show: false
})

winHandler.onCreated(browserWindow => {
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  else browserWindow.loadFile(INDEX_PATH)
})

export default winHandler
