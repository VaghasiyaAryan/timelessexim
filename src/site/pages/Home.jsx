import { Link } from 'react-router-dom';
import { usePage, useFetch } from '../hooks.js';
import { getProducts } from '../catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import HomeShowcase from '../components/HomeShowcase.jsx';
import { CONTACT } from '../config.js';

export default function Home() {
  usePage("Timeless Exim — Global Textile Exports", "Timeless Exim is an international textile export company supplying premium bedsheets, pillow covers, bed linen and home textile products to importers, distributors, retailers and hospitality businesses worldwide.");
  // Live catalogue (featured first, up to 8) replaces the built-in cards once it loads
  const { data: products } = useFetch(() => getProducts(), []);
  const picks = products?.length ? [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)].slice(0, 8) : null;
  return (
    <>
      <main className="hero" id="hero">
        <div className="guides" aria-hidden="true">
          <span className="v l"></span><span className="v c"></span><span className="v r"></span>
        </div>

        <div className="hero-top" aria-hidden="true">
          <div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div>
        </div>

        <section className="container hero-copy">
          <div className="hline mid" aria-hidden="true"><div className="dots"><i></i><i></i><i></i></div></div>

          <div className="eyebrow reveal" style={{ '--d': '.05s' }}>
            <span className="pulse"></span>
            INDIA <span className="sep"></span> <span className="hide-sm">GLOBAL SOURCING <span className="sep" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 10px' }}></span></span>INTERNATIONAL TRADE
          </div>

          <h1 className="headline">
            <span className="line"><span style={{ '--d': '.15s' }}>Premium Textiles,</span></span>
            <span className="line"><span style={{ '--d': '.3s' }}>Delivered <em>Across Borders.</em></span></span>
          </h1>

          <p className="lede reveal" style={{ '--d': '.5s' }}>
            Timeless Exim is an international textile export company supplying premium bedsheets, pillow covers, bed linen, and home textile products to importers, distributors, retailers, and businesses worldwide.
          </p>

          <div className="cta-row reveal" style={{ '--d': '.62s' }}>
            <Link to="/contact#enquiry" className="btn btn-dark">
              Request a Quote
              <svg aria-hidden="true" focusable="false" className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <a href="#range" className="btn btn-light">Explore Products</a>
            <a href={CONTACT.whatsapp} className="btn btn-ghost">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" /><path d="M9.2 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.6.4-1.4.6-2.1.4-2.6-.8-4.7-2.9-5.5-5.5-.2-.7 0-1.5.5-2Z" /></svg>
              WhatsApp Us
            </a>
          </div>

          <div className="trust reveal" style={{ '--d': '.75s' }}>
            <div className="trust-item">
              <span className="trust-icon"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.3 6.8 19l1-5.8L3.6 9.1l5.8-.8L12 3Z" /></svg></span>
              <div><strong>Premium Quality</strong><span>Carefully sourced textiles</span></div>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></svg></span>
              <div><strong>Global Supply</strong><span>Serving international markets</span></div>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6l7-3Z" /><path d="M8.8 12.2l2.2 2.2 4.4-4.6" /></svg></span>
              <div><strong>Reliable Trade</strong><span>Professional export support</span></div>
            </div>
          </div>
        </section>

        <HomeShowcase />

        <div className="hero-bottom"></div>
        <div className="hline full" aria-hidden="true"><div className="dots"><i></i><i></i><i></i></div></div>
        <div style={{ height: '48px' }}></div>
      </main>

      <section className="section" id="about">
        <div className="container about">
          <div className="about-media" data-reveal>
            <div className="frame"><img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1100&q=80&auto=format&fit=crop" alt="Hotel bed dressed in crisp white linen" loading="lazy" /></div>
            <div className="inset"><img src="https://images.unsplash.com/photo-1605459437907-541c4e2c0ed1?w=500&q=80&auto=format&fit=crop" alt="Close-up of soft cotton fabric folds" loading="lazy" /></div>
            <div className="since"><div className="k">ORIGIN</div><div className="t">Made in India</div></div>
          </div>
          <div data-reveal style={{ '--d': '.1s' }}>
            <span className="kicker"><b>01</b> ABOUT US</span>
            <h2 className="h2">A sourcing partner built for <em>international buyers.</em></h2>
            <p className="body" style={{ marginTop: '24px' }}>Timeless Exim is an export house focused entirely on home textiles. We work with established Indian mills and manufacturing units to supply bedsheets, pillow covers, bed linen and related products to businesses around the world.</p>
            <p className="body">Our role is to make sourcing from India simple and dependable: one point of contact from first sample to final shipment, clear specifications, careful quality control, and export paperwork handled for you.</p>
            <div className="pillars">
              <div className="pillar"><div className="k">BUSINESS MODEL</div><div className="v">B2B export only</div></div>
              <div className="pillar"><div className="k">SOURCING BASE</div><div className="v">Indian textile hubs</div></div>
              <div className="pillar"><div className="k">CAPABILITY</div><div className="v">Private label &amp; custom specs</div></div>
              <div className="pillar"><div className="k">MARKETS</div><div className="v">Americas, Europe, GCC, Oceania</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="range">
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <span className="kicker"><b>02</b> PRODUCTS</span>
              <h2 className="h2">The complete <em>home textile</em> range.</h2>
            </div>
            <p className="body">Every product can be supplied in standard ranges or developed to your specification: fabric, construction, size, colour, finish and packaging.</p>
          </div>

          <div className="range">
            {picks ? picks.map((p, i) => <ProductCard key={p.id} product={p} index={i} />) : (<>
            <Link className="product" to="/contact?product=Bedsheets#enquiry" data-reveal>
              <div className="ph"><img src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=700&q=80&auto=format&fit=crop" alt="Bed with premium white bedsheets" loading="lazy" /></div>
              <div className="pb"><span className="no">01</span><h3>Bedsheets</h3><p>Flat and fitted sheets in single to super-king sizes, made to international size standards.</p>
                <div className="spec"><span>Cotton</span><span>Percale</span><span>Sateen</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Pillow%20Covers#enquiry" data-reveal style={{ '--d': '.06s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=700&q=80&auto=format&fit=crop" alt="Pillow covers on an upholstered bed" loading="lazy" /></div>
              <div className="pb"><span className="no">02</span><h3>Pillow Covers</h3><p>Envelope, zip and Oxford-style closures, packed in pairs for retail or in bulk for hospitality.</p>
                <div className="spec"><span>Standard</span><span>King</span><span>Euro</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Cushion%20Covers#enquiry" data-reveal style={{ '--d': '.12s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1611489704164-6f73c62bd810?w=700&q=80&auto=format&fit=crop" alt="Stacked linen cushion covers" loading="lazy" /></div>
              <div className="pb"><span className="no">03</span><h3>Cushion Covers</h3><p>Plain, textured, printed and embroidered covers for retail and interior collections.</p>
                <div className="spec"><span>Linen</span><span>Cotton</span><span>Velvet</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Duvet%20Covers#enquiry" data-reveal style={{ '--d': '.18s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1564019472231-4586c552dc27?w=700&q=80&auto=format&fit=crop" alt="White duvet cover and pillows" loading="lazy" /></div>
              <div className="pb"><span className="no">04</span><h3>Duvet Covers</h3><p>Button, zip or tie closures with matching shams, sized for US, UK and EU duvets.</p>
                <div className="spec"><span>Solids</span><span>Stripes</span><span>Prints</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Bed%20Linen#enquiry" data-reveal>
              <div className="ph"><img src="https://images.unsplash.com/photo-1688384452551-5cacc39946e0?w=700&q=80&auto=format&fit=crop" alt="Coordinated bed linen set with quilted cover" loading="lazy" /></div>
              <div className="pb"><span className="no">05</span><h3>Bed Linen Sets</h3><p>Coordinated sets of sheets, covers and shams, packed and ready for retail shelves.</p>
                <div className="spec"><span>Retail sets</span><span>Hotel packs</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Comforter%20Covers#enquiry" data-reveal style={{ '--d': '.06s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1639690222869-1e608aa51f82?w=700&q=80&auto=format&fit=crop" alt="Soft white comforter cover" loading="lazy" /></div>
              <div className="pb"><span className="no">06</span><h3>Comforter Covers</h3><p>Lightweight and quilted covers with soft-hand finishes for everyday and hotel use.</p>
                <div className="spec"><span>Quilted</span><span>Washed</span><span>Plain</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Table%20Linen#enquiry" data-reveal style={{ '--d': '.12s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1588610992315-5654831ceebd?w=700&q=80&auto=format&fit=crop" alt="Close-up of natural table linen fabric" loading="lazy" /></div>
              <div className="pb"><span className="no">07</span><h3>Table Linen</h3><p>Tablecloths, runners and napkins for homes, restaurants and hotels.</p>
                <div className="spec"><span>Tablecloths</span><span>Runners</span><span>Napkins</span></div>
                <div className="enq">Enquire <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
            <Link className="product" to="/contact?product=Custom%20Orders#enquiry" data-reveal style={{ '--d': '.18s' }}>
              <div className="ph"><img src="https://images.unsplash.com/photo-1596433904500-97b901c5d274?w=700&q=80&auto=format&fit=crop" alt="Stack of folded fabrics in natural tones" loading="lazy" /></div>
              <div className="pb"><span className="no">08</span><h3>Custom Textiles</h3><p>Your fabric, size, colour and label — developed to specification and produced for export.</p>
                <div className="spec"><span>Private label</span><span>OEM</span></div>
                <div className="enq">Discuss a project <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div></div>
            </Link>
          </>)}
          </div>
          <div style={{ marginTop: '32px', textAlign: 'center' }} data-reveal><Link to="/products" className="btn btn-light">View the full catalogue</Link></div>

          <div className="custom-panel" data-reveal>
            <div>
              <span className="kicker">MADE TO SPECIFICATION</span>
              <h3>Build your range around your market.</h3>
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

      <section className="section" id="process">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="kicker"><b>03</b> OUR PROCESS</span>
            <h2 className="h2">From first enquiry <em>to your port.</em></h2>
            <p className="body">A clear, five-stage process with one point of contact and progress updates at every milestone.</p>
          </div>

          <div className="steps">
            <div className="step" data-reveal><div className="n">i</div><h3>Enquiry &amp; Brief</h3><p>Share the products, specifications, quantities and target market you're sourcing for.</p><div className="meta">REQUIREMENTS</div></div>
            <div className="step" data-reveal style={{ '--d': '.08s' }}><div className="n">ii</div><h3>Sampling</h3><p>We develop and dispatch samples so you can approve fabric, colour, size and finish.</p><div className="meta">APPROVAL</div></div>
            <div className="step" data-reveal style={{ '--d': '.16s' }}><div className="n">iii</div><h3>Production &amp; QC</h3><p>Bulk production with in-line and final inspections against your approved sample.</p><div className="meta">INSPECTION</div></div>
            <div className="step" data-reveal style={{ '--d': '.24s' }}><div className="n">iv</div><h3>Packing &amp; Labelling</h3><p>Private labels, barcodes, inserts and cartons prepared to your market's requirements.</p><div className="meta">RETAIL-READY</div></div>
            <div className="step" data-reveal style={{ '--d': '.32s' }}><div className="n">v</div><h3>Documentation &amp; Shipping</h3><p>Export paperwork, freight booking and dispatch coordinated through to your destination.</p><div className="meta">DISPATCH</div></div>
          </div>

          <div className="buyers" data-reveal>
            <span className="lbl">WHO WE SUPPLY</span>
            <span>Importers</span><span>Wholesalers</span><span>Distributors</span><span>Retailers</span><span>Hotels &amp; Hospitality</span><span>Home Textile Brands</span><span>Sourcing Companies</span>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="reach">
        <div className="container reach">
          <div data-reveal>
            <span className="kicker"><b>04</b> GLOBAL REACH</span>
            <h2 className="h2">Sourced in India. <em>Supplied worldwide.</em></h2>
            <p className="body" style={{ marginTop: '22px' }}>We prepare every consignment for the market it's going to — sizing, labelling, packaging and documentation included.</p>
            <ul className="trade-list">
              <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg></span><div><strong>Export documentation</strong><span>Commercial invoice, packing list, certificate of origin and shipping documents for every order.</span></div></li>
              <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h11M4 7l3-3M4 7l3 3M20 17H9M20 17l-3-3M20 17l-3 3" /></svg></span><div><strong>Flexible trade terms</strong><span>FOB, CIF and other Incoterms, agreed per order to suit your logistics.</span></div></li>
              <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg></span><div><strong>Mixed-product shipments</strong><span>Combine bedsheets, covers and table linen in a single consolidated order.</span></div></li>
              <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" /></svg></span><div><strong>Clear communication</strong><span>A dedicated contact and progress updates from sampling to dispatch.</span></div></li>
            </ul>
          </div>
          <div className="regions">
            <div className="region" data-reveal><div className="k">NORTH AMERICA <i>i.</i></div><h3>USA &amp; Canada</h3><p>Retail-ready packs and hospitality programmes sized to US standards.</p></div>
            <div className="region" data-reveal style={{ '--d': '.08s' }}><div className="k">EUROPE <i>ii.</i></div><h3>UK &amp; Germany</h3><p>UK and EU bed sizes, labelling and packaging for European retail.</p></div>
            <div className="region" data-reveal style={{ '--d': '.16s' }}><div className="k">MIDDLE EAST <i>iii.</i></div><h3>UAE &amp; Saudi Arabia</h3><p>Hotel linen and home collections for the GCC's hospitality and retail sectors.</p></div>
            <div className="region" data-reveal style={{ '--d': '.24s' }}><div className="k">OCEANIA <i>iv.</i></div><h3>Australia</h3><p>Bedding and table linen for importers, wholesalers and homeware brands.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '96px' }}>
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Planning your next order? <em>Let's talk.</em></h2>
              <p>Tell us what you're sourcing and we'll come back with product options, samples and a detailed quotation.</p>
            </div>
            <div className="actions">
              <Link to="/contact#enquiry" className="btn btn-gold">Request a Quote</Link>
              <a href={CONTACT.whatsapp} className="btn btn-outline">Chat on WhatsApp</a>
              <span className="note">TYPICAL REPLY WITHIN ONE BUSINESS DAY</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
