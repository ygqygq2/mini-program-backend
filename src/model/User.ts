// User Model
import mongoose from "../db/mongodb";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // 必需
      unique: true, // 唯一
    },
    password: String,
    age: Number,
    city: String,
    gender: {
      type: Number,
      default: 0, // 0 保密，1 男，2 女
    },
  },
  {
    timestamps: true, // 自动添加创建时间和更新时间
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
