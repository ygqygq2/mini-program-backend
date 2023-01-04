// config
import * as dotenv from "dotenv";
const NODE_ENV = process.env.NODE_ENV || "dev";
dotenv.config({ path: `.env.${NODE_ENV}` }); //config()中是配置.env文件的位置，如果在根目录，此处括号中可以留空

const config = {
  server: {
    port: process.env.PORT,
  },
  db: {
    db_host: process.env.DB_HOST,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_port: process.env.DB_PORT,
  },
  jwtSecret: "JWTSECRET",
  miniProgram: {
    appId: "wxc3db312ddf9bcb01",
    appSecret: "6bb4f303f55a5893fac810e2ab56faa1",
  },
};

export default config;
