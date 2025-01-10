import { Elysia, t } from "elysia";
import routerH from "@/utils/routerH";
import cryptoJs from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { mysql, sqlite } from "@/config";
export default new Elysia({ prefix: "/users" })
  .post("/", async (ctx) => "a", {
    query: t.Object({
      app: t.String(),
      name: t.String(),
      password: t.String()
    }),
    response: {
      200: t.Object({}),
      500: routerH.error,
      400: routerH.error
    }
  }) // 创建用户
  .post(
    "/email",
    async (ctx) => {
      const { email } = ctx.query;
      // 正则邮箱是否正确
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(email)) {
        return routerH.run({
          code: 400,
          mse: "邮箱格式不正确"
        });
      }
      const iteEmail =
        sqlite
          .query(`SELECT * FROM user_email WHERE email='1' AND strftime('%s', 'now') * 1000 - expire <= 60 * 1000`)
          .run(email) || [];
      if (iteEmail.length > 0) {
        return routerH.run({
          code: 400,
          mse: "请勿频繁发送验证码"
        });
      }
    },
    {
      query: t.Object({
        email: t.String()
      }),
      response: {
        200: t.Object({}),
        500: routerH.error,
        400: routerH.error
      }
    }
  )
  .get("/", async ({}) => "获取用户列表")
  .get("/:id", async () => "获取用户信息")
  .put("/:id", async () => "更新用户信息")
  .delete("/:id", async () => "删除用户信息");
