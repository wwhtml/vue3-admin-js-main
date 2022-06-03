import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//styles
import "@/styles/main.scss";

//ant-design-vue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { createI18n } from "vue-i18n";

const i18n = createI18n({
  // something vue-i18n options here ...
  locale: "ch",
  messages: {
    ch: {
      header_menu: {
        logout: "退出",
      },
    },
    en: {
      header_menu: {
        logout: "sign out",
      },
    },
    jp: {
      header_menu: {
        logout: "終了",
      },
    },
  },
});
// svg全局组件
import SvgIcon from "@/components/Svgicon";
import "@/components/Svgicon/svg.js"; // svg文件解析

createApp(App)
  .component("svg-icon", SvgIcon)
  .use(store)
  .use(router)
  .use(Antd)
  .use(i18n)
  .mount("#app");
