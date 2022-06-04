<template>
  <a-row :gutter="30">
    <a-col :span="8">
      <div class="header-wrap">
        <h4>菜单列表</h4>
        <a-button @click="handleChildMenu('0')">添加一级菜单</a-button>
      </div>
      <a-tree
        v-if="MenuListConfig.list.length"
        default-expand-all
        blockNode
        :tree-data="MenuListConfig.list"
      >
        <template #title="{ menu_name_cn, menu_id }">
          <div class="menu-item">
            <span>{{ menu_name_cn }}</span>
            <div class="button-group">
              <a-button
                class="button-mini"
                size="small"
                type="primary"
                @click="handleChildMenu(menu_id)"
              >
                添加子菜单
              </a-button>
              <a-button
                class="button-mini"
                size="small"
                @click="editMenuInfo({ menu_id })"
                >编辑</a-button
              >
              <a-button
                class="button-mini"
                size="small"
                @click="showDeleteConfirm({ menu_id })"
                >删除</a-button
              >
            </div>
          </div>
        </template>
      </a-tree>
    </a-col>
    <a-col :span="16">
      <div class="header-wrap">
        <h4>菜单信息</h4>
      </div>
      <a-form
        :label-col="{
          style: {
            width: '200px',
          },
        }"
        :wrapper-col="{
          span: 14,
        }"
      >
        <a-form-item label="父级菜单ID">
          <a-input
            v-model:value="menuInfo.parent_id"
            :disabled="true"
          ></a-input>
        </a-form-item>
        <a-form-item label="菜单名称（中文）">
          <a-input v-model:value="menuInfo.menu_name_cn"></a-input>
        </a-form-item>
        <a-form-item label="菜单名称（英文）">
          <a-input v-model:value="menuInfo.menu_name_en"></a-input>
        </a-form-item>
        <a-form-item label="操作权限（增、删、改、查）">
          <a-checkbox-group
            v-model:value="menuInfo.elem"
            name="checkboxgroup"
            :options="options"
          />
        </a-form-item>
        <a-form-item label="path路径">
          <a-input v-model:value="menuInfo.router_path"></a-input>
        </a-form-item>
        <a-form-item label="路由名称">
          <a-input v-model:value="menuInfo.router_name"></a-input>
        </a-form-item>
        <a-form-item label="页面路径">
          <a-input v-model:value="menuInfo.component"></a-input>
        </a-form-item>
        <a-form-item label="图标">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img
              v-if="imageUrl"
              style="width: 100%"
              :src="imageUrl"
              alt="avatar"
            />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="排序">
          <a-input v-model:value="menuInfo.sort"></a-input>
        </a-form-item>
        <a-form-item label="是否隐藏路由">
          <a-radio-group v-model:value="menuInfo.hidden">
            <a-radio value="1">隐藏</a-radio>
            <a-radio value="0">不隐藏</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="禁启用">
          <a-radio-group v-model:value="menuInfo.disabled">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="页面缓存">
          <a-radio-group v-model:value="menuInfo.keep">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="页面重定向路径">
          <a-input v-model:value="menuInfo.redirect"></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
          <a-button type="primary" @click="createMenu">Create</a-button>
          <a-button style="margin-left: 10px">Cancel</a-button>
          <a-button style="margin-left: 10px" @click="updateMenu"
            >确认修改</a-button
          >
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import {
  MenuCreate,
  MenuList,
  MenuRemove,
  MenuDetailed,
  MenuUpdate,
} from "@/api/menu";
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
  createVNode,
} from "vue";
import {
  LoadingOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";

export default {
  components: { LoadingOutlined, PlusOutlined, ExclamationCircleOutlined },
  setup() {
    //备用的测试数据
    const treeData = [
      {
        parent_id: "0",
        menu_id: "234",
        name: "系统控制",
        key: "0-0",
        child: [
          {
            parent_id: "234",
            menu_id: "235",
            name: "首页",
            key: "0-0-0",
          },
          {
            parent_id: "234",
            menu_id: "236",
            name: "管理总台",
            key: "0-0-1",
            child: [
              {
                parent_id: "236",
                menu_id: "238",
                name: "角色管理",
                key: "0-0-1-0",
              },
              {
                parent_id: "236",
                menu_id: "240",
                name: "用户管理",
                key: "0-0-1-1",
              },
              {
                parent_id: "236",
                menu_id: "241",
                name: "菜单管理",
                key: "0-0-1-2",
              },
            ],
          },
          {
            parent_id: "234",
            menu_id: "255",
            name: "信息管理",
            key: "0-0-2",
            child: [
              {
                parent_id: "255",
                menu_id: "256",
                name: "列表管理",
                key: "0-0-2-0",
              },
              {
                parent_id: "255",
                menu_id: "257",
                name: "详细页",
                key: "0-0-2-1",
              },
              {
                parent_id: "255",
                menu_id: "258",
                name: "类别管理",
                key: "0-0-2-2",
              },
            ],
          },
        ],
      },
    ];

    /*****************************************
     * 菜单列表
     */
    const MenuListConfig = reactive({
      list: [],
      menu_type: "add", //控制是添加还是修改
      menu_id: "",
    });

    //获取菜单列表
    const getMenuList = () => {
      MenuList().then((res) => {
        console.log(res);
        MenuListConfig.list = res.content;
      });
    };
    getMenuList();

    /***************************
     * 添加菜单
     */
    const menuInfo = reactive({
      parent_id: "0",
      menu_name_cn: "",
      menu_name_en: "",
      elem: ["info:delete", "info:add", "info:edit"],
      router_name: "",
      router_path: "",
      component: "",

      icon: "",
      sort: "",
      disabled: "0",
      hidden: "0",
      keep: "0",
      redirect: "0",
    });

    const options = [
      { label: "删除按钮", value: "info:delete" },
      { label: "添加按钮", value: "info:add" },
      { label: "编辑按钮", value: "info:edit" },
    ];

    //上传图片配置
    const fileList = ref([]);
    const loading = ref(false);
    const imageUrl = ref("");

    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }

      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }

      if (info.file.status === "error") {
        loading.value = false;
        message.error("upload error");
      }
    };

    const beforeUpload = (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("You can only upload JPG file!");
      }

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }

      return isJpgOrPng && isLt2M;
    };

    //新增菜单
    const createMenu = () => {
      MenuCreate({ lang: "en", ...menuInfo }).then((res) => {
        console.log(res);
        message.success(res.msg);
        getMenuList();
      });
    };

    //添加子菜单，只需要修改一下form表单的父级ID
    const handleChildMenu = (val) => {
      console.log(val);
      menuInfo.parent_id = val;
    };

    /*************************************
     * 删除菜单
     */
    const removeMenu = (id) => {
      MenuRemove(id).then((res) => {
        console.log(res);
        message.success(res.msg);
        getMenuList();
      });
    };

    const showDeleteConfirm = (val11) => {
      Modal.confirm({
        title: "您确认删除这个菜单?",
        icon: createVNode(ExclamationCircleOutlined),
        // content: "Some descriptions",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",

        onOk() {
          // console.log('OK');
          removeMenu(val11);
        },

        onCancel() {
          console.log("Cancel");
        },
      });
    };

    /*******************************************
     * 编辑菜单
     */

    const editMenuInfo = (id) => {
      //点击编辑按钮，当前数据放到form表单中
      //获取详情
      MenuListConfig.menu_id = id.menu_id;
      MenuDetailed(id).then((res) => {
        const request_data = res.content;
        const keys = Object.keys(request_data);
        for (let key in menuInfo) {
          if (keys.includes(key)) {
            // 匹配响应报文和表单字段
            menuInfo[key] = request_data[key];
          }
        }
      });
    };

    const updateMenu = () => {
      MenuUpdate({ menu_id: MenuListConfig.menu_id, ...menuInfo }).then(
        (res) => {
          console.log(res);
          getMenuList();
        }
      );
    };

    return {
      treeData,
      MenuListConfig,
      //添加菜单
      menuInfo,
      options,
      fileList,
      loading,
      imageUrl,
      handleChange,
      beforeUpload,
      createMenu,
      handleChildMenu,
      //删除菜单
      removeMenu,
      showDeleteConfirm,
      //编辑菜单
      editMenuInfo,
      updateMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
.header-wrap {
  padding-bottom: 24px;
  border-bottom: 2px solid red;
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  margin-bottom: 24px;
  h4 {
    margin: 0;
  }
}

.menu-item {
  display: flex;
  justify-content: space-between;
  margin-left: 5px;
  .button-mini {
    margin-left: 5px;
  }
}

::v-deep
  .ant-tree.ant-tree-block-node
  .ant-tree-list-holder-inner
  .ant-tree-node-content-wrapper {
  padding: 0;
}
</style>
