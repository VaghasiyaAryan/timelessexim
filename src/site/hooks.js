import { useEffect, useState } from 'react';

// Sets the browser-tab title and meta description for the current page.
export function usePage(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);
}

// Scroll-in animations: any element with [data-reveal] gets the "in" class once it enters the viewport.
// Watches the page for new elements too (e.g. product cards that arrive from the API).
export function useRevealOnScroll(rootRef, key) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
      : null;
    const scan = () => root.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
    scan();
    // Page-hero entrance (headline + .reveal items inside .hero-copy)
    const heroCopy = root.querySelector('.hero-copy');
    const raf = heroCopy ? requestAnimationFrame(() => heroCopy.classList.add('ready')) : 0;
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => { io?.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, [rootRef, key]);
}

// Small fetch helper for components: { data, error, loading }
export function useFetch(fn, deps) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn().then(
      (data) => live && setState({ data, error: null, loading: false }),
      (error) => live && setState({ data: undefined, error, loading: false })
    );
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
