import type { Product } from '../../domain/entities/product';

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ApiProductResponse {
  products: ProductDto[];
  total: number;
  skip: number;
  limit: number;
}

export function mapDtoToEntity(dto: ProductDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    price: dto.price,
    discountPercentage: dto.discountPercentage,
    rating: dto.rating,
    stock: dto.stock,
    brand: dto.brand || 'Generic',
    category: dto.category,
    thumbnail: dto.thumbnail,
    images: dto.images,
  };
}
