import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { env } from "./config/env";
import { checkDatabaseConnection } from "./db";
import { errorHandler } from "./middlewares/error";
import { userModule } from "./modules/users";

export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Backthen API Documentation",
          version: "1.0.0",
          description: "REST API built with Bun, ElysiaJS, Drizzle ORM, and MySQL",
        },
        tags: [
          { name: "General", description: "Health check & general endpoints" },
          { name: "Users", description: "User management endpoints" },
        ],
      },
      path: "/swagger",
    })
  )
  .use(errorHandler)
  .get(
    "/health",
    async () => {
      const dbConnected = await checkDatabaseConnection();
      return {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          database: dbConnected ? "connected" : "disconnected",
        },
      };
    },
    {
      detail: {
        tags: ["General"],
        summary: "Service health check",
      },
    }
  )
  .group("/api/v1", (api) => api.use(userModule))
  .listen(env.PORT, () => {
    console.log(`🦊 Server is running at http://localhost:${env.PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${env.PORT}/swagger`);
  });

export type App = typeof app;
