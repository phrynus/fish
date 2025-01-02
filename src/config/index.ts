import mysql2 from "mysql2/promise";
import { Database } from "bun:sqlite";
import speakeasy from "speakeasy";
import fs from "fs";
import path from "path";
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

// sqlite 检查是否有表
let table = sqlite.query(`SELECT name FROM sqlite_master WHERE type='table'`).all();
if (table.length < 1) {
  // 管理员表
  sqlite.exec(`
    CREATE TABLE user_admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ascii TEXT NOT NULL,
      hex TEXT NOT NULL,
      base32 TEXT NOT NULL,
      otpauth_url TEXT NOT NULL,
      is_login INTEGER NOT NULL
    )
  `);
  const secret: any = speakeasy.generateSecret({
    length: 20,
    name: "FISH - ADMIN"
  });
  const secretsub: any = speakeasy.generateSecret({
    length: 20,
    name: "FISH - ADMINSUB"
  });
  sqlite.exec(
    `INSERT INTO user_admin (name, ascii, hex, base32, otpauth_url, is_login) VALUES ('admin', '${secret.ascii}', '${secret.hex}', '${secret.base32}', '${secret.otpauth_url}', 0);`
  );
  sqlite.exec(
    `INSERT INTO user_admin (name, ascii, hex, base32, otpauth_url, is_login) VALUES ('admin', '${secretsub.ascii}', '${secretsub.hex}', '${secretsub.base32}', '${secretsub.otpauth_url}', 0);`
  );
  // key表
  sqlite.exec(`
    CREATE TABLE "user_key" (
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expire" INTEGER NOT NULL
    )
  `);
}
// 清空user_admin

// 每十分钟删除一次user_key表里面expire小于当前时间的记录
(async () => {
  const sql = sqlite.query(`DELETE FROM user_key WHERE expire < ?`);
  setInterval(async () => {
    try {
      console.log("清理过期key:", sql.run(Date.now()).changes);
    } catch (error) {
      console.error("清理过期key失败:", error);
    }
  }, 1000 * 60 * 30); //每分钟执行一次
})();
// totp
const secret: any = sqlite.query(`SELECT * FROM user_admin WHERE id=1`).get();

export { mysql, sqlite, secret };
