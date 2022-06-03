const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave: process.env.NODE_ENV !== "production",
  lintOnSave: false,
  chainWebpack: (config) => {
    config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(path.resolve("src/assets/svg")) //处理svg目录
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });

    //解决i18n插件警告的问题
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
  },
  devServer: {
    // open: true,
    host: "localhost",
    port: 8888,
    proxy: {
      [process.env.VUE_APP_ACCOUNT_FLAG]: {
        target: process.env.VUE_APP_ACCOUNT_APIURL,
        ws: false, // webstock
        changeOrigin: true, // 是否开启跨域
        pathRewrite: { [`^${process.env.VUE_APP_ACCOUNT_FLAG}`]: "" },
      },
      [process.env.VUE_APP_USER_FLAG]: {
        target: process.env.VUE_APP_USER_APIURL,
        ws: false, // webstock
        changeOrigin: true, // 是否开启跨域
        pathRewrite: { [`^${process.env.VUE_APP_USER_FLAG}`]: "" },
      },
      [process.env.VUE_APP_ROLE_FLAG]: {
        target: process.env.VUE_APP_ROLE_APIURL,
        ws: false, // webstock
        changeOrigin: true, // 是否开启跨域
        pathRewrite: { [`^${process.env.VUE_APP_ROLE_FLAG}`]: "" },
      },
    },
  },
});
