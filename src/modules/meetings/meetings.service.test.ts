import { describe, expect, it, vi } from "vitest";
import { MeetingAnalysisResponse } from "./types/meeting-analysis.types";
import { MeetingRepository } from "./meetings.repository";
import { MeetingService } from "./meetings.service";
import { GroqService } from "../../shared/integrations/groq/groq.service";

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

  it("rejects meeting creation when title already exists", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    vi.mocked(repository.findMeetingByTitle).mockResolvedValue(true);

    await expect(service.createMeetingService({
      title: "Planning",
      participants: ["alice@example.com"],
      meetingDate: "2026-06-10T00:00:00.000Z",
      transcript: [],
    }, "creator-id")).rejects.toMatchObject({
      statusCode: 409,
      message: "Meeting already exists",
    });
  });

  it("rejects meeting creation with invalid meeting date", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    vi.mocked(repository.findMeetingByTitle).mockResolvedValue(false);

    await expect(service.createMeetingService({
      title: "Planning",
      participants: ["alice@example.com"],
      meetingDate: "not-a-date",
      transcript: [],
    }, "creator-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "Meeting date must be valid.",
    });
  });

  it("rejects meeting creation with empty participants", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    vi.mocked(repository.findMeetingByTitle).mockResolvedValue(false);

    await expect(service.createMeetingService({
      title: "Planning",
      participants: [],
      meetingDate: "2026-06-10T00:00:00.000Z",
      transcript: [],
    }, "creator-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "At least one participant is required.",
    });
  });

  it("rejects meeting creation when transcript is missing", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    vi.mocked(repository.findMeetingByTitle).mockResolvedValue(false);

    await expect(service.createMeetingService({
      title: "Planning",
      participants: ["alice@example.com"],
      meetingDate: "2026-06-10T00:00:00.000Z",
      transcript: undefined as never,
    }, "creator-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "Meeting transcript is required.",
    });
  });

  it("rejects get meeting when id is missing", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    await expect(service.getMeetingById("")).rejects.toMatchObject({
      statusCode: 400,
      message: "Meeting ID is required.",
    });
  });

  it("rejects get meeting when meeting does not exist", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    vi.mocked(repository.getMeetingById).mockResolvedValue(null);

    await expect(service.getMeetingById("missing-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "Meeting not found.",
    });
  });

  it("rejects list meetings when pagination is invalid", async () => {
    const repository = createMeetingRepository();
    const service = new MeetingService(repository, createGroqService());

    await expect(service.listMeetings({ page: "0", limit: "-1" })).rejects.toMatchObject({
      statusCode: 400,
      message: "Pagination values must be positive integers.",
    });
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
