import Vue from 'vue'
import Vuex from 'vuex'
import chatCache from './chatCache/chatCache'
import imgCache from './imgCache/imgCache'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    chatCache,
    imgCache,
  }
})
