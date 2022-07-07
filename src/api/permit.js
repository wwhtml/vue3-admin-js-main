import service from "@/utils/axiosConfig.js";
service.defaults.baseURL = process.env.VUE_APP_FLAG1;
service.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_ROLE_APIURL
    : process.env.VUE_APP_ROLE_FLAG;

//权限接口
export function getPermission(data = {}) {
  return service({
    url: "/v1/permission ",
    method: "post",
    data,
  });
}