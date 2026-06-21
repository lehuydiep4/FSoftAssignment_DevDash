import type { Product } from '../../domain/entities/product';
import type { Category } from '../../domain/entities/category';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { mapDtoToEntity } from '../models/product.model';
import type { ApiProductResponse, ProductDto } from '../models/product.model';
import { mapCategoryDtoToEntity } from '../models/category.model';
import type { CategoryDto } from '../models/category.model';
import { fetchJson } from '../../api';

export class ProductRepositoryImpl implements ProductRepository {
  private readonly baseUrl = 'https://dummyjson.com';

  async getProducts(): Promise<Product[]> {
    const data = await fetchJson<ApiProductResponse>(`${this.baseUrl}/products`);
    return data.products.map(mapDtoToEntity);
  }

  async getProductById(id: number): Promise<Product> {
    const data = await fetchJson<ProductDto>(`${this.baseUrl}/products/${id}`);
    return mapDtoToEntity(data);
  }

  async getCategories(): Promise<Category[]> {
    const data = await fetchJson<CategoryDto[]>(`${this.baseUrl}/products/categories`);
    return data.map(mapCategoryDtoToEntity);
  }
}
