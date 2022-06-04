import service from "@/utils/axiosConfig.js";
// service.defaults.baseURL = process.env.VUE_APP_FLAG1;
service.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_USER_APIURL
    : process.env.VUE_APP_USER_FLAG;
// console.log(process.env.VUE_APP_FLAG1)
/** 用户新增 */
export function UserCreate(data) {
  return service({
    url: "/v1/user/create",
    method: "post",
    data,
  });
}

//获取用户列表
export function UserList(data) {
  return service({
    url: "/v1/user/lists",
    method: "post",
    data,
  });
}

//删除用户
export function UserRemove(data) {
  return service({
    url: "/v1/user/remove",
    method: "post",
    data,
  });
}

//用户状态更新
export function UserStatus(data) {
    return service({
      url: "/v1/user/status ",
      method: "post",
      data,
    });
}

export function UserInfo(data) {
  return service({
    url: "/v1/user/info ",
    method: "post",
    data,
  });
}

export function UserUpdate(data) {
  return service({
    url: "/v1/user/update  ",
    method: "post",
    data,
  });
}














// http://user.web-jshtml.cn/api/v1/user/lists

// export function UserCreate(data){
//     return service.request({
//         url: process.env.VUE_APP_APIURL_USER + '/v1/user/create',
//         method: 'post',
//         data,
//     })
// }
