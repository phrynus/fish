import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_cards" })
  .get("/:id", async () => "取卡密")
  .put("/:id", async () => "修改卡密")
  .delete("/:id", async () => "删除卡密")
  .post("/apps/:app_id", async () => "添加卡密")
  .get("/apps/:app_id", async () => "获取卡密列表");
