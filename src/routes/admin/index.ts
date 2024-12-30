import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

import { secret, sqlite } from "@/config";
import routerH from "@/utils/routerH";

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
        let qr = "";
        if (secret.is_login) {
          let { key } = ctx.query;
          const verified = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: "base32",
            token: key,
            window: 1
          });
          if (!verified) throw routerH.run(400);
        } else {
          sqlite.query("UPDATE user_admin SET is_login = 1 WHERE id = 1").run();
          secret.is_login = 1;
          qr = await QRCode.toDataURL(secret.otpauth_url, {});
        }
        const access = await ctx.acc.sign({});
        const refresh = await ctx.ref.sign({});
        return routerH.run({
          access,
          refresh,
          qr
        });
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
          code: t.Number(),
          msg: t.String(),
          data: t.Object({
            access: t.String(),
            refresh: t.String(),
            qr: t.String()
          })
        }),
        500: routerH.error,
        400: routerH.error
      }
    }
  )
  .post(
    "/ref",
    async (ctx) => {
      try {
        let { token } = ctx.query;
        if (!(await ctx.ref.verify(token))) {
          return routerH.run(400);
        }
        const access = await ctx.acc.sign({
          id: 1,
          username: "admin"
        });
        return routerH.run({ access, refresh: token });
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
          code: t.Number(),
          msg: t.String(),
          data: t.Object({
            access: t.String(),
            refresh: t.String()
          })
        }),
        500: routerH.error,
        400: routerH.error
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
  .use(apps)
  .use(apps_role)
  .use(apps_cards)
  .use(apps_orders)
  .use(apps_version)
  .use(apps_products)
  .use(apps_card_type)
  .use(apps_payment_methods)
  .use(users)
  .use(users_apps_config);
