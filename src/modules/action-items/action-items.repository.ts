import { Op, WhereOptions } from "sequelize";
import {
  ActionItem,
  CreateActionItemRecordInput,
  ListActionItemsFilter,
  UpdateActionItemStatusInput,
  updateStatusResponse,
} from "./action-items.types";
import { ActionItemModel } from "./action-item.model";

export class ActionItemsRepository {
  async create(input: CreateActionItemRecordInput): Promise<ActionItem> {
    const actionItem = await ActionItemModel.create({
      meetingId: input.meetingId,
      title: input.title,
      description: input.description,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      createdBy: input.createdBy,
    });

    return actionItem.get({ plain: true });
  }

  async updateStatus(id: string, input: UpdateActionItemStatusInput): Promise<updateStatusResponse | null> {
    const actionItem = await ActionItemModel.findByPk(id);

    if (!actionItem) return null;

    const [, updated] = await ActionItemModel.update(
      { status: input.status },
      { where: { id }, returning: true }
    );

    return {
      id: updated[0].id,
      status: updated[0].status,
      updatedAt: updated[0].updatedAt
    };
  }

  async list(filter: ListActionItemsFilter): Promise<ActionItem[]> {
    const where: WhereOptions<ActionItem> = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.assigneeId) {
      where.assigneeId = filter.assigneeId;
    }

    if (filter.meetingId) {
      where.meetingId = filter.meetingId;
    }

    const actionItems = await ActionItemModel.findAll({
      where,
      order: [["dueDate", "ASC"]],
    });

    return actionItems.map((actionItem) => actionItem.get({ plain: true }));
  }

  async listOverdue(): Promise<ActionItem[]> {
    const actionItems = await ActionItemModel.findAll({
      where: {
        status: { [Op.ne]: "COMPLETED" },
        dueDate: { [Op.lt]: new Date() },
      },
      order: [["dueDate", "ASC"]],
    });

    return actionItems.map((actionItem) => actionItem.get({ plain: true }));
  }
}
