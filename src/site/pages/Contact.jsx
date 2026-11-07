import { usePage } from '../hooks.js';
import { CONTACT } from '../config.js';
import EnquiryForm from '../components/EnquiryForm.jsx';
import IndiaClock from '../components/IndiaClock.jsx';

export default function Contact() {
  usePage("Contact — Timeless Exim", "Contact Timeless Exim for export quotations on bedsheets, pillow covers, cushion covers, duvet covers, bed linen and custom home textiles.");
  return (
    <>
      <main className="hero">
        <div className="guides" aria-hidden="true">
          <span className="v l"></span><span className="v c"></span><span className="v r"></span>
        </div>
        <div className="hero-top" aria-hidden="true">
          <div className="hline full"><div className="dots"><i></i><i></i><i></i></div></div>
        </div>

        <section className="container page-hero hero-copy">
          <div className="eyebrow reveal" style={{ '--d': '.05s' }}>
            <span className="pulse"></span>
            CONTACT <span className="sep"></span> EXPORT ENQUIRIES
          </div>
          <h1 className="headline">
            <span className="line"><span style={{ '--d': '.15s' }}>Let's discuss</span></span>
            <span className="line"><span style={{ '--d': '.3s' }}><em>your next order.</em></span></span>
          </h1>
          <p className="lede reveal" style={{ '--d': '.5s' }}>Whether you're sourcing a first trial order or planning a container programme, tell us what you need and our export team will reply with options, samples and a detailed quotation.</p>
          <div className="contact-quick reveal" style={{ '--d': '.62s' }}>
            <a href={`mailto:${CONTACT.email}`} className="btn btn-light">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
              Email the export desk
            </a>
            <a href={CONTACT.whatsapp} className="btn btn-light">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" /><path d="M9.2 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.6.4-1.4.6-2.1.4-2.6-.8-4.7-2.9-5.5-5.5-.2-.7 0-1.5.5-2Z" /></svg>
              WhatsApp us
            </a>
            <a href={CONTACT.phoneHref} className="btn btn-ghost">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: '96px' }}>
          <div className="contact-layout">
            <EnquiryForm />

            <aside className="side">
              <div className="card info-card" data-reveal style={{ '--d': '.08s' }}>
                <div className="k">DIRECT CONTACT</div>
                <div className="contact-row">
                  <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span>
                  <div><small>Export enquiries</small><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
                </div>
                <div className="contact-row">
                  <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" /><path d="M9.2 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.6.4-1.4.6-2.1.4-2.6-.8-4.7-2.9-5.5-5.5-.2-.7 0-1.5.5-2Z" /></svg></span>
                  <div><small>Phone &amp; WhatsApp</small><a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></div>
                </div>
                <div className="contact-row">
                  <span className="ic"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span>
                  <div><small>Head office</small><span className="val">{CONTACT.addressLines[0]}<br />{CONTACT.addressLines[1]}</span></div>
                </div>
              </div>

              <div className="card info-card" data-reveal style={{ '--d': '.16s' }}>
                <div className="k">BUSINESS HOURS · IST (UTC+5:30)</div>
                <div className="hours">
                  <span>Monday – Friday</span><b>9:30 – 18:30</b>
                  <span>Saturday</span><b>10:00 – 14:00</b>
                  <span>Sunday</span><b>Closed</b>
                </div>
                <IndiaClock />
              </div>

              <div className="card info-card" data-reveal style={{ '--d': '.24s' }}>
                <div className="k">WHAT HAPPENS NEXT</div>
                <ol className="next-steps">
                  <li><div><strong>We review your brief</strong> and may ask a few questions about specs or destination.</div></li>
                  <li><div><strong>You receive options &amp; pricing</strong> with a quotation for your volumes and trade terms.</div></li>
                  <li><div><strong>Samples are dispatched</strong> for approval before bulk production begins.</div></li>
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="kicker">FREQUENTLY ASKED</span>
            <h2 className="h2">Questions from <em>international buyers.</em></h2>
          </div>
          <div className="faq" data-reveal>
            <details open>
              <summary>What is your minimum order quantity?<span className="pm"></span></summary>
              <div className="ans">MOQs depend on the product, fabric and level of customisation. Standard ranges can start at smaller volumes, while custom developments and private-label programmes need higher quantities. Share your requirement and we'll confirm the MOQ with your quotation.</div>
            </details>
            <details>
              <summary>Can we receive samples before placing a bulk order?<span className="pm"></span></summary>
              <div className="ans">Yes. We develop and courier samples so you can approve fabric, colour, size and finish before production. Sample and courier charges, and whether they can be adjusted against your bulk order, are confirmed at the enquiry stage.</div>
            </details>
            <details>
              <summary>Do you offer private labelling and custom packaging?<span className="pm"></span></summary>
              <div className="ans">Yes. We can apply your woven or printed labels, care labels, barcodes and inserts, and pack into polybags, retail boxes or bulk cartons to your specification.</div>
            </details>
            <details>
              <summary>What are your production lead times?<span className="pm"></span></summary>
              <div className="ans">Lead times vary with product, quantity, fabric availability and season. Once samples are approved we confirm a production and dispatch schedule, and keep you updated at each milestone.</div>
            </details>
            <details>
              <summary>Which countries do you export to?<span className="pm"></span></summary>
              <div className="ans">We supply buyers across North America, Europe, the Middle East and Oceania — including the USA, Canada, the UK, Germany, the UAE, Saudi Arabia and Australia. Other destinations are welcome; just tell us your port.</div>
            </details>
            <details>
              <summary>What trade terms and documents do you provide?<span className="pm"></span></summary>
              <div className="ans">We work with common Incoterms such as FOB and CIF, agreed per order. Each shipment is supported by a commercial invoice, packing list, certificate of origin and the relevant shipping documents; payment terms are confirmed with your quotation.</div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
