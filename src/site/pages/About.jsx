import { Link } from 'react-router-dom';
import { usePage } from '../hooks.js';

export default function About() {
  usePage("About Us — Timeless Exim", "Timeless Exim is an Indian export house focused on home textiles — one point of contact from first sample to final shipment for importers, retailers and hospitality buyers worldwide.");
  return (
    <>
      <main>
        <div className="hero">
          <div className="guides" aria-hidden="true"><span className="v l"></span><span className="v c"></span><span className="v r"></span></div>
          <div className="hero-top" aria-hidden="true"><div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div></div>
          <section className="container page-hero compact hero-copy">
            <div className="eyebrow reveal" style={{ '--d': '.05s' }}><span className="pulse"></span> ABOUT US <span className="sep"></span> EXPORT HOUSE</div>
            <h1 className="headline">
              <span className="line"><span style={{ '--d': '.15s' }}>Sourcing from India,</span></span>
              <span className="line"><span style={{ '--d': '.3s' }}><em>made simple.</em></span></span>
            </h1>
            <p className="lede reveal" style={{ '--d': '.5s' }}>We're an export house focused entirely on home textiles — connecting international buyers with established Indian mills, and managing everything from first sample to final shipment.</p>
          </section>
        </div>

        <section className="section" style={{ paddingTop: '64px' }}>
          <div className="container about">
            <div className="about-media" data-reveal>
              <div className="frame"><img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1100&q=80&auto=format&fit=crop" alt="Hotel bed dressed in crisp white linen" /></div>
              <div className="inset"><img src="https://images.unsplash.com/photo-1605459437907-541c4e2c0ed1?w=500&q=80&auto=format&fit=crop" alt="Close-up of soft cotton fabric folds" loading="lazy" /></div>
              <div className="since"><div className="k">ORIGIN</div><div className="t">Made in India</div></div>
            </div>
            <div data-reveal style={{ '--d': '.1s' }}>
              <span className="kicker"><b>01</b> WHO WE ARE</span>
              <h2 className="h2">A sourcing partner built for <em>international buyers.</em></h2>
              <p className="body" style={{ marginTop: '24px' }}>Timeless Exim works with established Indian mills and manufacturing units to supply bedsheets, pillow covers, bed linen and related products to businesses around the world.</p>
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

        <section className="section section-alt">
          <div className="container">
            <div className="stats" data-reveal>
              <div className="stat"><div className="v">8</div><div className="k">PRODUCT CATEGORIES</div></div>
              <div className="stat"><div className="v">5</div><div className="k">STAGE EXPORT PROCESS</div></div>
              <div className="stat"><div className="v">4</div><div className="k">REGIONS SUPPLIED</div></div>
              <div className="stat"><div className="v"><em>1</em></div><div className="k">POINT OF CONTACT</div></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <span className="kicker"><b>02</b> WHAT WE DO</span>
                <h2 className="h2">Everything between <em>the mill and your port.</em></h2>
              </div>
              <p className="body">We handle the parts of international sourcing that usually take the most time — so you can focus on selling.</p>
            </div>
            <div className="cards">
              <div className="vcard" data-reveal>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></span>
                <h3>Sourcing</h3>
                <p>We match your brief to the right mills and manufacturing units across India's textile hubs.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.06s' }}>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16M6 16l9-9 3 3-9 9H6v-3Z" /></svg></span>
                <h3>Product development</h3>
                <p>Fabric, construction, size, colour and finish developed to your specification, with samples for approval.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.12s' }}>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6l7-3Z" /><path d="M8.8 12.2l2.2 2.2 4.4-4.6" /></svg></span>
                <h3>Quality control</h3>
                <p>In-line and final inspections for weave, finish, measurements and colour-fastness against your approved sample.</p>
              </div>
              <div className="vcard" data-reveal>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-7.1 7.1a1.4 1.4 0 0 1-2 0l-8-8Z" /><circle cx="8.2" cy="8.2" r="1.4" /></svg></span>
                <h3>Packing &amp; labelling</h3>
                <p>Private labels, care labels, barcodes, inserts and retail-ready packaging prepared for your market.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.06s' }}>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg></span>
                <h3>Export documentation</h3>
                <p>Commercial invoice, packing list, certificate of origin and shipping documents for every order.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.12s' }}>
                <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15h18l-2 4H5l-2-4Z" /><path d="M6 15V9h12v6M9 9V6h6v3M12 3v3" /></svg></span>
                <h3>Shipping coordination</h3>
                <p>Freight booking and dispatch coordinated through to your destination port.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-head center" data-reveal>
              <span className="kicker"><b>03</b> HOW WE WORK</span>
              <h2 className="h2">The principles behind <em>every order.</em></h2>
            </div>
            <div className="cards">
              <div className="vcard" data-reveal>
                <span className="no">i.</span>
                <h3>Consistency over volume</h3>
                <p>A repeat order should feel exactly like the first. We hold every lot to the sample you approved.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.06s' }}>
                <span className="no">ii.</span>
                <h3>Clear communication</h3>
                <p>A dedicated contact, straight answers on what's possible, and progress updates at every milestone.</p>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.12s' }}>
                <span className="no">iii.</span>
                <h3>Built for your market</h3>
                <p>Sizing, labelling, packaging and paperwork prepared for the country each consignment is going to.</p>
              </div>
            </div>
            <div className="buyers" data-reveal>
              <span className="lbl">WHO WE SUPPLY</span>
              <span>Importers</span><span>Wholesalers</span><span>Distributors</span><span>Retailers</span><span>Hotels &amp; Hospitality</span><span>Home Textile Brands</span><span>Sourcing Companies</span>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '96px' }}>
          <div className="container">
            <div className="cta-band" data-reveal>
              <div>
                <h2>Looking for a reliable textile partner? <em>Let's talk.</em></h2>
                <p>Tell us what you're sourcing and we'll come back with product options, samples and a detailed quotation.</p>
              </div>
              <div className="actions">
                <Link to="/contact#enquiry" className="btn btn-gold">Request a Quote</Link>
                <Link to="/products" className="btn btn-outline">Browse products</Link>
                <span className="note">TYPICAL REPLY WITHIN ONE BUSINESS DAY</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
