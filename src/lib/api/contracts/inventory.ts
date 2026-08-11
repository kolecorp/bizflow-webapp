import type {
  InventoryItem,
  StockSnapshot,
  AdjustInventoryInput,
} from "../types/inventory";

export interface InventoryRepository {
  getInventory(): Promise<InventoryItem[]>;
  getStock(): Promise<StockSnapshot[]>;
  adjustInventory(input: AdjustInventoryInput): Promise<InventoryItem>;
}
