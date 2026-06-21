import type { AppState } from './types';
import { renderLoadingView } from './ui/loader';
import { renderErrorView } from './ui/error';
import { renderSuccessState } from './ui/success';

export interface UiCallbacks {
  onRetry: () => void;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string) => void;
  onSelectProduct: (id: number | null) => void;
}

/**
 * Renders the application in the idle state.
 */
function renderIdleState(container: HTMLElement): void {
  container.innerHTML = `
    <div class="status-msg text-center py-10">
      <p class="text-slate-500 dark:text-slate-400">Initializing application...</p>
    </div>
  `;
}

/**
 * Renders the application in the loading state.
 */
function renderLoadingState(container: HTMLElement): void {
  container.innerHTML = renderLoadingView();
}

/**
 * Renders the application in the error state.
 */
function renderErrorState(container: HTMLElement, errorMessage: string, onRetry: () => void): void {
  container.innerHTML = renderErrorView(errorMessage);
  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', onRetry);
  }
}

/**
 * Main render function that handles routing to corresponding state renderer functions.
 */
export function renderApp(state: AppState, container: HTMLElement, callbacks: UiCallbacks): void {
  switch (state.status) {
    case 'idle':
      renderIdleState(container);
      break;

    case 'loading':
      renderLoadingState(container);
      break;

    case 'error':
      renderErrorState(container, state.errorMessage, callbacks.onRetry);
      break;

    case 'success':
      renderSuccessState(state, container, callbacks);
      break;
  }
}
