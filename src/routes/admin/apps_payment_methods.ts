import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_payment_methods" })
  .get("/:id", async () => "取支付方式")
  .put("/:id", async () => "修改支付方式")
  .delete("/:id", async () => "删除支付方式")
  .post("/apps/:app_id", async () => "新增支付方式")
  .get("/apps/:app_id", async () => "获取支付方式列表");
