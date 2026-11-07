import { Link, useParams } from 'react-router-dom';
import { usePage, useFetch } from '../hooks.js';
import { whatsappLink } from '../config.js';
import { getProduct, getProducts, enquireLink, FALLBACK_IMG } from '../catalog.js';
import ProductCard, { imageFallback } from '../components/ProductCard.jsx';
import { ArrowIcon } from '../components/Icons.jsx';

function Missing({ title, text }) {
  usePage('Product not found — Timeless Exim', text);
  return (
    <div className="state" style={{ padding: '96px 24px' }}>
      <h3>{title}</h3>
      <p>{text}</p>
      <Link className="btn btn-dark" to="/products">Browse all products</Link>
    </div>
  );
}

function Related({ product }) {
  const { data: all } = useFetch(() => getProducts(), []);
  if (!all) return null;
  const others = all.filter((x) => x.id !== product.id);
  const related = [
    ...others.filter((x) => x.category_slug === product.category_slug),
    ...others.filter((x) => x.category_slug !== product.category_slug && x.featured),
    ...others,
  ].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="kicker">YOU MAY ALSO NEED</span>
            <h2 className="h2">Complete the <em>range.</em></h2>
          </div>
          <p className="body">Combine products from different categories into one consolidated, mixed-product export order.</p>
        </div>
        <div className="range three">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div style={{ marginTop: '36px', textAlign: 'center' }}><Link className="btn btn-light" to="/products">View the full catalogue</Link></div>
      </div>
    </section>
  );
}

function Details({ p }) {
  usePage(`${p.name} — Timeless Exim`, p.description || `${p.name} from Timeless Exim.`);
  return (
    <div className="pd">
      <div className="pd-media" data-reveal>
        <img src={p.image_url || FALLBACK_IMG} alt={p.name} onError={imageFallback} />
      </div>
      <div className="pd-info" data-reveal style={{ '--d': '.08s' }}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span className="sep"></span>
          <Link to="/products">Products</Link><span className="sep"></span>
          {p.category_slug && (
            <><Link to={`/products?category=${encodeURIComponent(p.category_slug)}`}>{p.category_name}</Link><span className="sep"></span></>
          )}
          <span aria-current="page">{p.name}</span>
        </nav>
        <span className="kicker">{(p.category_name || 'Home textiles').toUpperCase()}</span>
        <h1>{p.name}</h1>
        {p.description && <p className="lead">{p.description}</p>}
        {p.specs?.length > 0 && <div className="pd-specs">{p.specs.map((s) => <span key={s}>{s}</span>)}</div>}
        <div className="pd-actions">
          <Link className="btn btn-dark" to={enquireLink(p.category_name || 'Custom Orders', p.name)}>Request a quote <ArrowIcon className="arrow" /></Link>
          <a className="btn btn-light" href={whatsappLink(`Hello Timeless Exim, I'd like a quote for: ${p.name}`)}>Ask on WhatsApp</a>
        </div>
        <dl className="pd-table">
          <div><dt>CUSTOMISATION</dt><dd>Fabric, thread count / GSM, size, colour and finish developed to your specification.</dd></div>
          <div><dt>SIZES</dt><dd>US, UK and EU standard sizes, or custom dimensions.</dd></div>
          <div><dt>PACKAGING</dt><dd>Private label, care labels, barcodes, inserts, polybags, retail boxes or bulk cartons.</dd></div>
          <div><dt>MOQ</dt><dd>Confirmed with your quotation — depends on fabric and level of customisation.</dd></div>
          <div><dt>SAMPLES</dt><dd>Developed and couriered for approval before bulk production.</dd></div>
          <div><dt>TRADE TERMS</dt><dd>FOB, CIF and other Incoterms, agreed per order.</dd></div>
        </dl>
        <p className="pd-note"><strong>Sourcing for a hotel, retailer or private-label brand?</strong> Mention your target market and destination port in your enquiry and we'll prepare sizing, labelling and documentation for it.</p>
      </div>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { data: product, error, loading } = useFetch(() => getProduct(slug), [slug]);

  let body;
  if (loading) {
    body = (
      <div className="pd" aria-busy="true">
        <div className="pd-media skeleton"><div className="a" style={{ height: '100%' }}></div></div>
        <div className="pd-info skeleton" style={{ border: 0, background: 'none' }}><div className="b"></div><div className="b"></div><div className="b s"></div></div>
      </div>
    );
  } else if (error) {
    body = error.status === 404
      ? <Missing title="This product isn’t available." text="It may have been renamed or removed from our catalogue." />
      : <Missing title="This product couldn’t load." text="Please refresh the page in a moment." />;
  } else {
    body = <Details p={product} />;
  }

  return (
    <main>
      <section className="section" style={{ paddingTop: '64px' }}>
        <div className="container">{body}</div>
      </section>
      {product && <Related product={product} />}
    </main>
  );
}
