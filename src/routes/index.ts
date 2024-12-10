import { Elysia } from "elysia";
const app = new Elysia();
export default () => {
  app.get("/", async () => {
    return "© Github Phrynus";
  });

  app.get("/app", async () => {
    return "Hello API";
  });

  app.get("/api/:id", async ({ params }) => {
    return `Hello ${params.id}`;
  });

  return app;
};
