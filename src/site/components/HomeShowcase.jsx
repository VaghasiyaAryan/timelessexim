import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WorldMap from './WorldMap.jsx';
import { ArrowIcon } from './Icons.jsx';

// Category selector swaps the signature (centre) image
const CATS = [
  { id: 'bedsheets', label: 'Bedsheets', kicker: 'SIGNATURE SERIES', title: 'Hotel-Grade Bed Linen', photo: '1617325247661-675ab4b64ae2', alt: 'Styled bed dressed in premium white bed linen with matching pillow covers' },
  { id: 'pillow', label: 'Pillow Covers', kicker: 'PILLOW COVERS', title: 'Envelope & Oxford Pillow Covers', photo: '1713920273122-61f17239194d' },
  { id: 'cushion', label: 'Cushion Covers', kicker: 'CUSHION COVERS', title: 'Textured Cushion Covers', photo: '1579656381226-5fc0f0100c3b' },
  { id: 'linen', label: 'Bed Linen', kicker: 'BED LINEN', title: 'Coordinated Bed Linen Sets', photo: '1582582621959-48d27397dc69' },
  { id: 'duvet', label: 'Duvet Covers', kicker: 'DUVET COVERS', title: 'Duvet & Comforter Covers', photo: '1564019472231-4586c552dc27' },
  { id: 'custom', label: 'Custom Orders', kicker: 'CUSTOM ORDERS', title: 'Made to Your Specification', photo: '1596433904500-97b901c5d274' },
];
const photoUrl = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

function CenterImages({ active }) {
  const [mounted, setMounted] = useState([CATS[0].id]); // images added to the page so far
  const [loaded, setLoaded] = useState(() => new Set());
  const [shown, setShown] = useState(CATS[0].id);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    setMounted((m) => (m.includes(active) ? m : [...m, active]));
    if (loaded.has(active)) requestAnimationFrame(() => setShown(active));
  }, [active, loaded]);

  const onLoad = (id) => {
    setLoaded((s) => new Set(s).add(id));
    if (id === activeRef.current) requestAnimationFrame(() => setShown(id));
  };

  return mounted.map((id) => {
    const c = CATS.find((x) => x.id === id);
    return (
      <img
        key={id}
        src={photoUrl(c.photo, 1600)}
        alt={c.alt || c.title}
        className={id === shown ? undefined : 'hidden'}
        onLoad={() => onLoad(id)}
      />
    );
  });
}

