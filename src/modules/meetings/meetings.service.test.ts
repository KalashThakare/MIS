import { describe, expect, it, vi } from "vitest";
import { GroqService } from "../../shared/groq/groq.service";
import { MeetingAnalysisResponse } from "./types/meeting-analysis.types";
import { MeetingRepository } from "./meetings.repository";
import { MeetingService } from "./meetings.service";

const createMeetingRepository = () => ({
  create: vi.fn(),
  findMeetingByTitle: vi.fn(),
  getMeetingById: vi.fn(),
  listMeetings: vi.fn(),
  createMeetingAnalysis: vi.fn(),
}) as unknown as MeetingRepository;

const createGroqService = () => ({
  analyzeMeeting: vi.fn(),
}) as unknown as GroqService;

describe("MeetingService", () => {
  it("normalizes title and participant emails before creating a meeting", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());
    const createdMeeting = {
      id: "meeting-id",
      title: "Planning",
      meetingDate: new Date("2026-06-10T00:00:00.000Z"),
      transcript: [],
      createdBy: "creator-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    vi.mocked(repository.findMeetingByTitle).mockResolvedValue(false);
    vi.mocked(repository.create).mockResolvedValue(createdMeeting);

    await expect(service.createMeetingService({
      title: " Planning ",
      participants: [" ALICE@example.com ", "bob@example.com"],
      meetingDate: "2026-06-10T00:00:00.000Z",
      transcript: [],
    }, "creator-id")).resolves.toEqual(createdMeeting);

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      title: "Planning",
      participants: ["alice@example.com", "bob@example.com"],
      createdBy: "creator-id",
    }));
  });

  it("analyzes a meeting and persists the LLM response with the meeting creator", async () => {
    const repository = createMeetingRepository();
    const groqService = createGroqService();
    const service = new MeetingService(repository, groqService);
    const transcript = [{ timestamp: "00:01", speaker: "Alex", text: "Priya will send the recap." }];
    const analysis: MeetingAnalysisResponse = {
      summary: [{ text: "The team discussed the recap.", citations: [{ timestamp: "00:01" }] }],
      actionItems: [{ task: "Send the recap", assignee: "Priya", status: "PENDING", citations: [{ timestamp: "00:01" }] }],
      decisions: [],
      followUps: [],
    };

    vi.mocked(repository.getMeetingById).mockResolvedValue({
      id: "meeting-id",
      title: "Planning",
      meetingDate: new Date("2026-06-10T00:00:00.000Z"),
      transcript,
      createdBy: "creator-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      participants: [],
    });
    vi.mocked(groqService.analyzeMeeting).mockResolvedValue(analysis);
    vi.mocked(repository.createMeetingAnalysis).mockResolvedValue(analysis);

    await expect(service.analyseMeeting("meeting-id")).resolves.toEqual(analysis);

    expect(groqService.analyzeMeeting).toHaveBeenCalledWith(transcript);
    expect(repository.createMeetingAnalysis).toHaveBeenCalledWith("meeting-id", "creator-id", analysis);
  });

  it("does not call the LLM when the meeting has no transcript", async () => {
    const repository = createMeetingRepository();
    const groqService = createGroqService();
    const service = new MeetingService(repository, groqService);

    vi.mocked(repository.getMeetingById).mockResolvedValue({
      id: "meeting-id",
      title: "Planning",
      meetingDate: new Date("2026-06-10T00:00:00.000Z"),
      transcript: [],
      createdBy: "creator-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      participants: [],
    });

    await expect(service.analyseMeeting("meeting-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "Meeting has no transcript to analyse.",
    });

    expect(groqService.analyzeMeeting).not.toHaveBeenCalled();
  });
});
