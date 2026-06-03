import { MeetingParticipantModel } from "../../modules/meetings/models/meeting-participant.model";
import { MeetingModel } from "../../modules/meetings/models/meetings.model";
import { UserModel } from "../../modules/user/user.model";


export function defineAssociations() {

  MeetingModel.belongsTo(UserModel, { foreignKey: "createdBy", as: "creator" });

  MeetingModel.hasMany(MeetingParticipantModel, { foreignKey: "meetingId", as: "participants" });
  MeetingParticipantModel.belongsTo(MeetingModel, { foreignKey: "meetingId" });

  MeetingParticipantModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
}