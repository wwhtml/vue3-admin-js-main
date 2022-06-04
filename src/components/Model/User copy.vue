<template>
  <a-modal
    v-model:visible="visible"
    :title="member_id ? '编辑用户' : '新增用户'"
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
        <a-input-password v-model:value="formState.password" autoComplete />
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
import { reactive, ref, watch, toRef } from "vue";
import { UserCreate, UserInfo } from "../../api/user";
import { message, Modal } from "ant-design-vue";
// 加密
import md5 from "js-md5";
export default {
  props: {
    visible: {
      type: Boolean,
      default: "",
    },
    member_id: {
      type: [Number, String],
      default: "",
    },
  },
  emits: ["update:visible", "update:member_id", "loadData"],

  setup(props, context) {
    console.log(props);
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
    const handleCancel = (e) => {
      context.emit("update:visible", false);
      // context.emit("update:member_id", "");
    };

    const visible = ref(false);
    watch(
      () => props.visible,
      (newValue, oldValue) => {
        visible.value = newValue;
        // 用户详情请求
        props.member_id && newValue && getUserInfo();
      }
    );

    const getUserInfo = () => {
      UserInfo({ member_id: props.member_id }).then((res) => {
        // requestDataFormat(response.content, formState, ["status", "type"]);
        console.log(res);
        const { username, truename, phone, password, care_id, role, status } =
          res.content;
        formState.username = username;
        formState.truename = truename;
        formState.phone = phone;
        formState.password = password;
        formState.care_id = care_id;
        formState.role = role;
        formState.status = status;
      });
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
      //编辑
      getUserInfo,
      visible,
    };
  },
};
</script>

<style scoped lang=""></style>
