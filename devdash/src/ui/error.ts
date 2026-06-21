export function renderErrorView(errorMessage: string): string {
  return `
    <div class="w-full max-w-6xl mx-auto bg-white/45 dark:bg-slate-900/45 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-3xl shadow-lg p-8 min-h-[calc(100vh-48px)] flex flex-col gap-7 animate-[fadeIn_0.6s_ease-out]">
      <header class="border-b border-slate-200/80 dark:border-white/6 pb-5">
        <div class="flex items-center gap-3">
          <span class="text-3xl bg-gradient-to-br from-indigo-500 to-indigo-600 bg-clip-text text-transparent animate-pulse">⚡</span>
          <h1 class="font-display text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">DevDash</h1>
        </div>
      </header>
      <main class="flex items-center justify-center flex-grow py-10">
        <div class="bg-white/75 dark:bg-slate-800/55 border border-red-500/20 rounded-3xl p-10 text-center max-w-[460px] shadow-lg animate-[fadeIn_0.4s_ease-out]">
          <div class="text-5xl mb-4">⚠️</div>
          <h2 class="font-display text-slate-900 dark:text-slate-50 text-xl font-bold mb-3">Failed to Load Dashboard</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">${errorMessage}</p>
          <button id="retry-btn" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold cursor-pointer bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-300">
            <span>🔄</span> Retry Connection
          </button>
        </div>
      </main>
    </div>
  `;
}
