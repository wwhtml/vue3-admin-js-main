import { createStore } from 'vuex'
import admin from "./modules/admin"
import account from "./modules/account"
import permit from "./modules/permit"

//模块化，可以分离不同的业务场景和解决命名冲突问题
export default createStore({
  // state: {
  // },
  // getters: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  modules: {
    account, admin, permit
  }
})
