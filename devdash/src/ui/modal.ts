import type { SuccessState } from '../types';

/**
 * Renders the top status indicator bar for SWR revalidation or error fallback.
 */
export function renderModalStatusBarHtml(status: string, hasDetails: boolean): string {
  if (status === 'revalidating') {
    return `
      <div id="modal-status-bar" class="absolute top-0 left-0 w-full h-1 bg-indigo-500/10 overflow-hidden rounded-t-3xl" title="Syncing details in background...">
        <div class="w-1/2 h-full bg-indigo-500 rounded-full animate-loadingBar"></div>
      </div>
    `;
  }
  if (status === 'error' && hasDetails) {
    return `
      <div id="modal-status-bar" class="absolute top-0 left-0 w-full h-1 bg-amber-500/25 overflow-hidden rounded-t-3xl" title="Failed to sync latest details from server. Displaying cached information.">
        <div class="w-full h-full bg-amber-500"></div>
      </div>
    `;
  }
  return '';
}

/**
 * Renders only the inner body HTML of the modal.
 */
export function renderModalBodyHtml(state: SuccessState): string {
  // 1. Show skeleton loader only if we have no details cached and status is loading
  if (state.detailsStatus === 'loading' && !state.selectedProductDetails) {
    return `
      <div class="animate-pulse">
        <div class="shimmer h-[300px] rounded-2xl mb-5"></div>
        <div class="shimmer w-1/2 h-7 rounded-lg mb-4"></div>
        <div class="shimmer h-4 rounded-lg mb-2"></div>
        <div class="shimmer h-4 rounded-lg mb-2"></div>
        <div class="shimmer w-3/5 h-4 rounded-lg mb-6"></div>
        <div class="flex gap-4">
          <div class="shimmer w-[120px] h-9 rounded-lg"></div>
          <div class="shimmer w-[90px] h-9 rounded-lg"></div>
        </div>
      </div>
    `;
  } 
  
  // 2. Show full-screen error inside the modal only if we have no details cached and status is error
  if (state.detailsStatus === 'error' && !state.selectedProductDetails) {
    return `
      <div class="text-center py-10 px-5">
        <div class="text-5xl mb-4">⚠️</div>
        <h3 class="font-display text-slate-900 dark:text-slate-50 text-xl font-bold mb-2">Failed to Load Product Details</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6">${state.detailsError || 'An unexpected error occurred'}</p>
        <div class="flex justify-center gap-3">
          <button id="modal-retry-btn" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-300">🔄 Retry Connection</button>
          <button id="modal-close-btn-error" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold cursor-pointer border border-slate-200 dark:border-white/6 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">Close</button>
        </div>
      </div>
    `;
  } 
  
  // 3. Render cached or updated product details
  if (state.selectedProductDetails) {
    const product = state.selectedProductDetails;
    const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
    
    // Generate image gallery thumbnails
    const imagesHtml = product.images
      .map(
        (img, idx) => `
      <img class="gallery-thumb w-14 h-14 object-cover rounded-lg border-2 border-transparent cursor-pointer bg-white dark:bg-slate-800 transition-all hover:-translate-y-0.5 ${idx === 0 ? 'active border-indigo-500 shadow-md' : ''}" src="${img}" alt="${product.title} image ${idx + 1}" data-index="${idx}">
    `
      )
      .join('');

    const isLowStock = product.stock < 10;
    const stockStatusText = isLowStock ? `Only ${product.stock} left in stock!` : `${product.stock} in stock`;
    const stockClass = isLowStock ? 'text-red-500' : 'text-emerald-500 dark:text-emerald-400';

    return `
      <div class="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 mt-2">
        <div class="flex flex-col gap-4">
          <div class="relative w-full pt-[75%] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/6 bg-black/5 dark:bg-white/5">
            <img id="modal-main-image" class="absolute top-0 left-0 w-full h-full object-contain p-3 box-border" src="${product.thumbnail}" alt="${product.title}">
          </div>
          <div class="flex gap-2.5 overflow-x-auto pb-1">
            ${imagesHtml}
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">${product.brand}</span>
            <span class="text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md capitalize">${product.category}</span>
          </div>
          <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 leading-tight">${product.title}</h2>
          
          <div class="flex justify-between items-center border-b border-slate-200/80 dark:border-white/6 pb-4">
            <div class="flex items-baseline gap-2">
              <span class="font-display text-3xl font-extrabold text-slate-900 dark:text-slate-50">$${product.price}</span>
              ${
                product.discountPercentage > 0
                  ? `<span class="text-lg text-slate-400 dark:text-slate-500 line-through">$${originalPrice}</span>
                     <span class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">-${Math.round(product.discountPercentage)}%</span>`
                  : ''
              }
            </div>
            <div class="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md">
              <span class="text-sm">⭐</span>
              <span class="text-xs font-bold text-amber-600 dark:text-amber-500">${product.rating.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <h4 class="font-display text-sm font-bold text-slate-900 dark:text-slate-50 mb-1.5">Description</h4>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">${product.description}</p>
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200/80 dark:border-white/6 pt-4 mt-2">
            <div class="flex justify-between text-xs pb-2 border-b border-dashed border-slate-100 dark:border-white/4">
              <span class="text-slate-500 dark:text-slate-400 font-medium">Availability Status</span>
              <span class="font-bold ${stockClass}">${stockStatusText}</span>
            </div>
            <div class="flex justify-between text-xs pb-2 border-b border-dashed border-slate-100 dark:border-white/4">
              <span class="text-slate-500 dark:text-slate-400 font-medium">Brand</span>
              <span class="text-slate-900 dark:text-slate-50 font-bold">${product.brand}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400 font-medium">Category</span>
              <span class="text-slate-900 dark:text-slate-50 font-bold capitalize">${product.category}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

/**
 * Renders the full modal overlay structure.
 */
export function renderModalContent(state: SuccessState): string {
  if (state.selectedProductId === null) return '';

  const bodyHtml = renderModalBodyHtml(state);
  const statusBarHtml = renderModalStatusBarHtml(state.detailsStatus, state.selectedProductDetails !== null);

  return `
    <div class="fixed top-0 left-0 w-screen h-screen bg-slate-950/70 backdrop-blur-md z-[1000] flex items-center justify-center p-5 box-border animate-[fadeIn_0.3s_ease-out]" id="product-modal-overlay">
      <div id="modal-card-box" class="bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl rounded-3xl w-full max-w-3xl max-h-[calc(100vh-40px)] overflow-y-auto relative animate-[scaleUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)] p-8">
        
        <!-- Top Status Bars (SWR) -->
        ${statusBarHtml}

        <button id="modal-close-btn" class="absolute top-5 right-5 bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 text-slate-900 dark:text-slate-50 text-xl w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition-all hover:rotate-90 hover:border-indigo-500 hover:text-indigo-500 hover:shadow-sm z-10" aria-label="Close details">&times;</button>
        <div class="modal-body">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}
