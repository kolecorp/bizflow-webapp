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

function callAppsScript<T>(functionName: string, ...args: unknown[]) {
  return new Promise<T>((resolve, reject) => {
    if (typeof google === "undefined" || !google.script || !google.script.run) {
      reject(new Error("Apps Script environment is not available."));
      return;
    }

    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [functionName](...args);
  });
}

export class AppsScriptProvider
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
    return callAppsScript<AuthUser>("signIn", input);
  }

  async signOut(): Promise<void> {
    return callAppsScript<void>("signOut");
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return callAppsScript<AuthUser | null>("getCurrentUser");
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    throw new Error(
      "onAuthStateChanged is not supported in Apps Script adapter yet.",
    );
  }

  async getProducts(): Promise<Product[]> {
    return callAppsScript<Product[]>("getProducts");
  }

  async getProduct(id: string): Promise<Product | null> {
    return callAppsScript<Product | null>("getProduct", id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return callAppsScript<Product>("createProduct", input);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return callAppsScript<Product>("updateProduct", id, input);
  }

  async deleteProduct(id: string): Promise<void> {
    return callAppsScript<void>("deleteProduct", id);
  }

  async getTransactions(): Promise<Transaction[]> {
    return callAppsScript<Transaction[]>("getTransactions");
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return callAppsScript<Transaction | null>("getTransaction", id);
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    return callAppsScript<Transaction>("createTransaction", input);
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    return callAppsScript<Transaction>("updateTransaction", id, input);
  }

  async deleteTransaction(id: string): Promise<void> {
    return callAppsScript<void>("deleteTransaction", id);
  }

  async getInventory(): Promise<InventoryItem[]> {
    return callAppsScript<InventoryItem[]>("getInventory");
  }

  async getStock(): Promise<StockSnapshot[]> {
    return callAppsScript<StockSnapshot[]>("getStock");
  }

  async adjustInventory(input: AdjustInventoryInput): Promise<InventoryItem> {
    return callAppsScript<InventoryItem>("adjustInventory", input);
  }

  async getCustomers(): Promise<Customer[]> {
    return callAppsScript<Customer[]>("getCustomers");
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return callAppsScript<Customer | null>("getCustomer", id);
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    return callAppsScript<Customer>("createCustomer", input);
  }

  async updateCustomer(
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    return callAppsScript<Customer>("updateCustomer", id, input);
  }

  async deleteCustomer(id: string): Promise<void> {
    return callAppsScript<void>("deleteCustomer", id);
  }

  async getExpenses(): Promise<Expense[]> {
    return callAppsScript<Expense[]>("getExpenses");
  }

  async getExpense(id: string): Promise<Expense | null> {
    return callAppsScript<Expense | null>("getExpense", id);
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    return callAppsScript<Expense>("createExpense", input);
  }

  async updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
    return callAppsScript<Expense>("updateExpense", id, input);
  }

  async deleteExpense(id: string): Promise<void> {
    return callAppsScript<void>("deleteExpense", id);
  }

  async getSalesReport(criteria: ReportCriteria): Promise<SalesReport> {
    return callAppsScript<SalesReport>("getSalesReport", criteria);
  }

  async getInventoryReport(criteria: ReportCriteria): Promise<InventoryReport> {
    return callAppsScript<InventoryReport>("getInventoryReport", criteria);
  }
}
