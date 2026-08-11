export interface Expense {
  id: string;
  title: string;
  amount: number;
  category?: string;
  paidBy?: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category?: string;
  paidBy?: string;
  date: string;
  notes?: string;
}

export interface UpdateExpenseInput {
  title?: string;
  amount?: number;
  category?: string;
  paidBy?: string;
  date?: string;
  notes?: string;
}
