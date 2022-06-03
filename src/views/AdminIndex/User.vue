<template>
  <!-- table -->
  <!-- 首先要先完成一个添加用户的功能 -->
  <a-row type="flex" class="mb-24">
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
          <a-space style="width: 100%">
            <a-button type="primary" @click="searchHandler">搜索111</a-button>
            <a-button type="primary" @click="searchHandler('reset')"
              >重置</a-button
            >
            <a-button type="primary">导出</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-col>
    <a-col flex="100px">
      <a-button type="primary" block @click="showModal">新增用111户</a-button>
    </a-col>
    <a-col>
      <a-button type="danger" style="margin-left: 8px"> 批量删除 </a-button>
    </a-col>
  </a-row>

  <a-table
    :columns="tableConfig.columns"
    :loading="tableConfig.loading"
    :pagination="pagination"
    :bordered="true"
    :data-source="tableConfig.data"
    @change="handleChange"
  >
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.dataIndex === 'status'">
        {{ text }}
        <a-switch
          :loading="record.statusLoading"
          :checked="text == 0 ? false : true"
          @click="changeUserStatus(record)"
        />
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-space align="center">
          <a-button type="primary">详情</a-button>
          <a-button>编辑</a-button>
          <a-popconfirm
            placement="topRight"
            title="您确认删除当前项?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="removeUserConfirm(record)"
          >
            <a-button type="dashed">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </a-table>

  <!-- 添加功能 -->
  <DraggableModal
    v-model:visible="visible"
    okText="确认"
    cancelText="取消"
    title="用户添加"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="userInfoFormRef"
      :label-col="{
        span: 5,
      }"
      :wrapper-col="{
        span: 14,
      }"
      :model="userCreateFormState"
    >
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="userCreateFormState.phone" />
      </a-form-item>
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="userCreateFormState.username" />
      </a-form-item>
      <a-form-item label="真实名称" name="truename">
        <a-input v-model:value="userCreateFormState.truename" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input v-model:value="userCreateFormState.password" />
      </a-form-item>
      <a-form-item label="身份证" name="care_id">
        <a-input v-model:value="userCreateFormState.care_id" />
      </a-form-item>
      <a-form-item label="角色类型" name="role">
        <a-radio-group v-model:value="userCreateFormState.role">
          <a-radio value="1">超管</a-radio>
          <a-radio value="2">产品管理</a-radio>
          <a-radio value="3">用户管理</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="禁启用" name="status">
        <a-radio-group v-model:value="userCreateFormState.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </DraggableModal>
</template>

<script>
import { UserList, UserCreate, UserRemove, UserStatus } from "../../api/user";

