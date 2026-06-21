import type { ProductRepository } from '../../domain/repositories/product.repository';
import { getState, setState, updateSuccessState } from '../../state';
import type { Product } from '../../domain/entities/product';
import { LocalStorageCache } from '../../utils';

export class DashboardService {
  private readonly productRepository: ProductRepository;
  private readonly productCache: LocalStorageCache<Product>;

  constructor(
    productRepository: ProductRepository,
    productCache: LocalStorageCache<Product>
  ) {
    this.productRepository = productRepository;
    this.productCache = productCache;
  }

  /**
   * Controller function to load dashboard data asynchronously.
   */
  async loadDashboard(): Promise<void> {
    setState({ status: 'loading' });

    try {
      // Fetch products and categories in parallel (Promise.all)
      const [products, categories] = await Promise.all([
        this.productRepository.getProducts(),
        this.productRepository.getCategories(),
      ]);

      setState({
        status: 'success',
        products,
        categories,
        searchQuery: '',
        selectedCategory: 'all',
        sortBy: 'default',
        selectedProductId: null,
        details: { status: 'idle' },
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
  private async fetchProductDetailsAndRevalidate(id: number, hasLocalCache: boolean): Promise<void> {
    try {
      const details = await this.productRepository.getProductById(id);
      
      // Save to the cache
      this.productCache.set(id, details);

      const updatedState = getState();
      if (updatedState.status === 'success' && updatedState.selectedProductId === id) {
        updateSuccessState({
          details: { status: 'success', data: details },
        });
      }
    } catch (error) {
      const updatedState = getState();
      if (updatedState.status === 'success' && updatedState.selectedProductId === id) {
        const currentDetails = updatedState.details;
        
        if (hasLocalCache && (currentDetails.status === 'revalidating' || currentDetails.status === 'success')) {
          // Fall back to success with cached details, keeping the UI intact
          updateSuccessState({
            details: { status: 'success', data: currentDetails.data },
          });
        } else {
          // Full error screen inside the modal
          const message = error instanceof Error ? error.message : 'Failed to load details';
          updateSuccessState({
            details: { status: 'error', errorMessage: message },
          });
        }
      }
    }
  }

  /**
   * Handles selection of a product, executing the SWR (Stale-While-Revalidate) pattern.
   */
  async selectProduct(id: number | null): Promise<void> {
    const state = getState();
    if (state.status !== 'success') return;

    if (id === null) {
      updateSuccessState({
        selectedProductId: null,
        details: { status: 'idle' },
      });
      return;
    }

    // SWR Pattern: check localStorage cache first, then state.products list
    let cachedProduct = this.productCache.get(id);
    let isRevalidating = false;

    if (cachedProduct) {
      isRevalidating = true;
    } else {
      const basicProduct = state.products.find((p) => p.id === id);
      if (basicProduct) {
        cachedProduct = basicProduct;
        isRevalidating = true;
      }
    }

    updateSuccessState({
      selectedProductId: id,
      details: cachedProduct
        ? { status: 'revalidating', data: cachedProduct }
        : { status: 'loading' },
    });

    await this.fetchProductDetailsAndRevalidate(id, isRevalidating);
  }
}
