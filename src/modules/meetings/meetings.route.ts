import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { apiRateLimiter } from "../../shared/middleware/rateLimiter";
import { MeetingRepository } from "./meetings.repository";
import { MeetingService } from "./meetings.service";
import { MeetingController } from "./meetings.controller";
import { validateCreateMeeting, validateListMeetings, validateMeetingIdParams } from "./meetings.validation";
import { GroqService } from "../../shared/groq/groq.service";

const meetingRepository = new MeetingRepository();
const groqService = new GroqService();
const meetingService = new MeetingService(meetingRepository, groqService);
const meetingController = new MeetingController(meetingService);

export const meetingRoutes = Router();

meetingRoutes.use(apiRateLimiter);

meetingRoutes.get(
  "/meetings",
  authenticate,
  validateListMeetings,
  meetingController.list.bind(meetingController)
);

meetingRoutes.post(
  "/meeting",
  authenticate,
  validateCreateMeeting,
  meetingController.create.bind(meetingController)
);

meetingRoutes.get(
  "/meeting/:id",
  authenticate,
  validateMeetingIdParams,
  meetingController.getMeeting.bind(meetingController)
);

meetingRoutes.post(
  "/meetings/:id/analyze", 
  authenticate, 
  validateMeetingIdParams, 
  meetingController.analyze.bind(meetingController)
);
