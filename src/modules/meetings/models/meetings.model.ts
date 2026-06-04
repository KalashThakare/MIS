import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Meeting, TranscriptEntry } from "../types/meetings.type";

type MeetingCreationAttributes = Optional<Meeting, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export class MeetingModel extends Model<Meeting, MeetingCreationAttributes> implements Meeting {
  declare id: string;
  declare title: string;
  declare meetingDate: Date;
  declare transcript: TranscriptEntry[];
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare deletedAt: Date | null;
}

export function defineMeetingModel(sequelize: Sequelize) {
  MeetingModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 200] }
      },
      meetingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      transcript: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" }
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
      tableName: "meetings",
      paranoid: true,
      timestamps: true,
      indexes: [
        { fields: ["createdBy"] },
        { fields: ["meetingDate"] },
      ],
    }
  );
}
