import './style.css';
import { ProductRepositoryImpl } from './data/repositories/product.repository.impl';
import { getState, subscribe, updateSuccessState } from './state';
import { renderApp } from './ui';
import type { UiCallbacks } from './ui';
import { debounce, LocalStorageCache } from './utils';
import type { Product } from './domain/entities/product';
import { DashboardService } from './application/services/dashboard.service';

// --- Composition Root ---

// Initialize repositories
const productRepository = new ProductRepositoryImpl();

// Initialize generic localStorage cache with a constraint (caching product details for 10 minutes)
const productCache = new LocalStorageCache<Product>('devdash_product_details_cache', 10);

// Initialize application services
const dashboardService = new DashboardService(productRepository, productCache);

// Get references to app container
const appContainer = document.querySelector<HTMLDivElement>('#app')!;

// Handler functions for user interactions, delegating to the service or state updates
const callbacks: UiCallbacks = {
  onRetry: () => dashboardService.loadDashboard(),
  onSearchChange: debounce((query: string) => {
    updateSuccessState({ searchQuery: query });
  }, 250),
  onSearchClear: () => {
    updateSuccessState({ searchQuery: '' });
  },
  onCategoryChange: (category: string) => {
    updateSuccessState({ selectedCategory: category });
  },
  onSortChange: (sortBy: string) => {
    updateSuccessState({ sortBy });
  },
  onSelectProduct: (id: number | null) => {
    // Fire and forget asynchronous call
    void dashboardService.selectProduct(id);
  },
};

// Subscribe to state changes and trigger render
subscribe(() => {
  renderApp(getState(), appContainer, callbacks);
});

// Bootstrap application - trigger initial load with top-level await
await dashboardService.loadDashboard();
