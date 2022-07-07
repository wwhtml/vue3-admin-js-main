export const list = [
  //   {
  //     path: "/",
  //     redirect: "/layout",
  //   },
  //   {
  //     path: "/layout",
  //     name: "Layout",
  //   },

  //首页
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "首页1",
      icon: "home",
    },
  },
  //管理总台
  {
    path: "/adminIndex",
    name: "AdminIndex",
    meta: {
      title: "管理总台",
      icon: "console",
    },
    children: [
      {
        path: "/user",
        name: "User",
        meta: {
          title: "用户管理",
          icon: "user",
        },
      },
      {
        path: "/role",
        name: "Role",
        meta: {
          title: "角色管理",
          icon: "role",
        },
      },

      {
        path: "/menu",
        name: "Menu",
        meta: {
          title: "菜单管理",
          icon: "menu",
        },
      },
    ],
  },
  //信息管理
  {
    path: "/information",
    name: "Information",
    meta: {
      title: "信息管理",
      icon: "informtion",
    },
    children: [
      {
        path: "/infoLsit",
        name: "InfoLsit",
        meta: {
          title: "列表管理",
          icon: "role",
        },
      },
      {
        path: "/detail",
        name: "detail",
        meta: {
          title: "详细页",
          icon: "detail",
        },
      },
      {
        path: "/kind",
        name: "kind",
        meta: {
          title: "类别管理",
          icon: "kind",
        },
      },
    ],
  },
  //产品管理
  {
    path: "/product",
    name: "Product",
    meta: {
      title: "产品管理",
      icon: "product",
    },
  },
  //会员管理
  {
    path: "/mumber",
    name: "Mumber",
    meta: {
      title: "会员管理",
      icon: "mumber",
    },
  },
];
