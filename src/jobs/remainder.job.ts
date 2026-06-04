import cron from "node-cron";
import { ReminderService } from "../modules/reminders/reminder.service";
import { ReminderRepository } from "../modules/reminders/reminder.repository";
import { logger } from "../shared/logger/pino";

const reminderService = new ReminderService(new ReminderRepository);

export function startReminder(): void {

    cron.schedule("*/5 * * * *", async () => { // I have kept scheduler to run every 5 min
        logger.info("Reminder scheduler triggered");

        try {
            await reminderService.processOverdueReminders();
        } catch (err) {
            logger.error({ err }, "Reminder scheduler failed");
        }
    });

    logger.info("Reminder scheduler started, runs every 5 min");

}