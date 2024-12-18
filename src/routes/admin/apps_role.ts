import { Elysia } from "elysia";
export default new Elysia({ prefix: "/apps_role" })
  .get("/:id", () => "获取角色详情")
  .put("/:id", () => "更新角色")
  .delete("/:id", () => "删除角色")
  .post("/apps", () => "创建角色")
  .get("/apps/:app_id", () => "获取角色列表")
  .get("/users/:user_id", () => "获取拥有该角色的用户列表");
