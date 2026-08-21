export type NotificationKind = "info" | "success" | "warning" | "error";

export type NotificationCategory =
  | "system"
  | "file_transfer"
  | "chat"
  | "ticket";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  kind: NotificationKind;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  href?: string;
};

export type FileTransferStatus =
  | "pending"
  | "uploading"
  | "delivered"
  | "failed"
  | "rejected";

export type FileTransferDirection = "to_computer" | "from_computer";

export type FileTransferJob = {
  id: string;
  computerId: string;
  computerName: string;
  fileName: string;
  fileSize: number;
  direction: FileTransferDirection;
  status: FileTransferStatus;
  sentBy: string;
  sentAt: string;
  completedAt?: string;
  error?: string;
};

export type StaffChatChannel = {
  id: string;
  name: string;
  type: "team" | "direct";
  members: string[];
  lastMessageAt?: string;
};

export type StaffChatMessage = {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  body: string;
  sentAt: string;
  /** RPC envelope id when routed through workstation agent */
  rpcId?: string;
};

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";

export type SupportTicket = {
  id: string;
  subject: string;
  customer: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  computerId?: string;
  computerName?: string;
};

export type TicketComment = {
  id: string;
  ticketId: string;
  author: string;
  body: string;
  createdAt: string;
  internal: boolean;
};
