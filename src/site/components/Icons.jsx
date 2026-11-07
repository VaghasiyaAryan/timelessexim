const base = {
  'aria-hidden': 'true', focusable: 'false', viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round',
};

export const ArrowIcon = (props) => (
  <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export const WhatsAppIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.3-3.8A8.2 8.2 0 1 1 20 11.6Z" />
    <path d="M9.2 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.5 2.5l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.6.4-1.4.6-2.1.4-2.6-.8-4.7-2.9-5.5-5.5-.2-.7 0-1.5.5-2Z" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...base} {...props}><path d="M4 8h16M4 16h16" /></svg>
);

export const SearchIcon = (props) => (
  <svg {...base} strokeWidth="1.6" {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

// Brand mark: placeholder until the official logo asset is available
export const LogoMark = () => (
  <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="23" fill="none" stroke="#171717" strokeWidth="1" />
    <circle cx="24" cy="24" r="19.5" fill="none" stroke="#B59A6A" strokeWidth=".6" />
    <text x="24" y="30.5" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="19" fontWeight="600" fill="#171717" letterSpacing="-.5">T<tspan fill="#B59A6A">E</tspan></text>
  </svg>
);
