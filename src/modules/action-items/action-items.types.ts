export const ACTION_ITEM_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export type ActionItemStatus = typeof ACTION_ITEM_STATUSES[number];

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  dueDate: Date | null;
  status: ActionItemStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateActionItemInput {
  meetingId: string;
  title: string;
  description?: string;
  assigneeId: string;
  dueDate: string;
}

export interface CreateActionItemRecordInput {
  meetingId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  dueDate: Date | null;
  createdBy: string;
}

export interface UpdateActionItemStatusInput {
  status: ActionItemStatus;
}

export interface ListActionItemsFilter {
  status?: ActionItemStatus;
  assigneeId?: string;
  meetingId?: string;
}

export interface updateStatusResponse{
  id: string;
  status: ActionItemStatus;
  updatedAt: Date;
}
