import sequelize from "../../config/db";
import { env } from "../../config/env";
import { defineActionItemModel } from "../../modules/action-items/action-item.model";
import { defineMeetingAnalysisModel } from "../../modules/meetings/models/meeting-analysis.model";
import { defineMeetingParticipantModel } from "../../modules/meetings/models/meeting-participant.model";
import { defineMeetingModel } from "../../modules/meetings/models/meetings.model";
import { defineReminderLogModel } from "../../modules/reminders/reminder.model";
import { defineUserModel } from "../../modules/user/user.model";
import { logger } from "../logger/pino";


const modelDefiners = [
    defineUserModel,
    defineMeetingModel,
    defineMeetingParticipantModel,
    defineActionItemModel,
    defineReminderLogModel,
    defineMeetingAnalysisModel
];

export const initModels = () => {
    modelDefiners.forEach((define) => define(sequelize));
};

export const syncModels = async (): Promise<void> => {
    const isDev = env.nodeEnv === "development";

    try {
        await sequelize.sync({ alter: isDev, logging: false });
        logger.info("All models synced.");
    } catch (error) {
        logger.error({error},"Model sync failed:");
        throw error;
    }
};

export { sequelize };
