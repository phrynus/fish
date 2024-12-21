import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import speakeasy from "speakeasy";

import { secret, sqlite } from "@/config";

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

export default new Elysia({ prefix: `/admin_${secret.hex.slice(0, 6)}` })
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
    try {
      const access_token = await ctx.acc.sign({});
      const refresh_token = await ctx.ref.sign({});
      if (secret.is_login) {
        let { key } = ctx.query;
        if (!key) throw new Error("秘钥为空");
        const verified = speakeasy.totp.verify({
          secret: secret.base32,
          encoding: "base32",
          token: key,
          window: 1
        });
        if (!verified) throw new Error("验证失败");
      } else {
        sqlite.query("UPDATE user_admin SET is_login = 1 WHERE id = 1").run();
        secret.is_login = 1;
        return { access_token, refresh_token, otpauth_url: secret.otpauth_url };
      }
      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  })
  .post("/ref", async (ctx) => {
    try {
      let { refresh_token } = ctx.query;
      if (!(await ctx.ref.verify(refresh_token))) {
        throw new Error("Invalid refresh token");
      }
      const access_token = await ctx.acc.sign({
        id: 1,
        username: "admin"
      });
      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  })
  .onBeforeHandle(async ({ headers, acc }) => {
    try {
      const { access_token } = headers;
      if (!access_token) {
        throw new Error("Missing access token");
      }
      if (!(await acc.verify(access_token))) {
        throw new Error("Invalid access token");
      }
    } catch (error) {
      throw error;
    }
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
