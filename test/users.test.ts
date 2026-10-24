import { describe, expect, it } from "bun:test";
import { app } from "../src/index";
import { UsersService } from "../src/services/users-service";

describe("User Registration API (POST /api/users)", () => {
  const testEmail = `neymar_${Date.now()}@localhost`;

  it("should register a new user and return { data: 'OK' }", async () => {
    const response = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "neymar",
          email: testEmail,
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { data?: string; error?: string };
    expect(body.data).toBe("OK");

    // Verify user in database
    const savedUser = await UsersService.getUserByEmail(testEmail);
    expect(savedUser).not.toBeNull();
    expect(savedUser?.name).toBe("neymar");
    expect(savedUser?.email).toBe(testEmail);
    expect(savedUser?.password).not.toBe("rahasia");
    expect(savedUser?.password.startsWith("$2")).toBe(true);

    // Verify bcrypt hash matches
    const isPasswordValid = await Bun.password.verify("rahasia", savedUser!.password);
    expect(isPasswordValid).toBe(true);
  });

  it("should reject registration with duplicate email and return { error: 'Email sudah terdaftar' }", async () => {
    const response = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "neymar junior",
          email: testEmail,
          password: "different_password",
        }),
      })
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error?: string };
    expect(body.error).toBe("Email sudah terdaftar");
  });

  it("should reject invalid request body with 422 or 400", async () => {
    const response = await app.handle(
      new Request("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "neymar",
          // missing email and password
        }),
      })
    );

    expect([400, 422]).toContain(response.status);
  });
});
