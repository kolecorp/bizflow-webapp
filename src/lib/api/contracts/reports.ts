import type {
  ReportCriteria,
  SalesReport,
  InventoryReport,
} from "../types/reports";

export interface ReportRepository {
  getSalesReport(criteria: ReportCriteria): Promise<SalesReport>;
  getInventoryReport(criteria: ReportCriteria): Promise<InventoryReport>;
}
