import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customers";

export interface CustomerRepository {
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(input: CreateCustomerInput): Promise<Customer>;
  updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer>;
  deleteCustomer(id: string): Promise<void>;
}
