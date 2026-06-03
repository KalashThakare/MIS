import { Router } from "express";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

const controller = new HealthController(new HealthService());

export const healthRoutes = Router();

healthRoutes.get("/health", controller.show.bind(controller));
