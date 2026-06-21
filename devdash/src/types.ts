import type { Product } from './domain/entities/product';
import type { Category } from './domain/entities/category';

export interface SuccessState {
  status: 'success';
  products: Product[];
  categories: Category[];
  
  // Day 4: Search + filter/sort
  searchQuery: string;
  selectedCategory: string; // 'all' or slug
  sortBy: string; // 'default' | 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc' | 'rating-desc'
  
  // Day 5: Detail view
  selectedProductId: number | null;
  selectedProductDetails: Product | null;
  detailsStatus: 'idle' | 'loading' | 'success' | 'error' | 'revalidating';
  detailsError: string | null;
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | SuccessState
  | { status: 'error'; errorMessage: string };
