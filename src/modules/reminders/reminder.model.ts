import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { REMINDER_STATUSES, ReminderLog } from "./reminder.types";
import { ReminderStatus } from "./reminder.types";

type ReminderLogCreationAttributes = Optional<ReminderLog, "id" | "sentAt" | "error">;

export class ReminderLogModel
  extends Model<ReminderLog, ReminderLogCreationAttributes>
  implements ReminderLog {
  declare id: string;
  declare actionItemId: string;
  declare sentTo: string;
  declare status: ReminderStatus;
  declare sentAt: Date;
  declare error: string | null;
}

export function defineReminderLogModel(sequelize: Sequelize) {
  ReminderLogModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      actionItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "action_items", key: "id" },
      },
      sentTo: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      status: {
        type: DataTypes.ENUM(...REMINDER_STATUSES),
        allowNull: false,
      },
      sentAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: "reminder_logs",
      timestamps: false,
      indexes: [
        { fields: ["actionItemId"] },
        { fields: ["sentTo"] },
        { fields: ["sentAt"] },
      ],
    }
  );
}