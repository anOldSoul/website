import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    hasLoad: false,
    userdata: {}
  },
  mutations: {
    login (state, userdata) {
      state.hasLoad = true
      state.userdata = userdata
    }
  },
  actions: actions,
  getters: {
  }
})
export default store
