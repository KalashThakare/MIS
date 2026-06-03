import { createServer } from "node:http";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { logger } from "./src/shared/logger/pino";
import sequelize, { connectDB } from "./src/config/db";
import { initModels, syncModels } from "./src/shared/database";

const app = createApp();
const server = createServer(app);

async function startServer() {
  try {
    await connectDB();
    initModels();
    await syncModels();

    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });

    registerShutdownHandlers();

  } catch (err) {
    logger.fatal({ err }, "Failed to start server");
    process.exit(1);
  }
}

function registerShutdownHandlers() {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);

    server.close(async () => {
      logger.info("HTTP server closed");
      await sequelize.close();
      logger.info("DB connection closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    logger.fatal({ reason }, "Unhandled promise rejection");
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "Uncaught exception");
    process.exit(1);
  });
}

startServer();