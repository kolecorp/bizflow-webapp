import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types/transactions";

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | null>;
  createTransaction(input: CreateTransactionInput): Promise<Transaction>;
  updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
