import type { Product } from './domain/entities/product';

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: Product[] }
  | { status: 'error'; errorMessage: string };
