<template>
  <a-modal
    v-model:visible="visible"
    :title="rowId ? '编辑用户' : '新增用户'"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="真实名称" name="truename">
        <a-input v-model:value="formState.truename" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item label="身份证" name="card_id">
        <a-input v-model:value="formState.card_id" />
      </a-form-item>
      <a-form-item label="角色类型" name="role">
        <a-radio-group :options="roleOptions" v-model:value="formState.role" />
      </a-form-item>
      <a-form-item label="禁启用" name="status">
        <a-radio-group :options="isOptions" v-model:value="formState.status" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";
import { UserList, UserCreate, UserRemove, UserStatus } from "../../api/user";
import { message, Modal } from "ant-design-vue";
// 加密
import md5 from "js-md5";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rowId: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const handleCancel = (e) => {
      context.emit("update:visible", false);
    };

    /****************************************************
     * 用户新增
     */
    const formRef = ref(null);
    const formState = reactive({
      username: "",
      truename: "",
      phone: "", //必填
      password: "", //加密密码
      care_id: "",
      role: "user", //必填
      status: false, //必填（status：true or false;所以这里直接写了true）
    });
    const roleOptions = [
      { label: "超管", value: "admin" },
      { label: "产品管理员", value: "product" },
      { label: "用户管理", value: "user" },
    ];
    const isOptions = [
      { label: "启用", value: true },
      { label: "禁用", value: false },
    ];

    const createUser = () => {
      const userInfos = Object.assign({}, formState);

      userInfos.password = md5(userInfos.password);
      UserCreate(userInfos)
        .then((res) => {
          const { user } = res.content;
          if (user) {
            message.success("创建成功");
            handleCancel();
            context.emit("loadData");
          } else {
            message.error(res.msg); //如果因为已经注册了，会提示
          }
        })
        .catch((err) => {
          message.error(err);
        });
    };
    const handleOk = (e) => {
      createUser();
    };

    return {
      handleCancel,
      formState,
      formRef,
      roleOptions,
      isOptions,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 14,
      },

      createUser,
      handleOk,
    };
  },
};
</script>

<style scoped lang=""></style>
