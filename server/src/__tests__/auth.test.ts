import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/password";
import { signJwt, verifyJwt } from "../lib/jwt";

describe("password hashing", () => {
  it("verifies a correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });
});

describe("jwt", () => {
  it("signs and verifies a token", () => {
    const token = signJwt({ sub: "user-123", role: "USER" });
    const payload = verifyJwt(token);
    expect(payload?.sub).toBe("user-123");
    expect(payload?.role).toBe("USER");
  });

  it("rejects a tampered token", () => {
    const token = signJwt({ sub: "user-123" });
    expect(verifyJwt(token + "x")).toBeNull();
  });
});
