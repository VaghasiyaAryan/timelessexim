import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePage, useFetch } from '../hooks.js';
import { CONTACT } from '../config.js';
import { getProducts, getCategories } from '../catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import { SearchIcon } from '../components/Icons.jsx';

const Skeletons = () => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <div className="skeleton" key={i}><div className="a"></div><div className="b"></div><div className="b s"></div></div>
    ))}
  </>
);

export default function Products() {
  usePage('Products — Timeless Exim', 'Browse the Timeless Exim home textile catalogue: bedsheets, pillow covers, cushion covers, duvet covers, bed linen sets, table linen and custom private-label programmes for export.');

  // Filters live in the URL (/products?category=bedsheets&q=cotton) so views can be bookmarked and shared
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const [search, setSearch] = useState(q);
  useEffect(() => setSearch(q), [q]);

  const update = (next, replace) => {
    const p = new URLSearchParams();
    const c = next.category ?? category;
    const term = next.q ?? q;
    if (c) p.set('category', c);
    if (term) p.set('q', term);
    setParams(p, { replace, state: { keepScroll: true } });
  };

  useEffect(() => {
    if (search === q) return undefined;
    const t = setTimeout(() => update({ q: search }, true), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { data, error, loading } = useFetch(() => Promise.all([getProducts(), getCategories()]), []);
  const [products, categories] = data || [[], []];

  const counts = useMemo(() => {
    const c = {};
    products.forEach((p) => { if (p.category_slug) c[p.category_slug] = (c[p.category_slug] || 0) + 1; });
    return c;
  }, [products]);

  const term = q.trim().toLowerCase();
  const list = products.filter((p) =>
    (!category || p.category_slug === category) &&
    (!term || [p.name, p.description, p.category_name, ...(p.specs || [])].join(' ').toLowerCase().includes(term))
  );

  let grid;
  if (loading) grid = <Skeletons />;
  else if (error) {
    grid = (
      <div className="state">
        <h3>The catalogue couldn't load.</h3>
        <p>Please refresh the page in a moment. You can still send us an enquiry and we'll share our full range by email.</p>
        <Link className="btn btn-dark" to="/contact#enquiry">Request the catalogue</Link>
      </div>
    );
  } else if (!list.length) {
    grid = (
      <div className="state">
        <h3>No products match{term ? ` “${q}”` : ''}.</h3>
        <p>Try another category or search term — or tell us what you're looking for and we'll source or develop it for you.</p>
        <button className="btn btn-light" type="button" onClick={() => { setSearch(''); setParams(new URLSearchParams(), { state: { keepScroll: true } }); }}>Show all products</button>
      </div>
    );
  } else {
    grid = list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />);
  }

  return (
    <main>
      <div className="hero">
        <div className="guides" aria-hidden="true"><span className="v l"></span><span className="v c"></span><span className="v r"></span></div>
        <div className="hero-top" aria-hidden="true"><div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div></div>
        <section className="container page-hero compact hero-copy">
          <div className="eyebrow reveal" style={{ '--d': '.05s' }}><span className="pulse"></span> CATALOGUE <span className="sep"></span> HOME TEXTILES</div>
          <h1 className="headline">
            <span className="line"><span style={{ '--d': '.15s' }}>The complete</span></span>
            <span className="line"><span style={{ '--d': '.3s' }}><em>home textile range.</em></span></span>
          </h1>
          <p className="lede reveal" style={{ '--d': '.5s' }}>Every product is available in standard ranges or developed to your specification: fabric, construction, size, colour, finish and packaging.</p>
        </section>
      </div>

      <section className="section section-alt" style={{ paddingTop: '72px' }} aria-label="Product catalogue">
        <div className="container">
          <div className="toolbar">
            <div className="filters" role="group" aria-label="Filter by category">
              <button className="filter" type="button" aria-pressed={!category} onClick={() => update({ category: '' })}>
                All products{!loading && !error && <span className="ct">{products.length}</span>}
              </button>
              {categories
                .filter((c) => counts[c.slug] || c.slug === category)
                .map((c) => (
                  <button key={c.slug} className="filter" type="button" aria-pressed={c.slug === category} onClick={() => update({ category: c.slug })}>
                    {c.name}<span className="ct">{counts[c.slug] || 0}</span>
                  </button>
                ))}
            </div>
            <label className="search">
              <SearchIcon />
              <input className="input" type="search" placeholder="Search products…" autoComplete="off" aria-label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
          </div>
          <p className="result-count" aria-live="polite">
            {!loading && !error && list.length > 0 && `Showing ${list.length} of ${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
          <div className="range">{grid}</div>

          <div className="custom-panel" data-reveal>
            <div>
              <span className="kicker">MADE TO SPECIFICATION</span>
              <h3>Can't see exactly what you need?</h3>
              <p>Send us a reference, a tech pack or simply a target price. We'll propose fabric and construction options and develop samples for approval.</p>
              <Link to="/contact?product=Custom%20Orders#enquiry" className="btn btn-light">Share your specification</Link>
            </div>
            <div className="spec-grid">
              <div><div className="k">FABRICS</div><div className="v">Cotton, cotton blends, linen, microfibre</div></div>
              <div><div className="k">WEAVES &amp; FINISHES</div><div className="v">Percale, sateen, jacquard, stonewashed</div></div>
              <div><div className="k">THREAD COUNT &amp; GSM</div><div className="v">Developed to your specification</div></div>
              <div><div className="k">COLOUR &amp; DESIGN</div><div className="v">Solid dyed, printed, embroidered</div></div>
              <div><div className="k">SIZES</div><div className="v">US, UK, EU and custom dimensions</div></div>
              <div><div className="k">PACKAGING</div><div className="v">Private label, inserts, retail boxes</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '96px' }}>
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Ready to price a range? <em>Let's talk.</em></h2>
              <p>Tell us the products, quantities and destination you're working with and we'll come back with options, samples and a detailed quotation.</p>
            </div>
            <div className="actions">
              <Link to="/contact#enquiry" className="btn btn-gold">Request a Quote</Link>
              <a href={CONTACT.whatsapp} className="btn btn-outline">Chat on WhatsApp</a>
              <span className="note">TYPICAL REPLY WITHIN ONE BUSINESS DAY</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
