const fs = require('fs')

export const strict = false

export const state = () => ({
   kits: {}
})
  
export const mutations = {
    setKit (state, { id, data }) {
        state.kits[id] = data;
    }
}

export const actions = {
    load({ commit, dispatch }, currentKit) {
        const cwd = process.cwd();
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