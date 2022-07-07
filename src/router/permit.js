import Router from "./index";
import Store from "@/store"
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
    if (Store.state.permit.all_router.length == 0) {
      //第一个参数：是调用的action函数名，第二个参数是实际参数
      Store.dispatch("permit/actionGetPermission").then(() => {
        const all_router = Store.state.permit.all_router;
        Router.options.routes = all_router;

        //更新动态路由
        const async_router = Store.state.permit.async_router;
        async_router.forEach((item) => {
          Router.addRoute(item)
        })
        console.log(to.name)
        console.log({ ...to })

        //判断是否是中转路由   to.name 指的是路由的name属性，严格区分大小写的
        if (to.name == "AdminIndex") {
          //动态路由的第一项
          const first_router = async_router[0]?.children[0] || async_router[0];
          next({ ...first_router, replace: true });

        } else {

          //next() 动态路由更新完成之后执行
          next({ ...to, replace: true });
        }

      })
    } else {
      if (to.name === "Login") {
        Router.go(-1)
      } else {
        next()

      }
    }
  } else {
    if (whiteRouter.includes(to.name)) {
      next();  // 确认进入，不发生路由拦截的动作
    } else {
      next({ name: "Login" });   // 确认进入跳转路由
    }
  }
})