
import { getPermission } from "@/api/permit"
import { formatTree } from "@/utils/formatData"
import { routes } from "@/router/index"

/* 
  {
    path: "/login",  //router_path
    name: "Login",  //router_name
    hidInMenu: true,  //hidden
    // redirect:'',
    meta: {
      title: "登录",  //menu_name_cn
      icon: "", //icon
      keeoAlive:true//keep
    },
    component: () => import("../views/Account/Login.vue"),  //component
  },


*/

//对添加的菜单（路由）进行设置
function formatRouter(dataMenu) {
  // console.log("dataMenu");
  // console.log(dataMenu);
  const menuArray = [];
  if (dataMenu && dataMenu.length > 0) {
    console.log(dataMenu)
    //循环菜单
    dataMenu.forEach((menu) => {
      //每次循环声明一个JSON对象，用来存储临时数据
      const menuObj = {};

      //路由地址
      menuObj.path = menu.router_path;
      //路由名称
      menuObj.name = menu.router_name;
      //是否隐藏
      menuObj.hidInMenu = menu.hidden == '1' ? true : false;
      //重定向
      // if (menu.redirect) {
      //   menuObj.redirect = menu.redirect
      // }
      menuObj.meta = {
        title: menu.menu_name_cn,
        icon: menu.icon,
        keeoAlive: menu.keep == '1' ? true : false
      }
      //映射组件
      menuObj.component = menu.component && require("@/" + menu.component).default;//如果存在，在进行设置，否则会报错
      //通过这两个id才可以将数据转换为树状列表
      menuObj.menu_id = menu.menu_id;
      menuObj.parent_id = menu.parent_id;
      //追加到数据
      menuArray.push(menuObj)
    })
    //输出结果
    // console.log('menuArray')
    // console.log(menuArray)
    const menu = formatTree(menuArray, 'menu_id', 'parent_id', 'children', 0);
    // console.log(menu)
    return menu
  }
}


const state = {
  async_router: [],
  all_router: []
};
const getters = {
};
//同步处理
const mutations = {
  SET_ROUTER(state, router) {
    state.async_router = router;
    state.all_router = routes.concat(router);
  }
};
//异步处理
const actions = {
  //
  actionGetPermission(context) {
    return new Promise((resolve, reject) => {
      getPermission().then(res => {
        // console.log(res)
        const routerMenu = res.content.router_menu;
        const menuTree = formatRouter(routerMenu)
        //更新路由
        context.commit('SET_ROUTER', menuTree)
        resolve()
      })
    })

  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}