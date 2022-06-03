<template>
  <!-- 表格 渲染数据列表 -->
  <a-table
    :columns="tableConfig.columns"
    :loading="tableConfig.loading"
    :data-source="tableConfig.data"
    bordered
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.dataIndex === 'status'">
        <a-switch
          :loading="record.statusLoading"
          :checked="text == 0 ? false : true"
          @click="changeUserStatus(record)"
        />
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="primary">详情</a-button>
        <a-button>编辑</a-button>

        <a-button type="dashed" @click="removeUserConfirm(record)">删除</a-button>
      </template>
    </template>
  </a-table>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { UserList, UserCreate, UserRemove, UserStatus } from "../../api/user";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { message, Modal } from "ant-design-vue";

export default {
  setup() {
    const tableConfig = reactive({
      columns: [
        {
          title: "ID",
          dataIndex: "member_id",
          key: "member_id",
          align: "center",
        },
        {
          title: "用户名",
          dataIndex: "username",
          key: "username",
          align: "center",
        },
        {
          title: "真实姓名",
          dataIndex: "truename",
          key: "truename",
          align: "center",
        },
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
          align: "center",
        },
        {
          title: "角色类型",
          dataIndex: "role",
          key: "role",
          align: "center",
        },
        {
          title: "状态（禁启用）",
          dataIndex: "status",
          key: "status",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "operation",
          key: "operation",
          align: "center",
        },
      ],
      loading: false,
      data: [],
    });

    const getUserList = () => {
      const requestData = {
        pageNumber: 1,
        pageSize: 10,
      };
      UserList(requestData).then((res) => {
        const { data } = res.content;
        tableConfig.data = data;
      });
    };
    onBeforeMount(() => {
      getUserList();
    });

    /******************************************************************************
     * 状态更新
     */
    const statusLoading = ref(false);
    const changeUserStatus = (record) => {
      record.statusLoading = true;
      record.status = record.status == 0 ? 1 : 0;
      const data = { member_id: record.member_id, status: record.status };
      UserStatus(data).then((res) => {
        if (res.error_code == 0) {
          record.statusLoading = false;
          message.success(res.msg);
        }
      });
    };
    /******************************************************************************
     * 删除用户
     */
    const removeUser = (record) => {
      UserRemove({ member_id: record.member_id }).then((res) => {
        console.log(res);
        if (res.error_code == 0) {
          message.success(res.msg);
          getUserList()
        }
      });
    };
    const removeUserConfirm = (record) => {
      Modal.confirm({
        title:  "温馨提示",
        content: "确认删除此信息，删除后无法恢复？",
        okText:  "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          removeUser(record)
        },
        onCancel() {},
      });
    };

    return {
      tableConfig,
      getUserList,
      //状态更新
      changeUserStatus,
      statusLoading,
      //删除
      removeUser,
      removeUserConfirm
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
