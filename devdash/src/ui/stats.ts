import type { Product } from '../domain/entities/product';

export function renderStatsOverview(products: Product[]): string {
  const count = products.length;
  const avgPrice = count > 0 ? products.reduce((acc, p) => acc + p.price, 0) / count : 0;
  const topRated = count > 0 ? Math.max(...products.map((p) => p.rating)) : 0;

  return `
    <div class="bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
      <span class="text-3xl w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">📦</span>
      <div class="flex flex-col">
        <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Results</span>
        <span class="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">${count}</span>
      </div>
    </div>
    <div class="bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
      <span class="text-3xl w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">💰</span>
      <div class="flex flex-col">
        <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Price</span>
        <span class="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">$${avgPrice.toFixed(2)}</span>
      </div>
    </div>
    <div class="bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md">
      <span class="text-3xl w-12 h-12 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 dark:text-indigo-400">⭐</span>
      <div class="flex flex-col">
        <span class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Rated</span>
        <span class="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">${topRated.toFixed(1)}</span>
      </div>
    </div>
  `;
}
