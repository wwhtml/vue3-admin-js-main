<template>
  <div class="collapsed-btn" @click="collapsedEmit">
    <menu-unfold-outlined v-if="collapsed" class="trigger" />
    <menu-fold-outlined v-else class="trigger" />
  </div>

  <div class="menu-button">
    <a-dropdown :trigger="['click']">
      <a-avatar src="https://joeschmoe.io/api/v1/random" />
      <template #overlay>
        <a-menu>
          <a-menu-item key="0">
            <!-- <apple-filled /> -->
            <svg-icon iconName="user1" className="header-menu-svg"></svg-icon>
            <span>13301356209</span>
          </a-menu-item>
          <a-menu-item key="1">
            <!-- <apple-filled /> -->
            <svg-icon iconName="lang" className="header-menu-svg"></svg-icon>
            <span class="lang" :class="{ current: Language.lang_current == item.value }" v-for="item in Language.lang"
              :key="item.value" @click="toggleLang(item.value)">{{ item.label }}</span>
          </a-menu-item>
          <a-menu-item key="3">
            <div class="menu-item" @click="logout">
              <!-- <apple-filled /> -->
              <svg-icon iconName="exit" className="header-menu-svg"></svg-icon>
              <span>{{ $t("header_menu.logout") }}</span>
            </div>

          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { removeToken, removeUsername } from "@/utils/cookies"

export default {
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["collapsedEmit"],

  setup(props, { attrs, slots, emit, expose }) {
    const router = useRouter();

    const collapsedEmit = () => {
      emit("collapsedEmit");
      console.log(111);
    };
    //设置语言
    const Language = reactive({
      lang: [
        { label: "中文", value: "ch" },
        { label: "英文", value: "en" },
        { label: "日文", value: "jp" },
      ],
      lang_current: "ch",
    });

    //设置多语言
    const { locale } = useI18n({ useScope: "global" });
    // 设置语言
    const toggleLang = (lang) => {
      locale.value = lang;
      Language.lang_current = lang;
    };

    const logout = () => {
      console.log("logout")
      //调用后台接口，清除后台的一个进程
      //清除前端的认证信息
      removeUsername();
      removeToken();
      router.replace({
        path: "/"
      })
      window.location.reload()

    }

    return {
      collapsedEmit,
      Language,
      toggleLang,
      logout
    };
  },
};
</script>

<style lang="scss" scoped>
.collapsed-btn {
  width: 64px;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: rgb(238 238 238);
  }
}

.trigger {
  font-size: 20px;
  transition: color 0.3s;
}

.menu-button {
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
}

::v-deep .ant-dropdown-menu-item {
  color: #333333;

  .anticon {
    color: #cccccc;
    font-size: 16px !important;
  }
}

.lang {
  margin-right: 10px;
  color: #aeaeae;

  &.current {
    color: #333333;
  }
}
</style>
