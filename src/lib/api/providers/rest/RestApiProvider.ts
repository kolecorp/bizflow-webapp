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
  ReportCriteria,
  SalesReport,
  InventoryReport,
} from "../../types/index";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }

  return response.json();
}

export class RestApiProvider
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
    return request<AuthUser>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async signOut(): Promise<void> {
    await request<void>("/api/auth/signout", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return request<AuthUser | null>("/api/auth/me");
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    throw new Error(
      "onAuthStateChanged is not supported in the REST adapter yet.",
    );
  }

  async getProducts(): Promise<Product[]> {
    return request<Product[]>("/api/products");
  }

  async getProduct(id: string): Promise<Product | null> {
    return request<Product | null>(`/api/products/${id}`);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return request<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await request<void>(`/api/products/${id}`, {
      method: "DELETE",
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    return request<Transaction[]>("/api/transactions");
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return request<Transaction | null>(`/api/transactions/${id}`);
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    return request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    return request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await request<void>(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  }

  async getInventory(): Promise<InventoryItem[]> {
    return request<InventoryItem[]>("/api/inventory");
  }

  async getStock(): Promise<StockSnapshot[]> {
    return request<StockSnapshot[]>("/api/inventory/stock");
  }

  async adjustInventory(input: AdjustInventoryInput): Promise<InventoryItem> {
    return request<InventoryItem>("/api/inventory", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getCustomers(): Promise<Customer[]> {
    return request<Customer[]>("/api/customers");
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return request<Customer | null>(`/api/customers/${id}`);
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    return request<Customer>("/api/customers", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateCustomer(
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    return request<Customer>(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await request<void>(`/api/customers/${id}`, {
      method: "DELETE",
    });
  }

  async getExpenses(): Promise<Expense[]> {
    return request<Expense[]>("/api/expenses");
  }

  async getExpense(id: string): Promise<Expense | null> {
    return request<Expense | null>(`/api/expenses/${id}`);
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    return request<Expense>("/api/expenses", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
    return request<Expense>(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  async deleteExpense(id: string): Promise<void> {
    await request<void>(`/api/expenses/${id}`, {
      method: "DELETE",
    });
  }

  async getSalesReport(criteria: ReportCriteria): Promise<SalesReport> {
    return request<SalesReport>("/api/reports/sales", {
      method: "POST",
      body: JSON.stringify(criteria),
    });
  }

  async getInventoryReport(criteria: ReportCriteria): Promise<InventoryReport> {
    return request<InventoryReport>("/api/reports/inventory", {
      method: "POST",
      body: JSON.stringify(criteria),
    });
  }
}
