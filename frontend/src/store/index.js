import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    windowIds: [],
    windowMessage: null,
    sharedState: {}
  },
  mutations: {
    setWindowIds(state, payload) {
      state.windowIds = payload
    },
    setWindowMessage(state, payload) {
      state.windowMessage = payload
    },
    setSharedState(state, payload) {
      state.sharedState = payload
    },
    updateSharedState(state, payload) {
      const {key, value} = payload
      state.sharedState[key] = value
    }
  },
  actions: {},
  modules: {}
})
