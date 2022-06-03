<template>
  <div class="user">
    <!-- 首先要先完成一个添加用户的功能 -->
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
        <a-button type="primary" block @click="showModal">新增用户</a-button>
      </a-col>
      <a-col>
        <a-button
          type="primary"
          style="margin-left: 8px"
          :disabled="!hasSelected"
          @click="deleteTheSelected(tableConfig.selectedRowKeys)"
        >
          批量删除
        </a-button>
      </a-col>
    </a-row>

    <!-- 表格 渲染数据列表 -->
    <a-table
      :columns="tableConfig.columns"
      :data-source="tableConfig.data"
      :loading="tableConfig.loading"
      bordered
      :row-selection="rowSelection"
      :row-key="(record) => record.member_id"
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
          <a-button>编辑</a-button>

          <a-popconfirm
            placement="topRight"
            title="您确认删除当前项?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="removeUserConfirm(record)"
          >
            <a-button type="dashed">删除</a-button>
            <!-- <a-button type="dashed" @click="removeUser(record)">删除</a-button> -->
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!-- 添加用户相关dom模块 -->
    <a-modal
      ref="modalRef"
      v-model:visible="visible"
      :wrap-style="{ overflow: 'hidden' }"
      @ok="handleOk"
    >
      <a-form
        ref="userInfoFormRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="userInfo"
      >
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="userInfo.phone" />
        </a-form-item>
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="userInfo.username" />
        </a-form-item>
        <a-form-item label="真实名称" name="truename">
          <a-input v-model:value="userInfo.truename" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input v-model:value="userInfo.password" />
        </a-form-item>
        <a-form-item label="身份证" name="care_id">
          <a-input v-model:value="userInfo.care_id" />
        </a-form-item>
        <a-form-item label="角色类型" name="role">
          <a-radio-group v-model:value="userInfo.role">
            <a-radio value="1">超管</a-radio>
            <a-radio value="2">产品管理</a-radio>
            <a-radio value="3">用户管理</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="禁启用" name="status">
          <a-radio-group v-model:value="userInfo.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">
          Draggable Modal
        </div>
      </template>
      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { UserList, UserCreate, UserRemove, UserStatus } from "../../api/user";
import {
  reactive,
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  toRefs,
  toRef,
} from "vue";
import { useDraggable } from "@vueuse/core";
import { message } from "ant-design-vue";

