<template>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :title="roleId ? '角色编辑' : '角色新增'">
    <a-form ref="formRef" :model="roleConfig.formState" :label-col="roleConfig.labelCol"
      :wrapper-col="roleConfig.wrapperCol">
      <a-form-item label="角色名称" name="role_name">
        <a-input v-model:value="roleConfig.formState.role_name"></a-input>
      </a-form-item>
      <a-form-item label="角色标识" name="role_value">
        <a-input v-model:value="roleConfig.formState.role_value"></a-input>
      </a-form-item>
      <a-form-item label="是否超管" name="has_admin">
        <a-radio-group v-model:value="roleConfig.formState.has_admin" :options="aoptions"></a-radio-group>
      </a-form-item>
      <a-form-item label="是否启用" name="role_disabled">
        <a-radio-group v-model:value="roleConfig.formState.role_disabled" :options="options" />
      </a-form-item>

      <a-form-item label="权限设置">
        <a-tree v-if="roleConfig.menuListTree.length" checkable :tree-data="roleConfig.menuListTree" :fieldNames="{
          title: 'menu_name_cn',
          key: 'menu_id',
        }" v-model:checkedKeys="roleConfig.checkedKeys" @check="handleTree">
          <template #title="{ menu_name_cn, menu_id }">
            <div>{{ menu_name_cn }} - {{ menu_id }}</div>

          </template>
        </a-tree>
        <!-- default-expand-all 如果不先判断length，会无效 -->
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { RoleCreate, RoleDetailed, RoleUpdate } from "@/api/role";
import { MenuList } from "@/api/menu";
import { message } from "ant-design-vue";

//是否超管
const aoptions = [
  {
    label: "是",
    value: true,
  },
  {
    label: "否",
    value: false,
  },
];
//角色是否启用的数据
const options = [
  {
    label: "是",
    value: true,
  },
  {
    label: "否",
    value: false,
  },
];
//权限列表数据
const optionsConfig = [
  {
    title: "管理总台",
    checkAll: false,
    checkedList: [],
    data: [
      {
        title: "角色管理",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "roleControl:edit" },
          { label: "删除", value: "roleControl:delete" },
          { label: "新增", value: "roleControl:add" },
          { label: "查看", value: "roleControl:look" },
        ],
      },
      {
        title: "角色列表",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "roleList:edit" },
          { label: "删除", value: "roleList:delete" },
          { label: "新增", value: "roleList:add" },
          { label: "查看", value: "roleList:look" },
        ],
      },
      {
        title: "菜单列表",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "menuControl:edit" },
          { label: "删除", value: "menuControl:delete" },
          { label: "新增", value: "menuControl:add" },
          { label: "查看", value: "menuControl:look" },
        ],
      },
    ],
  },
  {
    title: "信息管理",
    checkAll: false,
    checkedList: [],
    data: [
      {
        title: "信息列表",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "infoList:edit" },
          { label: "删除", value: "infoList:delete" },
          { label: "新增", value: "infoList:add" },
          { label: "查看", value: "infoList:look" },
        ],
      },
      {
        title: "信息类别",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "infoKind:edit" },
          { label: "删除", value: "infoKind:delete" },
          { label: "新增", value: "infoKind:add" },
          { label: "查看", value: "infoKind:look" },
        ],
      },
    ],
  },
  {
    title: "产品管理",
    checkAll: false,
    checkedList: [],
    data: [
      {
        title: "产品列表",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "pLsit:edit" },
          { label: "删除", value: "pLsit:delete" },
          { label: "新增", value: "pLsit:add" },
          { label: "查看", value: "pLsit:look" },
        ],
      },
      {
        title: "产品类别",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "pKind:edit" },
          { label: "删除", value: "pKind:delete" },
          { label: "新增", value: "pKind:add" },
          { label: "查看", value: "pKind:look" },
        ],
      },
    ],
  },
  {
    title: "会员管理",
    checkAll: false,
    checkedList: [],
    data: [
      {
        title: "会员列表",
        checkAll: false,
        checkedList: [],
        plainOptions: [
          { label: "编辑", value: "vip:edit" },
          { label: "删除", value: "vip:delete" },
          { label: "新增", value: "vip:add" },
          { label: "查看", value: "vip:look" },
        ],
      },
    ],
  },
];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    roleId: {
      type: [Number, String],
      default: "",
    },
  },
  emits: ["update:visible", "update:roleId", "loadData"],

  setup(props, context) {
    const formRef = ref(null);

    const handleCancel = () => {
      context.emit("update:visible", false);
      context.emit("update:roleId", "");
      formRef.value.resetFields();
      roleConfig.checkedKeys = [];
    };
    const handleOk = (e) => {
      props.roleId ? updateRole() : createRole();
    };

    const roleConfig = reactive({
      formState: {
        role_name: "", //比如：普通管理员
        role_value: "",
        role_disabled: false,
        has_admin: false,
        menu_checked: "",
        menu_half: "",
        menu_elem: "",
      },
      //menu_elem: "info:add,info:edit",

      labelCol: { style: { width: "100px" } },
      wrapperCol: { span: 24 },
      checkedKeys: [],
      menuListTree: [],
    });

    //获取权限菜单
    const getMenuList = () => {
      MenuList().then((res) => {
        console.log(res);
        roleConfig.menuListTree = res.content;
      });
    };

    watch(
      () => props.visible,
      () => {
        // 用户详情请求
        props.visible && roleConfig.menuListTree.length == 0 && getMenuList();
      }
    );

    //选择
    const handleTree = (checkedKeys, e) => {
      // console.log(checkedKeys);
      // console.log(e);
      roleConfig.formState.menu_checked = checkedKeys.join();
      roleConfig.formState.menu_half = e.halfCheckedKeys.join();
    };

    /*************************************
     * 创建角色
     */
    const createRole = () => {
      const roleInfos = Object.assign({}, roleConfig.formState);
      RoleCreate(roleInfos).then((res) => {
        message.success("添加成功");
        context.emit("loadData");
        handleCancel();
      });
    };

    /**********************************************
     * 编辑角色
     */
    //获取角色详情，渲染到页面，修改之后点击提交，就完成修改
    const getRoleDetailed = () => {
      RoleDetailed({ role_id: props.roleId }).then((res) => {
        console.log(res);
        roleConfig.formState = res.content;
        const checkedKeys = res.content.menu_checked.split(",");

        roleConfig.checkedKeys = checkedKeys.map(Number);
      });
    };

    watch(
      () => props.roleId,
      () => {
        // 用户详情请求
        props.roleId && getRoleDetailed();
      }
    );

    const updateRole = () => {
      const params = Object.assign({}, roleConfig.formState);
      RoleUpdate(params).then((res) => {
        console.log(res);
        message.success("修改成功");
        context.emit("loadData");
        handleCancel();
      });
    };

    return {
      formRef,
      handleCancel,
      roleConfig,
      //权限列表选择
      aoptions, //是否超管
      options, //是否禁用
      optionsConfig,
      handleTree,
      createRole,
      handleOk,
      //编辑
      getRoleDetailed,
      updateRole,
    };
  },
};
</script>

<style scoped lang="scss">
</style>
