export interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface CreateMeetingInput {
  title: string;
  participants: string[];
  meetingDate: string;
  transcript: TranscriptEntry[];
}


export interface CreateMeetingDTO {
  title: string;
  participants: string[];
  meetingDate: Date;
  transcript: TranscriptEntry[];
}

export interface CreateMeetingRecordInput {
  title: string;
  participants: string[];
  meetingDate: Date;
  transcript: TranscriptEntry[];
  createdBy: string;
}

export interface Meeting {
  id: string;
  title: string;
  meetingDate: Date;
  transcript: TranscriptEntry[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  userId: string | null;
  email: string;
  createdAt: Date;
}

export interface MeetingResponse {
  id?: string;
  title: string;
  meetingDate: Date;
  participants: string[];
  transcript: TranscriptEntry[];
}

export interface MeetingWithParticipants extends Meeting {
  participants: MeetingParticipant[];
}

export interface PaginationInput {
  page: number;
  limit: number;
}

export interface PaginatedMeetingsResponse {
  items: MeetingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
