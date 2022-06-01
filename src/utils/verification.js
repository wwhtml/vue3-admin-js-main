
/***************************************************************
 * 校验用户名
 */
 export function checkPhone(value) {
  let regPhong = /^1[3456789]\d{9}$/;
  return regPhong.test(value);
}




/***************************************************************
 * 校验密码
 */
export function checkPass(value) {
  let regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return regPassword.test(value);
}



/**
 * 数字
 */
 export function code(value){
  let regCode = /^\d{6}$/;
  return regCode.test(value);
}