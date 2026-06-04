import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { MeetingParticipant } from "../types/meetings.type";


type ParticipantCreationAttributes = Optional<MeetingParticipant, "id" | "createdAt" | "userId">;

export class MeetingParticipantModel
  extends Model<MeetingParticipant, ParticipantCreationAttributes>
  implements MeetingParticipant {
  declare id: string;
  declare meetingId: string;
  declare userId: string | null;
  declare email: string;
  declare readonly createdAt: Date;
}

export function defineMeetingParticipantModel(sequelize: Sequelize) {
  MeetingParticipantModel.init(
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
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "meeting_participants",
      timestamps: false,
      indexes: [
        { fields: ["meetingId"] },
        { fields: ["email"] },
        { unique: true, fields: ["meetingId", "email"] },
      ],
    }
  );
}