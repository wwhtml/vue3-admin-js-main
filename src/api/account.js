import service from "@/utils/axiosConfig.js";
// service.defaults.baseURL = process.env.VUE_APP_FLAG;
//注意：baseURL针对不同的环境进行设置
//比如：生产环境直接调用后台接口，开发环境需要设置代理
service.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_ACCOUNT_APIURL
    : process.env.VUE_APP_ACCOUNT_FLAG;

//用户登录
export function Login(data = {}) {
  return service.request({
    url: "/v1/account/login",
    method: "post",
    data,
  });
}

//检测用户名是否存在
export function CheckUsername(data) {
  return service({
    url: "/v1/account/check",
    method: "post",
    data,
  });
}

//获取验证码
export function GetCode(data) {
  return service({
    url: "/v1/send",
    method: "post",
    data,
  });
}

//用户注册
export function Register(data) {
  return service({
    url: "/v1/account/register",
    method: "post",
    data,
  });
}
