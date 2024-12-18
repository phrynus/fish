import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps" })
  .post("/", () => "创建APP")
  .get("/", () => "获取APP列表")
  .get("/:id", () => "获取APP详情")
  .put("/:id", () => "更新APP")
  .delete("/:id", () => "删除APP");
