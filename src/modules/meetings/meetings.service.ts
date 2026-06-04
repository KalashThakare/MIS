import { MeetingRepository } from "./meetings.repository";
import { CreateMeetingInput, Meeting, MeetingResponse, PaginatedMeetingsResponse } from "./types/meetings.type";
import { AppError } from "../../shared/errors/AppError";
import { GroqService } from "../../shared/groq/groq.service";
import { MeetingAnalysisResponse } from "./types/meeting-analysis.types";

export class MeetingService {

    constructor(
        private readonly meetingRepository: MeetingRepository,
        private readonly groqService: GroqService
    ) { };

    async createMeetingService(input: CreateMeetingInput, createdBy: string): Promise<Meeting> {
        const title = input.title?.trim();
        const participants = input.participants?.map((participant) => participant.trim().toLowerCase());
        const meetingDate = new Date(input.meetingDate);

        if (!title) {
            throw new AppError("Meeting title is required.", 400);
        }

        const exists = await this.meetingRepository.findMeetingByTitle(title);

        if (exists) {
            throw new AppError("Meeting already exists", 409);
        }

        if (!Array.isArray(participants) || participants.length === 0 || participants.some((participant) => !participant)) {
            throw new AppError("At least one participant is required.", 400);
        }

        if (Number.isNaN(meetingDate.getTime())) {
            throw new AppError("Meeting date must be valid.", 400);
        }

        if (!Array.isArray(input.transcript)) {
            throw new AppError("Meeting transcript is required.", 400);
        }

        return this.meetingRepository.create({
            title,
            participants,
            meetingDate,
            transcript: input.transcript,
            createdBy
        });
    }

    async getMeetingById(id: string): Promise<MeetingResponse> {
        if (!id) {
            throw new AppError("Meeting ID is required.", 400);
        }

        const meeting = await this.meetingRepository.getMeetingById(id);

        if (!meeting) {
            throw new AppError("Meeting not found.", 404);
        }

        return {
            id: meeting.id,
            title: meeting.title,
            meetingDate: meeting.meetingDate,
            participants: meeting.participants.map((p) => p.email),
            transcript: meeting.transcript,
        };
    }

    async listMeetings(query: { page?: unknown; limit?: unknown }): Promise<PaginatedMeetingsResponse> {
        const page = this.parsePositiveInteger(query.page, 1);
        const limit = this.parsePositiveInteger(query.limit, 10);

        const { rows, count } = await this.meetingRepository.listMeetings({ page, limit });

        return {
            items: rows.map((meeting) => ({
                id: meeting.id,
                title: meeting.title,
                meetingDate: meeting.meetingDate,
                participants: meeting.participants.map((participant) => participant.email),
                transcript: meeting.transcript,
            })),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    private parsePositiveInteger(value: unknown, fallback: number): number {
        const parsed = Number(value ?? fallback);

        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new AppError("Pagination values must be positive integers.", 400);
        }

        return parsed;
    }

    async analyseMeeting(meetingId: string): Promise<MeetingAnalysisResponse> {
        const meeting = await this.meetingRepository.getMeetingById(meetingId);

        if (!meeting) {
            throw new AppError("Meeting not found.", 404);
        }

        if (!Array.isArray(meeting.transcript) || meeting.transcript.length === 0) {
            throw new AppError("Meeting has no transcript to analyse.", 400);
        }

        const analysis = await this.groqService.analyzeMeeting(meeting.transcript);

        return this.meetingRepository.createMeetingAnalysis(meetingId, meeting.createdBy, analysis);
    }
}
