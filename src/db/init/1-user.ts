import User from "../../model/User";

!(async () => {
  // 创建用户
  const user = await User.create({
    username: "jim",
    password: "123",
  });
})();
