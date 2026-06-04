import { Request, Response, NextFunction } from "express";
import { MeetingService } from "./meetings.service";

export class MeetingController {

    constructor(private readonly meetingService: MeetingService) { };

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response = await this.meetingService.createMeetingService(req.body, req.user!.id);

            res.success(response, 201);

        } catch (error) {
            next(error);
        }
    }

    async getMeeting(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const meeting = await this.meetingService.getMeetingById(request.params.id);

            response.success(meeting, 200);
        } catch (error) {
            next(error);
        }
    }

    async list(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const meetings = await this.meetingService.listMeetings(request.query);

            response.success(meetings);
        } catch (error) {
            next(error);
        }
    }

    async analyze(request: Request, response: Response, next: NextFunction): Promise<void>{
        try {
            const meetingId = request.params.id;

            const analysis = await this.meetingService.analyseMeeting(meetingId);

            response.success(analysis, 200);   
        } catch (error) {
            next(error);
        }
    }
}
