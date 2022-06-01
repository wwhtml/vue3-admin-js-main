import Cookies from "js-cookie";
const token = "tokenAdmin";
// token
export function setToken(params){
  Cookies.set(token,params.token)
}
export function getToken(){
  return Cookies.get(token)
}
export function removeToken() {
  Cookies.removeToken(token);
}