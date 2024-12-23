import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

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
// 400: 请求错误
// 401: 未登录
// 403: 无权限
// 404: 路由不存在
// 500: 服务器错误

export default new Elysia({ prefix: `/${secret.hex.slice(0, 6)}` })
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
  .post(
    "/login",
    async (ctx) => {
      try {
        const access = await ctx.acc.sign({});
        const refresh = await ctx.ref.sign({});
        let qr = "";
        if (secret.is_login) {
          let { key } = ctx.query;
          const verified = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: "base32",
            token: key,
            window: 1
          });
          if (!verified) return ctx.error(400, "验证失败");
        } else {
          sqlite.query("UPDATE user_admin SET is_login = 1 WHERE id = 1").run();
          secret.is_login = 1;
          qr = await QRCode.toDataURL(secret.otpauth_url, {});
        }
        return { access, refresh, qr };
      } catch (error) {
        throw error;
      }
    },
    {
      query: t.Object({
        key: t.String()
      }),
      response: {
        200: t.Object({
          access: t.String(),
          refresh: t.String(),
          qr: t.String()
        }),
        400: t.String()
      }
    }
  )
  .post(
    "/ref",
    async (ctx) => {
      try {
        let { token } = ctx.query;
        if (!(await ctx.ref.verify(token))) {
          return ctx.error(400, "TOKEN验证失败");
        }
        const access_token = await ctx.acc.sign({
          id: 1,
          username: "admin"
        });
        return { access_token, refresh_token: token };
      } catch (error) {
        throw error;
      }
    },
    {
      query: t.Object({
        token: t.String()
      }),
      response: {
        200: t.Object({
          access_token: t.String(),
          refresh_token: t.String()
        }),
        400: t.String()
      }
    }
  )
  .onBeforeHandle(async (ctx) => {
    try {
      const { Authorization } = ctx.headers;
      const verify = await ctx.acc.verify(Authorization);
      if (!verify) return ctx.error(401, "TOKEN验证失败");
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
