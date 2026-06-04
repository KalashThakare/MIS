import { IncomingWebhook } from "@slack/webhook";
import { env } from "../../config/env";
import { ActionItem } from "../../modules/action-items/action-items.types";
import { logger } from "../logger/pino";
import { asigneeDetails } from "../../modules/reminders/reminder.types";

const webhook = new IncomingWebhook(env.slack.webhook_url);

export class SlackService {

    async sendOverdueMessage(item: ActionItem, assigneeDetails: asigneeDetails): Promise<void> {
        if (!item.dueDate) {
            logger.warn({ actionItemId: item.id }, "Skipping overdue reminder for action item without due date");
            return;
        }

        const daysOverdue = Math.floor(
            (Date.now() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        const overdueText = daysOverdue === 0 ? "Due today" : `${daysOverdue} day(s) overdue`;

        await webhook.send({
            text: "Overdue Action Item Reminder",
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `Action Item Overdue`,
                    },
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: [
                            `Reminder:* ${item.title}*`,
                            ``,
                            `*Assigned To:* ${assigneeDetails.userName}`,
                            `*Email:* ${assigneeDetails.email}`,
                            `*Due Date:* ${new Date(item.dueDate).toDateString()}`,
                            `*Overdue By:* ${overdueText}`,
                            `*Status:* \`${item.status}\``,
                            ``,
                            item.description ? `*Description:* ${item.description}` : null,
                        ]
                            .filter((line): line is string => line !== null)
                            .join("\n"),
                    },
                },
                { type: "divider" },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `⚡ Automated reminder from *MIS* · ${new Date().toDateString()}`,
                        },
                    ],
                },
            ],
        });

        logger.info({ actionItemId: item.id }, "Slack reminder sent");
    }
}
