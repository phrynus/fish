import { Elysia } from "elysia";
import userRouter from "./user";

export default new Elysia({ prefix: "/api" }).use(userRouter);
