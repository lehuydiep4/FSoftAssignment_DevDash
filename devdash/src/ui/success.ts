import type { SuccessState } from '../types';
import type { Product } from '../domain/entities/product';
import type { UiCallbacks } from '../ui';
import { renderStatsOverview } from './stats';
import { renderProductCards } from './product';
import { renderModalContent, renderModalBodyHtml, renderModalStatusBarHtml } from './modal';

/**
 * Filters and sorts the list of products based on search query, category, and sorting criteria.
 */
function getFilteredAndSortedProducts(
  products: Product[],
  searchQuery: string,
  selectedCategory: string,
  sortBy: string
): Product[] {
  const query = searchQuery.toLowerCase().trim();
  const filtered = products
    .filter((p) => {
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    })
    .filter((p) => {
      return selectedCategory === 'all' || p.category === selectedCategory;
    });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    return 0; // default
  });
}

/**
 * Binds DOM event listeners for search input, selectors, product list grid, and details modal.
 */
function bindSuccessEventListeners(
  container: HTMLElement,
  callbacks: UiCallbacks,
  state: SuccessState
): void {
  const searchInput = container.querySelector('#search-input') as HTMLInputElement | null;
  const searchClearBtn = container.querySelector('#search-clear-btn') as HTMLButtonElement | null;
  const categorySelect = container.querySelector('#category-select') as HTMLSelectElement | null;
  const sortSelect = container.querySelector('#sort-select') as HTMLSelectElement | null;
  const productsGridCont = container.querySelector('#products-grid-container') as HTMLElement | null;
  const modalContainer = container.querySelector('#modal-container') as HTMLElement | null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      callbacks.onSearchChange(val);
      if (searchClearBtn) {
        if (val) {
          searchClearBtn.classList.remove('hidden');
          searchClearBtn.classList.add('flex');
        } else {
          searchClearBtn.classList.add('hidden');
          searchClearBtn.classList.remove('flex');
        }
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.classList.add('hidden');
      searchClearBtn.classList.remove('flex');
      callbacks.onSearchClear();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      callbacks.onCategoryChange((e.target as HTMLSelectElement).value);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      callbacks.onSortChange((e.target as HTMLSelectElement).value);
    });
  }

  if (productsGridCont) {
    productsGridCont.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest('.product-card') as HTMLElement | null;
      if (card) {
        const idAttr = card.dataset.id;
        if (idAttr) {
          callbacks.onSelectProduct(Number.parseInt(idAttr, 10));
        }
      }
    });
  }

  if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('gallery-thumb')) {
        const mainImg = modalContainer.querySelector('#modal-main-image') as HTMLImageElement;
        if (mainImg) {
          mainImg.src = target.getAttribute('src') || '';
        }
        
        modalContainer.querySelectorAll('.gallery-thumb').forEach((t) => {
          t.classList.remove('active', 'border-indigo-500', 'shadow-md');
        });
        target.classList.add('active', 'border-indigo-500', 'shadow-md');
      }
      
      if (
        target.id === 'modal-close-btn' ||
        target.id === 'modal-close-btn-error' ||
        target.classList.contains('modal-close-btn')
      ) {
        callbacks.onSelectProduct(null);
      }
      
      if (target.id === 'product-modal-overlay') {
        callbacks.onSelectProduct(null);
      }

      if (target.id === 'modal-retry-btn') {
        callbacks.onSelectProduct(state.selectedProductId);
      }
    });
  }
}

/**
 * Performs a complete initial render of the success dashboard layout.
 */
function renderFullSuccessLayout(
  state: SuccessState,
  container: HTMLElement,
  callbacks: UiCallbacks,
  sortedProducts: Product[]
): void {
  container.innerHTML = `
    <div class="w-full max-w-6xl mx-auto bg-white/45 dark:bg-slate-900/45 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-3xl shadow-lg p-8 min-h-[calc(100vh-48px)] flex flex-col gap-7 animate-[fadeIn_0.6s_ease-out]">
      <header class="border-b border-slate-200/80 dark:border-white/6 pb-5">
        <div class="flex items-center gap-3">
          <span class="text-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">⚡</span>
          <h1 class="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">DevDash</h1>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">Premium Async Developer Dashboard</p>
      </header>
      
      <!-- Controls Bar -->
      <div class="flex flex-wrap justify-between items-center gap-5 bg-white/45 dark:bg-slate-900/45 border border-white/60 dark:border-white/5 rounded-2xl p-4 md:px-6 mb-2 backdrop-blur-md">
        <div class="relative flex-grow min-w-[280px] flex items-center">
          <span class="absolute left-3.5 text-slate-500 dark:text-slate-400 text-sm pointer-events-none">🔍</span>
          <input type="text" id="search-input" class="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200/80 dark:border-white/6 bg-white/75 dark:bg-slate-800/55 text-slate-900 dark:text-slate-50 font-sans text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" placeholder="Search products, brands..." value="${state.searchQuery}">
          <button id="search-clear-btn" class="absolute right-3.5 bg-none border-none text-slate-500 dark:text-slate-400 text-lg cursor-pointer hidden items-center justify-center w-5 h-5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 transition-all ${state.searchQuery ? 'flex' : 'hidden'}" style="outline: none;">&times;</button>
        </div>
        
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <label for="category-select" class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
            <select id="category-select" class="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/6 bg-white/75 dark:bg-slate-800/55 text-slate-900 dark:text-slate-50 font-sans text-sm font-medium cursor-pointer transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-w-[160px]">
              <option value="all">All Categories</option>
              ${state.categories
                .map(
                  (cat) => `
                <option value="${cat.slug}" ${state.selectedCategory === cat.slug ? 'selected' : ''}>${cat.name}</option>
              `
                )
                .join('')}
            </select>
          </div>
          
          <div class="flex items-center gap-2">
            <label for="sort-select" class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sort By</label>
            <select id="sort-select" class="pl-4 pr-10 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/6 bg-white/75 dark:bg-slate-800/55 text-slate-900 dark:text-slate-50 font-sans text-sm font-medium cursor-pointer transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 min-w-[160px]">
              <option value="default" ${state.sortBy === 'default' ? 'selected' : ''}>Default</option>
              <option value="title-asc" ${state.sortBy === 'title-asc' ? 'selected' : ''}>Name: A to Z</option>
              <option value="title-desc" ${state.sortBy === 'title-desc' ? 'selected' : ''}>Name: Z to A</option>
              <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating-desc" ${state.sortBy === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <main class="flex flex-col gap-6">
        <!-- Stats Overview -->
        <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-2" id="stats-overview-container">
          ${renderStatsOverview(sortedProducts)}
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6" id="products-grid-container">
          ${renderProductCards(sortedProducts)}
        </div>
      </main>
    </div>
    
    <!-- Modal Container -->
    <div id="modal-container">
      ${renderModalContent(state)}
    </div>
  `;

  bindSuccessEventListeners(container, callbacks, state);
}

