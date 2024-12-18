import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_orders" })
  .get("/:id", async () => "取订单")
  .delete("/:id", async () => "刪除订单")
  .get("/apps/:app_id", async () => "新增订单");
