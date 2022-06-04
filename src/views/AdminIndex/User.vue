<template>
  <a-row type="flex" class="mb-20 color-green">
    <a-col flex="auto">
      <a-form layout="inline" ref="formRef" :model="formState">
        <a-form-item label="角色类型" name="role">
          <a-select
            style="width: 120px"
            ref="select"
            v-model:value="formState.role"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled">Disabled</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select
            style="width: 120px"
            ref="select"
            v-model:value="formState.status"
          >
            <!-- ant-design-vue规定value值不能是Boolean 所以用1和0代替-->
            <a-select-option value="">全部</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="关键字" name="key" style="margin-right: 0">
          <a-select
            style="width: 120px"
            ref="select"
            v-model:value="formState.key"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="username">用户名</a-select-option>
            <a-select-option value="truename">真实姓名</a-select-option>
            <a-select-option value="phone">手机号</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="keywords">
          <a-input
            v-model:value="formState.keywords"
            placeholder="input search text"
            style="width: 150px"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="searchHandler()">搜索</a-button>
          <a-button type="primary" @click="searchHandler('reset')"
            >重置</a-button
          >
          <a-button type="primary">导出</a-button>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col flex="100px">
      <a-button type="primary" block @click="showUserModel">新增用户</a-button>
    </a-col>
    <a-col>
      <a-button type="primary" style="margin-left: 8px"> 批量删除 </a-button>
    </a-col>
  </a-row>

  <!-- 表格 渲染数据列表 -->
  <a-table
    :columns="tableConfig.columns"
    :loading="tableConfig.loading"
    :data-source="tableConfig.data"
    bordered
    :pagination="pagination"
    @change="handlePagination"
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
        <a-button @click="handleEdit(record)">编辑</a-button>

        <a-button type="dashed" @click="removeUserConfirm(record)"
          >删除</a-button
        >
      </template>
    </template>
  </a-table>

  <UserModel v-model:visible="userModelVisible" v-model:mumberId="mumberId" @loadData="getUserList"></UserModel>
</template>

<script>
import { reactive, ref, computed } from "vue";
import { UserList, UserCreate, UserRemove, UserStatus } from "../../api/user";
import { onBeforeMount, onMounted } from "@vue/runtime-core";
import { message, Modal } from "ant-design-vue";
import UserModel from "@/components/Model/User";

export default {
  components: {
    UserModel,
  },
  setup(props, context) {
    /*******************************************************
     * 搜索
     */
    const formRef = ref();
    const formState = reactive({
      role: "",
      status: "",
      key: "",
      keywords: "",
    });
    const searchHandler = (type) => {
      if (type === "reset") {
        formRef.value.resetFields();
      }
      tableConfig.current_page = 1;
      tableConfig.per_page = 10;
      const formStateCopy = Object.assign({}, formState);
      const search = {};
      if (formStateCopy.key && formStateCopy.keywords) {
        search[formStateCopy.key] = formStateCopy.keywords;
      }

      // 删除关键字
      delete formStateCopy.key;
      delete formStateCopy.keywords;

      // 拼接搜索项
      tableConfig.searchInfo = Object.assign({}, search, formStateCopy);
      // 将statsu的只进行修改，如果是0改成false，如果是1改成true（因为请求接口参数是Boolean）
      if (tableConfig.searchInfo.status === 1) {
        tableConfig.searchInfo.status = true;
      } else if (tableConfig.searchInfo.status === 0) {
        tableConfig.searchInfo.status = false;
      } else {
        tableConfig.searchInfo.status = "";
      }
      // 过滤空选项
      for (let key in tableConfig.searchInfo) {
        if (tableConfig.searchInfo[key] === "") {
          delete tableConfig.searchInfo[key];
        }
      }

      getUserList();
    };

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
      total: "",
      current_page: 1,
      per_page: 10,
      searchInfo: {},
    });

    /********************************************************
     * 获取用户列表
     */
    const getUserList = () => {
      tableConfig.loading = true;
      const requestData = {
        pageNumber: tableConfig.current_page,
        pageSize: tableConfig.per_page,
      };

      UserList({ ...requestData, ...tableConfig.searchInfo }).then((res) => {
        tableConfig.loading = false;
        const { data, current_page, per_page, total } = res.content;
        tableConfig.data = data;
        tableConfig.current_page = current_page;
        tableConfig.per_page = per_page;
        tableConfig.total = total;
      });
    };
    onBeforeMount(() => {
      getUserList();
    });

    //分页设置
    const pagination = computed(() => ({
      total: tableConfig.total,
      // total: 60,
      current: tableConfig.current_page,
      pageSize: tableConfig.per_page,
      // position: ["bottomLeft"], //制定分页器的位置
      // pageSizeOptions: ["2", "4", "6", "8", "10"],//指定每页可以显示多少条
      showQuickJumper: true, //是否可以快速跳转至某页
      showSizeChanger: true, //是否可以改变 pageSize
      // hideOnSinglePage:true//只有一页时是否隐藏分页器
    }));

    const handlePagination = (pag, filters, sorter) => {
      //获取数据
      tableConfig.current_page = pag.current;
      tableConfig.per_page = pag.pageSize;
      getUserList();
    };

    /**********************************************************
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

    /**********************************************************
     * 删除用户
     */
    const removeUser = (record) => {
      UserRemove({ member_id: record.member_id }).then((res) => {
        console.log(res);
        if (res.error_code == 0) {
          message.success(res.msg);
          getUserList();
        }
      });
    };
    const removeUserConfirm = (record) => {
      Modal.confirm({
        title: "温馨提示",
        content: "确认删除此信息，删除后无法恢复？",
        okText: "确认",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          removeUser(record);
        },
        onCancel() {},
      });
    };

    /**********************************************************
     * 用户添加
     */
    const userModelVisible = ref(false);
    const showUserModel = () => {
      userModelVisible.value = true;
    };

    const mumberId = ref(null);
    const handleEdit = (record) => {
      mumberId.value = record.member_id;
      showUserModel();
    };

    return {
      formRef,
      formState,
      searchHandler,
      tableConfig,
      getUserList,
      pagination, //分页器
      handlePagination,
      //状态更新
      changeUserStatus,
      statusLoading,
      //删除
      removeUser,
      removeUserConfirm,
      //用户添加
      userModelVisible,
      showUserModel,

      //编辑
      handleEdit,
      mumberId,
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
