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

// mysql 检查是否有表
const mysqlTable = await mysql
  .query(`SELECT TABLE_NAME FROM information_schema.tables WHERE table_name='apps'`)
  .then((res) => res[0]);
if (mysqlTable.length < 1) {
  const installSql = await Bun.file("install.sql").text();
  const sqls = installSql.split("-- <>");
  let name = "";
  for (const sql of sqls) {
    if (sql.trim() === "") continue;
    // 判断是否是创建表的语句
    if (!sql.trim().startsWith("CREATE TABLE")) {
      name = sql.trim();
      continue;
    }
    await mysql
      .query(sql)
      .then((res) => {
        console.log(`[MySQL] 创建表成功: ${name}`);
      })
      .catch((error) => {
        console.error(`[MySQL] 创建表失败: ${name} ${error.message}`);
      });
  }
}

const sqlite = new Database("data/db.sqlite");
sqlite.exec("PRAGMA journal_mode = WAL;");
// sqlite 检查是否有表
const sqliteTable = sqlite.query(`SELECT name FROM sqlite_master WHERE type='table'`).all();
if (sqliteTable.length < 1) {
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
  sqlite.exec(
    `INSERT INTO user_admin (name, ascii, hex, base32, otpauth_url, is_login) VALUES ('admin', '${secret.ascii}', '${secret.hex}', '${secret.base32}', '${secret.otpauth_url}', 0);`
  );
  // key表
  sqlite.exec(`
    CREATE TABLE "user_key" (
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expire" INTEGER NOT NULL
    )
  `);
  // key表
  sqlite.exec(`
    CREATE TABLE "user_email" (
      "email" TEXT NOT NULL,
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
