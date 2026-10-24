import { Elysia } from "elysia";
import { UserService } from "./service";
import { createUserSchema, userParamsSchema } from "./model";

export const userModule = new Elysia({ prefix: "/users" })
  .get(
    "/",
    async () => {
      const data = await UserService.getAll();
      return {
        success: true,
        data,
        message: "Users retrieved successfully",
      };
    },
    {
      detail: {
        tags: ["Users"],
        summary: "Get all users",
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const user = await UserService.getById(params.id);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          error: "User not found",
        };
      }
      return {
        success: true,
        data: user,
      };
    },
    {
      params: userParamsSchema,
      detail: {
        tags: ["Users"],
        summary: "Get user by ID",
      },
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      const created = await UserService.create(body);
      set.status = 201;
      return {
        success: true,
        data: created,
        message: "User created successfully",
      };
    },
    {
      body: createUserSchema,
      detail: {
        tags: ["Users"],
        summary: "Create a new user",
      },
    }
  );
