import { useEffect, useRef, useState } from 'react';

// Dotted world map with India → global trade routes, drawn behind the home-page showcase.
// The map code and land data load only when the map is about to scroll into view.
const W = 1320;
const H = 560;
const STEP = 14;
const ORIGIN = [78.9, 21.5];
const DESTS = [
  { name: 'USA', c: [-96, 38], a: 'end' },
  { name: 'CANADA', c: [-100, 56], a: 'end' },
  { name: 'UK', c: [-2, 53.5], a: 'end' },
  { name: 'GERMANY', c: [10.4, 51.2], a: 'start' },
  { name: 'SAUDI ARABIA', c: [45, 24], a: 'end' },
  { name: 'UAE', c: [54.3, 24.2], a: 'start' },
];

async function buildMap() {
  const [{ geoEquirectangular, geoContains }, { feature }, topo] = await Promise.all([
    import('d3-geo'),
    import('topojson-client'),
    import('world-atlas/land-110m.json'),
  ]);
  const land = feature(topo.default || topo, (topo.default || topo).objects.land);
  // Top of the band sits at 74°N so the northern trade lanes stay visible above the tiles
  const s = (W / (2 * Math.PI)) * 1.02;
  const proj = geoEquirectangular().scale(s).center([8, 0]).translate([W / 2, s * ((74 * Math.PI) / 180)]);

  const dots = [];
  for (let y = STEP / 2; y < H; y += STEP) {
    for (let x = STEP / 2; x < W; x += STEP) {
      const ll = proj.invert([x, y]);
      if (ll && geoContains(land, ll)) dots.push([x, y]);
    }
  }
  const [ox, oy] = proj(ORIGIN);
  const routes = DESTS.map((d, i) => {
    const [x, y] = proj(d.c);
    const mx = (ox + x) / 2;
    const my = (oy + y) / 2;
    const dist = Math.hypot(x - ox, y - oy);
    const cy = Math.max(8, my - Math.min(110, dist * 0.3));
    return { ...d, x, y, i, path: `M${ox},${oy} Q${mx},${cy} ${x},${y}`, len: Math.round(dist * 1.25) };
  });
  return { dots, routes, ox, oy };
}

export default function WorldMap() {
  const host = useRef(null);
  const [map, setMap] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const run = () => buildMap().then((m) => { if (live) setMap(m); }).catch(() => {}); // degrade silently
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); idle(run); }
    }, { rootMargin: '600px 0px' });
    io.observe(host.current);
    return () => { live = false; io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!map) return undefined;
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [map]);

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={'world' + (ready ? ' ready' : '')} aria-hidden="true" ref={host}>
      {map && (
        <svg viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="fx"><stop offset="0" stopColor="#000" /><stop offset=".12" stopColor="#fff" /><stop offset=".88" stopColor="#fff" /><stop offset="1" stopColor="#000" /></linearGradient>
            <mask id="m"><rect width={W} height={H} fill="url(#fx)" /></mask>
          </defs>
          <g className="land" mask="url(#m)">
            {map.dots.map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r="1.25" />)}
          </g>
          <g>
            {map.routes.map((r) => (
              <g key={r.name}>
                <path className="route" d={r.path} />
                {!reduced && (
                  <path
                    className="route route-draw"
                    d={r.path}
                    style={{ '--len': r.len, strokeDasharray: r.len, animationDelay: `${0.4 + r.i * 0.1}s`, strokeOpacity: 0.5 }}
                  />
                )}
                <circle className="marker" cx={r.x} cy={r.y} r="3" />
                <text className="label" x={r.a === 'end' ? r.x - 8 : r.x + 8} y={r.y + 3.5} textAnchor={r.a}>{r.name}</text>
              </g>
            ))}
            <circle className="origin-ring" cx={map.ox} cy={map.oy} r="9" />
            <circle className="origin" cx={map.ox} cy={map.oy} r="4" />
            <text className="label origin-label" x={map.ox + 14} y={map.oy - 10}>INDIA</text>
            <text className="legend" x={W - 8} y="40" textAnchor="end">EXPORT LANES</text>
            <text className="legend v" x={W - 8} y="62" textAnchor="end">India → Global Markets</text>
            <text className="legend" x={W - 8} y="84" textAnchor="end">+ AUSTRALIA · EUROPE · GCC</text>
          </g>
        </svg>
      )}
    </div>
  );
}
