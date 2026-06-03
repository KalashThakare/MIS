import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { MeetingRepository } from "./meetings.repository";
import { MeetingService } from "./meetings.service";
import { MeetingController } from "./meetings.controller";

const meetingRepository = new MeetingRepository();
const meetingService = new MeetingService(meetingRepository);
const meetingController = new MeetingController(meetingService);

export const meetingRoutes = Router();

meetingRoutes.get("/meetings", authenticate, meetingController.list.bind(meetingController));
meetingRoutes.post("/meeting", authenticate, meetingController.create.bind(meetingController));
meetingRoutes.get("/meeting/:id", authenticate, meetingController.getMeeting.bind(meetingController));
