import Vue from 'vue'
import Vuex from 'vuex'
import chatCache from './chatCache/chatCache'
import imgCache from './imgCache/imgCache'


Vue.use(Vuex)

export default new Vuex.Store({
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
