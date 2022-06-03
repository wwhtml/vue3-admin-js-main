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
          <a-input
            v-model:value="formState.username"
            placeholder="请输入您的用户名"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入您的用户名"
            allow-clear
            autoComplete
          ></a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>

      <div class="fs-12">
        <router-link to="/forget" @click="Incomplete">忘记密码</router-link>
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
import { useRouter } from "vue-router";
import { Login } from "../../api/account";
import { checkPhone, checkPass, code } from "../../utils/verification";
import { message } from "ant-design-vue";
import { setToken, getToken } from "../../utils/cookies";
import md5 from "js-md5";

export default {
  setup() {
    const router = useRouter();
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
    const handleFinish = () => {
      const params = {
        username: formState.username,
        password: md5(formState.password),
      };
      Login(params).then((res) => {
        const data = res.content;
        if (data) {
          //将token进行保存
          setToken({ token: data.token });
          message.success(res.msg);
          router.push("/home");
        } else {
          message.error(res.msg);
        }
      });
    };

    const Incomplete = () => {
      message.info("后台接口未完成");
    };

    return {
      formRef,
      formState,
      rules,
      handleFinish,
      Incomplete,
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
