import mysql2 from "mysql2/promise";
import { Database } from "bun:sqlite";
try {
  const envs = ["MYSQL_HOST", "MYSQL_PORT", "MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE"];
  envs.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`缺少配置文件: ${env}`);
    }
  });
} catch (error) {
  throw error;
}

const mysql = mysql2.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// utf8mb4_general_ci
await mysql
  .getConnection()
  .then((connection) => {
    connection.release();
    console.log(`[MySQL] 连接成功: ${connection.threadId}`);
  })
  .catch((error) => {
    console.error(`[MySQL] 连接失败: ${error.message}`);
  });

const sqlite = new Database("data/db.sqlite");
sqlite.exec("PRAGMA journal_mode = WAL;");

export { mysql, sqlite };