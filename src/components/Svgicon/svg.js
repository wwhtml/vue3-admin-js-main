//  获取当前svg目录所有为.svg结尾的文件
const req = require.context("@/assets/svg", false, /\.svg$/);
// 解析获取的.svg文件的文件名称，并返回
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext);
};
requireAll(req);
console.log(requireAll(req));


//相当于下面
// const req = require("@/assets/svg/user1.svg");
// const req1 = require("@/assets/images/face.png");
// console.log(req);
// console.log(req1);


