<template>
  <div class="role-container">
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="showModal"> 角色新增 </a-button>
      {{ roleCreateConfig.visible }}
    </div>

    <a-table :columns="roleListConfig.columns" :data-source="roleListConfig.data" bordered
      :row-key="(record) => record.role_id" size="middle">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'role_disabled'">
          <a-switch :checked="text == 0 ? false : true" @click="changeStatus(record)" />
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="primary" style="margin-right: 10px">详情</a-button>
          <a-button style="margin-right: 10px">编辑</a-button>
          <a-popconfirm placement="topRight" title="您确认删除当前项?" ok-text="确认" cancel-text="取消"
            @confirm="removeRole(record)">
            <a-button type="dashed" style="margin-right: 10px">删除</a-button>
            <!-- <a-button type="dashed" @click="removeUser(record)">删除</a-button> -->
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="roleCreateConfig.visible" title="新增角色" width="600px" ok-text="确认" cancel-text="取消"
      @ok="handleOK" @cancel="handleCancel">
      <a-form :model="roleCreateConfig.formState" :label-col="roleCreateConfig.labelCol"
        :wrapper-col="roleCreateConfig.wrapperCol">
        <a-form-item label="角色名称">
          <a-input v-model:value="roleCreateConfig.formState.role_name"></a-input>
        </a-form-item>
        <a-form-item label="角色标识">
          <a-input v-model:value="roleCreateConfig.formState.role_value"></a-input>
        </a-form-item>
        <a-form-item label="是否超管">
          <a-radio-group v-model:value="roleCreateConfig.formState.has_admin" :options="aoptions" />
        </a-form-item>
        <a-form-item label="是否启用">
          <a-radio-group v-model:value="roleCreateConfig.formState.role_disabled" :options="options" />
        </a-form-item>
        <a-form-item label="权限设置" name="menu_checked">
          <a-tree v-model:selectedKeys="selectedKeys" v-model:checkedKeys="checkedKeys" checkable v-if="menuList.length"
            default-expand-all :tree-data="menuList" :fieldNames="{
              children: 'children',
              title: 'menu_name_cn',
              key: 'menu_id',
            }" @check="handleCheck">
            <template #title="{ menu_name_cn, menu_id }">
              {{ menu_name_cn }}-----{{ menu_id }}
            </template>
          </a-tree>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- {{roleCreateConfig.visible}} -->
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { MenuList } from "../../api/menu";
import { RoleCreate, RoleList, RoleRemove, RoleStatus,RoleDetailed } from "../../api/role";
import { onBeforeMount,onMounted } from "@vue/runtime-core";
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
    value: "1",
  },
  {
    label: "否",
    value: "0",
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
  setup() {
    // const roleCreateInfo = reactive({
    //   role_name: "超级管理员",
    //   role_value: "admin",
    //   role_disabled: "1",
    //   menu_checked: "1,2",
    //   menu_half: "1,2",
    //   menu_elem: "info:add,info:edit",
    // });

    /********************************************************************************************************
     * 角色列表
     */

    const roleListConfig = reactive({
      loading: false,
      columns: [
        {
          title: "ID",
          dataIndex: "role_id",
          key: "role_id",
          align: "center",
        },

        {
          title: "角色类型",
          dataIndex: "role_name",
          key: "role_name",
          align: "center",
        },
        {
          title: "状态（禁启用）",
          dataIndex: "role_disabled",
          key: "role_disabled",
          align: "center",
        },
        {
          title: "权限",
          dataIndex: "access",
          key: "access",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          align: "center",
        },
      ],
      data: [], //表格数据
      current_page: "", //当前页码
      per_page: "",
      total: "", //数据总条数
      selectedRowKeys: [], //选中的数据（保存数据id）用来进行批量操作
    });

    const getRoleList = () => {
      RoleList({ pageNumber: 1, pageSize: 100 }).then((res) => {
        console.log(res);
        roleListConfig.data = res.content.data;
      });
    };
    onBeforeMount(() => {
      getRoleList();
    });

    /**********************************************************************************
     * 添加角色
     */
    const roleCreateConfig = reactive({
      visible: false,
      labelCol: { style: { width: "100px" } },
      wrapperCol: { span: 24 },
      // roleCreateInfo: {
      //   role_name: "超级管理员",
      //   role_value: "admin",
      //   role_disabled: "1",
      //   menu_checked: "1,2",
      //   menu_half: "1,2",
      //   menu_elem: "info:add,info:edit",
      // },
      formState: {
        role_name: "超级管理员",
        role_value: "admin",
        role_disabled: "0", //是否启用
        has_admin: false, //是否超管
        menu_half: "",
        menu_checked: "",
      },
    });

    const showModal = () => {
      roleCreateConfig.visible = true;
    };

    const handleCancel = () => {
      roleCreateConfig.visible = false;
    };

    const handleOK = () => {
      console.log(111);
      // roleCreateConfig.visible = false;
      createMenu();
    };

    //权限选择配置
    const menuList = ref([]);
    const expandedKeys = ref([]);
    const selectedKeys = ref([]);
    const checkedKeys = ref([]);
    //获取菜单列表
    const getMenuList = () => {
      MenuList().then((res) => {
        console.log(res);
        menuList.value = res.content;
      });
    };
    onBeforeMount(() => {
      getMenuList();
    });

    const handleCheck = (checkedKeys, e) => {
      // console.log(checkedKeys)
      // console.log(e)
      const data = e.halfCheckedKeys;
      roleCreateConfig.formState.menu_half = data.join();
      roleCreateConfig.formState.menu_checked = checkedKeys.join();
    };

    const createMenu = () => {
      console.log(roleCreateConfig.formState);
      RoleCreate(roleCreateConfig.formState).then((res) => {
        console.log(res);
      });
    };

    /**
     * 删除角色
     */

    const removeRole = (record) => {
      const data = {
        role_id: record.role_id,
      };
      RoleRemove(data).then(
        (res) => {
          message.success(res.content);
          getMenuList();
        },
        (error) => {
          message.error(error.msg);
        }
      );
    };
    /**
     * 禁用启用
     */
    const changeStatus = (record) => {
      // console.log(record);
      record.role_disabled = record.role_disabled == 0 ? 1 : 0;
      const data = {
        role_id: record.role_id,
        role_disabled: record.role_disabled,
      };
      RoleStatus(data).then((res) => {
        console.log(res);
        message.success("状态变更成功");
      });
    };


    //角色详情
    const getRoleDetailed = () => {
      RoleDetailed({role_id:185}).then((res) => {
        console.log(res)
      })
    }
    onMounted(()=>{
      getRoleDetailed()
    })

    return {
      //获取角色列表
      roleListConfig,
      getRoleList,

      // roleCreateInfo,
      roleCreateConfig,
      showModal,
      handleOK,
      handleCancel,

      //权限列表选择
      aoptions, //是否超管
      options, //是否禁用
      // optionsConfig,
      menuList,
      expandedKeys,
      selectedKeys,
      checkedKeys,
      handleCheck,
      createMenu,

      //shanchu
      removeRole,
      //禁启用
      changeStatus,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
