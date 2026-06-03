export interface HealthStatus {
  service: string;
  status: "ok";
  timestamp: string;
  uptimeSeconds: number;
}
