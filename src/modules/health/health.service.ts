import { HealthStatus } from "./health.types";

export class HealthService {
  getStatus(): HealthStatus {
    return {
      service: "MIS API",
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime())
    };
  }
}
