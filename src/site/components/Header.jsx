import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, CONTACT } from '../config.js';
import { LogoMark, MenuIcon, WhatsAppIcon } from './Icons.jsx';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Timeless Exim — home">
      <LogoMark />
      <span className="logo-text">
        <span className="logo-name">TIMELESS <span>EXIM</span></span>
        <span className="logo-tag">GLOBAL TEXTILE EXPORTS</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu after navigating, and on Escape
  useEffect(() => setOpen(false), [location.pathname, location.search, location.hash]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={'header' + (open ? ' menu-open' : '')}>
      <div className="container">
        <Logo />

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>)}
        </nav>

        <div className="header-actions">
          <a href={CONTACT.whatsapp} className="btn btn-light btn-sm" aria-label="Chat on WhatsApp">
            <WhatsAppIcon />
            WhatsApp
          </a>
          <Link to="/contact#enquiry" className="btn btn-dark btn-sm">Request a Quote</Link>
          <button
            className="menu-btn"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="drawer"
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      <div className="drawer" id="drawer">
        <nav aria-label="Mobile">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>)}
        </nav>
        <div className="drawer-actions">
          <Link to="/contact#enquiry" className="btn btn-dark">Request a Quote</Link>
          <a href={CONTACT.whatsapp} className="btn btn-light">WhatsApp</a>
        </div>
      </div>
    </header>
  );
}
