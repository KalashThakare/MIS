import { describe, expect, it, vi } from "vitest";
import { ActionItemsRepository } from "./action-items.repository";
import { ActionItemsService } from "./action-items.service";
import { ActionItem } from "./action-items.types";

const createRepository = () => ({
  create: vi.fn(),
  updateStatus: vi.fn(),
  list: vi.fn(),
  listOverdue: vi.fn(),
}) as unknown as ActionItemsRepository;

describe("ActionItemsService", () => {
  it("trims title and description before creating an action item", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);

    vi.mocked(repository.create).mockResolvedValue({
      id: "action-item-id",
      meetingId: "meeting-id",
      title: "Send recap",
      description: "Share notes",
      assigneeId: "assignee-id",
      dueDate: new Date("2026-06-10T00:00:00.000Z"),
      status: "PENDING",
      createdBy: "creator-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await service.create({
      meetingId: "meeting-id",
      title: " Send recap ",
      description: " Share notes ",
      assigneeId: "assignee-id",
      dueDate: "2026-06-10T00:00:00.000Z",
    }, "creator-id");

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      title: "Send recap",
      description: "Share notes",
      assigneeId: "assignee-id",
      createdBy: "creator-id",
    }));
  });

  it("rejects creation when due date is invalid", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);

    await expect(service.create({
      meetingId: "meeting-id",
      title: "Send recap",
      description: "Share notes",
      assigneeId: "assignee-id",
      dueDate: "not-a-date",
    }, "creator-id")).rejects.toMatchObject({
      statusCode: 400,
      message: "Due date must be valid.",
    });
  });

  it("returns the updated status when repository updates an action item", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);
    const updatedAt = new Date("2026-06-10T00:00:00.000Z");

    vi.mocked(repository.updateStatus).mockResolvedValue({
      id: "action-item-id",
      status: "COMPLETED",
      updatedAt,
    });

    await expect(service.updateStatus("action-item-id", { status: "COMPLETED" })).resolves.toEqual({
      id: "action-item-id",
      status: "COMPLETED",
      updatedAt,
    });

    expect(repository.updateStatus).toHaveBeenCalledWith("action-item-id", { status: "COMPLETED" });
  });

  it("raises not found when updating a missing action item", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);

    vi.mocked(repository.updateStatus).mockResolvedValue(null);

    await expect(service.updateStatus("missing-id", { status: "COMPLETED" })).rejects.toMatchObject({
      statusCode: 404,
      message: "Action item not found.",
    });
  });

  it("returns filtered action items from repository", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);
    const items: ActionItem[] = [
      {
        id: "action-item-id",
        meetingId: "meeting-id",
        title: "Send recap",
        description: null,
        assigneeId: null,
        dueDate: null,
        status: "PENDING",
        createdBy: "creator-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    vi.mocked(repository.list).mockResolvedValue(items);

    await expect(service.list({ status: "PENDING", meetingId: "meeting-id" })).resolves.toEqual(items);

    expect(repository.list).toHaveBeenCalledWith({ status: "PENDING", meetingId: "meeting-id" });
  });

  it("returns overdue action items from repository", async () => {
    const repository = createRepository();
    const service = new ActionItemsService(repository);
    const items: ActionItem[] = [
      {
        id: "action-item-id",
        meetingId: "meeting-id",
        title: "Send recap",
        description: null,
        assigneeId: null,
        dueDate: new Date("2026-06-01T00:00:00.000Z"),
        status: "PENDING",
        createdBy: "creator-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    vi.mocked(repository.listOverdue).mockResolvedValue(items);

    await expect(service.listOverdue()).resolves.toEqual(items);

    expect(repository.listOverdue).toHaveBeenCalledWith();
  });
});
