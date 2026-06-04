import sequelize from "../../config/db";
import { MeetingParticipantModel } from "./models/meeting-participant.model";
import { MeetingModel } from "./models/meetings.model";
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
}
