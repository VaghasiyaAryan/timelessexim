// Public catalogue API (served by the Express app under /api)
export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1596433904500-97b901c5d274?w=900&q=80&auto=format&fit=crop';

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw Object.assign(new Error(`Request failed (${res.status})`), { status: res.status });
  return res.json();
}

// Products and categories rarely change while someone browses, so share one request per session.
let productsCache;
let categoriesCache;

export function getProducts() {
  productsCache ??= getJSON('/api/products').then((d) => d.products).catch((err) => { productsCache = undefined; throw err; });
  return productsCache;
}

export function getCategories() {
  categoriesCache ??= getJSON('/api/categories').then((d) => d.categories).catch((err) => { categoriesCache = undefined; throw err; });
  return categoriesCache;
}

export const getProduct = (slug) => getJSON('/api/products/' + encodeURIComponent(slug)).then((d) => d.product);

export const enquireLink = (product, item) =>
  `/contact?${new URLSearchParams({ product, ...(item ? { item } : {}) })}#enquiry`;
