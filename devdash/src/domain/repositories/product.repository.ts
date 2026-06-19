import type { Product } from '../entities/product';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product>;
}
