import './styles/styles.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/responsive.css';

import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useRevealOnScroll } from './hooks.js';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import Product from './pages/Product.jsx';
import Process from './pages/Process.jsx';
import Markets from './pages/Markets.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// After each navigation: jump to the #section if there is one, otherwise to the top of the page.
function ScrollManager() {
  const { pathname, search, hash, state } = useLocation();
  useEffect(() => {
    if (state?.keepScroll) return undefined;
    if (!hash) { window.scrollTo(0, 0); return undefined; }
    let tries = 0;
    let timer;
    const go = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: tries ? 'smooth' : 'auto', block: 'start' });
      else if (tries++ < 20) timer = setTimeout(go, 50);
    };
    go();
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search, hash]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const ref = useRef(null);
  useRevealOnScroll(ref, pathname);
  return (
    <>
      <ScrollManager />
      <Header />
      <div ref={ref} key={pathname}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

// Old links such as /about.html or product.html?slug=x keep working
function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();
  const m = pathname.match(/^\/(index|about|products|product|process|markets|contact)(?:\.html)?$/);
  if (!m) return <NotFound />;
  if (m[1] === 'product') return <ProductBySlugQuery />;
  const to = m[1] === 'index' ? '/' : '/' + m[1];
  return <Navigate to={to + search + hash} replace />;
}

function ProductBySlugQuery() {
  const [params] = useSearchParams();
  const slug = params.get('slug');
  return <Navigate to={slug ? `/products/${encodeURIComponent(slug)}` : '/products'} replace />;
}

export default function SiteApp() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<Product />} />
          <Route path="process" element={<Process />} />
          <Route path="markets" element={<Markets />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<LegacyRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
