<template>
  <a-layout :style="{ height: '100vh', overflow: 'hidden' }">
    <a-layout-sider
      width="300"
      v-model:collapsed="collapsed"
      collapsible
      :style="{ color: 'white', overflowY: 'auto', overflowX: 'hidden' }"
    >
      <BasicLayoutSider :collapsed="collapsed"></BasicLayoutSider>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          background: '#fff',
          padding: ' 0',
          display: 'flex',
          justifyContent: 'space-between',
        }"
      >
        <BasicLayoutHeader
          :collapsed="collapsed"
          @collapsedEmit="collapsedHandler"
        ></BasicLayoutHeader>
      </a-layout-header>
      <a-layout-content :style="{ overflow: 'auto', padding: '24px 24px 0px','background-color':'white' }">
        <BasicLayoutContent></BasicLayoutContent>
        <!-- <router-view></router-view> -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { ref } from "vue";
import BasicLayoutSider from "./BasicLayoutSider.vue";
import BasicLayoutHeader from "./BasicLayoutHeader.vue";
import BasicLayoutContent from "./BasicLayoutContent.vue";
export default {
  components: {
    BasicLayoutSider,
    BasicLayoutHeader,
    BasicLayoutContent,
  },
  setup() {
    //是否坍塌
    const collapsed = ref(false);
    const collapsedHandler = () => {
      const bool = !collapsed.value;
      collapsed.value = bool;
      localStorage.setItem("collapsed", bool);
    };

    return {
      collapsed,
      collapsedHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.ant-layout-header {
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  z-index: 5;
}


//设置侧边栏滚动条样式
::v-deep .ant-layout-sider {
  &::-webkit-scrollbar {
    width: 16px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 16px;
    display: none;
  }
  &:hover::-webkit-scrollbar {
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: rgb(61 71 86 / 88%);
  }

  &::-webkit-scrollbar-track {
    border-radius: 6px;
    background: transparent;
  }
}
</style>
