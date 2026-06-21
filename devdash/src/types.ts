import type { Product } from './domain/entities/product';
import type { Category } from './domain/entities/category';

/**
 * ProductSummary is a utility type representing a preview of the Product.
 * Uses `Pick` utility type to select only properties relevant to the list grid.
 */
export type ProductSummary = Pick<
  Product,
  | 'id'
  | 'title'
  | 'description'
  | 'price'
  | 'discountPercentage'
  | 'rating'
  | 'brand'
  | 'category'
  | 'thumbnail'
>;

/**
 * Discriminated union driving the product detail modal state.
 * Solves the illegal state representation problem (e.g. details status success but details data null).
 */
export type DetailsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Product }
  | { status: 'revalidating'; data: Product }
  | { status: 'error'; errorMessage: string; data?: Product };

export interface SuccessState {
  status: 'success';
  products: Product[];
  categories: Category[];
  
  // Day 4: Search + filter/sort
  searchQuery: string;
  selectedCategory: string; // 'all' or slug
  sortBy: string; // 'default' | 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc' | 'rating-desc'
  
  // Day 5 & 6: Detail view & substate discriminated union
  selectedProductId: number | null;
  details: DetailsState;
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | SuccessState
  | { status: 'error'; errorMessage: string };

/**
 * Utility type representing safe updates to SuccessState.
 * Employs `Partial` and `Omit` utility types to lock status and primary fetched list.
 */
export type SuccessStateUpdates = Partial<Omit<SuccessState, 'status' | 'products' | 'categories'>>;

/**
 * Exhaustive type assertion helper for compile-time narrowing enforcement.
 */
export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${JSON.stringify(x)}`);
}

