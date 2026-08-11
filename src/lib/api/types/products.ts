export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku?: string;
  category?: string;
  price: number;
  cost?: number;
  stock?: number;
  description?: string;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  description?: string;
  active?: boolean;
}
