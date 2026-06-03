import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { healthRoutes } from "./modules/health";
import { errorHandler } from "./shared/middleware/errorHandler";
import { notFoundHandler } from "./shared/middleware/notFoundHandler";
import { requestLogger } from "./shared/middleware/requestLogger";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use(env.apiPrefix, healthRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
