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

const now = new Date().toISOString();
const mockUser: AuthUser = {
  id: "user-1",
  email: "admin@example.com",
  name: "Admin",
  role: "admin",
  createdAt: now,
};

const products: Product[] = [];
const customers: Customer[] = [];
const expenses: Expense[] = [];
const transactions: Transaction[] = [];
const inventoryItems: InventoryItem[] = [];

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export class MockProvider
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
    if (input.email !== mockUser.email || input.password !== "password") {
      throw new Error("Invalid credentials.");
    }
    return clone(mockUser);
  }

  async signOut(): Promise<void> {
    return;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return clone(mockUser);
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    callback(clone(mockUser));
    return () => {
      /* no-op */
    };
  }

  async getProducts(): Promise<Product[]> {
    return clone(products);
  }

  async getProduct(id: string): Promise<Product | null> {
    return clone(products.find((item) => item.id === id) ?? null);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: generateId("product"),
      active: true,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    products.push(product);
    return clone(product);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found.");
    }
    products[productIndex] = {
      ...products[productIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return clone(products[productIndex]);
  }

  async deleteProduct(id: string): Promise<void> {
    const index = products.findIndex((item) => item.id === id);
    if (index !== -1) {
      products.splice(index, 1);
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    return clone(transactions);
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    return clone(transactions.find((item) => item.id === id) ?? null);
  }

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: generateId("transaction"),
      items: input.items,
      customerId: input.customerId,
      subtotal: input.items.reduce((sum, item) => sum + item.totalPrice, 0),
      tax: input.tax ?? 0,
      discount: input.discount ?? 0,
      total:
        input.items.reduce((sum, item) => sum + item.totalPrice, 0) +
        (input.tax ?? 0) -
        (input.discount ?? 0),
      paymentMethod: input.paymentMethod,
      status: "completed",
      createdAt: now,
      updatedAt: now,
    };
    transactions.push(transaction);
    return clone(transaction);
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    const transactionIndex = transactions.findIndex((item) => item.id === id);
    if (transactionIndex === -1) {
      throw new Error("Transaction not found.");
    }
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return clone(transactions[transactionIndex]);
  }

  async deleteTransaction(id: string): Promise<void> {
    const index = transactions.findIndex((item) => item.id === id);
    if (index !== -1) {
      transactions.splice(index, 1);
    }
  }

  async getInventory(): Promise<InventoryItem[]> {
    return clone(inventoryItems);
  }

  async getStock(): Promise<StockSnapshot[]> {
    return inventoryItems.map((item) => ({
      productId: item.productId,
      available: item.quantity,
      reserved: 0,
      location: item.location,
    }));
  }

  async adjustInventory(input: AdjustInventoryInput): Promise<InventoryItem> {
    const existing = inventoryItems.find(
      (item) => item.productId === input.productId,
    );
    if (existing) {
      existing.quantity += input.quantity;
      existing.updatedAt = new Date().toISOString();
      return clone(existing);
    }

    const inventoryItem: InventoryItem = {
      id: generateId("inventory"),
      productId: input.productId,
      quantity: input.quantity,
      location: "default",
      createdAt: now,
      updatedAt: now,
    };
    inventoryItems.push(inventoryItem);
    return clone(inventoryItem);
  }

  async getCustomers(): Promise<Customer[]> {
    return clone(customers);
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return clone(customers.find((item) => item.id === id) ?? null);
  }

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const customer: Customer = {
      id: generateId("customer"),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    customers.push(customer);
    return clone(customer);
  }

  async updateCustomer(
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    const customerIndex = customers.findIndex((item) => item.id === id);
    if (customerIndex === -1) {
      throw new Error("Customer not found.");
    }
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return clone(customers[customerIndex]);
  }

  async deleteCustomer(id: string): Promise<void> {
    const index = customers.findIndex((item) => item.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
    }
  }

  async getExpenses(): Promise<Expense[]> {
    return clone(expenses);
  }

  async getExpense(id: string): Promise<Expense | null> {
    return clone(expenses.find((item) => item.id === id) ?? null);
  }

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const expense: Expense = {
      id: generateId("expense"),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    expenses.push(expense);
    return clone(expense);
  }

  async updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const expenseIndex = expenses.findIndex((item) => item.id === id);
    if (expenseIndex === -1) {
      throw new Error("Expense not found.");
    }
    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return clone(expenses[expenseIndex]);
  }

  async deleteExpense(id: string): Promise<void> {
    const index = expenses.findIndex((item) => item.id === id);
    if (index !== -1) {
      expenses.splice(index, 1);
    }
  }

  async getSalesReport(criteria: ReportCriteria): Promise<SalesReport> {
    const totalSales = transactions.reduce(
      (sum, transaction) => sum + transaction.total,
      0,
    );
    return {
      totalSales,
      totalTransactions: transactions.length,
      totalItems: transactions.reduce(
        (sum, transaction) => sum + transaction.items.length,
        0,
      ),
      totalTax: transactions.reduce(
        (sum, transaction) => sum + transaction.tax,
        0,
      ),
      totalDiscount: transactions.reduce(
        (sum, transaction) => sum + transaction.discount,
        0,
      ),
    };
  }

  async getInventoryReport(criteria: ReportCriteria): Promise<InventoryReport> {
    const productsInStock = inventoryItems.length;
    const lowStockCount = inventoryItems.filter(
      (item) => item.quantity <= 5,
    ).length;
    const totalValue = inventoryItems.reduce(
      (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
      0,
    );

    return {
      productsInStock,
      lowStockCount,
      totalValue,
    };
  }
}
