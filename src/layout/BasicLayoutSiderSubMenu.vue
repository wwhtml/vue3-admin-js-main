<template>
  <a-sub-menu :key="menuInfo.path">
    <template #icon><MailOutlined /></template>
    <template #title>{{ menuInfo.meta.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.path">
      <template v-if="!item.children">
        <a-menu-item :key="item.path">
          <template #icon>
            <PieChartOutlined />
          </template>
          <router-link v-if="!item.children" :to="item.path" :key="item.path">
            {{ item.meta.title }}
          </router-link>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.path" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script>
import { PieChartOutlined, MailOutlined } from "@ant-design/icons-vue";

export default {
  name: "SubMenu",
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    PieChartOutlined,
    MailOutlined,
  },
};
</script>

<style></style>
