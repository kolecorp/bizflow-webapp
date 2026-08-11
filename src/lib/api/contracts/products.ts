import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../types/products";

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
