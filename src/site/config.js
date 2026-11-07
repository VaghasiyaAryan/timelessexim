// Company contact details used across the website. Update them here once and every page follows.
export const CONTACT = {
  email: 'export@timelessexim.com',
  phoneDisplay: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  // Add the business number in international format without "+" or spaces, e.g. https://wa.me/919876543210
  whatsapp: 'https://wa.me/',
  addressShort: 'Address line, City, State, India',
  addressLines: ['Address line 1', 'City, State, PIN — India'],
};

export const whatsappLink = (text) => (text ? `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}` : CONTACT.whatsapp);

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/process', label: 'Our Process' },
  { to: '/markets', label: 'Global Reach' },
  { to: '/contact', label: 'Contact' },
];
