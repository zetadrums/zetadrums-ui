import { Fxb } from 'fxbjs'

export const strict = false

export const state = () => ({
   reader: null,
   buffer: null,
   xml: null,
   conf: {}
})
  
export const mutations = {
    setReader (state, reader) {
        state.reader = reader;
    },
    setBuffer (state, buffer) {
        state.buffer = buffer;
    },
    setXml (state, xml) {
        state.xml = xml;
    },
    setConf (state, conf) {
        state.conf = conf;
    },
    setParameter (state, {key, value}) {
        state.conf[key] = value
        state.xml.setAttribute(key, value)
        const outerHtml = Buffer.from(state.xml.outerHTML)
        state.buffer = Buffer.concat([
            state.buffer.slice(0, 8),
            outerHtml
        ])
        state.buffer.writeInt32LE(outerHtml.length, 4)
        state.reader.set('data', state.buffer)
        state.reader.write(__dirname + '/../assets/ssd5.5.fxb')
    },
    setParameters (state, data) {
        for (let key in data) {
            state.conf[key] = data[key]
            state.xml.setAttribute(key, data[key])
        }
        const outerHtml = Buffer.from(state.xml.outerHTML)
        state.buffer = Buffer.concat([
            state.buffer.slice(0, 8),
            outerHtml
        ])
        state.buffer.writeInt32LE(outerHtml.length, 4)
        state.reader.set('data', state.buffer)
        state.reader.write(__dirname + '/../assets/ssd5.5.fxb')
    }
}

export const actions = {
    loadBase({ commit }) {
        const base = Fxb.loadFile(__dirname + '/../assets/ssd5.5.fxb')
        const data = base.get('data')
        commit('setReader', base)
        commit('setBuffer', data)

        const size = data.readInt32LE(4);
        const content = data.slice(8, size + 8)
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/html");
        const ssdSamplerState = xmlDoc.getElementsByTagName('ssd_sampler_state')[0]

        let ret = {}
        for (let o of ssdSamplerState.attributes) {
            ret[o.name] = o.value
        }

        commit('setXml', ssdSamplerState)
        commit('setConf', ret)
    }
}