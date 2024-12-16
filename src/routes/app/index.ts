import { Elysia } from "elysia";
export default new Elysia({ prefix: "/adminApi" })
  .get("/", () => "© Github Phrynus")
  .post("/app", ({ query, logger }) => {
    logger.log("1234");
    return query;
  })
  .put("/app", () => "© Github Phrynus 1")
  .delete("/app", () => "© Github Phrynus 2")
  .get("/app", () => "© Github Phrynus 3");
