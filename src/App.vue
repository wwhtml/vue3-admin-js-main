<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script>
//将ant-design-vue中默认的英文转换为中文
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default {
  setup() {
    return {
      locale: zhCN,
    };
  },
};
</script>
