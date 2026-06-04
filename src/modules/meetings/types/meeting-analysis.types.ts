export interface Citation {
  timestamp: string;  // "HH:MM"
}

export interface SummaryItem {
  text: string;
  citations: Citation[];
}

export interface ActionItem {
  task: string;
  assignee: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  citations: Citation[];
}

export interface Decision {
  decision: string;
  citations: Citation[];
}

export interface FollowUp {
  suggestion: string;
  citations: Citation[];
}

export interface MeetingAnalysis {
  id: string;
  meetingId: string;
  summary: SummaryItem[];
  decisions: Decision[];
  followUps: FollowUp[];
  modelUsed: string;
  promptVersion: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MeetingAnalysisResponse {
  summary: SummaryItem[];
  actionItems: ActionItem[];
  decisions: Decision[];
  followUps: FollowUp[];
}
