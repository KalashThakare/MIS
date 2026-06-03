export const REMINDER_STATUSES = ["SENT", "FAILED"] as const;
export type ReminderStatus = typeof REMINDER_STATUSES[number];

export interface ReminderLog {
  id: string;
  actionItemId: string;
  sentTo: string;
  status: ReminderStatus;
  sentAt: Date;
  error: string | null;
}