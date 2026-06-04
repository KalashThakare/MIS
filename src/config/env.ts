import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "development" | "test" | "production";

interface Env {
  apiPrefix: string;
  jwtExpiresIn: string;
  jwtSecret: string;
  database: Database;
  groq_api_key: string;
  slack: Slack;
  nodeEnv: NodeEnv;
  port: number;
}

interface Database {
  db_uri: string
}

interface Slack {
  webhook_url: string
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

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export const env: Env = {
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: parsePort(process.env.PORT),
  apiPrefix: process.env.API_PREFIX ?? "/api/v1",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  database: {
    db_uri: getRequiredEnv("DATABASE_URI"),
  },
  slack: {
    webhook_url: getRequiredEnv("SLACK_WEBHOOK_URL")
  },
  groq_api_key: getRequiredEnv("GROQ_API_KEY")
};
