export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
  Canceled = 4
}

export enum TicketPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  creatorId: number;
  creatorName: string;
  assignedAgentId?: number;
  assignedAgentName: string;
  comments?: TicketComment[];
  attachments?: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isInternal: boolean;
}

export interface TicketAttachment {
  id: number;
  ticketId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface CreateTicketDTO {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgentId?: number;
}


export interface UpdateTicketStatusDTO {
  status: TicketStatus;
}

export interface AddCommentDTO {
  content: string;
}
