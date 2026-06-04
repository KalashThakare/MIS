import { Router, Request, Response } from "express";

export const evaluationRoutes = Router();

evaluationRoutes.get("/evaluation", (_req: Request, res: Response) => {
  res.status(200).json({
    candidateName: "Kalash G. Thakare",
    email: "kalashthakare898@gmail.com",
    repositoryUrl: "https://github.com/KalashThakare/MIS",
    deployedUrl: "https://example.com",
    externalIntegration: "Slack Webhook",
    features: [
      "Authentication",
      "AI Analysis",
      "Reminder Scheduler",
      "Rate Limiting",
      "Input validation",
      "Unit Tests"
    ]
  });
});