import { Elysia, t } from "elysia";
import { resModel } from "@/utils/routesH";

export default new Elysia({ prefix: "/user" })
  .post(
    "/reg",
    async ({ h }) => {
      return h();
    },
    {
      body: t.Object({
        username: t.String({
          isRequired: true
        }),
        password: t.String({
          isRequired: true
        })
      }),
      response: resModel
    }
  )
  .post(
    "/login",
    async (ctx) => {
      // TODO: 登录
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      response: resModel
    }
  )
  .post(
    "/password/update",
    async (ctx) => {
      // TODO: 修改密码
    },
    {
      body: t.Object({
        password: t.String()
      }),
      response: resModel
    }
  )
  .post(
    "/info",
    async (ctx) => {
      // TODO: 获取用户信息
    },
    {
      response: resModel
    }
  )
  .post(
    "/info/update",
    async (ctx) => {
      // TODO: 修改用户信息
    },
    {
      response: resModel
    }
  );
