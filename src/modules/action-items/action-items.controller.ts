import { NextFunction, Request, Response } from "express";
import { ActionItemsService } from "./action-items.service";
import { ActionItemStatus } from "./action-items.types";

interface ListActionItemsQuery {
  status?: ActionItemStatus;
  assignee?: string;
  assigneeId?: string;
  meetingId?: string;
}

export class ActionItemsController {
  constructor(private readonly actionItemsService: ActionItemsService) {}

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const actionItem = await this.actionItemsService.create(request.body, request.user!.id);

      response.success(actionItem, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const actionItem = await this.actionItemsService.updateStatus(request.params.id, request.body);

      response.success(actionItem);
    } catch (error) {
      next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const query = request.query as ListActionItemsQuery;
      const assigneeId = query.assignee ?? query.assigneeId;

      const actionItems = await this.actionItemsService.list({
        status: query.status,
        assigneeId,
        meetingId: query.meetingId,
      });

      response.success({ items: actionItems });
    } catch (error) {
      next(error);
    }
  }

  async overdue(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const actionItems = await this.actionItemsService.listOverdue();

      response.success({ items: actionItems });
    } catch (error) {
      next(error);
    }
  }
}
