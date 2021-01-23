import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    windowIds: [],
    message: null
  },
  mutations: {
    setWindowIds(state, payload) {
      state.windowIds = payload
    },
    setMessage(state, payload) {
      state.message = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
