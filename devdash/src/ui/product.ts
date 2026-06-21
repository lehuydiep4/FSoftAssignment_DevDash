import type { ProductSummary } from '../types';

export function renderProductCards(products: ProductSummary[]): string {
  if (products.length === 0) {
    return `
      <div class="col-span-full text-center py-16 px-5 bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-3xl animate-[fadeIn_0.4s_ease-out]">
        <span class="text-5xl block mb-4">🔍</span>
        <h3 class="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">No Products Found</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-[480px] mx-auto">We couldn't find any products matching your search criteria. Try a different search term or category filter!</p>
      </div>
    `;
  }

  return products
    .map(
      (product) => `
    <div class="product-card bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-3xl overflow-hidden flex flex-col transition-all duration-400 cursor-pointer relative hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-lg" data-id="${product.id}">
      <div class="relative w-full pt-[65%] bg-black/5 overflow-hidden">
        <img class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105" src="${product.thumbnail}" alt="${product.title}" loading="lazy">
        ${
          product.discountPercentage > 0
            ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md">-${Math.round(product.discountPercentage)}%</span>`
            : ''
        }
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">${product.brand}</span>
          <span class="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md capitalize">${product.category}</span>
        </div>
        <h3 class="font-display text-base font-semibold text-slate-900 dark:text-slate-50 mb-2 leading-snug line-clamp-1" title="${product.title}">${product.title}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-grow">${product.description}</p>
        <div class="flex justify-between items-center border-t border-slate-200/80 dark:border-white/6 pt-3.5 mt-auto">
          <div>
            <span class="font-display text-lg font-bold text-slate-900 dark:text-slate-50">$${product.price}</span>
          </div>
          <div class="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
            <span class="text-xs">⭐</span>
            <span class="text-[11px] font-bold text-amber-600 dark:text-amber-500">${product.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}
