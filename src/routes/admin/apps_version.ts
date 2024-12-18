import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_version" })
  .get("/:id", () => "取对应版本")
  .put("/:id", () => "修改对应版本")
  .delete("/:id", () => "删除对应版本")
  .post("/apps", () => "添加新版本")
  .get("/apps/:app_id", () => "获取所有版本");
