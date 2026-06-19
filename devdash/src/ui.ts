import type { AppState } from './types';

/**
 * Renders the application UI based on the current state.
 */
export function renderApp(state: AppState, container: HTMLElement, onRetry: () => void): void {
  switch (state.status) {
    case 'idle':
      container.innerHTML = `
        <div class="status-msg">
          <p>Initializing application...</p>
        </div>
      `;
      break;

    case 'loading':
      // Render beautiful skeleton cards to wow the user
      const skeletons = Array.from({ length: 8 })
        .map(
          () => `
        <div class="product-card skeleton">
          <div class="skeleton-img shimmer"></div>
          <div class="product-info">
            <div class="skeleton-badge shimmer"></div>
            <div class="skeleton-title shimmer"></div>
            <div class="skeleton-desc shimmer"></div>
            <div class="skeleton-desc shimmer" style="width: 80%"></div>
            <div class="skeleton-footer">
              <div class="skeleton-price shimmer"></div>
              <div class="skeleton-rating shimmer"></div>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      container.innerHTML = `
        <div class="dashboard-layout">
          <header class="app-header">
            <div class="header-logo">
              <span class="logo-icon">⚡</span>
              <h1>DevDash</h1>
            </div>
            <p class="subtitle">Premium Async Developer Dashboard</p>
          </header>
          <div class="loading-bar shimmer"></div>
          <main class="app-main">
            <div class="products-grid">
              ${skeletons}
            </div>
          </main>
        </div>
      `;
      break;

    case 'error':
      container.innerHTML = `
        <div class="dashboard-layout">
          <header class="app-header">
            <div class="header-logo">
              <span class="logo-icon">⚡</span>
              <h1>DevDash</h1>
            </div>
          </header>
          <main class="app-main error-center">
            <div class="error-card">
              <div class="error-icon">⚠️</div>
              <h2>Failed to Load Dashboard</h2>
              <p class="error-msg">${state.errorMessage}</p>
              <button id="retry-btn" class="btn btn-primary">
                <span>🔄</span> Retry Connection
              </button>
            </div>
          </main>
        </div>
      `;
      // Bind event listener to the retry button
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', onRetry);
      }
      break;

    case 'success':
      const productCards = state.products
        .map(
          (product) => `
        <div class="product-card" data-id="${product.id}">
          <div class="product-img-wrapper">
            <img class="product-image" src="${product.thumbnail}" alt="${product.title}" loading="lazy">
            ${
              product.discountPercentage > 0
                ? `<span class="discount-badge">-${Math.round(product.discountPercentage)}%</span>`
                : ''
            }
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-brand">${product.brand}</span>
              <span class="product-category">${product.category}</span>
            </div>
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <div class="product-price">
                <span class="price-val">$${product.price}</span>
              </div>
              <div class="product-rating">
                <span class="star-icon">⭐</span>
                <span class="rating-val">${product.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      container.innerHTML = `
        <div class="dashboard-layout">
          <header class="app-header">
            <div class="header-logo">
              <span class="logo-icon">⚡</span>
              <h1>DevDash</h1>
            </div>
            <p class="subtitle">Premium Async Developer Dashboard</p>
          </header>
          
          <main class="app-main">
            <div class="stats-overview">
              <div class="stat-card">
                <span class="stat-icon">📦</span>
                <div class="stat-content">
                  <span class="stat-label">Total Products</span>
                  <span class="stat-value">${state.products.length}</span>
                </div>
              </div>
              <div class="stat-card">
                <span class="stat-icon">💰</span>
                <div class="stat-content">
                  <span class="stat-label">Avg Price</span>
                  <span class="stat-value">$${(
                    state.products.reduce((acc, p) => acc + p.price, 0) / state.products.length
                  ).toFixed(2)}</span>
                </div>
              </div>
              <div class="stat-card">
                <span class="stat-icon">⭐</span>
                <div class="stat-content">
                  <span class="stat-label">Top Rated</span>
                  <span class="stat-value">${Math.max(...state.products.map((p) => p.rating)).toFixed(
                    1
                  )}</span>
                </div>
              </div>
            </div>

            <div class="products-grid">
              ${productCards}
            </div>
          </main>
        </div>
      `;
      break;
  }
}
