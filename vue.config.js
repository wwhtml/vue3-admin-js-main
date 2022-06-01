const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    // lintOnSave: process.env.NODE_ENV !== "production",
    lintOnSave: false,
    devServer: {
      // open: true,
      host: "localhost",
      port: 8888,
      proxy: {
        [process.env.VUE_APP_ACCOUNT_FLAG]: {
          target: process.env.VUE_APP_ACCOUNT_APIURL,
          ws: false, // webstock
          changeOrigin: true, // 是否开启跨域
          pathRewrite: { [`^${process.env.VUE_APP_ACCOUNT_FLAG}`]: "" }
        },
        [process.env.VUE_APP_USER_FLAG]: {
          target: process.env.VUE_APP_USER_APIURL,
          ws: false, // webstock
          changeOrigin: true, // 是否开启跨域
          pathRewrite: { [`^${process.env.VUE_APP_USER_FLAG}`]: "" }
        },
        [process.env.VUE_APP_ROLE_FLAG]: {
          target: process.env.VUE_APP_ROLE_APIURL,
          ws: false, // webstock
          changeOrigin: true, // 是否开启跨域
          pathRewrite: { [`^${process.env.VUE_APP_ROLE_FLAG}`]: "" }
        }
      }
    }
})
