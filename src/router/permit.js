import Router from "./index";
// cookies
import { getToken } from "@/utils/cookies";
const whiteRouter = ['Login', 'Register', 'Forget']
// 前置路由
Router.beforeEach((to, form, next) => {
  /**
   * 1、如果 token 存在直接确认进入下一个路由
   * 2、如果 token 不存在跳回登录页，
   *    判断当前路由是否为登录页，如果是直接进入，否则跳回登录页
   */

  /**
   * 进入后台管理之前处理权限
   * 解耦：尽量把不同的业务逻辑分离出来
   */
  if (getToken()) {
    next();
  } else {
    if (whiteRouter.includes(to.name)) {
      next();  // 确认进入，不发生路由拦截的动作
    } else {
      next({ name: "Login" });   // 确认进入跳转路由
    }
  }
})