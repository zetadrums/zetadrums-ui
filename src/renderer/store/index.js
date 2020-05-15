const Store = require('electron-store')
const yaml = require('js-yaml');
const store = new Store({
    cwd: process.cwd(),
    name: 'config',
	fileExtension: 'yaml',
	serialize: yaml.safeDump,
	deserialize: yaml.safeLoad
});
const osc = require('osc');

export const strict = false

export const state = () => ({
    loggedInToHost: null,
    volume: store.get('config.volume', 100),
    oscPort: null,
    categories: store.get('categories', []),
    currentKit: store.get('kits.current'),
    currentPerformance: store.get('kits.currentPerformance')
})
  
export const mutations = {
    setHostConnectionState (state, newState) {
        state.loggedInToHost = newState;
    },
    setVolume (state, newVolume) {
        state.volume = newVolume;
        store.set('config.volume', newVolume)
        try {
            const args = [
                {
                    type: 'f',
                    value: newVolume / 100
                }
            ];
            console.log('[OSC] Calling ', store.get('host.volumeMethod'), 'with', JSON.stringify(args));
            state.oscPort.send({
                address: store.get('host.volumeMethod'),
                args: args || []
            }); 
        } catch (err) {
            console.error(err)
        }
    },
    refreshPerformance(state, nb) {
        try {
            state.currentPerformance = state.currentPerformance === -1 ? 0 : -1
            store.set('kits.currentPerformance', state.currentPerformance)
            const args = [
                {
                    type: 'i',
                    value: state.currentPerformance
                }
            ];
            console.log('[OSC] Calling ', store.get('host.performanceMethod'), 'with', JSON.stringify(args));
            state.oscPort.send({
                address: store.get('host.performanceMethod'),
                args: args || []
            }); 
        } catch (err) {
            console.error(err)
        }
    },
    setCurrentKit(state, id) {
        state.currentKit = id
        store.set('kits.current', id)
    },
    setOscPort (state, oscPort) {
        state.oscPort = oscPort;
    }
}

export const actions = {
    connectToHost({ commit, dispatch }) {
        commit('setHostConnectionState', null)
        try {
            let oscPort;

            switch (store.get('host.mode')) {
                case 'UDP':
                    oscPort = new osc.UDPPort({
                        metadata: true,
                        remoteAddress: store.get('host.ip'),
                        remotePort: store.get('host.port')
                    });
                    break;
                case 'TCP':
                default:
                    oscPort = new osc.TCPSocketPort({
                        metadata: true,
                        remoteAddress: store.get('host.ip'),
                        remotePort: store.get('host.port')
                    });
                    break;
            }
            commit('setOscPort', oscPort)
            oscPort.open(store.get('host.ip'), store.get('host.port'));
            oscPort.on('ready', () => {
                commit('setHostConnectionState', true)
            })
            oscPort.on('error', () => {
                commit('setHostConnectionState', false)
                setTimeout(() => {
                    dispatch('connectToHost')
                }, 10000)
            })
            oscPort.on('message', (msg) => {
               console.log('[OSC] Message received from host :', JSON.stringify(msg));
            })

            // Init
            dispatch('afterConnectActions')
        } catch (err) {
            console.log(err)
            commit('setHostConnectionState', false)
            setTimeout(() => {
                dispatch('connectToHost')
            }, 10000)
        }
    },
    send({state}, {endpoint, args, prefix}) {
        try {
            console.log('[OSC] Calling ', `${(prefix === undefined || prefix) ? store.get('host.path') : ''}${endpoint}`, 'with', JSON.stringify(args, 4));
            state.oscPort.send({
                address: `${(prefix === undefined || prefix) ? store.get('host.path') : ''}${endpoint}`,
                args: args || []
            }); 
        } catch (err) {
            console.error(err)
        }
    },
    afterConnectActions({state, dispatch}) {
        dispatch('send', {
            endpoint: store.get('host.volumeMethod'),
            args: [
                {
                    type: 'f',
                    value: state.volume / 100
                }
            ],
            prefix: false
        })
    }
}