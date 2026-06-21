import type { Category } from '../../domain/entities/category';

export interface CategoryDto {
  slug: string;
  name: string;
  url: string;
}

export function mapCategoryDtoToEntity(dto: CategoryDto): Category {
  return {
    slug: dto.slug,
    name: dto.name,
    url: dto.url,
  };
}
