import { AppError } from "../../shared/errors/AppError";
import { ActionItemsRepository } from "./action-items.repository";
import {
  ActionItem,
  CreateActionItemInput,
  ListActionItemsFilter,
  UpdateActionItemStatusInput,
  updateStatusResponse,
} from "./action-items.types";

export class ActionItemsService {
  constructor(private readonly actionItemsRepository: ActionItemsRepository) {}

  async create(input: CreateActionItemInput, createdBy: string): Promise<ActionItem> {
    const dueDate = new Date(input.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      throw new AppError("Due date must be valid.", 400);
    }

    return this.actionItemsRepository.create({
      meetingId: input.meetingId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      assigneeId: input.assigneeId,
      dueDate,
      createdBy,
    });
  }

  async updateStatus(id: string, input: UpdateActionItemStatusInput): Promise<updateStatusResponse> {
    if (!id) {
      throw new AppError("Action item ID is required.", 400);
    }

    const actionItem = await this.actionItemsRepository.updateStatus(id, input);

    if (!actionItem) {
      throw new AppError("Action item not found.", 404);
    }

    return actionItem;
  }

  async list(filter: ListActionItemsFilter): Promise<ActionItem[]> {
    return this.actionItemsRepository.list(filter);
  }

  async listOverdue(): Promise<ActionItem[]> {
    return this.actionItemsRepository.listOverdue();
  }
}
