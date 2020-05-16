const fs = require('fs')
import { v4 as uuidv4 } from 'uuid';

export const strict = false

export const state = () => ({
   kits: {}
})
  
export const mutations = {
    setKit (state, { id, data }) {
        state.kits[id] = data
    },
    addKit (state, data) {
        const id = uuidv4()
        const cwd = process.env.PORTABLE_EXECUTABLE_DIR || process.cwd()
        fs.writeFileSync(cwd + '/kits/' + id + '.json', JSON.stringify(data))
        state.kits[id] = data
    }
}

export const actions = {
    load({ commit, dispatch }, currentKit) {
        const cwd = process.env.PORTABLE_EXECUTABLE_DIR || process.cwd()
        const files = fs.readdirSync(cwd + '/kits')
        for (let filepath of files) {
            if (filepath.match(/\.json$/) === false) {
                continue
            }
            const fileContent = fs.readFileSync(cwd + '/kits/' + filepath).toString()
            try {
                const data = JSON.parse(fileContent)
                const id = filepath.replace('.json', '')
                commit('setKit', {
                    id,
                    data
                })
                if (id === currentKit) {
                    dispatch('setCurrentKit', id)
                }
            } catch {}
        }
    },
    setCurrentKit({ state, commit }, id) {
        commit('setCurrentKit', id, { root: true })
        commit('fxb/setParameters', state.kits[id].data, { root: true })
        commit('refreshPerformance', 0, { root: true })
    }
}