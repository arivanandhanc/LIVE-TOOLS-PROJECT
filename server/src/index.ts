import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { startRetentionSweeper } from "./services/files";

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(
    { port: env.port, env: env.nodeEnv, storage: env.storageDriver },
    `ConvertFlow API listening on http://localhost:${env.port}`
  );
});

const sweeper = startRetentionSweeper();

function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down…");
  clearInterval(sweeper);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
