import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ip } from "elysia-ip";
import { cors } from "@elysiajs/cors";

import apiRouter from "./api";
import adminRouter from "./admin";
import { secret } from "@/config";

const app = new Elysia();
export default () => {
  return app
    .use(cors())
    .use(swagger())
    .use(ip())
    .use(adminRouter)
    .use(apiRouter)
    .all("*", async (ctx) => {
      return ctx.error(404, "");
    });
};
