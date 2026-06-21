# DevDash — Typed Async Dashboard

A premium TypeScript single-page dashboard application that loads data from public JSON APIs, transforms it, and displays it with search, filtering, and detail views.

Deploy Github Pages: [https://lehuydiep4.github.io/FSoftAssignment_DevDash/](https://lehuydiep4.github.io/FSoftAssignment_DevDash/)

## Objectives

- Apply ES6+, asynchronous JavaScript, and strict TypeScript together.
- Build a type-safe application compiling with `"strict": true` and zero compiler warnings or errors.
- Clean Architecture implementation separating domain models, data repository contracts, and presentation UI views.

## Clean Architecture Structure

- **Domain Layer**: Core entities ([Product](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/domain/entities/product.ts) and [Category](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/domain/entities/category.ts)) and repository interfaces ([ProductRepository](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/domain/repositories/product.repository.ts)). Exposes business logic with zero external dependency.
- **Data/Infrastructure Layer**: Concrete implementation ([ProductRepositoryImpl](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/data/repositories/product.repository.impl.ts)) and data transfer models ([ProductDto](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/data/models/product.model.ts)).
- **Presentation Layer**: Functional, unidirectional rendering components ([renderApp](file:///c:/Study/Fsoft/Tech/part4JSAdvance/Assignment/devdash/src/ui.ts) and templates under `src/ui/*`).

## Local Development Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Completed Features

- [x] **Pass Tier**
  - Project compiles under strict mode with zero type errors.
  - Domain data is modeled with strict interfaces (no `any` for domain/API structures).
  - List view loads asynchronously with async/await and displays custom shimmer/skeletons.
  - Proper parameter and function return-type typing.
  - Complete `try/catch` UI error states and a responsive detail modal.
- [x] **Good Tier**
  - Advanced search, sort, and category filtering using array high-order methods (`filter`, `sort`, `map`).
  - Reusable, generic `fetchJson<T>` helper module with error/status handling.
  - Parallel loading of products and categories using `Promise.all`.
  - Application state modeled as a strict union type.
- [x] **Excellent Tier**
  - State management uses a **discriminated union** substate (`DetailsState`) representing idle, loading, success, revalidating, and error states for the product detail view, avoiding impossible UI combinations.
  - **Exhaustive narrowing** enforced on both top-level state and detail view state using compile-time `assertNever` assertions.
  - Meaningful usage of **utility types**:
    - `Pick` to define `ProductSummary` for lightweight list rendering.
    - `Omit` and `Partial` to declare safe partial state update payloads (`SuccessStateUpdates`) in state mutation handlers.
    - `Record` inside the caching layer to index keys.
  - A generic class **`LocalStorageCache<T extends { id: string | number }>`** that caches product detail pages in `localStorage` with a configurable TTL (10-minute expiry).
  - Debounce applied to search input (delaying inputs by 250ms) and memoized SWR pattern applied to product details caching.
  - Clean directory structure conforming to strict module division.

