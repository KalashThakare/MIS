import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { ActionItemsController } from "./action-items.controller";
import { ActionItemsRepository } from "./action-items.repository";
import { ActionItemsService } from "./action-items.service";
import {
  validateCreateActionItem,
  validateListActionItems,
  validateUpdateActionItemStatus,
} from "./action-items.validation";

const actionItemsRepository = new ActionItemsRepository();
const actionItemsService = new ActionItemsService(actionItemsRepository);
const actionItemsController = new ActionItemsController(actionItemsService);

export const actionItemsRoutes = Router();

actionItemsRoutes.post(
  "/action-items",
  authenticate,
  validateCreateActionItem,
  actionItemsController.create.bind(actionItemsController)
);

actionItemsRoutes.patch(
  "/action-items/:id/status",
  authenticate,
  validateUpdateActionItemStatus,
  actionItemsController.updateStatus.bind(actionItemsController)
);

actionItemsRoutes.get(
  "/action-items/overdue",
  authenticate,
  actionItemsController.overdue.bind(actionItemsController)
);

actionItemsRoutes.get(
  "/action-items",
  authenticate,
  validateListActionItems,
  actionItemsController.list.bind(actionItemsController)
);

