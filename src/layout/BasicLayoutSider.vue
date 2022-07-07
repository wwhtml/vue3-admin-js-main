<template>
  <div class="logo">
    <img v-if="collapsed" :src="logo_min" alt="手把手撸码前端 1371374684" />
    <img v-else :src="logo" alt="手把手撸码前端 1371374684" />
  </div>

  <a-menu theme="dark" mode="inline" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" @click="selectMenu"
    @openChange="openMenu">

    <template v-for="item in list" :key="item.path">
      <template v-if="!item.hidInMenu">
        <template v-if="!item.children">
          <a-menu-item :key="item.path">
            <template #icon>
              <PieChartOutlined />
            </template>
            <router-link :to="item.path" :key="item.path">
              {{ item.meta.title }}
            </router-link>
          </a-menu-item>
        </template>
        <template v-else>
          <BasicLayoutSiderSubMenu :key="item.path" :menu-info="item" />
        </template>
      </template>
    </template>

  </a-menu>
</template>

<script>
import {
  MailOutlined,
  QqOutlined,
  AppstoreOutlined,
  SettingOutlined,
  PieChartOutlined,
} from "@ant-design/icons-vue";
import { reactive, ref, toRefs } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";

// import { list } from "./sider-data";
import BasicLayoutSiderSubMenu from "./BasicLayoutSiderSubMenu";

export default {
  components: {
    BasicLayoutSiderSubMenu,
    MailOutlined,
    QqOutlined,
    AppstoreOutlined,
    SettingOutlined,
    PieChartOutlined,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    // console.log(router);
    // console.log(route);
    const list = router.options.routes;


    const siderConfig = reactive({
      logo: require("@/assets/images/logo.png"),
      logo_min: require("@/assets/images/logo-min.png"),
      selectedKeys: localStorage.getItem("selectedKeys")
        ? [localStorage.getItem("selectedKeys")]
        : ["/home"],
      openKeys: localStorage.getItem("openKeys")
        ? JSON.parse(localStorage.getItem("openKeys"))
        : ["/home"],
      // list: list
    });

    //选中menu
    const selectMenu = ({ item, key, keyPath }) => {
      siderConfig.selectedKeys = [key];
      localStorage.setItem("selectedKeys", key); // 设置
    };

    // 展开/关闭菜单
    const openMenu = (openKeys) => {
      siderConfig.openKeys = openKeys;
      localStorage.setItem("openKeys", JSON.stringify(openKeys)); // 设置
    };

    return {
      ...toRefs(siderConfig),
      list,
      selectMenu,
      openMenu,
    };
  },
};
</script>
<style lang="scss" scoped>
.logo {
  padding: 20px;
  border-bottom: 1px solid #000;

  img {
    display: inline-block;
  }
}
</style>
