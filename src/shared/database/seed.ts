import bcrypt from "bcryptjs";
import sequelize from "../../config/db";
import { ActionItemModel } from "../../modules/action-items/action-item.model";
import { MeetingParticipantModel } from "../../modules/meetings/models/meeting-participant.model";
import { MeetingModel } from "../../modules/meetings/models/meetings.model";
import { UserModel } from "../../modules/user/user.model";
import { logger } from "../logger/pino";
import { defineAssociations } from "./associations";
import { initModels, syncModels } from ".";

const DEMO_PASSWORD = "Password@123";
const DEMO_MEETING_ID = "bb146b67-39b6-4a08-a8f2-0e71f413cc3b";

const users = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "James",
    email: "james@example.com",
  },
  {
    id: "a8fb80e0-422a-4aa3-9898-55d3eab695b4",
    name: "Priya",
    email: "priya@example.com",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Tom",
    email: "tom@example.com",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Lisa",
    email: "lisa@example.com",
  },
] as const;

const transcript = [
  {
    timestamp: "00:02",
    speaker: "Sarah",
    text: "Let's kick off. Today we need to finalize the Q3 roadmap, review the authentication bug backlog, and decide on the mobile app release date.",
  },
  {
    timestamp: "00:05",
    speaker: "James",
    text: "Before we start, I want to flag that the payment gateway integration is currently blocked. We are waiting on API credentials from Stripe. I have already emailed them twice.",
  },
  {
    timestamp: "00:08",
    speaker: "Sarah",
    text: "Okay. Priya, can you take ownership of following up with Stripe and get us unblocked by end of this week?",
  },
  {
    timestamp: "00:09",
    speaker: "Priya",
    text: "Yes, I will handle that. I will escalate to their enterprise support team today.",
  },
  {
    timestamp: "00:13",
    speaker: "Tom",
    text: "On the authentication bug - we have identified the root cause. It is a race condition in the token refresh logic. I can have a fix ready by Wednesday.",
  },
  {
    timestamp: "00:15",
    speaker: "Sarah",
    text: "Good. Tom, please also write a regression test so this does not happen again.",
  },
  {
    timestamp: "00:16",
    speaker: "Tom",
    text: "Understood, I will include the regression test in the same PR.",
  },
  {
    timestamp: "00:20",
    speaker: "Lisa",
    text: "For the mobile app, design is complete. We have finished all screens for iOS. Android still needs two more screens - the notification preferences and the account settings page.",
  },
  {
    timestamp: "00:23",
    speaker: "James",
    text: "Engineering is ready on our side for iOS. We can start the App Store submission process as soon as QA signs off.",
  },
  {
    timestamp: "00:25",
    speaker: "Sarah",
    text: "Let's decide on this now. We will target July 15th as the iOS release date. Android will follow two weeks later on July 29th.",
  },
  {
    timestamp: "00:26",
    speaker: "Priya",
    text: "Agreed. That gives us enough buffer for QA.",
  },
  {
    timestamp: "00:27",
    speaker: "James",
    text: "Agreed.",
  },
  {
    timestamp: "00:30",
    speaker: "Lisa",
    text: "I will complete the remaining two Android screens by Friday and hand them off to James for implementation.",
  },
  {
    timestamp: "00:33",
    speaker: "Tom",
    text: "We should also schedule a load test before the iOS launch. Last time we had performance issues after a big release.",
  },
  {
    timestamp: "00:35",
    speaker: "Sarah",
    text: "Good point. James, can you coordinate with DevOps to schedule a load test for the week of July 7th?",
  },
  {
    timestamp: "00:36",
    speaker: "James",
    text: "Will do.",
  },
  {
    timestamp: "00:40",
    speaker: "Sarah",
    text: "One last thing - we need to update the API documentation before the release. It is currently outdated and does not reflect the new endpoints.",
  },
  {
    timestamp: "00:42",
    speaker: "Priya",
    text: "I can take that. I will update the API docs and have them reviewed by Tom before July 10th.",
  },
  {
    timestamp: "00:45",
    speaker: "Sarah",
    text: "Perfect. To summarise - iOS ships July 15th, Android July 29th, payment gateway is blocked pending Stripe credentials, and Tom is fixing the auth bug by Wednesday. Let's wrap up.",
  },
];

