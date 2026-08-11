import type {
  AuthRepository,
  ProductRepository,
  TransactionRepository,
  InventoryRepository,
  CustomerRepository,
  ExpenseRepository,
  ReportRepository,
} from "../../contracts/index";
import type {
  AuthUser,
  SignInInput,
  Product,
  CreateProductInput,
  UpdateProductInput,
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  InventoryItem,
  StockSnapshot,
  AdjustInventoryInput,
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  SalesReport,
  InventoryReport,
  ReportCriteria,
} from "../../types/index";

export class FirebaseProvider
  implements
    AuthRepository,
    ProductRepository,
    TransactionRepository,
    InventoryRepository,
    CustomerRepository,
    ExpenseRepository,
    ReportRepository
{
  async signIn(input: SignInInput): Promise<AuthUser> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async signOut(): Promise<void> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getProducts(): Promise<Product[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getProduct(id: string): Promise<Product | null> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async deleteProduct(id: string): Promise<void> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getTransactions(): Promise<Transaction[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async deleteTransaction(id: string): Promise<void> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getInventory(): Promise<InventoryItem[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getStock(): Promise<StockSnapshot[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async adjustInventory(input: AdjustInventoryInput): Promise<InventoryItem> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getCustomers(): Promise<Customer[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getCustomer(id: string): Promise<Customer | null> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async updateCustomer(
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async deleteCustomer(id: string): Promise<void> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getExpenses(): Promise<Expense[]> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getExpense(id: string): Promise<Expense | null> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async deleteExpense(id: string): Promise<void> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getSalesReport(criteria: ReportCriteria): Promise<SalesReport> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }

  async getInventoryReport(criteria: ReportCriteria): Promise<InventoryReport> {
    throw new Error("FirebaseProvider is not implemented yet.");
  }
}
