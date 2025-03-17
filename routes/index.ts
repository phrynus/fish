import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Logestic } from "logestic";
import config from "@/config";
//
import { H } from "@/utils/routesH";
import apiRouter from "./api";
//
const app = new Elysia();
export default () => {
  return app
    .use(cors())
    .use(
      swagger({
        path: "/swagger"
      })
    )
    .use(Logestic.preset("common"))
    .decorate("h", H)
    .use(apiRouter)
    .all("*", async (ctx: any) => ctx.error(404, config.webError));
};
