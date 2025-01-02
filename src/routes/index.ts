import { Elysia, Context } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { ip } from "elysia-ip";
import { cors } from "@elysiajs/cors";
import { Logestic } from "logestic";

import apiRouter from "./api";
import adminRouter from "./admin";
import routerH from "@/utils/routerH";

const app = new Elysia();
export default () => {
  return app
    .use(Logestic.preset("common"))
    .use(cors())
    .use(swagger())
    .use(ip())
    .onError(({ code, error }) => {
      if (error.message) {
        const errorJson: any = JSON.parse(error.message);
        return routerH.run({
          code: 422,
          msg: errorJson.summary
        });
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
