import { ActionItemModel } from "../../modules/action-items/action-item.model";
import { MeetingParticipantModel } from "../../modules/meetings/models/meeting-participant.model";
import { MeetingModel } from "../../modules/meetings/models/meetings.model";
import { ReminderLogModel } from "../../modules/reminders/reminder.model";
import { UserModel } from "../../modules/user/user.model";


export function defineAssociations() {

  UserModel.hasMany(MeetingModel, { foreignKey: "createdBy", as: "createdMeetings" });
  MeetingModel.belongsTo(UserModel, { foreignKey: "createdBy", as: "creator" });

  MeetingModel.hasMany(MeetingParticipantModel, { foreignKey: "meetingId", as: "participants" });
  MeetingParticipantModel.belongsTo(MeetingModel, { foreignKey: "meetingId" });

  MeetingParticipantModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  MeetingModel.hasMany(ActionItemModel, { foreignKey: "meetingId", as: "actionItems" });
  ActionItemModel.belongsTo(MeetingModel, { foreignKey: "meetingId", as: "meeting" });

  ActionItemModel.belongsTo(UserModel, { foreignKey: "assigneeId", as: "assignee" });
  ActionItemModel.belongsTo(UserModel, { foreignKey: "createdBy", as: "creator" });

  UserModel.hasMany(ReminderLogModel, { foreignKey: "sentTo", as: "remindersReceived" });
  ReminderLogModel.belongsTo(UserModel, { foreignKey: "sentTo", as: "recipient" });
}
