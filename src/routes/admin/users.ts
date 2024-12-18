import { Elysia } from "elysia";
import cryptoJs from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { mysql, sqlite } from "@/config";
export default new Elysia({ prefix: "/users" })
  .post("/", async ({ query, ip, jwt }) => {
    const { username, password, email } = query;
    const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    const usernameReg = /^[a-zA-Z0-9_]{3,16}$/;
    try {
      if (!username || !password || !email) throw new Error("请输入用户名、密码和邮箱");
      if (!emailReg.test(email)) throw new Error("邮箱格式不正确");
      if (!usernameReg.test(username)) throw new Error("用户名格式不正确，长度为3-16位，只能包含字母、数字、下划线");
      if (password.length < 6) throw new Error("密码长度不能小于6位");
      const c_params = [
        uuidv4(),
        username,
        cryptoJs.SHA256(password).toString(),
        email,
        1,
        ip,
        JSON.stringify({
          number: 3,
          mac: []
        })
      ];
      const sql = `INSERT INTO users (uuid, username, password, email, status, reg_ip, reg_mac) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await mysql.execute(sql, c_params);
      // 循环匹配
      return "ok";
    } catch (error: any) {
      [{ pattern: /Duplicate entry '[a-zA-Z0-9_]{3,16}' for key 'users.username'/, msg: "用户名已被使用" }].forEach(
        ({ pattern, msg }) => {
          if (pattern.test(error.message)) throw new Error(msg);
        }
      );
      return error;
    }
  })
  .get("/", async ({}) => "获取用户列表")
  .get("/:id", async () => "获取用户信息")
  .put("/:id", async () => "更新用户信息")
  .delete("/:id", async () => "删除用户信息");
