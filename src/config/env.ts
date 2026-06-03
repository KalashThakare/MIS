import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "test" | "production";

interface Env {
  apiPrefix: string;
  nodeEnv: NodeEnv;
  port: number;
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? 8000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer.");
  }

  return port;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  const nodeEnv = value ?? "development";

  if (nodeEnv !== "development" && nodeEnv !== "test" && nodeEnv !== "production") {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  return nodeEnv;
}

export const env: Env = {
  apiPrefix: process.env.API_PREFIX ?? "/api/v1",
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: parsePort(process.env.PORT)
};
