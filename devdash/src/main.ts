import './style.css';
import { ProductRepositoryImpl } from './data/repositories/product.repository.impl';
import { getState, setState, subscribe } from './state';
import { renderApp } from './ui';
import type { UiCallbacks } from './ui';
import { debounce } from './utils';

// Initialize the data repository
const productRepository = new ProductRepositoryImpl();

// Get references to app container
const appContainer = document.querySelector<HTMLDivElement>('#app')!;

/**
 * Controller function to load dashboard data asynchronously.
 */
async function loadDashboard(): Promise<void> {
  setState({ status: 'loading' });

  try {
    // Fetch products and categories in parallel (Promise.all)
    const [products, categories] = await Promise.all([
      productRepository.getProducts(),
      productRepository.getCategories(),
    ]);

    setState({
      status: 'success',
      products,
      categories,
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'default',
      selectedProductId: null,
      selectedProductDetails: null,
      detailsStatus: 'idle',
      detailsError: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setState({ status: 'error', errorMessage: message });
  }
}

/**
 * Asynchronously fetches product details and updates the state.
 * Handles silent fallback when cached/local details are available during a fetch error.
 */
async function fetchProductDetailsAndRevalidate(id: number, hasLocalCache: boolean): Promise<void> {
  try {
    const details = await productRepository.getProductById(id);
    
    const updatedState = getState();
    if (updatedState.status === 'success' && updatedState.selectedProductId === id) {
      setState({
        ...updatedState,
        detailsStatus: 'success',
        selectedProductDetails: details,
      });
    }
  } catch (error) {
    const updatedState = getState();
    if (updatedState.status === 'success' && updatedState.selectedProductId === id) {
      if (hasLocalCache) {
        // If we already have the local details visible, fallback to success silently so the modal stays open with valid data
        setState({
          ...updatedState,
          detailsStatus: 'success',
        });
      } else {
        // If no cached details exist, show full error screen inside the modal
        const message = error instanceof Error ? error.message : 'Failed to load details';
        setState({
          ...updatedState,
          detailsStatus: 'error',
          detailsError: message,
        });
      }
    }
  }
}

// Handler functions for user interactions
const callbacks: UiCallbacks = {
  onRetry: loadDashboard,
  onSearchChange: debounce((query: string) => {
    const state = getState();
    if (state.status === 'success') {
      setState({ ...state, searchQuery: query });
    }
  }, 250),
  onSearchClear: () => {
    const state = getState();
    if (state.status === 'success') {
      setState({ ...state, searchQuery: '' });
    }
  },
  onCategoryChange: (category: string) => {
    const state = getState();
    if (state.status === 'success') {
      setState({ ...state, selectedCategory: category });
    }
  },
  onSortChange: (sortBy: string) => {
    const state = getState();
    if (state.status === 'success') {
      setState({ ...state, sortBy });
    }
  },
  onSelectProduct: async (id: number | null) => {
    const state = getState();
    if (state.status !== 'success') return;

    if (id === null) {
      setState({
        ...state,
        selectedProductId: null,
        selectedProductDetails: null,
        detailsStatus: 'idle',
        detailsError: null,
      });
      return;
    }

    // SWR Pattern: Try to find product details locally from the list first
    const localProduct = state.products.find((p) => p.id === id);

    setState({
      ...state,
      selectedProductId: id,
      selectedProductDetails: localProduct || null,
      detailsStatus: localProduct ? 'revalidating' : 'loading',
      detailsError: null,
    });

    await fetchProductDetailsAndRevalidate(id, !!localProduct);
  },
};

// Subscribe to state changes and trigger render
subscribe(() => {
  renderApp(getState(), appContainer, callbacks);
});

// Bootstrap application - trigger initial load with top-level await
await loadDashboard();
