export interface TransactionItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Transaction {
  id: string;
  customerId?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "mobile" | "other";
  status: "draft" | "completed" | "refunded";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  customerId?: string;
  items: TransactionItem[];
  tax?: number;
  discount?: number;
  paymentMethod: "cash" | "card" | "mobile" | "other";
}

export interface UpdateTransactionInput {
  items?: TransactionItem[];
  tax?: number;
  discount?: number;
  paymentMethod?: "cash" | "card" | "mobile" | "other";
  status?: "draft" | "completed" | "refunded";
}
