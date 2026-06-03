import { Op } from "sequelize";
import { ActionItemModel } from "../action-items/action-item.model";
import { ReminderLogModel } from "./reminder.model";
import { ReminderLog } from "./reminder.types";

export class ReminderRepository {

    async findOverdueActionItems() {
        return ActionItemModel.findAll({
            where: {
                dueDate: { [Op.lt]: new Date() },
                status: { [Op.ne]: "COMPLETED" },
                deletedAt: null,
            },
        });
    }

    async wasRecentlyReminded(actionItemId: string): Promise<boolean> {
        const recent = await ReminderLogModel.findOne({
            where: {
                actionItemId,
                status: "SENT",
                sentAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
        });

        return recent !== null;
    }

    async logReminder(data: Omit<ReminderLog, "id" | "sentAt">): Promise<void> {
        await ReminderLogModel.create(data);
    }
}