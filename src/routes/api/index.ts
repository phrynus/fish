import { Elysia } from "elysia";
export default new Elysia({ prefix: "/api" }).get("/", () => "© Github Phrynus");
