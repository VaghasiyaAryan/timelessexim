import { Link } from 'react-router-dom';
import { usePage } from '../hooks.js';

export default function NotFound() {
  usePage('Page not found — Timeless Exim', 'The page you are looking for does not exist or has moved.');
  return (
    <main className="hero">
      <div className="guides" aria-hidden="true"><span className="v l"></span><span className="v c"></span><span className="v r"></span></div>
      <section className="container nf">
        <div className="code">404</div>
        <h1>This page has <em>shipped elsewhere.</em></h1>
        <p>The page you're looking for doesn't exist or has moved. Try the catalogue, or get in touch and we'll point you in the right direction.</p>
        <div className="cta-row">
          <Link to="/" className="btn btn-dark">Back to home</Link>
          <Link to="/products" className="btn btn-light">Browse products</Link>
          <Link to="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </section>
    </main>
  );
}
