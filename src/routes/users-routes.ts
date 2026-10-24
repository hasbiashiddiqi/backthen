import { Elysia, t } from "elysia";
import { UsersService } from "../services/users-service";

export const usersRoutes = new Elysia({ prefix: "/users" }).post(
  "/",
  async ({ body, set }) => {
    const result = await UsersService.registerUser(body);

    if (!result.success) {
      set.status = 400;
      return {
        error: result.error,
      };
    }

    set.status = 200;
    return {
      data: "OK",
    };
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ minLength: 3 }),
      password: t.String({ minLength: 1 }),
    }),
    detail: {
      tags: ["Users"],
      summary: "Register new user",
    },
  }
);
