import { t } from "elysia";

export const createUserSchema = t.Object({
  name: t.String({ minLength: 2, maxLength: 255 }),
  email: t.String({ format: "email" }),
});

export const userParamsSchema = t.Object({
  id: t.Numeric(),
});
