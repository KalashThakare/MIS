import { HealthStatus } from "./health.types";

export class HealthService {
  getStatus(): HealthStatus {
    return {
      status: "ok",
    };
  }
}