export default function HomeShowcase() {
  const [active, setActive] = useState(CATS[0].id);
  const current = CATS.find((c) => c.id === active);
  const sectionRef = useRef(null);
  const showcaseRef = useRef(null);

  // Entrance: tiles appear when the showcase scrolls in; the strips below fade in on their own
  useEffect(() => {
    const section = sectionRef.current;
    const showcase = showcaseRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.target === showcase) showcase.classList.add('show');
        else e.target.parentElement.classList.add('ready');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    io.observe(showcase);
    section.querySelectorAll(':scope > .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Gentle parallax on the tile photos
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const layers = [...sectionRef.current.querySelectorAll('[data-parallax]')];
    let ticking = false;
    const parallax = () => {
      const vh = innerHeight;
      layers.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(-p * parseFloat(el.dataset.parallax) * 100).toFixed(2)}%, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } };
    addEventListener('scroll', onScroll, { passive: true });
    parallax();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="container showcase-wrap" id="products" aria-label="Product showcase" ref={sectionRef}>
      <div className="showcase-glow" aria-hidden="true"></div>
      <WorldMap />

      <div className="showcase" ref={showcaseRef}>
        <span className="origin-badge" style={{ '--d': '1.1s' }}>
          <svg className="flag" viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="4" fill="#E08A3C" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#3E7D4A" /><circle cx="9" cy="6" r="1.5" fill="none" stroke="#1F3A7A" strokeWidth=".5" /></svg>
          PROUDLY SOURCED FROM INDIA
        </span>

        <figure className="tile tile-left" style={{ '--d': '.6s' }}>
          <div className="media" data-parallax=".06"><img src={photoUrl('1596433904500-97b901c5d274', 900)} alt="Stack of neatly folded cotton bedsheets in natural tones" /></div>
          <span className="tag tag-1" style={{ '--d': '1s' }}>PREMIUM BEDSHEETS</span>
          <figcaption className="tile-caption"><div><div className="k">COLLECTION 01</div><div className="t">Folded Sheet Sets</div></div><span className="n">i.</span></figcaption>
        </figure>

        <figure className="tile tile-center" style={{ '--d': '.45s' }}>
          <div className="media" data-parallax=".04">
            <CenterImages active={active} />
          </div>
          <span className="tag tag-2" style={{ '--d': '1.15s' }}>BED LINEN</span>
          <figcaption className="tile-caption">
            <div><div className="k">{current.kicker}</div><div className="t">{current.title}</div></div>
            <span className="n">ii.</span>
          </figcaption>
        </figure>

        <figure className="tile tile-right-a" style={{ '--d': '.75s' }}>
          <div className="media" data-parallax=".07"><img src={photoUrl('1611489704164-6f73c62bd810', 900)} alt="Linen cushion covers stacked in cream and rust tones" /></div>
          <span className="tag tag-3" style={{ '--d': '1.25s' }}>CUSHION COVERS</span>
        </figure>

        <figure className="tile tile-right-b" style={{ '--d': '.9s' }}>
          <div className="media" data-parallax=".05"><img src={photoUrl('1582582621959-48d27397dc69', 900)} alt="Pillow covers arranged on an upholstered bed" /></div>
          <span className="tag tag-4" style={{ '--d': '1.35s' }}>PILLOW COVERS</span>
        </figure>

        <div className="swatch" style={{ '--d': '1.45s' }}>
          <img src={photoUrl('1605459437907-541c4e2c0ed1', 200)} alt="Close-up of fine cotton weave" />
          <div>
            <div className="k">CUSTOM TEXTILES</div>
            <div className="t">Fine weave, clean seams</div>
            <div className="d">Made to your spec &amp; label</div>
          </div>
        </div>
      </div>

      <div className="categories reveal" style={{ '--d': '.2s' }}>
        <span className="lbl">BROWSE BY CATEGORY</span>
        <div className="cat-list" role="tablist" aria-label="Product categories">
          {CATS.map((c) => (
            <button key={c.id} className="cat" type="button" role="tab" aria-selected={c.id === active} onClick={() => setActive(c.id)}>{c.label}</button>
          ))}
        </div>
        <Link to="/products" className="view-all">Full catalogue <ArrowIcon /></Link>
      </div>

      <div className="info reveal" style={{ '--d': '.3s' }}>
        <div className="info-item">
          <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5.5" /><path d="M9.5 9l1.8 1.8L14.8 7.3M8.5 13.8 7 21l5-2.5 5 2.5-1.5-7.2" /></svg></span>
          <div><h3>QUALITY ASSURED</h3><p>Every batch inspected for weave, finish and colour-fastness.</p></div>
        </div>
        <div className="info-item">
          <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg></span>
          <div><h3>BULK EXPORT ORDERS</h3><p>Container-scale volumes with consistent lot quality.</p></div>
        </div>
        <div className="info-item">
          <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-7.1 7.1a1.4 1.4 0 0 1-2 0l-8-8Z" /><circle cx="8.2" cy="8.2" r="1.4" /></svg></span>
          <div><h3>CUSTOM PACKAGING</h3><p>Private labels, inserts and retail-ready packing.</p></div>
        </div>
        <div className="info-item">
          <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15h18l-2 4H5l-2-4Z" /><path d="M6 15V9h12v6M9 9V6h6v3M12 3v3" /></svg></span>
          <div><h3>GLOBAL SHIPPING SUPPORT</h3><p>Documentation, freight and customs coordination.</p></div>
        </div>
      </div>
    </section>
  );
}
