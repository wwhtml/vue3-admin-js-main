<template>
  <a-modal
    v-model:visible="visible"
    :title="mumberId ? '用户编辑' : '用户新增'"
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
      <a-form-item label="角色类型" >
        <a-select
          v-model:value="formState.role"
          :options="roleOptions"
        ></a-select>
      </a-form-item>
      <a-form-item label="禁启用" name="status">
        <a-radio-group :options="isOptions" v-model:value="formState.status" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { UserCreate, UserInfo, UserUpdate } from "../../api/user";
import { RoleList, RoleStatus, RoleRemove } from "../../api/role";

import md5 from "js-md5";
import { message } from "ant-design-vue";
export default {
  props: {
    visible: {
      type: Boolean,
      defalut: false,
    },
    mumberId: {
      type: [String, Number],
      default: "",
    },
  },
  emits: ["update:visible", "update:mumberId", "loadData"],
  setup(props, context) {
    const handleOk = (e) => {
      props.mumberId ? updateUserInfo() : createUser();
      handleCancel();
    };
    const handleCancel = () => {
      context.emit("update:visible", false);
      context.emit("update:mumberId", "");
      formRef.value.resetFields();
    };

    //用户添加
    const formRef = ref(null);
    const formState = reactive({
      username: "",
      truename: "",
      phone: "", //必填
      password: "", //加密密码
      card_id: "",
      role: "user", //必填
      status: false, //必填（status：true or false;所以这里直接写了true）
    });
    const roleOptions = ref([]);
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

    //编辑
    const getUserInfo = () => {
      UserInfo({ member_id: props.mumberId }).then((res) => {
        console.log(res);
        const { username, truename, phone, password, card_id, role, status } =
          res.content;
        formState.username = username;
        formState.truename = truename;
        formState.phone = phone;
        formState.password = password;
        formState.card_id = card_id;
        formState.role = role;
        formState.status = status === 0 ? false : true;
      });
    };
    watch(
      () => props.mumberId,
      () => {
        // 用户详情请求
        props.mumberId && getUserInfo();
      }
    );
    const updateUserInfo = () => {
      // 密码加密
      const request_data = Object.assign({}, formState);
      if (request_data.password) {
        request_data.password = md5(request_data.password);
      } else {
        delete request_data.password;
      }
      UserUpdate({ ...request_data, member_id: props.mumberId })
        .then((res) => {
          // 用户新增成功
          message.success(res.msg);
          context.emit("loadData");
        })
        .catch((error) => {
          message.success(error);
        });
    };

    //获取角色列表
    const getRoleList = () => {
      RoleList({ pageSize: 50, pageNumber: 1, status: true }).then((res) => {
        console.log(res);
        const data = res.content.data;
        data.forEach((item) => {
          item.label = item.role_name;
          item.value = item.role_value;
        });
        roleOptions.value = data;
      });
    };
    watch(
      () => props.visible,
      () => {
        // 用户详情请求
        props.visible && roleOptions.value.length === 0 && getRoleList();
      }
    );
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
      updateUserInfo,
      //角色
      getRoleList,
    };
  },
};
</script>

<style scoped lang="scss"></style>
