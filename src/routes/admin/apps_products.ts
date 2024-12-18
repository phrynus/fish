import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_products" })
  .get("/:id", async () => "取商品信息")
  .put("/:id", async () => "修改商品信息")
  .delete("/:id", async () => "删除商品信息")
  .post("/apps", async () => "添加商品信息")
  .get("/apps/:app_id", async () => "获取商品列表");
