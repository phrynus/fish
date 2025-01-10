import { Elysia, Context } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ip } from "elysia-ip";
import { cors } from "@elysiajs/cors";
import { Logestic } from "logestic";

import apiRouter from "./api";
import adminRouter from "./admin";
import routerH from "@/utils/routerH";

function isJsonString(str: string) {
  try {
    const obj = JSON.parse(str); // 尝试解析
    return typeof obj === "object" && obj !== null; // 检查解析结果是否为对象
  } catch (e) {
    return false; // 如果解析失败，则不是合法的 JSON 字符串
  }
}

const app = new Elysia();
export default () => {
  return app
    .use(Logestic.preset("common"))
    .use(cors())
    .use(swagger())
    .use(ip())
    .onError(async ({ code, error }) => {
      try {
        if (error.message) {
          const isj = isJsonString(error.message);
          return routerH.run({
            code: 422,
            msg: isj ? JSON.parse(error.message).summary : error.message
          });
        }
      } catch (e) {
        return routerH.run(400);
      }
    })
    .use(adminRouter)
    .use(apiRouter)
    .all("*", async (ctx) => {
      return ctx.error(
        404,
        `
      :::::::::       :::    :::       :::::::::    :::   :::       ::::    :::      :::    :::       :::::::: 
     :+:    :+:      :+:    :+:       :+:    :+:   :+:   :+:       :+:+:   :+:      :+:    :+:      :+:    :+: 
    +:+    +:+      +:+    +:+       +:+    +:+    +:+ +:+        :+:+:+  +:+      +:+    +:+      +:+         
   +#++:++#+       +#:+::+:#+       +#:+::+:#+     +:#:+         +#+ +:+ +#+      +#+    +:+      ++#+::+#++   
  +#+             +#+    +#+       +#+    +#+      +#+          +#+  +#+#+#      +#+    +#+             +#+    
 #+#             #+#    #+#       #+#    #+#      #+#          #+#   #+#+#      #+#    #+#      #+#    #+#     
###             ###    ###       ###    ###      ###          ###    ####       ########        ########       
Copyright(C) 2025 github.com/phrynus  All Rights Reserved.`
      );
    });
};
