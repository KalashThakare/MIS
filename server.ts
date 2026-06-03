import { createServer } from "node:http";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { PinoLogger } from "./src/shared/logger/PinoLogger";

const logger = new PinoLogger();
const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  logger.info(`HTTP server listening on port ${env.port}`);
});

function shutdown(signal: NodeJS.Signals): void {
  logger.info(`${signal} received. Closing HTTP server.`);

  server.close((error) => {
    if (error) {
      logger.error("HTTP server closed with an error.", error);
      process.exit(1);
    }

    logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
