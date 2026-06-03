import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { MeetingRepository } from "./meetings.repository";
import { MeetingService } from "./meetings.service";
import { MeetingController } from "./meetings.controller";
import { validateCreateMeeting, validateListMeetings, validateMeetingIdParams } from "./meetings.validation";

const meetingRepository = new MeetingRepository();
const meetingService = new MeetingService(meetingRepository);
const meetingController = new MeetingController(meetingService);

export const meetingRoutes = Router();

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
