import { Link } from 'react-router-dom';
import { CONTACT } from '../config.js';
import { Logo } from './Header.jsx';

const PRODUCT_LINKS = [
  ['bedsheets', 'Bedsheets'],
  ['pillow-covers', 'Pillow Covers'],
  ['cushion-covers', 'Cushion Covers'],
  ['duvet-covers', 'Duvet Covers'],
  ['table-linen', 'Table Linen'],
  ['custom-orders', 'Custom Textiles'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="blurb">Premium home textiles sourced in India and supplied to importers, wholesalers, retailers and hospitality businesses around the world.</p>
          </div>
          <div>
            <h4>PRODUCTS</h4>
            <ul>
              {PRODUCT_LINKS.map(([slug, label]) => (
                <li key={slug}><Link to={`/products?category=${slug}`}>{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>COMPANY</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/process">Our Process</Link></li>
              <li><Link to="/markets">Global Reach</Link></li>
              <li><Link to="/contact#faq">FAQs</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>GET IN TOUCH</h4>
            <ul className="contact-lines">
              <li><b>EXPORT ENQUIRIES</b><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><b>PHONE &amp; WHATSAPP</b><a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a></li>
              <li><b>HEAD OFFICE</b>{CONTACT.addressShort}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Timeless Exim. All rights reserved.</span>
          <span>Sourced in India · Supplied worldwide</span>
        </div>
      </div>
    </footer>
  );
}
