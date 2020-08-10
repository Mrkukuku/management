const state={
    openTab: [], // 所有打开的路由
    activeIndex: '/', // 激活状态
    Authorization: sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization') : ''
  }
const mutations={
    // 添加tabs
    add_tabs (state, data) {
      state.openTab.push(data)
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0
      for (let option of state.openTab) {
        if (option.route === route) {
          break
        }
        index++
      }
      state.openTab.splice(index, 1)
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
      state.activeIndex = index
    },

    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization
      // console.log("store---到这里了!");
      sessionStorage.setItem('Authorization', user.Authorization);
    }
  };
  const actions={
    changeLogin (ctx, Authorization) {
      ctx.commit('changeLogin', Authorization)
    }
  }

export default {
    namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
    state,
    mutations,
    actions
}