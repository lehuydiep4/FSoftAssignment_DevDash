import type { Product } from '../../domain/entities/product';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { mapDtoToEntity } from '../models/product.model';
import type { ApiProductResponse, ProductDto } from '../models/product.model';
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
}
