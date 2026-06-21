export function renderLoadingView(): string {
  const skeletons = Array.from({ length: 8 })
    .map(
      () => `
    <div class="bg-white/75 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/6 rounded-3xl overflow-hidden flex flex-col animate-pulse">
      <div class="w-full pt-[65%] shimmer bg-slate-200 dark:bg-slate-800"></div>
      <div class="p-5 flex flex-col flex-grow gap-3">
        <div class="shimmer h-4 w-12 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div class="shimmer h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div class="shimmer h-4 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
        <div class="shimmer h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div class="flex justify-between items-center border-t border-slate-200/80 dark:border-white/6 pt-3.5 mt-2">
          <div class="shimmer h-6 w-16 rounded bg-slate-200 dark:bg-slate-800"></div>
          <div class="shimmer h-5 w-10 rounded bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="w-full max-w-6xl mx-auto bg-white/45 dark:bg-slate-900/45 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-3xl shadow-lg p-8 min-h-[calc(100vh-48px)] flex flex-col gap-7 animate-[fadeIn_0.6s_ease-out]">
      <header class="border-b border-slate-200/80 dark:border-white/6 pb-5">
        <div class="flex items-center gap-3">
          <span class="text-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">⚡</span>
          <h1 class="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">DevDash</h1>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">Premium Async Developer Dashboard</p>
      </header>
      <div class="h-1 w-full rounded bg-gradient-to-r from-slate-200 via-indigo-500 to-slate-200 dark:from-slate-800 dark:via-indigo-500 dark:to-slate-800 bg-[size:200%_100%] animate-[shimmer-anim_1.5s_infinite_linear]"></div>
      <main class="flex flex-col gap-6">
        <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          ${skeletons}
        </div>
      </main>
    </div>
  `;
}
