import routes from "./routes";
import { v4 as uuidv4 } from "uuid";
// import mysql from "mysql2/promise";
import md5 from "md5";
import cryptoJs from "crypto-js";
import { Database } from "bun:sqlite";

import { mysqlModels } from "./models";

// 启动服务
const start = routes();
start.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
// uuid
console.log(mysqlModels);

mysqlModels.Users.add({
  username: "admin1",
  password: md5("admin"),
  email: "admin1@example.com",
  status: 1,
  reg_ip: "127.0.0.1",
  reg_mac: {
    type: "string",
    default: uuidv4()
  }
})
  .then((e) => {
    console.log(e);
  })
  .catch((e) => {
    console.error(e);
  });
