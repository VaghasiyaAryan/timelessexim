import { Link } from 'react-router-dom';
import { FALLBACK_IMG } from '../catalog.js';
import { ArrowIcon } from './Icons.jsx';

const useFallback = (e) => {
  if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
};

export default function ProductCard({ product: p, index = 0 }) {
  const specs = (p.specs || []).slice(0, 3);
  return (
    <Link className="product" to={`/products/${encodeURIComponent(p.slug)}`} data-reveal style={{ '--d': `${(index % 4) * 0.06}s` }}>
      <div className="ph"><img src={p.image_url || FALLBACK_IMG} alt={p.name} loading="lazy" onError={useFallback} /></div>
      <div className="pb">
        <span className="no">{p.category_name || 'Home textiles'}</span>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        {specs.length > 0 && <div className="spec">{specs.map((s) => <span key={s}>{s}</span>)}</div>}
        <div className="enq">View details <ArrowIcon /></div>
      </div>
    </Link>
  );
}

export { useFallback as imageFallback };
