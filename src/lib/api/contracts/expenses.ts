import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from "../types/expenses";

export interface ExpenseRepository {
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | null>;
  createExpense(input: CreateExpenseInput): Promise<Expense>;
  updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
}
