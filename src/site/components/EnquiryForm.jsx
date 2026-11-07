import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories } from '../catalog.js';
import { CONTACT } from '../config.js';
import { ArrowIcon } from './Icons.jsx';

// Shown until the live categories load (or if they can't)
const DEFAULT_PRODUCTS = [
  ['Bedsheets', 'Bedsheets'], ['Pillow Covers', 'Pillow Covers'], ['Cushion Covers', 'Cushion Covers'],
  ['Duvet Covers', 'Duvet Covers'], ['Bed Linen', 'Bed Linen Sets'], ['Comforter Covers', 'Comforter Covers'],
  ['Table Linen', 'Table Linen'], ['Custom Orders', 'Custom / Private Label'],
];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'United Arab Emirates', 'Saudi Arabia', 'Australia', 'France', 'Netherlands', 'Italy', 'Spain', 'Qatar', 'New Zealand'];
const BUSINESS_TYPES = ['Importer', 'Wholesaler', 'Distributor', 'Retailer', 'Hotel / Hospitality', 'Home textile brand', 'Sourcing company', 'Other'];
const QUANTITIES = ['Samples / trial order', 'Up to 1,000 pieces', '1,000 – 5,000 pieces', '5,000 – 20,000 pieces', '20,000+ pieces / container loads'];
const TIMELINES = ['As soon as possible', 'Within 1–2 months', 'Within 3–6 months', 'Planning ahead / exploring'];

const EMPTY = { name: '', company: '', email: '', phone: '', country: '', business_type: '', quantity: '', timeline: '', message: '' };
const REQUIRED = ['name', 'company', 'email', 'country', 'products', 'message'];
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function findErrors(values, products) {
  const bad = new Set();
  ['name', 'company', 'country', 'message'].forEach((n) => { if (!values[n].trim()) bad.add(n); });
  if (!emailOk(values.email.trim())) bad.add('email');
  if (!products.length) bad.add('products');
  return bad;
}

