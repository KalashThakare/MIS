import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth";
import { healthRoutes } from "./modules/health";
import { errorHandler } from "./shared/middleware/errorHandler";
import { notFoundHandler } from "./shared/middleware/notFoundHandler";
import { requestLogger } from "./shared/middleware/requestLogger";
import { responseHandler } from "./shared/middleware/responseHandler";
import { meetingRoutes } from "./modules/meetings/meetings.route";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(requestLogger);
  app.use(helmet());
  app.use(cors());
  app.use(responseHandler);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  const prefix = env.apiPrefix
  app.use(prefix, healthRoutes);
  app.use(prefix, authRoutes);
  app.use(prefix, meetingRoutes);


  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
