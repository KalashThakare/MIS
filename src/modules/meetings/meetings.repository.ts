import sequelize from "../../config/db";
import { ActionItemModel } from "../action-items/action-item.model";
import { UserModel } from "../user/user.model";
import { MeetingAnalysisModel } from "./models/meeting-analysis.model";
import { MeetingParticipantModel } from "./models/meeting-participant.model";
import { MeetingModel } from "./models/meetings.model";
import { MeetingAnalysisResponse } from "./types/meeting-analysis.types";
import { CreateMeetingRecordInput, Meeting, MeetingWithParticipants, PaginationInput } from "./types/meetings.type";

export class MeetingRepository {
    async create(input: CreateMeetingRecordInput): Promise<Meeting> {
        const meeting = await sequelize.transaction(async (transaction) => {
            const createdMeeting = await MeetingModel.create({
                title: input.title.trim(),
                meetingDate: input.meetingDate,
                transcript: input.transcript,
                createdBy: input.createdBy,
            }, { transaction });

            await MeetingParticipantModel.bulkCreate(
                input.participants.map((email) => ({
                    meetingId: createdMeeting.id,
                    userId: null,
                    email
                })),
                { transaction }
            );

            return createdMeeting;
        });

        return meeting.get({ plain: true });
    }

    async findMeetingByTitle(title: string): Promise<boolean> {
        const meeting = await MeetingModel.findOne({
            where: {
                title: title
            }
        })

        return meeting !== null;
    }

    async getMeetingById(id: string): Promise<MeetingWithParticipants | null> {
        const meeting = await MeetingModel.findOne({
            where: { id },
            include: [
                {
                    model: MeetingParticipantModel,
                    as: "participants",
                    attributes: ["email", "userId"],
                }
            ]
        });

        if (!meeting) return null;

        return meeting.get({ plain: true }) as MeetingWithParticipants;
    }

    async listMeetings(input: PaginationInput): Promise<{ rows: MeetingWithParticipants[]; count: number }> {
        const result = await MeetingModel.findAndCountAll({
            limit: input.limit,
            offset: (input.page - 1) * input.limit,
            order: [["meetingDate", "DESC"]],
            distinct: true,
            include: [
                {
                    model: MeetingParticipantModel,
                    as: "participants",
                    attributes: ["email", "userId"],
                }
            ]
        });

        return {
            count: result.count,
            rows: result.rows.map((meeting) => meeting.get({ plain: true }) as MeetingWithParticipants)
        };
    }

    async createMeetingAnalysis(meetingId: string, createdBy: string, analysis: MeetingAnalysisResponse): Promise<MeetingAnalysisResponse> {
        await sequelize.transaction(async (transaction) => {
            await MeetingAnalysisModel.create({
                meetingId,
                summary: analysis.summary,
                decisions: analysis.decisions,
                followUps: analysis.followUps,
                modelUsed: "llama-3.3-70b-versatile",
                promptVersion: "v1",
            }, { transaction });

            if (analysis.actionItems.length === 0) return;

            const participants = await MeetingParticipantModel.findAll({
                where: { meetingId },
                attributes: ["email"],
                transaction,
            });

            const participantEmails = participants.map((participant) => participant.email.toLowerCase());

            const users = await UserModel.findAll({
                attributes: ["id", "email", "name"],
                transaction,
            });

            const usersByEmail = new Map(users.map((user) => [user.email.toLowerCase(), user.id]));
            const usersByName = new Map(users.map((user) => [user.name.trim().toLowerCase(), user.id]));

            await ActionItemModel.bulkCreate(
                analysis.actionItems.map((item) => {
                    const assignee = item.assignee?.trim().toLowerCase();
                    const assigneeId = assignee
                        ? usersByEmail.get(assignee)
                            ?? usersByName.get(assignee)
                            ?? usersByEmail.get(participantEmails.find((email) => email.startsWith(`${assignee}@`)) ?? "")
                            ?? null
                        : null;

                    return {
                        meetingId,
                        title: item.task,
                        description: JSON.stringify({ citations: item.citations }),
                        assigneeId,
                        dueDate: null,
                        status: item.status,
                        createdBy,
                    };
                }),
                { transaction }
            );
        });

        return analysis;
    }
}