export default function EnquiryForm() {
  const [params] = useSearchParams();
  const wanted = params.get('product');
  const item = params.get('item');

  const initial = () => ({ ...EMPTY, message: item ? `I'm interested in: ${item}\n\n` : '' });
  const [values, setValues] = useState(initial);
  const [products, setProducts] = useState(() => (wanted ? [wanted] : []));
  const [options, setOptions] = useState(DEFAULT_PRODUCTS);
  const [errors, setErrors] = useState(new Set());
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [sendError, setSendError] = useState('');
  const [firstName, setFirstName] = useState('');
  const cardRef = useRef(null);
  const formRef = useRef(null);

  // Arriving from a product page (/contact?product=Bedsheets&item=...) pre-fills the form
  useEffect(() => {
    if (wanted) setProducts((p) => (p.includes(wanted) ? p : [...p, wanted]));
    if (item) setValues((v) => (v.message ? v : { ...v, message: `I'm interested in: ${item}\n\n` }));
  }, [wanted, item]);

  // Keep the product chips in step with the categories managed in the admin panel
  useEffect(() => {
    let live = true;
    getCategories().then((cats) => { if (live && cats.length) setOptions(cats.map((c) => [c.name, c.name])); }).catch(() => {});
    return () => { live = false; };
  }, []);

  // Selected products that aren't in the list (e.g. from a link) still show as chips
  const chips = useMemo(() => {
    const extra = products.filter((p) => !options.some(([v]) => v === p)).map((p) => [p, p]);
    return [...options, ...extra];
  }, [options, products]);

  const revalidate = (nextValues, nextProducts) => {
    if (errors.size) setErrors(findErrors(nextValues, nextProducts));
  };
  const setField = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    revalidate(next, products);
  };
  const toggleProduct = (name) => {
    const next = products.includes(name) ? products.filter((p) => p !== name) : [...products, name];
    setProducts(next);
    revalidate(values, next);
  };

  async function submit(e) {
    e.preventDefault();
    const bad = findErrors(values, products);
    setErrors(bad);
    if (bad.size) {
      const first = REQUIRED.find((n) => bad.has(n));
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setSendError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, products }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setStatus('idle');
      setSendError(`Sorry, we couldn't send your enquiry. Please try again, or email us at ${CONTACT.email}.`);
      return;
    }
    setFirstName(values.name.trim().split(/\s+/)[0]);
    setStatus('sent');
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function reset() {
    setValues({ ...EMPTY });
    setProducts([]);
    setErrors(new Set());
    setStatus('idle');
  }

  const field = (name, extra = '') => `field${extra}${errors.has(name) ? ' invalid' : ''}`;

  return (
    <div className={'card form-card' + (status === 'sent' ? ' sent' : '')} id="enquiry" data-reveal ref={cardRef}>
      <form noValidate onSubmit={submit} ref={formRef}>
        <div className="h3">Request a quotation</div>
        <p className="sub">Fields marked <span style={{ color: 'var(--gold)' }}>*</span> are required. The more detail you share, the more precise our quote.</p>

        <div className="form-grid">
          <div className={field('name')}>
            <label htmlFor="f-name">FULL NAME <i>*</i></label>
            <input className="input" id="f-name" name="name" autoComplete="name" placeholder="Your name" required value={values.name} onChange={setField('name')} />
            <span className="err">Please enter your name.</span>
          </div>
          <div className={field('company')}>
            <label htmlFor="f-company">COMPANY <i>*</i></label>
            <input className="input" id="f-company" name="company" autoComplete="organization" placeholder="Company name" required value={values.company} onChange={setField('company')} />
            <span className="err">Please enter your company.</span>
          </div>
          <div className={field('email')}>
            <label htmlFor="f-email">BUSINESS EMAIL <i>*</i></label>
            <input className="input" id="f-email" name="email" type="email" autoComplete="email" placeholder="name@company.com" required value={values.email} onChange={setField('email')} />
            <span className="err">Please enter a valid email address.</span>
          </div>
          <div className="field">
            <label htmlFor="f-phone">PHONE / WHATSAPP</label>
            <input className="input" id="f-phone" name="phone" type="tel" autoComplete="tel" placeholder="Include country code" value={values.phone} onChange={setField('phone')} />
          </div>
          <div className={field('country')}>
            <label htmlFor="f-country">COUNTRY <i>*</i></label>
            <input className="input" id="f-country" name="country" autoComplete="country-name" placeholder="e.g. United Kingdom" list="countries" required value={values.country} onChange={setField('country')} />
            <datalist id="countries">
              {COUNTRIES.map((c) => <option key={c} value={c} />)}
            </datalist>
            <span className="err">Please enter your country.</span>
          </div>
          <div className="field">
            <label htmlFor="f-type">BUSINESS TYPE</label>
            <select className="input" id="f-type" name="business_type" value={values.business_type} onChange={setField('business_type')}>
              <option value="">Select one</option>
              {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <fieldset className={field('products', ' full')}>
            <legend>PRODUCTS OF INTEREST <i>*</i></legend>
            <div className="chips">
              {chips.map(([value, label]) => (
                <label className="chip" key={value}>
                  <input type="checkbox" name="products" value={value} checked={products.includes(value)} onChange={() => toggleProduct(value)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <span className="err">Please choose at least one product.</span>
          </fieldset>

          <div className="field">
            <label htmlFor="f-qty">ESTIMATED QUANTITY</label>
            <select className="input" id="f-qty" name="quantity" value={values.quantity} onChange={setField('quantity')}>
              <option value="">Select a range</option>
              {QUANTITIES.map((q) => <option key={q}>{q}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-when">TARGET DELIVERY</label>
            <select className="input" id="f-when" name="timeline" value={values.timeline} onChange={setField('timeline')}>
              <option value="">Select a timeline</option>
              {TIMELINES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={field('message', ' full')}>
            <label htmlFor="f-msg">YOUR REQUIREMENTS <i>*</i></label>
            <textarea className="input" id="f-msg" name="message" placeholder="Fabric, sizes, colours, thread count or GSM, packaging, labelling, destination port…" required value={values.message} onChange={setField('message')}></textarea>
            <span className="err">Please tell us a little about your requirements.</span>
          </div>
        </div>

        <div className="form-foot">
          {sendError
            ? <p className="fine" role="alert" style={{ color: '#B4442E' }}>{sendError}</p>
            : <p className="fine">We use your details only to respond to this enquiry. We never share them with third parties.</p>}
          <button type="submit" className="btn btn-dark" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
            <ArrowIcon className="arrow" />
          </button>
        </div>
      </form>

      <div className="success" role="status" aria-live="polite">
        <div className="seal"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></div>
        <h3>Thank you, <span>{firstName || "we've got it"}</span>.</h3>
        <p>Your enquiry has reached our export team. We aim to reply within one business day with options and pricing.</p>
        <button className="btn btn-light" type="button" onClick={reset}>Send another enquiry</button>
      </div>
    </div>
  );
}
