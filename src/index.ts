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
start.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

console.log(secret);
