/*
 * @Author      : Chinge Yang
 * @Date        : 2022-09-08 14:53:07
 * @LastEditTime: 2022-12-09 15:33:14
 * @LastEditors : Chinge Yang
 * @Description : user contoller
 * @FilePath    : /ygqygq2-cli-template/src/controller/user.ts
 */

import User from "../model/User";

// 登录
async function login(username: string, password: string) {
  // 查询用户是否存在
  const user = await User.findOne({ username });
  if (!user) {
    // 用户不存在
    throw new Error("用户不存在");
  }
  // 用户存在，验证密码是否正确
  if (password !== user.password) {
    // 密码错误
    throw new Error("密码错误");
  }
  // 登录成功
  return true;
}

// 注册
async function register(userInfo = {}) {
  // 插入数据库
  const newUser = await User.create(userInfo);
  // 返回注册的用户信息
  return newUser;
}

export { login, register };
