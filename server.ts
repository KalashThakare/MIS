import { createServer } from "node:http";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { logger } from "./src/shared/logger/pino";

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  logger.info({ port: env.port }, "HTTP server listening.");
});

function shutdown(signal: NodeJS.Signals): void {
  logger.info({ signal }, "Shutdown signal received. Closing HTTP server.");

  server.close((error) => {
    if (error) {
      logger.error({ error }, "HTTP server closed with an error.");
      process.exit(1);
    }

    logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