import { reactive, ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import DraggableModal from "../../components/DraggableModal.vue";

export default {
  name: "User",
  components: {
    DraggableModal,
  },

  setup() {
    /*****************************************
     * 用户列表
     */
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
          loading: true,
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
      current_page: 1, //当前页
      per_page: 10, //每一页数据条数
      last_page: "", //最后一页的页码
      total: "", //数据总条数
    });

    //获取数据
    const getUserList = () => {
      tableConfig.loading = true;
      const requestData = {
        pageNumber: tableConfig.current_page,
        pageSize: tableConfig.per_page,
      };
      UserList(requestData).then((res) => {
        tableConfig.loading = false;
        const { data, current_page, per_page, total } = res.content;
        tableConfig.data = data;
        tableConfig.current_page = current_page;
        tableConfig.per_page = per_page;
        tableConfig.total = total;
      });
    };
    onMounted(() => {
      //页面加载完成之后在获取数据
      getUserList(); //DOM加载后
    });

    //分页器
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

    const handleChange = (pagination) => {
      //获取数据
      tableConfig.current_page = pagination.current;
      tableConfig.per_page = pagination.pageSize;
      tableConfig.total = pagination.total;

      searchHandler();
    };

    /****************************
     * formSearch
     */

    const formRef = ref();
    const formState = reactive({
      role: "",
      status: "",
      key: "",
      keywords: "",
    });
    const searchHandler = (type) => {
      //配置后台接口参数
      if (type === "reset") {
        formRef.value.resetFields();
        tableConfig.current_page = 1; //当前页
        tableConfig.per_page = 10; //每一页数据条数
      }

      const requestData = {
        pageNumber: tableConfig.current_page,
        pageSize: tableConfig.per_page,
      };
      const formStateCopy = Object.assign({}, formState);
      const search = {};
      if (formStateCopy.key && formStateCopy.keywords) {
        search[formStateCopy.key] = formStateCopy.keywords;
      }

      // 删除关键字
      delete formStateCopy.key;
      delete formStateCopy.keywords;
      const requestDatas = Object.assign(
        {},
        requestData,
        search,
        formStateCopy
      );
      // 将statsu的只进行修改，如果是0改成false，如果是1改成true（因为请求接口参数是Boolean）
      if (requestDatas.status === 1) {
        requestDatas.status = true;
      } else if (requestDatas.status === 0) {
        requestDatas.status = false;
      } else {
        requestDatas.status = "";
      }
      // 过滤空选项
      for (let key in requestDatas) {
        if (requestDatas[key] === "") {
          delete requestDatas[key];
        }
      }
      console.log(requestDatas);

      getUserList(requestDatas);
    };

    /********************************************
     * 更新状态
     */
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

    /****************************************************
     * 删除
     */
    const removeUser = (record) => {
      UserRemove({ member_id: record.member_id }).then((res) => {
        if (res.error_code == 0) {
          searchHandler();
          message.success(res.msg);
        }
      });
    };

    const removeUserConfirm = (record) => {
      removeUser(record);
    };

    /****************************************************
     * 用户新增
     */
    const userCreateFormState = reactive({
      username: "",
      truename: "",
      phone: "", //必填
      password: "", //加密密码
      care_id: "",
      role: "1", //必填
      status: 0, //必填（status：true or false;所以这里直接写了true）
    });
    const visible = ref(false);
    const modalTitleRef = ref(null);
    const userInfoFormRef = ref(null);

    const createUser = () => {
      const userInfos = Object.assign({}, userCreateFormState);
      // 将statsu的只进行修改，如果是0改成false，如果是1改成true（因为请求接口参数是Boolean）
      if (userInfos.status === 1) {
        userInfos.status = true;
      } else if (userInfos.status === 0) {
        userInfos.status = false;
      }
      UserCreate(userInfos)
        .then((res) => {
          const { user } = res.content;
          if (user) {
            //添加用户之后还是重新获取列表比较合适，不适合有筛选条件
            searchHandler("reset"); //重置表单
            const requestData = {
              pageNumber: tableConfig.current_page,
              pageSize: tableConfig.per_page,
            };
            getUserList(requestData); //获取数据
            //这样可以保证新添加的用户可以被第一时间看到，从而确认添加成功
            message.success(res.msg);
          } else {
            message.error(res.msg); //如果因为已经注册了，会提示
          }
        })
        .catch((err) => {
          message.error(err);
        });
    };

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e) => {
      createUser();
      // userInfoFormRef.value.resetFields();
      // visible.value = false;
      // console.log(e);
      // console.log("handleOk");
    };

    const handleCancel = (e) => {
      console.log(e);
      console.log("handleCancel");
    };

    return {
      //列表
      tableConfig,
      pagination,
      handleChange,
      //更新状态
      changeUserStatus,

      //根据条件搜索
      formRef,
      formState,
      searchHandler,
      //删除
      removeUser,
      removeUserConfirm,
      //添加
      userCreateFormState,
      visible,
      modalTitleRef,
      userInfoFormRef,

      showModal,
      handleOk,
      handleCancel,
    };
  },
};
</script>

<style style lang="scss" scoped>
// @import "../../styles/sss.scss";
// button.ant-btn + .ant-btn {
//   margin-left: 8px;
// }
.ant-switch-checked {
  background-color: #1cbb1cfa;
}
</style>
