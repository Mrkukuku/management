import Vue from 'vue'
import Vuex from 'vuex'
import routeJump from './modules/RouteJump'
Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    routeJump
  }
});