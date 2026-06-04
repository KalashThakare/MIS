import { ReminderRepository } from "./reminder.repository";
import { logger } from "../../shared/logger/pino";
import { ActionItem } from "../action-items/action-items.types";
import { SlackService } from "../../shared/notifications/slack.service";

export class ReminderService {

    constructor(private readonly reminderRepository: ReminderRepository) { }

    private readonly slackService = new SlackService();

    async processOverdueReminders(): Promise<void> {
        logger.info("Running overdue reminders job");

        const overdueItems = await this.reminderRepository.findOverdueActionItems();

        if (overdueItems.length === 0) {
            logger.info("No overdue action items found");
            return;
        }

        logger.info(`Found ${overdueItems.length} overdue action items`);

        await Promise.allSettled(
            overdueItems.map((item) => this.sendReminder(item.get({ plain: true })))
        );
    }

    private async sendReminder(item: ActionItem): Promise<void> {

        try {

            const alreadyReminded = await this.reminderRepository.wasRecentlyReminded(item.id);

            if (alreadyReminded) {
                logger.info({ actionItemId: item.id }, "Skipping reminded within 24 hours");
                return;
            }

            const asigneeDetails = await this.reminderRepository.getAsigneeDetails(item.assigneeId);

            await this.slackService.sendOverdueMessage(item, asigneeDetails)

            await this.reminderRepository.logReminder({
                actionItemId: item.id,
                sentTo: item.assigneeId,
                status: "SENT",
                error: null,
            });

            logger.info({ actionItemId: item.id }, "Reminder sent");

        } catch (error) {

            await this.reminderRepository.logReminder({
                actionItemId: item.id,
                sentTo: item.assigneeId,
                status: "FAILED",
                error: error instanceof Error ? error.message : "Unknown error",
            });

            logger.error({ actionItemId: item.id, error }, "Reminder failed");

        }

    }


}