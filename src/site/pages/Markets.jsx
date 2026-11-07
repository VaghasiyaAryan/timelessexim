import { Link } from 'react-router-dom';
import { usePage } from '../hooks.js';
import { CONTACT } from '../config.js';

export default function Markets() {
  usePage("Global Reach — Timeless Exim", "Timeless Exim supplies home textiles from India to buyers in North America, Europe, the Middle East and Oceania, with export documentation and flexible Incoterms.");
  return (
    <>
      <main>
        <div className="hero">
          <div className="guides" aria-hidden="true"><span className="v l"></span><span className="v c"></span><span className="v r"></span></div>
          <div className="hero-top" aria-hidden="true"><div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div></div>
          <section className="container page-hero compact hero-copy">
            <div className="eyebrow reveal" style={{ '--d': '.05s' }}><span className="pulse"></span> GLOBAL REACH <span className="sep"></span> EXPORT MARKETS</div>
            <h1 className="headline">
              <span className="line"><span style={{ '--d': '.15s' }}>Sourced in India.</span></span>
              <span className="line"><span style={{ '--d': '.3s' }}><em>Supplied worldwide.</em></span></span>
            </h1>
            <p className="lede reveal" style={{ '--d': '.5s' }}>We prepare every consignment for the market it's going to — sizing, labelling, packaging and documentation included.</p>
          </section>
        </div>

        <section className="section" style={{ paddingTop: '64px' }}>
          <div className="container">
            <div className="section-head" data-reveal>
              <div>
                <span className="kicker"><b>01</b> WHERE WE SHIP</span>
                <h2 className="h2">Four regions, <em>one standard.</em></h2>
              </div>
              <p className="body">Our buyers span four regions. Other destinations are welcome — tell us your port and we'll plan the route.</p>
            </div>
            <div className="cards two">
              <div className="vcard" data-reveal>
                <span className="no">i. NORTH AMERICA</span>
                <h3>USA &amp; Canada</h3>
                <p>Retail-ready packs and hospitality programmes sized to US standards.</p>
                <ul><li>Twin to California King sizing</li><li>Retail barcodes and packaging</li><li>Hotel and hospitality programmes</li></ul>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.06s' }}>
                <span className="no">ii. EUROPE</span>
                <h3>UK &amp; Germany</h3>
                <p>UK and EU bed sizes, labelling and packaging for European retail.</p>
                <ul><li>UK and continental EU sizing</li><li>Market-specific care labelling</li><li>Private-label home collections</li></ul>
              </div>
              <div className="vcard" data-reveal>
                <span className="no">iii. MIDDLE EAST</span>
                <h3>UAE &amp; Saudi Arabia</h3>
                <p>Hotel linen and home collections for the GCC's hospitality and retail sectors.</p>
                <ul><li>Hotel-grade bed and table linen</li><li>Bulk hospitality packing</li><li>Retail home collections</li></ul>
              </div>
              <div className="vcard" data-reveal style={{ '--d': '.06s' }}>
                <span className="no">iv. OCEANIA</span>
                <h3>Australia</h3>
                <p>Bedding and table linen for importers, wholesalers and homeware brands.</p>
                <ul><li>Australian bed sizes</li><li>Importer and wholesaler programmes</li><li>Mixed-product consolidated orders</li></ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container reach">
            <div data-reveal>
              <span className="kicker"><b>02</b> EXPORT SUPPORT</span>
              <h2 className="h2">Paperwork and freight, <em>handled.</em></h2>
              <ul className="trade-list">
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg></span><div><strong>Export documentation</strong><span>Commercial invoice, packing list, certificate of origin and shipping documents for every order.</span></div></li>
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h11M4 7l3-3M4 7l3 3M20 17H9M20 17l-3-3M20 17l-3 3" /></svg></span><div><strong>Flexible trade terms</strong><span>FOB, CIF and other Incoterms, agreed per order to suit your logistics.</span></div></li>
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg></span><div><strong>Mixed-product shipments</strong><span>Combine bedsheets, covers and table linen in a single consolidated order.</span></div></li>
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" /></svg></span><div><strong>Clear communication</strong><span>A dedicated contact and progress updates from sampling to dispatch.</span></div></li>
              </ul>
            </div>
            <div data-reveal style={{ '--d': '.1s' }}>
              <span className="kicker">COMMON TRADE TERMS</span>
              <p className="body" style={{ margin: '18px 0 24px' }}>Terms are agreed per order. These are the ones our buyers use most often.</p>
              <div className="table-wrap">
                <table className="terms">
                  <thead><tr><th scope="col">TERM</th><th scope="col">WHAT IT MEANS FOR YOU</th></tr></thead>
                  <tbody>
                    <tr><td>FOB</td><td>We deliver the goods on board your vessel at the Indian port. You arrange and pay for main freight and insurance.</td></tr>
                    <tr><td>CIF</td><td>We arrange and pay for freight and insurance to your destination port. You handle import clearance on arrival.</td></tr>
                    <tr><td>CFR</td><td>As CIF, but without insurance — useful if you already insure your cargo.</td></tr>
                    <tr><td>Other</td><td>Ask us about other Incoterms if your logistics need a different arrangement.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '96px' }}>
          <div className="container">
            <div className="cta-band" data-reveal>
              <div>
                <h2>Shipping to a new market? <em>We'll plan it.</em></h2>
                <p>Tell us your destination port and target market — we'll advise on sizing, labelling and trade terms with your quotation.</p>
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
    </>
  );
}
