import './style.css';
import { ProductRepositoryImpl } from './data/repositories/product.repository.impl';
import { getState, setState, subscribe } from './state';
import { renderApp } from './ui';

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
    const products = await productRepository.getProducts();
    setState({ status: 'success', products });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setState({ status: 'error', errorMessage: message });
  }
}

// Subscribe to state changes and trigger render
subscribe(() => {
  renderApp(getState(), appContainer, loadDashboard);
});

// Bootstrap application - trigger initial load
loadDashboard();
