const init_data = {
  status: {
    0: false,
    1: true
  }
}

// josn key match
export function matchKey(field, value) {
  // 获取初始化的数据
  const data = init_data[field];
  // 不存在时，返回false
  if (!data) { return false; }
  // 否则
  return data[value];
}

// 响应报文的数据转
// export function requestDataFormat(data, field, matchField){
export function requestDataFormat(params) {
  const request_data = params.data;
  const keys = Object.keys(request_data);
  // form
  const formState = params.form;
  // 匹配字段赋值
  for (let key in formState) {
    if (keys.includes(key)) { // 匹配响应报文和表单字段
      if (params.match.includes(key)) { // 匹配是否转换数据的字段
        formState[key] = matchKey(key, request_data[key]);
      } else {
        formState[key] = request_data[key];
      }
    }
  }
}

//递归函数格式化树状菜单
export function formatTree(data, id = 'id', pid = "parent_id", child = "children", root) {
  const tree = [];
  if (data && data.length > 0) {
    data.forEach((item) => {
      //获取顶层菜单，parent_id===0
      if (item[pid] === root) {
        const children = formatTree(data, id, pid, child, item[id]);
        if (children && children.length > 0) {
          item[child] = children;
        }
        tree.push(item);
      }
    })
  }
  return tree;
}