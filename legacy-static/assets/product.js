// Product detail page: product.html?slug=hotel-grade-bed-linen
(() => {
  const { esc, arrow, reveal, productCard, getProduct, getProducts, FALLBACK_IMG } = window.TE;
  const host = document.getElementById('pd');
  const slug = new URLSearchParams(location.search).get('slug');

  const notFound = (title, text) => {
    document.title = 'Product not found — Timeless Exim';
    host.innerHTML = `
      <div class="state" style="padding:96px 24px">
        <h3>${title}</h3>
        <p>${text}</p>
        <a class="btn btn-dark" href="products.html">Browse all products</a>
      </div>`;
  };

  if (!slug) return notFound('No product selected.', 'Choose a product from our catalogue to see its details.');

  getProduct(slug)
    .then(p => {
      document.title = `${p.name} — Timeless Exim`;
      document.querySelector('meta[name="description"]').setAttribute('content', p.description || `${p.name} from Timeless Exim.`);

      const enquire = `contact.html?${new URLSearchParams({ product: p.category_name || 'Custom Orders', item: p.name })}#enquiry`;
      const specs = (p.specs || []).map(s => `<span>${esc(s)}</span>`).join('');
      const cat = p.category_slug
        ? `<a href="products.html?category=${encodeURIComponent(p.category_slug)}">${esc(p.category_name)}</a><span class="sep"></span>`
        : '';

      host.innerHTML = `
        <div class="pd">
          <div class="pd-media" data-reveal>
            <img src="${esc(p.image_url || FALLBACK_IMG)}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
          </div>
          <div class="pd-info" data-reveal style="--d:.08s">
            <nav class="crumbs" aria-label="Breadcrumb">
              <a href="index.html">Home</a><span class="sep"></span>
              <a href="products.html">Products</a><span class="sep"></span>
              ${cat}<span aria-current="page">${esc(p.name)}</span>
            </nav>
            <span class="kicker">${esc((p.category_name || 'Home textiles').toUpperCase())}</span>
            <h1>${esc(p.name)}</h1>
            ${p.description ? `<p class="lead">${esc(p.description)}</p>` : ''}
            ${specs ? `<div class="pd-specs">${specs}</div>` : ''}
            <div class="pd-actions">
              <a class="btn btn-dark" href="${enquire}">Request a quote ${arrow.replace('<svg', '<svg class="arrow"')}</a>
              <a class="btn btn-light" href="https://wa.me/?text=${encodeURIComponent(`Hello Timeless Exim, I'd like a quote for: ${p.name}`)}">Ask on WhatsApp</a>
            </div>
            <dl class="pd-table">
              <div><dt>CUSTOMISATION</dt><dd>Fabric, thread count / GSM, size, colour and finish developed to your specification.</dd></div>
              <div><dt>SIZES</dt><dd>US, UK and EU standard sizes, or custom dimensions.</dd></div>
              <div><dt>PACKAGING</dt><dd>Private label, care labels, barcodes, inserts, polybags, retail boxes or bulk cartons.</dd></div>
              <div><dt>MOQ</dt><dd>Confirmed with your quotation — depends on fabric and level of customisation.</dd></div>
              <div><dt>SAMPLES</dt><dd>Developed and couriered for approval before bulk production.</dd></div>
              <div><dt>TRADE TERMS</dt><dd>FOB, CIF and other Incoterms, agreed per order.</dd></div>
            </dl>
            <p class="pd-note"><strong>Sourcing for a hotel, retailer or private-label brand?</strong> Mention your target market and destination port in your enquiry and we'll prepare sizing, labelling and documentation for it.</p>
          </div>
        </div>`;
      reveal(host);
      return getProducts().then(all => {
        const others = all.filter(x => x.id !== p.id);
        const related = [
          ...others.filter(x => x.category_slug === p.category_slug),
          ...others.filter(x => x.category_slug !== p.category_slug && x.featured),
          ...others,
        ].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 3);
        if (!related.length) return;
        const grid = document.getElementById('relatedGrid');
        grid.innerHTML = related.map(productCard).join('');
        document.getElementById('related').hidden = false;
        reveal(grid);
      });
    })
    .catch(err => {
      if (err.status === 404) notFound('This product isn’t available.', 'It may have been renamed or removed from our catalogue.');
      else notFound('This product couldn’t load.', 'Please refresh the page in a moment.');
    });
})();
