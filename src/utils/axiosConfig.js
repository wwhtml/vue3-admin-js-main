import axios from "axios";
import {setToken,getToken} from "./cookies"
import { message } from "ant-design-vue";

const service = axios.create({
  timeout: 2000
});

// 添加请求拦截器
service.interceptors.request.use(
  //这里的信息是交由后端处理的
  function (config) {
    // 在发送请求之前做些什么
    config.headers["Authorization"] = getToken()
    console.log(config)
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error); 
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const { data } = response;
    if (data.error_code === 0) {
      return Promise.resolve(data);
    } else {
      console.log(111)
      return Promise.reject(data);
    }
  },
  function (error) {//比如请求接口错误就会返回下面的数据
    // 对响应错误做点什么
    const data = JSON.parse(error.request.response);
    console.log(222)
    message.error(data.msg)

    return Promise.reject(error);
  }
);

export default service;
