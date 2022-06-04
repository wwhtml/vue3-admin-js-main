import service from "@/utils/axiosConfig.js";
// service.defaults.baseURL = process.env.VUE_APP_FLAG1;
service.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.VUE_APP_USER_APIURL
    : process.env.VUE_APP_USER_FLAG;
// console.log(process.env.VUE_APP_FLAG1)


/** 菜单列表 */
export function MenuList(data = {}){
  return service.request({
      url: '/v1/menu/listsTree  ',
      method: 'post',
      data,
  })
}

/** 菜单新增 */
export function MenuCreate(data = {}){
  return service.request({
      url: '/v1/menu/create',
      method: 'post',
      data,
  })
}

/** 菜单删除 */
export function MenuRemove(data = {}){
  return service.request({
      url: '/v1/menu/remove ',
      method: 'post',
      data,
  })
}

/* 菜单编辑 */
export function MenuUpdate(data = {}){
  return service.request({
      url: '/v1/menu/update',
      method: 'post',
      data,
  })
}

export function MenuDetailed(data = {}){
  return service.request({
      url: '/v1/menu/detailed',
      method: 'post',
      data,
  })
}