export default {
  name: "User",
  setup() {
    //请求数据的逻辑
    let requestData = {
      pageNumber: 1,
      pageSize: 10,
    };

    /**
     * form表单搜索功能
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
        // formState.keywords = "";
      }
      const formStateCopy = Object.assign({}, formState);
      const search = {};
      if (formStateCopy.key && formStateCopy.keywords) {
        search[formStateCopy.key] = formStateCopy.keywords;
      }

      // 删除关键字
      delete formStateCopy.key;
      delete formStateCopy.keywords;

      // 拼接搜索项
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

      getUserList(requestDatas);
    };

    /*********************************************************************************************
     * 用户列表
     */
    const tableConfig = reactive({
      data: [],
      current_page: "",
      per_page: "",
      total: "",
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

      selectedRowKeys: [],
    });

    //获取数据列表（并将数据渲染到页面中）
    const getUserList = (requestData) => {
      tableConfig.loading = true;
      UserList(requestData).then((res) => {
        console.log(res);
        if (res.error_code === 0) {
          tableConfig.loading = false;
          // console.log(res);
          // console.log(res.content);
          const { data, current_page, per_page, total } = res.content;
          tableConfig.data = data;
          tableConfig.current_page = current_page;
          tableConfig.per_page = per_page;
          tableConfig.total = total;
        }
      });
    };
    onMounted(() => {
      //页面加载完成之后在获取数据
      getUserList(requestData); //DOM加载后
    });

    //getUserList(requestData);
    //在这里执行就相当于在组合式api中的created(){}中执行；

    //分页器
    const pagination = computed(() => ({
      total: tableConfig.total,
      current: tableConfig.current_page,
      pageSize: tableConfig.per_page,
    }));

    const handlePagination = (pag, filters, sorter) => {
      //获取数据
      tableConfig.current_page = pag.current;
      tableConfig.per_page = pag.pageSize;

      requestData.pageNumber = pag.current;
      requestData.pageSize = pag.pageSize;
      console.log(requestData);

      searchHandler();
    };

    /******************************************************************************
     * 删除用户
     */
    const removeUser = (record) => {
      console.log(record);
      UserRemove({ member_id: record.member_id }).then((res) => {
        console.log(res);
        if (res.error_code == 0) {
          // const data = tableConfig.data;
          // tableConfig.data = data.filter((item, index) => {
          //   return item.member_id !== record.member_id;
          // });
          //用上面的方式没办法保证当前页面数据一直是10条
          //或者
          searchHandler();

          message.success(res.msg);
        }
      });
    };

    const removeUserConfirm = (record) => {
      removeUser(record);
    };

    //批量删除
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        tableConfig.selectedRowKeys = selectedRowKeys;
        // console.log(selectedRowKeys);
      },
    };
    //判断是否选择
    const hasSelected = computed(() => tableConfig.selectedRowKeys.length > 0);
    const deleteTheSelected = (data) => {
       message.error("批量删除接口未完成。。。");
      //如果有接口的话，可能是下面
      // UserRemove({ member_ids:data}).then((res) => {
      //   console.log(UserRemove);
      // });
    };

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

    /****************************************************************************************
     * 添加用户信息
     */
    const userInfo = reactive({
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

    const showModal = () => {
      visible.value = true;
    };

    const createUser = () => {
      const userInfos = Object.assign({}, userInfo);

      // 将statsu的只进行修改，如果是0改成false，如果是1改成true（因为请求接口参数是Boolean）
      if (userInfos.status === 1) {
        userInfos.status = true;
      } else if (userInfos.status === 0) {
        userInfos.status = false;
      }
      console.log(userInfos);
      UserCreate(userInfos).then((res) => {
        const { user } = res.content;
        // console.log(user);
        if (user) {
          //添加用户之后还是重新获取列表比较合适，不适合有筛选条件
          searchHandler("reset"); //重置表单
          getUserList(requestData); //获取数据
          //这样可以保证新添加的用户可以被第一时间看到，从而确认添加成功

          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      });
    };

    const handleOk = (e) => {
      // console.log(e);
      createUser();
      userInfoFormRef.value.resetFields();
      visible.value = false;
    };

    const { x, y, isDragging } = useDraggable(modalTitleRef);
    const startX = ref(0);
    const startY = ref(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = modalTitleRef.value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }

      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });
    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(
            Math.max(dragRect.value.left, x.value),
            dragRect.value.right
          ) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(
            Math.max(dragRect.value.top, y.value),
            dragRect.value.bottom
          ) -
          startY.value;
      }
    });
    const transformStyle = computed(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });

    //通过return中的函数或者数据才能在dom中使用
    return {
      formRef,
      formState,
      searchHandler,
      //用户列表
      requestData,

      tableConfig,

      pagination, //分页器
      handlePagination,

      //删除
      removeUser,
      removeUserConfirm,

      //批量删除
      // removeBtnDisabled,
      hasSelected,
      // onSelectChange,
      rowSelection,
      deleteTheSelected,

      //状态更新
      changeUserStatus,
      statusLoading,

      //添加
      userInfo,
      visible,
      showModal,
      handleOk,
      modalTitleRef,
      transformStyle,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
      userInfoFormRef,
    };
  },
};
</script>
<style style lang="scss" scoped>
// @import "../../styles/sss.scss";
button.ant-btn + .ant-btn {
  margin-left: 8px;
}
.ant-switch-checked {
  background-color: #1cbb1cfa;
}
</style>
