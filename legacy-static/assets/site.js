// Shared behaviour for every Timeless Exim page: mobile menu, scroll reveals, footer year,
// plus small helpers (window.TE) for pages that render the live product catalogue.
(() => {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  if (header && menuBtn) {
    const setOpen = (open) => {
      header.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
    header.querySelectorAll('.drawer a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  // Page-hero entrance (headline + .reveal items inside .hero-copy)
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) requestAnimationFrame(() => heroCopy.classList.add('ready'));

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;
  const reveal = (root = document) => {
    root.querySelectorAll('[data-reveal]:not(.in)').forEach(el => (io ? io.observe(el) : el.classList.add('in')));
  };
  reveal();

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // ───────── Catalogue helpers ─────────
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arrow = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1596433904500-97b901c5d274?w=900&q=80&auto=format&fit=crop';

  async function getJSON(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw Object.assign(new Error(`Request failed (${res.status})`), { status: res.status });
    return res.json();
  }

  function productCard(p, i = 0) {
    const specs = (p.specs || []).slice(0, 3).map(s => `<span>${esc(s)}</span>`).join('');
    return `
      <a class="product" href="product.html?slug=${encodeURIComponent(p.slug)}" data-reveal style="--d:${(i % 4) * 0.06}s">
        <div class="ph"><img src="${esc(p.image_url || FALLBACK_IMG)}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'"></div>
        <div class="pb">
          <span class="no">${esc(p.category_name || 'Home textiles')}</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.description)}</p>
          ${specs ? `<div class="spec">${specs}</div>` : ''}
          <div class="enq">View details ${arrow}</div>
        </div>
      </a>`;
  }

  window.TE = {
    esc,
    arrow,
    reveal,
    productCard,
    FALLBACK_IMG,
    getProducts: (params = {}) => getJSON('/api/products?' + new URLSearchParams(params)).then(d => d.products),
    getProduct: (slug) => getJSON('/api/products/' + encodeURIComponent(slug)).then(d => d.product),
    getCategories: () => getJSON('/api/categories').then(d => d.categories),
  };
})();
