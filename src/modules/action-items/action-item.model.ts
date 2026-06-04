import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ACTION_ITEM_STATUSES, ActionItem, ActionItemStatus } from "./action-items.types";


type ActionItemCreationAttributes = Optional<ActionItem, "id" | "status" | "createdAt" | "updatedAt" | "deletedAt">;

export class ActionItemModel extends Model<ActionItem, ActionItemCreationAttributes> implements ActionItem {
  declare id: string;
  declare meetingId: string;
  declare title: string;
  declare description: string | null;
  declare assigneeId: string | null;
  declare dueDate: Date | null;
  declare status: ActionItemStatus;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare deletedAt: Date | null;
}

export function defineActionItemModel(sequelize: Sequelize) {
  ActionItemModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      meetingId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "meetings", key: "id" },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 200] },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      assigneeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...ACTION_ITEM_STATUSES),
        allowNull: false,
        defaultValue: "PENDING",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: "action_items",
      paranoid: true,
      timestamps: true,
      indexes: [
        { fields: ["meetingId"] },
        { fields: ["assigneeId"] },
        { fields: ["status"] },
        { fields: ["dueDate"] },
        { fields: ["status", "dueDate"] },
      ],
    }
  );
}
