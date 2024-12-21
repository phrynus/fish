import routes from "./routes";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
// import mysql from "mysql2/promise";
import md5 from "md5";
import cryptoJs from "crypto-js";
import { Database } from "bun:sqlite";

import { mysqlModels } from "./models";

import { secret } from "@/config";

// 启动服务
const start = routes();
start.listen(Number(process.env.PORT) || 3000, () => {
  console.log(`后台地址：http://127.0.0.1:${process.env.PORT}/${secret.hex.slice(0, 6)}`);
  console.log(`面板地址：http://127.0.0.1:${process.env.PORT}/swagger`);
});
