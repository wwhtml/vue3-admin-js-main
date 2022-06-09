<template>
  <a-modal
    v-model:visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :title="roleId ? '角色编辑' : '角色新增'"
  >
    <a-form
      :model="roleConfig.formState"
      :label-col="roleConfig.labelCol"
      :wrapper-col="roleConfig.wrapperCol"
    >
      <a-form-item label="角色名称">
        <a-input v-model:value="roleConfig.formState.role_name"></a-input>
      </a-form-item>
      <a-form-item label="角色标识">
        <a-input v-model:value="roleConfig.formState.role_value"></a-input>
      </a-form-item>
      <a-form-item label="是否超管">
        <a-radio-group
          v-model:value="roleConfig.formState.has_admin"
          :options="aoptions"
        ></a-radio-group>
      </a-form-item>
      <a-form-item label="是否启用">
        <a-radio-group
          v-model:value="roleConfig.formState.role_disabled"
          :options="options"
        />
      </a-form-item>

      <a-form-item label="权限设置">
        <a-tree
          default-expand-all
          checkable
          :tree-data="optionsConfig"
          :fieldNames="{
            children: 'data',
          }"
          v-model:checkedKeys="roleConfig.checkedKeys"
        >
        </a-tree>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive } from "vue";
import { RoleCreate } from "@/api/role";
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
  emits: ["update:visible", "loadData"],

  setup(props, context) {
    const handleCancel = () => {
      context.emit("update:visible", false);
    };
    const handleOk = () => {
      createRole();
    };

    const roleConfig = reactive({
      formState: {
        role_name: "普通管理员",
        role_value: "aaa",
        role_disabled: false,
        has_admin: false,
        menu_checked: "1,2",
        menu_half: "1,2",
        menu_elem: "info:add,info:edit",
      },
      labelCol: { style: { width: "100px" } },
      wrapperCol: { span: 24 },
      checkedKeys:[]
      
    });

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


    /**
     * 获取权限菜单
     */
    

    return {
      handleCancel,
      roleConfig,

      //权限列表选择
      aoptions, //是否超管
      options, //是否禁用
      optionsConfig,
      createRole,
      handleOk,
    };
  },
};
</script>

<style scoped lang="scss"></style>
