// Products page: live catalogue from /api/products with category filter + search, synced to the URL
// (products.html?category=bedsheets&q=cotton) so filtered views can be bookmarked and shared.
(() => {
  const { esc, reveal, productCard, getProducts, getCategories } = window.TE;
  const grid = document.getElementById('grid');
  const filters = document.getElementById('filters');
  const q = document.getElementById('q');
  const count = document.getElementById('count');

  let products = [];
  const params = new URLSearchParams(location.search);
  const state = { category: params.get('category') || '', q: params.get('q') || '' };
  q.value = state.q;

  function syncUrl(push) {
    const p = new URLSearchParams();
    if (state.category) p.set('category', state.category);
    if (state.q) p.set('q', state.q);
    const url = location.pathname + (p.toString() ? '?' + p : '');
    history[push ? 'pushState' : 'replaceState'](null, '', url);
  }

  function render() {
    filters.querySelectorAll('.filter').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === state.category));
    const term = state.q.trim().toLowerCase();
    const list = products.filter(p =>
      (!state.category || p.category_slug === state.category) &&
      (!term || [p.name, p.description, p.category_name, ...(p.specs || [])].join(' ').toLowerCase().includes(term))
    );

    if (!list.length) {
      grid.innerHTML = `
        <div class="state">
          <h3>No products match${term ? ` “${esc(state.q)}”` : ''}.</h3>
          <p>Try another category or search term — or tell us what you're looking for and we'll source or develop it for you.</p>
          <button class="btn btn-light" type="button" data-reset>Show all products</button>
        </div>`;
      count.textContent = '';
      return;
    }
    grid.innerHTML = list.map(productCard).join('');
    count.textContent = `Showing ${list.length} of ${products.length} product${products.length === 1 ? '' : 's'}`;
    reveal(grid);
  }

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    state.category = btn.dataset.cat;
    syncUrl(true);
    render();
  });

  let t;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = q.value; syncUrl(false); render(); }, 150);
  });

  grid.addEventListener('click', e => {
    if (!e.target.closest('[data-reset]')) return;
    state.category = ''; state.q = ''; q.value = '';
    syncUrl(true);
    render();
  });

  addEventListener('popstate', () => {
    const p = new URLSearchParams(location.search);
    state.category = p.get('category') || '';
    state.q = p.get('q') || '';
    q.value = state.q;
    render();
  });

  Promise.all([getProducts(), getCategories()])
    .then(([prods, cats]) => {
      products = prods;
      const counts = {};
      prods.forEach(p => { if (p.category_slug) counts[p.category_slug] = (counts[p.category_slug] || 0) + 1; });
      filters.insertAdjacentHTML('beforeend', cats
        .filter(c => counts[c.slug] || c.slug === state.category)
        .map(c => `<button class="filter" type="button" data-cat="${esc(c.slug)}" aria-pressed="false">${esc(c.name)}<span class="ct">${counts[c.slug] || 0}</span></button>`)
        .join(''));
      filters.querySelector('.filter').insertAdjacentHTML('beforeend', `<span class="ct">${prods.length}</span>`);
      render();
    })
    .catch(() => {
      grid.innerHTML = `
        <div class="state">
          <h3>The catalogue couldn't load.</h3>
          <p>Please refresh the page in a moment. You can still send us an enquiry and we'll share our full range by email.</p>
          <a class="btn btn-dark" href="contact.html#enquiry">Request the catalogue</a>
        </div>`;
    });
})();
