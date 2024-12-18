import { Elysia } from "elysia";
export default new Elysia({ prefix: "/users_apps_config" })
  .get("/:id", () => "取对应配置")
  .put("/:id", () => "更新对应配置")
  .delete("/:id", () => "删除对应配置")
  .post("/apps", () => "创建应用对应用户")
  .get("/apps/:app_id", () => "取应用所有用户")
  .get("/users/:app_id", () => "取用户所有应用");
