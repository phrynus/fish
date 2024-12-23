import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ip } from "elysia-ip";
import { cors } from "@elysiajs/cors";
import { Logestic } from "logestic";

import apiRouter from "./api";
import adminRouter from "./admin";
import { secret } from "@/config";

const app = new Elysia();
export default () => {
  return app
    .use(Logestic.preset("common"))
    .use(cors())
    .use(swagger())
    .use(ip())
    .use(adminRouter)
    .use(apiRouter)
    .all("*", async (ctx) => {
      // 版权声明
      return ctx.error(404, "© 2025 Phrynus.");
    });
};
