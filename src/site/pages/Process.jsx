import { Link } from 'react-router-dom';
import { usePage } from '../hooks.js';

export default function Process() {
  usePage("Our Process — Timeless Exim", "How Timeless Exim takes a home textile order from first enquiry to your port: brief, sampling, production and quality control, packing and labelling, documentation and shipping.");
  return (
    <>
      <main>
        <div className="hero">
          <div className="guides" aria-hidden="true"><span className="v l"></span><span className="v c"></span><span className="v r"></span></div>
          <div className="hero-top" aria-hidden="true"><div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div></div>
          <section className="container page-hero compact hero-copy">
            <div className="eyebrow reveal" style={{ '--d': '.05s' }}><span className="pulse"></span> OUR PROCESS <span className="sep"></span> FIVE STAGES</div>
            <h1 className="headline">
              <span className="line"><span style={{ '--d': '.15s' }}>From first enquiry</span></span>
              <span className="line"><span style={{ '--d': '.3s' }}><em>to your port.</em></span></span>
            </h1>
            <p className="lede reveal" style={{ '--d': '.5s' }}>A clear, five-stage process with one point of contact and progress updates at every milestone — so you always know where your order stands.</p>
          </section>
        </div>

        <section className="section" style={{ paddingTop: '64px' }}>
          <div className="container">
            <div className="steps" data-reveal>
              <div className="step"><div className="n">i</div><h3>Enquiry &amp; Brief</h3><div className="meta">REQUIREMENTS</div></div>
              <div className="step"><div className="n">ii</div><h3>Sampling</h3><div className="meta">APPROVAL</div></div>
              <div className="step"><div className="n">iii</div><h3>Production &amp; QC</h3><div className="meta">INSPECTION</div></div>
              <div className="step"><div className="n">iv</div><h3>Packing &amp; Labelling</h3><div className="meta">RETAIL-READY</div></div>
              <div className="step"><div className="n">v</div><h3>Documentation &amp; Shipping</h3><div className="meta">DISPATCH</div></div>
            </div>

            <div style={{ marginTop: '80px' }}>
              <article className="stage" data-reveal>
                <div className="n">i.</div>
                <div><h3>Enquiry &amp; brief</h3><div className="meta">YOU SHARE · WE CLARIFY</div></div>
                <div>
                  <p>Tell us the products, specifications, quantities and target market you're sourcing for. A reference image, tech pack or target price is all we need to start.</p>
                  <ul><li>Product, fabric and size requirements</li><li>Estimated quantities and delivery window</li><li>Destination country and port</li></ul>
                </div>
              </article>
              <article className="stage" data-reveal>
                <div className="n">ii.</div>
                <div><h3>Sampling</h3><div className="meta">APPROVAL BEFORE BULK</div></div>
                <div>
                  <p>We propose fabric and construction options, develop samples and courier them to you so you can approve fabric, colour, size and finish.</p>
                  <ul><li>Quotation for your volumes and trade terms</li><li>Physical samples for sign-off</li><li>Revisions until the sample is right</li></ul>
                </div>
              </article>
              <article className="stage" data-reveal>
                <div className="n">iii.</div>
                <div><h3>Production &amp; QC</h3><div className="meta">INSPECTED AGAINST YOUR SAMPLE</div></div>
                <div>
                  <p>Bulk production runs with in-line and final inspections. Every batch is checked against the approved sample before it moves to packing.</p>
                  <ul><li>Weave, finish and colour-fastness checks</li><li>Measurement and stitching inspection</li><li>Milestone updates during production</li></ul>
                </div>
              </article>
              <article className="stage" data-reveal>
                <div className="n">iv.</div>
                <div><h3>Packing &amp; labelling</h3><div className="meta">READY FOR YOUR SHELVES</div></div>
                <div>
                  <p>Private labels, barcodes, inserts and cartons prepared to your market's requirements, so goods arrive ready for retail or hospitality use.</p>
                  <ul><li>Woven or printed labels, care labels</li><li>Polybags, retail boxes or bulk cartons</li><li>Carton marking to your specification</li></ul>
                </div>
              </article>
              <article className="stage" data-reveal>
                <div className="n">v.</div>
                <div><h3>Documentation &amp; shipping</h3><div className="meta">THROUGH TO YOUR PORT</div></div>
                <div>
                  <p>Export paperwork, freight booking and dispatch coordinated through to your destination, under the Incoterms agreed for your order.</p>
                  <ul><li>Commercial invoice and packing list</li><li>Certificate of origin and shipping documents</li><li>FOB, CIF and other Incoterms</li></ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container split">
            <div className="split-media" data-reveal><img src="https://images.unsplash.com/photo-1605459437907-541c4e2c0ed1?w=1100&q=80&auto=format&fit=crop" alt="Close-up of fine cotton weave being inspected" loading="lazy" /></div>
            <div data-reveal style={{ '--d': '.1s' }}>
              <span className="kicker">QUALITY ASSURANCE</span>
              <h2 className="h2">Every batch, <em>checked twice.</em></h2>
              <p className="body" style={{ marginTop: '22px' }}>Quality isn't a final step — it's built into production. We inspect during manufacturing and again before packing, always against the sample you approved.</p>
              <ul className="trade-list">
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5.5" /><path d="M9.5 9l1.8 1.8L14.8 7.3M8.5 13.8 7 21l5-2.5 5 2.5-1.5-7.2" /></svg></span><div><strong>In-line inspection</strong><span>Issues caught during production, not after it.</span></div></li>
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6l7-3Z" /><path d="M8.8 12.2l2.2 2.2 4.4-4.6" /></svg></span><div><strong>Final inspection</strong><span>Weave, finish, measurements and colour-fastness checked before packing.</span></div></li>
                <li><span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg></span><div><strong>Consistent lots</strong><span>Container-scale volumes with consistent lot quality on repeat orders.</span></div></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '96px' }}>
          <div className="container">
            <div className="cta-band" data-reveal>
              <div>
                <h2>Start with stage one. <em>Send your brief.</em></h2>
                <p>Share what you're sourcing and we'll reply with options, a quotation and a sampling plan.</p>
              </div>
              <div className="actions">
                <Link to="/contact#enquiry" className="btn btn-gold">Request a Quote</Link>
                <Link to="/contact#faq" className="btn btn-outline">Read the FAQs</Link>
                <span className="note">TYPICAL REPLY WITHIN ONE BUSINESS DAY</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
