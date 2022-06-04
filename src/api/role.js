import service from "@/utils/axiosConfig.js";
service.defaults.baseURL = process.env.VUE_APP_FLAG1;
service.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_ROLE_APIURL
    : process.env.VUE_APP_ROLE_FLAG;

//获取角色列表
export function RoleList(data) {
  return service({
    url: "/v1/role/lists",
    method: "post",
    data,
  });
}

//角色详情
export function RoleDetailed(data = {}) {
  return service({
    url: "/v1/role/detailed ",
    method: "post",
    data,
  });
}

export function RoleCreate(data) {
  return service({
    url: "/v1/role/create",
    method: "post",
    data,
  });
}

//删除
export function RoleRemove(data) {
  return service({
    url: "/v1/role/delete",
    method: "post",
    data,
  });
} 

//禁启用
export function RoleStatus(data) {
  return service({
    url: "/v1/role/status",
    method: "post",
    data,
  });
}
//角色编辑
export function RoleUpdate(data={}) {
  return service({
    url: "/v1/role/update",
    method: "post",
    data,
  });
}

