import { Elysia } from "elysia";
import users from "./users";
import users_apps_config from "./users_apps_config";
import apps from "./apps";
import apps_role from "./apps_role";
import apps_card_type from "./apps_card_type";
import apps_cards from "./apps_cards";
import apps_orders from "./apps_orders";
import apps_payment_methods from "./apps_payment_methods";
import apps_products from "./apps_products";
import apps_version from "./apps_version";
import { jwt } from "@elysiajs/jwt";

export default new Elysia({ prefix: "/admin_ncnrfr" })
  .use(
    jwt({
      name: "acc",
      secret: "465nAx9xpfgAAJRy06IxCKD0pkggRlOW",
      exp: "4h"
    })
  )
  .use(
    jwt({
      name: "ref",
      secret: "nE60QeEAVp70OOavVv5lDKaMvKNs3s3P",
      exp: "7d"
    })
  ) //log
  .post("/login", async (ctx) => {
    const access_token = await ctx.acc.sign({});
    const refresh_token = await ctx.ref.sign({});
    return { access_token, refresh_token };
  })
  .post("/refresh_zpsumb", async (ctx) => {
    let { refresh_token } = ctx.query;
    if (!(await ctx.ref.verify(refresh_token))) {
      throw new Error("Invalid refresh token");
    }
    const access_token = await ctx.acc.sign({
      id: 1,
      username: "admin"
    });
    return { access_token, refresh_token };
  })
  .onBeforeHandle(async ({ headers, acc }) => {
    const { access_token } = headers;
    if (!access_token) {
      throw new Error("Missing access token");
    }
    if (!(await acc.verify(access_token))) {
      throw new Error("Invalid access token");
    }
    console.log(access_token, await acc.verify(access_token));
  })
  .use(users)
  .use(apps)
  .use(users_apps_config)
  .use(apps_role)
  .use(apps_card_type)
  .use(apps_cards)
  .use(apps_orders)
  .use(apps_payment_methods)
  .use(apps_products)
  .use(apps_version);
