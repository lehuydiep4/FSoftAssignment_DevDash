import type { Product } from '../../domain/entities/product';

/**
 * Filters and sorts the list of products based on search query, category, and sorting criteria.
 */
export function filterAndSortProducts(
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
