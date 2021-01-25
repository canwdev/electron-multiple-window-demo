import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    windowIds: [],
    windowMessage: null
  },
  mutations: {
    setWindowIds(state, payload) {
      state.windowIds = payload
    },
    setWindowMessage(state, payload) {
      state.windowMessage = payload
    }
  },
  actions: {},
  modules: {}
})
