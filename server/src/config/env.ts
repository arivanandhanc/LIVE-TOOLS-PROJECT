import dotenv from "dotenv";

dotenv.config();

function bool(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function int(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  nodeEnv,
  isProd: nodeEnv === "production",
  port: int(process.env.PORT, 4000),

  // Public origin of THIS API (used to build absolute download URLs).
  // Falls back to Render's auto-injected RENDER_EXTERNAL_URL so it "just works".
  apiBaseUrl:
    process.env.API_BASE_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    `http://localhost:${int(process.env.PORT, 4000)}`,

  // Comma-separated allowlist of front-end origins for CORS.
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Persistence & infra — all OPTIONAL. Absence => graceful degradation.
  databaseUrl: process.env.DATABASE_URL || null,
  redisUrl: process.env.REDIS_URL || null,

  // Storage: "local" (disk) or "s3" (S3/R2-compatible).
  storageDriver: (process.env.STORAGE_DRIVER ?? "local") as "local" | "s3",
  localStorageDir: process.env.LOCAL_STORAGE_DIR ?? "./storage",
  s3: {
    endpoint: process.env.S3_ENDPOINT || null,
    region: process.env.S3_REGION ?? "auto",
    bucket: process.env.S3_BUCKET || null,
    accessKeyId: process.env.S3_ACCESS_KEY_ID || null,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || null,
    publicUrl: process.env.S3_PUBLIC_URL || null,
  },

  // Auth
  jwtSecret: process.env.JWT_SECRET ?? "dev-insecure-change-me",
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
  jwtRefreshTtlDays: int(process.env.JWT_REFRESH_TTL_DAYS, 30),

  // Google reCAPTCHA (secret stays server-side only)
  recaptcha: {
    secret: process.env.RECAPTCHA_SECRET_KEY || null,
    minScore: Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5),
    enabled: bool(process.env.RECAPTCHA_ENABLED, Boolean(process.env.RECAPTCHA_SECRET_KEY)),
  },

  // File handling
  maxUploadBytes: int(process.env.MAX_UPLOAD_BYTES, 50 * 1024 * 1024), // 50 MB
  maxFilesPerRequest: int(process.env.MAX_FILES_PER_REQUEST, 20),
  // Auto-deletion retention windows
  guestRetentionMs: int(process.env.GUEST_RETENTION_MS, 60 * 60 * 1000), // 1h
  userRetentionMs: int(process.env.USER_RETENTION_MS, 24 * 60 * 60 * 1000), // 24h

  // Rate limiting
  rateLimitWindowMs: int(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: int(process.env.RATE_LIMIT_MAX, 300),
  uploadRateLimitMax: int(process.env.UPLOAD_RATE_LIMIT_MAX, 40),

  logLevel: process.env.LOG_LEVEL ?? (nodeEnv === "production" ? "info" : "debug"),
};

export type Env = typeof env;
