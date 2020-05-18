import { Fxb } from 'fxbjs'

const Store = require('electron-store')
const yaml = require('js-yaml');
const store = new Store({
    cwd: process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(),
    name: 'config',
	fileExtension: 'yaml',
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad
});

const generateXMLFromState = ret => {
    return `<SSD_SAMPLER_STATE${
        Object.entries(ret)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('')
    }/>`
}

export const strict = false

export const state = () => ({
   reader: null,
   buffer: null,
   conf: {},
   currentPerformance: false
})
  
export const mutations = {
    setReader (state, reader) {
        state.reader = reader;
    },
    setBuffer (state, buffer) {
        state.buffer = buffer;
    },
    setConf (state, conf) {
        state.conf = conf;
    },
    setParameter (state, {key, value}) {
        state.conf[key] = value
        const outerHtml = Buffer.from(generateXMLFromState(state.conf))
        state.buffer = Buffer.concat([
            state.buffer.slice(0, 8),
            outerHtml
        ])
        state.buffer.writeInt32LE(outerHtml.length, 4)
        state.reader.set('data', state.buffer)
        state.reader.write(store.get('fxb.path'))
        state.reader.write(store.get('fxb.temppath'))
    },
    setParameters (state, data) {
        for (let key in data) {
            state.conf[key] = data[key]
        }
        const outerHtml = Buffer.from(generateXMLFromState(state.conf))
        state.buffer = Buffer.concat([
            state.buffer.slice(0, 8),
            outerHtml
        ])
        state.buffer.writeInt32LE(outerHtml.length, 4)
        state.reader.set('data', state.buffer)
        state.reader.write(store.get('fxb.path'))
        state.reader.write(store.get('fxb.temppath'))
    }
}

export const actions = {
    loadBase({ commit }) {
        const base = Fxb.loadFile(store.get('fxb.path'))
        const data = base.get('data')
        commit('setReader', base)
        commit('setBuffer', data)

        const size = data.readInt32LE(4);
        const content = data.slice(8, size + 8)
        
        const regex = /([a-z_0-9\-]+)="([^"]*)"/gmi;
        let m;

        let ret = {}
        while ((m = regex.exec(content.toString())) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            ret[m[1]] = m[2]
        }
        
        commit('setConf', ret)
    },
    importKitFromDAW({ commit }, { name, category, currentPerformance }) {
        const base = Fxb.loadFile(currentPerformance === -1 ? store.get('fxb.path') : store.get('fxb.temppath'))
        const data = base.get('data')

        const size = data.readInt32LE(4);
        const content = data.slice(8, size + 8)
        
        const regex = /([a-z_0-9\-]+)="([^"]*)"/gmi;
        let m;

        let ret = {}
        while ((m = regex.exec(content.toString())) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            ret[m[1]] = m[2]
        }
        
        commit('kits/addKit', {
            name,
            category,
            data: ret
        }, { root: true })
    }
}