import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { recaptchaGuard } from "../middleware/recaptcha";

/**
 * The guard sits in front of the ENTIRE /api surface, so a mistake here breaks
 * every write on the site. These cover the two ways that can happen: letting a
 * protected write through unverified, and blocking a request that must never
 * need a token (silent refresh on page load, telemetry beacons).
 */

function mockReq(method: string, originalUrl: string): Request {
  return { method, originalUrl, path: originalUrl.split("?")[0], headers: {}, body: {} } as Request;
}

function mockRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & { statusCode: number; body: unknown };
}

/** Run the guard and report whether it called next() or short-circuited. */
async function run(method: string, url: string) {
  const res = mockRes();
  let passed = false;
  const next: NextFunction = () => {
    passed = true;
  };
  await recaptchaGuard(mockReq(method, url), res, next);
  return { passed, status: res.statusCode, body: res.body };
}

describe("recaptchaGuard", () => {
  const original = { ...env.recaptcha };

  beforeEach(() => {
    // Pretend reCAPTCHA is fully configured in enterprise mode.
    Object.assign(env.recaptcha, {
      mode: "enterprise",
      enabled: true,
      configured: true,
      projectId: "test-project",
      apiKey: "test-api-key",
      siteKey: "test-site-key",
    });
  });

  afterEach(() => {
    Object.assign(env.recaptcha, original);
    vi.restoreAllMocks();
  });

  it("lets safe methods through without a token", async () => {
    for (const method of ["GET", "HEAD", "OPTIONS"]) {
      expect((await run(method, "/api/tools")).passed).toBe(true);
    }
  });

  it("rejects a state-changing request with no token", async () => {
    const { passed, status, body } = await run("POST", "/api/tools/merge-pdf");
    expect(passed).toBe(false);
    expect(status).toBe(400);
    expect(body).toEqual({ error: "Missing reCAPTCHA token." });
  });

  it("exempts the no-gesture paths, including nested ones and query strings", async () => {
    const exempt = [
      "/api/auth/refresh",
      "/api/auth/logout",
      "/api/usage",
      "/api/auth/oauth/google",
      "/api/usage?tool=merge-pdf",
    ];
    for (const url of exempt) {
      expect((await run("POST", url)).passed).toBe(true);
    }
  });

  it("does not exempt a path that merely starts with an exempt prefix", async () => {
    // "/api/usagestats" must NOT inherit "/api/usage"'s exemption.
    expect((await run("POST", "/api/usagestats")).passed).toBe(false);
  });

  it("no-ops entirely when reCAPTCHA is not configured (local dev)", async () => {
    Object.assign(env.recaptcha, { configured: false });
    expect((await run("POST", "/api/tools/merge-pdf")).passed).toBe(true);
  });

  it("accepts a token that assesses as valid and above the score threshold", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          tokenProperties: { valid: true, action: "api/tools/merge_pdf" },
          riskAnalysis: { score: 0.9 },
        }),
      }))
    );

    const req = mockReq("POST", "/api/tools/merge-pdf");
    req.headers["x-recaptcha-token"] = "token-abc";
    const res = mockRes();
    let passed = false;
    await recaptchaGuard(req, res, () => {
      passed = true;
    });
    expect(passed).toBe(true);
  });

  it("blocks a token whose score is below the minimum", async () => {
    Object.assign(env.recaptcha, { minScore: 0.5 });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          tokenProperties: { valid: true, action: "api/tools/merge_pdf" },
          riskAnalysis: { score: 0.1 },
        }),
      }))
    );

    const req = mockReq("POST", "/api/tools/merge-pdf");
    req.headers["x-recaptcha-token"] = "token-abc";
    const res = mockRes();
    let passed = false;
    await recaptchaGuard(req, res, () => {
      passed = true;
    });
    expect(passed).toBe(false);
    expect(res.statusCode).toBe(403);
  });

  it("blocks a token Google reports as invalid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          tokenProperties: { valid: false, invalidReason: "EXPIRED" },
        }),
      }))
    );

    const req = mockReq("POST", "/api/auth/login");
    req.headers["x-recaptcha-token"] = "stale-token";
    const res = mockRes();
    let passed = false;
    await recaptchaGuard(req, res, () => {
      passed = true;
    });
    expect(passed).toBe(false);
    expect(res.statusCode).toBe(403);
  });
});
