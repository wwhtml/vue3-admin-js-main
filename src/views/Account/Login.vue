<template>
  <div class="account">
    <div class="form-wrap">
      <a-form
        ref="formRef"
        layout="vertical"
        :model="formState"
        :rules="rules"
        @finish="handleFinish"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username"></a-input>
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input v-model:value="formState.password"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>

      <div class="fs-12">
        <router-link to="/forget">忘记密码</router-link>
        <a-divider
          type="vertical"
          style="background-color: rgb(24 144 255)"
        ></a-divider>
        <router-link to="/register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { checkPhone, checkPass, code } from "../../utils/verification";
export default {
  setup() {
    const formState = reactive({
      username: "",
      password: "",
    });

    const checkUsername = async (_rule, value) => {
      console.log(_rule, value);
      if (!value) {
        return Promise.reject("请输入用户名"); //不存在的情况
      } else if (!checkPhone(value)) {
        return Promise.reject("请输入11位数字的手机号"); //手机号错误的情况
      } else {
        return Promise.resolve("ok");
      }
    };

    const checkPassword = (_rule, value) => {
      if (!value) {
        return Promise.reject("请输入密码"); //不存在的情况
      } else if (!checkPass(value)) {
        return Promise.reject("请输入6~20位的，数字+英文"); //密码错误的情况
      } else {
        return Promise.resolve("ok");
      }
    };

    const rules = reactive({
      username: [
        {
          validator: checkUsername,
          trigger: "change",
        },
      ],
      password: [
        {
          validator: checkPassword,
          trigger: "change",
        },
      ],
    });

    const formRef = ref();

    //提交数据
    const handleFinish = () => {};

    return {
      formRef,
      formState,
      rules,
      handleFinish,
    };
  },
};
</script>

<style scoped lang="scss">
.account {
  width: 100wh;
  height: 100vh;
  background-color: #282828;
  display: flex;
  justify-content: center;
}
.form-wrap {
  width: 300px;
  margin: auto;
}
::v-deep .ant-form-item-label > label {
  color: white;
}
</style>