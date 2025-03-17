import { Elysia, t } from "elysia";

export const H = (Object: any) => {
  let code = 200;
  let message = "…";
  let data = null;
  return { code, message, data };
};

export const resModel = {
  200: t.Object({
    code: t.Number({
      default: 200
    }),
    message: t.String(),
    data: t.Any()
  }),
  500: t.Object({
    code: t.Number({
      default: 500
    }),
    message: t.String()
  })
};
