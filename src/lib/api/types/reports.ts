export interface ReportCriteria {
  startDate?: string;
  endDate?: string;
  category?: string;
  productId?: string;
  customerId?: string;
}

export interface SalesReport {
  totalSales: number;
  totalTransactions: number;
  totalItems: number;
  totalTax: number;
  totalDiscount: number;
}

export interface InventoryReport {
  productsInStock: number;
  lowStockCount: number;
  totalValue: number;
}
