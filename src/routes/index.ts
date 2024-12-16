import { Elysia } from "elysia";
import appRouter from "./app";
import apiRouter from "./api";
const app = new Elysia();
class Logger {
  log(value: string) {
    console.log(value);
  }
}
export default () => {
  app.decorate("logger", new Logger());
  app.use(appRouter);
  app.use(apiRouter);
  app.all("*", async () => {
    return new Response("© Github Phrynus", { status: 404 });
  });
  return app;
};
//POST 创建 PUT 更新 DELETE 删除 GET 查询
