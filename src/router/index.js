import { createRouter, createWebHistory } from "vue-router";
import { h } from "vue";
const routes = [


  {
    path: "/",
    redirect: "/home",
    hidInMenu: true,
  },
  {
    path: "/login",
    name: "Login",
    hidInMenu: true,
    meta: {
      title: "登录",
      icon: "",
    },
    component: () => import("../views/Account/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    hidInMenu: true,
    meta: {
      title: "注册",
      icon: "",
    },
    component: () => import("../views/Account/Register.vue"),
  },
  {
    path: "/forget",
    name: "Forget",
    hidInMenu: true,
    meta: {
      title: "忘记密码",
      icon: "",
    },
    component: () => import("../views/Account/Forget.vue"),
  },

  {
    path: "/home",
    name: "Home",
    meta: {
      title: "首页",
      icon: "home",
    },
    component: () => import("../layout/BasicLayout.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "首页",
          icon: "home",
        },
        component: () => import("../views/Home/Home.vue"),
      },
    ],
  },

  {
    path: "/adminIndex",
    name: "adminIndex",
    meta: {
      title: "管理总台",
      icon: "console",
    },
    component: () => import("../layout/BasicLayout.vue"),
    children: [
      {
        path: "/user",
        name: "user",
        meta: {
          title: "角色管理",
          icon: "console",
        },
        component: () => import("../views/AdminIndex/User.vue"),
      },
      {
        path: "/role",
        name: "role",
        meta: {
          title: "用户管理",
          icon: "console",
        },
        component: () => import("../views/AdminIndex/Role.vue"),
      },
      {
        path: "/menu",
        name: "menu",
        meta: {
          title: "菜单管理",
          icon: "console",
        },
        component: () => import("../views/AdminIndex/Menu.vue"),
      },
    ],
  },
  {
    path: "/information",
    name: "information",
    meta: {
      title: "信息管理",
      icon: "console",
    },
    component: () => import("../layout/BasicLayout.vue"),
    children: [
      {
        path: "/infoLsit",
        name: "infoLsit",
        meta: {
          title: "列表管理",
          icon: "console",
        },
        // component: () => import("../views/AdminIndex/User.vue"),
      },
      {
        path: "/detail",
        name: "detail",
        meta: {
          title: "用户管理",
          icon: "console",
        },
        // component: () => import("../views/AdminIndex/Role.vue"),
      },
      {
        path: "/kind",
        name: "kind",
        meta: {
          title: "类别管理",
          icon: "console",
        },
        // component: () => import("../views/AdminIndex/Menu.vue"),
      },
    ],
  },

  {
    path: "/product",
    name: "product",
    meta: {
      title: "产品管理",
      icon: "product",
    },
    component: () => import("../layout/BasicLayout.vue"),
    children: [
      {
        path: "/product",
        name: "product",
        meta: {
          title: "产品管理",
          icon: "product",
        },
        // component: () => import("../views/Home/Index.vue"),
      },
    ],
  },
  {
    path: "/mumber",
    name: "Mumber",
    meta: {
      title: "会员管理",
      icon: "mumber",
    },
    component: () => import("../layout/BasicLayout.vue"),
    children: [
      {
        path: "/mumber",
        name: "Mumber",
        meta: {
          title: "会员管理",
          icon: "mumber",
        },
        // component: () => import("../views/Home/Index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
