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
            placeholder="请输入您的密码"
            allow-clear
            autoComplete
          ></a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" name="passwords">
          <a-input-password
            v-model:value="formState.passwords"
            placeholder="请输入您的密码"
            allow-clear
            autoComplete
          ></a-input-password>
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <a-row type="flex" justify="space-between">
            <a-col :span="12">
              <a-input v-model:value="formState.code"></a-input>
            </a-col>
            <a-col :span="10">
              <a-button
                type="primary"
                block
                :disabled="sendCodeConfig.disabled"
                :loading="sendCodeConfig.loading"
                @click="sendCode"
                >{{ sendCodeConfig.text }}</a-button
              >
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>注册</a-button>
        </a-form-item>
      </a-form>

      <div class="fs-12">
        <router-link to="/forget">忘记密码</router-link>
        <a-divider
          type="vertical"
          style="background-color: rgb(24 144 255)"
        ></a-divider>
        <router-link to="/login">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { checkPhone, checkPass, code } from "../../utils/verification";
import { CheckUsername, GetCode, Register } from "../../api/account";
//js-mad5
import md5 from "js-md5";
import { message } from "ant-design-vue";
export default {
  setup() {
    const formState = reactive({
      username: "",
      password: "",
      passwords: "",
      code: "",
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

    const checkPasswords = async (_rule, value) => {
      const pas = formState.password;
      if (!value) {
        return Promise.reject("请再次输入密码"); //不存在的情况
      } else if (!checkPass(value)) {
        return Promise.reject("请输入6~20位的，数字+英文"); //密码错误的情况
      } else if (pas && value && pas !== value) {
        return Promise.reject("两次密码不一致"); //密码错误的情况
      } else {
        return Promise.resolve("ok");
      }
    };

    //检验验证码
    const checkCode = async (_rule, value) => {
      if (!value) {
        return Promise.reject("请输入验证码"); //不存在的情况
      } else if (!code(value)) {
        return Promise.reject("请输入6位的数字"); //密码错误的情况
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
      passwords: [
        {
          validator: checkPasswords,
          trigger: "change",
        },
      ],
      code: [
        {
          validator: checkCode,
          trigger: "change",
        },
      ],
    });

    const formRef = ref();

    //发送验证码
    const sendCodeConfig = reactive({
      text: "发送验证码",
      disabled: false,
      loading: false,
      timer: null,
    });

    //发送验证码
    const sendCode = async () => {
      if (!formState.username || !checkPhone(formState.username)) {
        //如果用户名是空的，点击获取验证码报错
        formRef.value.validateFields(["username"]);
        return false; //若果是空的不再执行下面的代码
      }

      const userStatus = await checkUsernameFn();
      if (userStatus) {
        return false; //若果已经注册了，不再执行下面的代码
      }

      sendCodeConfig.disabled = true;
      sendCodeConfig.loading = true;
      sendCodeConfig.text = "发送中";

      const params = { username: formState.username, type: "Register" };
      GetCode(params).then((res) => {
        message.info("验证码：" + res.content);
        countDown(5);
      });
    };
    const countDown = (count) => {
      sendCodeConfig.text = count + " s";
      sendCodeConfig.loading = false;

      sendCodeConfig.timer && clearInterval(sendCodeConfig.timer);
      sendCodeConfig.timer = setInterval(() => {
        count--;
        sendCodeConfig.text = count + " s";
        if (count <= 0) {
          clearInterval(sendCodeConfig.timer);
          sendCodeConfig.disabled = false;
          sendCodeConfig.text = "重新发送";
        }
      }, 1000);
    };

    //验证用户是否注册
    const checkUsernameFn = () => {
      const params = { username: formState.username };
      return CheckUsername(params)
        .then((res) => {
          const { user } = res.content;
          if (user) {
            message.error("当前用户已注册");
          }
          return user;
        })
        .catch((error) => {
          message.error("检查网络");
          return true;
        });
    };

    //提交数据
    const router = useRouter();
    const handleFinish = () => {
      const requestData = {
        username: formState.username,
        password:  md5(formState.password),
        code: formState.code,
      };
      Register(requestData).then((res) => {
        const { code } = res.content;
        if (code) {
          message.success("注册成功");
          router.push("/login");
        } else {
          message.error(res.msg);
        }
      });
    };

    return {
      formRef,
      formState,
      rules,
      handleFinish,
      sendCodeConfig,
      sendCode,
      checkUsernameFn,
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
