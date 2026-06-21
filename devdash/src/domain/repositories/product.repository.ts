import type { Product } from '../entities/product';
import type { Category } from '../entities/category';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product>;
  getCategories(): Promise<Category[]>;
}