const actionItems = [
  {
    title: "Prepare release notes",
    description: "Document all changes made in the sprint for the release.",
    assigneeId: "a8fb80e0-422a-4aa3-9898-55d3eab695b4",
    dueDate: new Date("2026-06-15T10:00:00.000Z"),
  },
  {
    title: "Follow up with Stripe for API credentials",
    description: "Escalate to Stripe enterprise support and unblock the payment gateway integration.",
    assigneeId: "a8fb80e0-422a-4aa3-9898-55d3eab695b4",
    dueDate: new Date("2026-06-12T17:00:00.000Z"),
  },
  {
    title: "Fix token refresh race condition",
    description: "Prepare the authentication bug fix and include a regression test in the same PR.",
    assigneeId: "44444444-4444-4444-8444-444444444444",
    dueDate: new Date("2026-06-17T17:00:00.000Z"),
  },
  {
    title: "Complete remaining Android screens",
    description: "Finish notification preferences and account settings screens, then hand them off to James.",
    assigneeId: "55555555-5555-4555-8555-555555555555",
    dueDate: new Date("2026-06-12T17:00:00.000Z"),
  },
  {
    title: "Schedule pre-launch load test",
    description: "Coordinate with DevOps to schedule a load test for the week of July 7th.",
    assigneeId: "22222222-2222-4222-8222-222222222222",
    dueDate: new Date("2026-07-07T10:00:00.000Z"),
  },
  {
    title: "Update API documentation",
    description: "Update API docs for the new endpoints and have Tom review them before July 10th.",
    assigneeId: "a8fb80e0-422a-4aa3-9898-55d3eab695b4",
    dueDate: new Date("2026-07-10T17:00:00.000Z"),
  },
];

async function seedDatabase(): Promise<void> {
  initModels();
  defineAssociations();

  await sequelize.authenticate();
  await syncModels();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const creator = users[0];

  await sequelize.transaction(async (transaction) => {
    for (const user of users) {
      const existingUser = await UserModel.findByPk(user.id, { transaction });

      if (existingUser) {
        await existingUser.update({ ...user, passwordHash }, { transaction });
      } else {
        await UserModel.create({ ...user, passwordHash }, { transaction });
      }
    }

    const existingMeeting = await MeetingModel.findByPk(DEMO_MEETING_ID, { paranoid: false, transaction });
    const meetingPayload = {
      id: DEMO_MEETING_ID,
      title: "Product Roadmap Review - Q3 2026",
      meetingDate: new Date("2026-06-10T10:00:00.000Z"),
      transcript,
      createdBy: creator.id,
      deletedAt: null,
    };

    if (existingMeeting) {
      await existingMeeting.update(meetingPayload, { transaction });
      if (existingMeeting.deletedAt) {
        await existingMeeting.restore({ transaction });
      }
    } else {
      await MeetingModel.create(meetingPayload, { transaction });
    }

    await MeetingParticipantModel.destroy({
      where: { meetingId: DEMO_MEETING_ID },
      force: true,
      transaction,
    });

    await MeetingParticipantModel.bulkCreate(
      users.map((user) => ({
        meetingId: DEMO_MEETING_ID,
        userId: user.id,
        email: user.email,
      })),
      { transaction }
    );

    await ActionItemModel.destroy({
      where: { meetingId: DEMO_MEETING_ID },
      force: true,
      transaction,
    });

    await ActionItemModel.bulkCreate(
      actionItems.map((item) => ({
        meetingId: DEMO_MEETING_ID,
        title: item.title,
        description: item.description,
        assigneeId: item.assigneeId,
        dueDate: item.dueDate,
        status: "PENDING",
        createdBy: creator.id,
      })),
      { transaction }
    );
  });

  logger.info({
    meetingId: DEMO_MEETING_ID,
    users: users.map((user) => user.email),
    password: DEMO_PASSWORD,
  }, "Database seeded successfully.");
}

seedDatabase()
  .catch((error) => {
    logger.error({ error }, "Database seed failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
