import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { MeetingAnalysis, SummaryItem, Decision, FollowUp } from "../types/meeting-analysis.types";

type MeetingAnalysisCreationAttributes = Optional<MeetingAnalysis, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export class MeetingAnalysisModel
  extends Model<MeetingAnalysis, MeetingAnalysisCreationAttributes>
  implements MeetingAnalysis
{
  declare id: string;
  declare meetingId: string;
  declare summary: SummaryItem[];
  declare decisions: Decision[];
  declare followUps: FollowUp[];
  declare modelUsed: string;
  declare promptVersion: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare deletedAt: Date | null;
}

export function defineMeetingAnalysisModel(sequelize: Sequelize) {
  MeetingAnalysisModel.init(
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
      summary: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      decisions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      followUps: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      modelUsed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      promptVersion: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "meeting_analyses",
      paranoid: true,
      timestamps: true,
      indexes: [
        { fields: ["meetingId"] },
      ],
    }
  );
}