/**
 * Updates stats overview and product grid containers inside the DOM.
 */
function updateStatsAndProducts(container: HTMLElement, sortedProducts: Product[]): void {
  const statsOverviewCont = container.querySelector('#stats-overview-container') as HTMLElement | null;
  const productsGridCont = container.querySelector('#products-grid-container') as HTMLElement | null;

  if (statsOverviewCont) {
    statsOverviewCont.innerHTML = renderStatsOverview(sortedProducts);
  }

  if (productsGridCont) {
    productsGridCont.innerHTML = renderProductCards(sortedProducts);
  }
}

/**
 * Updates the details modal state or renders the initial modal container content.
 */
function updateModal(state: SuccessState, modalCont: HTMLElement): void {
  const existingOverlay = modalCont.querySelector('#product-modal-overlay');
  if (!existingOverlay || state.selectedProductId === null) {
    modalCont.innerHTML = renderModalContent(state);
    return;
  }

  const modalBody = existingOverlay.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = renderModalBodyHtml(state);
  }
  
  const modalBox = existingOverlay.querySelector('#modal-card-box');
  if (modalBox) {
    const existingBar = modalBox.querySelector('#modal-status-bar');
    if (existingBar) {
      existingBar.remove();
    }
    const newBarHtml = renderModalStatusBarHtml(state.detailsStatus, state.selectedProductDetails !== null);
    if (newBarHtml) {
      modalBox.insertAdjacentHTML('afterbegin', newBarHtml);
    }
  }
}

/**
 * Syncs the search query input and clear button state.
 */
function syncSearchInput(
  state: SuccessState,
  searchInput: HTMLInputElement | null,
  searchClearBtn: HTMLButtonElement | null
): void {
  if (!searchInput || searchInput.value === state.searchQuery) return;

  searchInput.value = state.searchQuery;
  if (searchClearBtn) {
    if (state.searchQuery) {
      searchClearBtn.classList.remove('hidden');
      searchClearBtn.classList.add('flex');
    } else {
      searchClearBtn.classList.add('hidden');
      searchClearBtn.classList.remove('flex');
    }
  }
}

/**
 * Syncs active selection values for the category and sorting selects.
 */
function syncSelects(
  state: SuccessState,
  categorySelect: HTMLSelectElement | null,
  sortSelect: HTMLSelectElement | null
): void {
  if (categorySelect && categorySelect.value !== state.selectedCategory) {
    categorySelect.value = state.selectedCategory;
  }

  if (sortSelect && sortSelect.value !== state.sortBy) {
    sortSelect.value = state.sortBy;
  }
}

/**
 * Updates individual components within the existing success layout, preventing visual flickering and conserving input focus.
 */
function updateSuccessLayout(
  state: SuccessState,
  container: HTMLElement,
  sortedProducts: Product[]
): void {
  updateStatsAndProducts(container, sortedProducts);

  const modalCont = container.querySelector('#modal-container') as HTMLElement | null;
  if (modalCont) {
    updateModal(state, modalCont);
  }

  const searchInput = container.querySelector('#search-input') as HTMLInputElement | null;
  const searchClearBtn = container.querySelector('#search-clear-btn') as HTMLButtonElement | null;
  const categorySelect = container.querySelector('#category-select') as HTMLSelectElement | null;
  const sortSelect = container.querySelector('#sort-select') as HTMLSelectElement | null;

  syncSearchInput(state, searchInput, searchClearBtn);
  syncSelects(state, categorySelect, sortSelect);
}

/**
 * Entrypoint helper for success state rendering.
 */
export function renderSuccessState(
  state: SuccessState,
  container: HTMLElement,
  callbacks: UiCallbacks
): void {
  const sortedProducts = getFilteredAndSortedProducts(
    state.products,
    state.searchQuery,
    state.selectedCategory,
    state.sortBy
  );

  const gridContainer = container.querySelector('#products-grid-container');
  const isOuterRendered = gridContainer !== null;

  if (isOuterRendered) {
    updateSuccessLayout(state, container, sortedProducts);
  } else {
    renderFullSuccessLayout(state, container, callbacks, sortedProducts);
  }
}
