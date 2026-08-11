export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockSnapshot {
  productId: string;
  available: number;
  reserved?: number;
  location?: string;
}

export interface AdjustInventoryInput {
  productId: string;
  quantity: number;
  note?: string;
}
