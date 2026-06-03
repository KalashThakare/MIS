import { Request, Response } from "express";
import { HealthService } from "./health.service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  show(_request: Request, response: Response): void {
    response.success(this.healthService.getStatus());
  }
}
