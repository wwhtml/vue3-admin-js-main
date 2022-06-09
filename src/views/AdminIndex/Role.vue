<template>
  <div style="margin-bottom: 16px">
    <a-button type="primary" @click="showModal"> 角色新增 </a-button>
  </div>
  <!-- 表格 渲染数据列表 -->
  <a-table
    :columns="roleLsitConfig.columns"
    :loading="roleLsitConfig.loading"
    :data-source="roleLsitConfig.data"
    bordered
    :pagination="pagination"
    @change="handlePagination"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.dataIndex === 'role_disabled'">
        {{ text }}
        <a-switch
          :loading="record.loading"
          :checked="text"
          @click="changeStatus(record)"
        />
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="primary">详情</a-button>
        <a-button @click="handleEdit(record)">编辑</a-button>
        <a-button type="dashed" @click="removeConfirm(record)">删除</a-button>
      </template>
    </template>
  </a-table>

  <!-- 角色新增 -->
  <RoleModal
    v-model:visible="modalVisible"
    v-model:roleId="roleId"
    @loadData="getRoleList"
  ></RoleModal>
</template>

<script>
import {
  onBeforeMount,
  reactive,
  getCurrentInstance,
  ref,
  computed,
} from "vue";
//api
import { RoleList, RoleStatus, RoleRemove } from "../../api/role";
import { message } from "ant-design-vue";
import RoleModal from "@/components/Model/Role.vue";
export default {
  components: {
    RoleModal,
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();

    /*************
     * 角色列表
     */
    const roleLsitConfig = reactive({
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
      data: [],
      loading: false,
      total: "",
      current_page: 1,
      per_page: 10,
    });

    //获取角色列表
    const getRoleList = () => {
      console.log(11111);
      roleLsitConfig.loading = true;
      const requestData = {
        pageNumber: roleLsitConfig.current_page,
        pageSize: roleLsitConfig.per_page,
      };

      RoleList(requestData).then((res) => {
        roleLsitConfig.loading = false;
        const { data, current_page, per_page, total } = res.content;
        roleLsitConfig.data = data;
        roleLsitConfig.current_page = current_page;
        roleLsitConfig.per_page = per_page;
        roleLsitConfig.total = total;
      });
    };
    onBeforeMount(() => {
      getRoleList();
    });

    //分页设置
    const pagination = computed(() => ({
      total: roleLsitConfig.total,
      // total: 60,
      current: roleLsitConfig.current_page,
      pageSize: roleLsitConfig.per_page,
      // position: ["bottomLeft"], //制定分页器的位置
      // pageSizeOptions: ["2", "4", "6", "8", "10"],//指定每页可以显示多少条
      showQuickJumper: true, //是否可以快速跳转至某页
      showSizeChanger: true, //是否可以改变 pageSize
      hideOnSinglePage: true, //只有一页时是否隐藏分页器
    }));

    const handlePagination = (pag, filters, sorter) => {
      //获取数据
      roleLsitConfig.current_page = pag.current;
      roleLsitConfig.per_page = pag.pageSize;
      getRoleList();
    };

    /**
     * 状态更新
     */
    const changeStatus = (record) => {
      record.loading = true;
      record.role_disabled = !record.role_disabled;
      const params = {
        role_id: record.role_id,
        role_disabled: record.role_disabled,
      };
      RoleStatus(params)
        .then((res) => {
          record.loading = false;
          message.success("状态更新成功");
        })
        .catch((error) => {
          message.error(error);
        });
    };

    /**
     * 删除某一项
     */
    const removeConfirm = (record) => {
      proxy.deleteConfirm({
        ok_fun: () => removeRole(record),
      });
    };

    const removeRole = (record) => {
      const role_id = record.role_id;
      RoleRemove({ role_id })
        .then((res) => {
          message.success(res.msg);
          getRoleList();
        })
        .catch((error) => {
          message.error(error.msg);
        });
    };

    //角色添加
    const modalVisible = ref(false);
    const showModal = () => {
      modalVisible.value = true;
    };

    //角色编辑
    const roleId = ref("");
    const handleEdit = (record) => {
      showModal();
      roleId.value = record.role_id;
      console.log(record);
    };

    return {
      roleLsitConfig,
      getRoleList,
      pagination, //分页器
      handlePagination,
      changeStatus,
      //删除
      removeConfirm,
      removeRole,
      //角色新增
      modalVisible,
      showModal,
      handleEdit,
      roleId,
    };
  },
};
</script>

<style scoped lang="scss">
button.ant-btn + .ant-btn {
  margin-left: 8px;
}

.ant-switch-checked {
  background-color: #1cbb1cfa;
}
</style>
