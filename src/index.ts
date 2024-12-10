import routes from "./routes";
import { v4 as uuidv4 } from "uuid";
import mysql from "mysql2/promise";
import md5 from "md5";
import cryptoJs from "crypto-js";

// 启动服务
const start = routes();
start.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
// uuid
