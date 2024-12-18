import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ip } from "elysia-ip";

import apiRouter from "./api";
import adminRouter from "./admin";

const app = new Elysia();
export default () => {
  app.use(swagger());
  app.use(ip());
  app.use(adminRouter);
  app.use(apiRouter);
  app.all("*", async () => {
    return new Response("© Github Phrynus", { status: 404 });
  });
  return app;
};
//POST 创建 PUT 更新 DELETE 删除 GET 查询
