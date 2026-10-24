import { Elysia } from "elysia";

export const errorHandler = new Elysia({ name: "error-handler" })
  .as("global")
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation failed",
        details: error.message,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        error: "Route or resource not found",
      };
    }

    console.error("[ServerError]:", error);
    set.status = 500;
    return {
      success: false,
      error: "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    };
  });
