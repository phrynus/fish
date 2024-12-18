import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_card_type" })
  .get("/:id", async () => "取卡密模版")
  .put("/:id", async () => "修改卡密模版")
  .delete("/:id", async () => "删除卡密模版")
  .post("/apps/:app_id", async () => "添加卡密模版")
  .get("/apps/:app_id", async () => "获取卡密模版列表");
