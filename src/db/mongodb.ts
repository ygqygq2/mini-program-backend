import config from "../../config";
import  mongoose from "mongoose";

// mongodb url
const url = `mongodb://${config.db.db_user}:${config.db.db_password}@${config.db.db_host}:${config.db.db_port}`;
// mongodb database name
const dbName = config.db.db_name;

// connect to mongodb
mongoose.set("strictQuery", true);
mongoose.connect(`${url}/${dbName}`);

// 获取连接对象
const conn = mongoose.connection;

conn.on("error", (err: any) => {
    console.log("连接 mongodb 数据库失败", err);
});

export default mongoose;
