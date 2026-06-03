import { describe, expect, it } from "vitest";
import { HealthService } from "./health.service";

describe("HealthService", () => {
  it("returns an ok health status", () => {
    const status = new HealthService().getStatus();

    expect(status.status).toBe("ok");
  });
});
