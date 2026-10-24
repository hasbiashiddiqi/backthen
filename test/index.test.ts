import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("Backthen API Tests", () => {
  it("GET /health should return 200 and status ok", async () => {
    const response = await app.handle(new Request("http://localhost:3000/health"));
    expect(response.status).toBe(200);
    const data = (await response.json()) as { status: string; services?: { database: string } };
    expect(data.status).toBe("ok");
    expect(data.services).toBeDefined();
  });

  it("POST /api/v1/users should validate input body and reject invalid payload", async () => {
    const response = await app.handle(
      new Request("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "A" }), // invalid: minLength 2, missing email
      })
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data).toBeDefined();
  });

  it("GET non-existing route should return 404", async () => {
    const response = await app.handle(new Request("http://localhost:3000/not-found-route"));
    expect(response.status).toBe(404);
  });
});
