export type ServiceTransaction = {
  id: string;
  service: string;
  customer: string;
  amount: number;
  date: string;
  description: string;
  time: string;
  recordedBy: string;
  recordedById?: string;
};

export type PrintAgentStatus = "online" | "offline";

export type PrintAgent = {
  id: string;
  name: string;
  machine: string;
  status: PrintAgentStatus;
  version: string;
  printersConnected: number;
  lastSeen: string;
  connectionCode?: string;
};

export type PrinterStatus = "online" | "offline" | "warning" | "error";

export type Printer = {
  id: string;
  name: string;
  model: string;
  location: string;
  status: PrinterStatus;
  statusDetail?: string;
  ip: string;
  protocol: string;
  agentId: string;
  jobsToday: number;
  pagesToday: number;
  pagesMonth: number;
  bwPages: number;
  colorPages: number;
  failedJobs: number;
  queueCount: number;
  supportsColor: boolean;
  supportsDuplex: boolean;
  paperSizes: string[];
  connectionType: string;
  tonerLevel?: number;
};

export type PrintJobStatus =
  | "queued"
  | "printing"
  | "completed"
  | "failed"
  | "cancelled";

export type PrintJob = {
  id: string;
  time: string;
  user: string;
  document: string;
  printerId: string;
  printerName: string;
  copies: number;
  pages: number;
  status: PrintJobStatus;
  color: boolean;
  duplex: boolean;
  customer?: string;
  amount?: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  location: string;
  lastCounted?: string;
  costPerUnit?: number;
};

export type StockAdjustment = {
  id: string;
  itemId: string;
  itemName: string;
  type: "add" | "remove" | "count";
  quantity: number;
  reason: string;
  date: string;
  time: string;
  by: string;
};

export type ComputerStatus = "online" | "offline" | "in-use";

export type WorkstationAgentStatus = "online" | "offline";

export type WorkstationAgent = {
  id: string;
  computerId: string;
  machine: string;
  status: WorkstationAgentStatus;
  version: string;
  lastSeen: string;
  /** Customer-side setting — agent must opt in before staff can push files */
  allowsFileTransfer: boolean;
  allowsStaffChat: boolean;
};

export type Computer = {
  id: string;
  name: string;
  label: string;
  status: ComputerStatus;
  currentUser?: string;
  sessionStart?: string;
  hourlyRate: number;
  printsToday: number;
  agentId?: string;
  agentConnected?: boolean;
  allowsFileTransfer?: boolean;
};

export type ServiceCatalogItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  active: boolean;
  description?: string;
};

export type DiscoveredPrinter = {
  id: string;
  name: string;
  ip: string;
  protocol: string;
  supportsColor: boolean;
  supportsDuplex: boolean;
  paperSizes: string[];
  status: PrinterStatus;
};
