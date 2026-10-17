/* Utilidades de interfaz — Propuesta 1 */
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.9.7 3.1 2.4 3.5 5.2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.2-7 8-7s7 2.5 8 7"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
  scan: '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 12h10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  agenda: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="1.5 2"/>',
  chart: '<path d="M3 20h18"/><path d="M6 16v-5M11 16V6M16 16v-8M20 16v-3"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v4h16v-4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  chevdown: '<path d="M6 9l6 6 6-6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  table: '<circle cx="12" cy="12" r="4"/><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  dollar: '<path d="M12 3v18M16 7.5c-.8-1.3-2.3-2-4-2-2.2 0-4 1.2-4 3s1.6 2.6 4 3 4 1.3 4 3.2-1.8 3.3-4 3.3c-1.9 0-3.4-.8-4.2-2.2"/>',
  api: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  badge: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16.5c.7-1.6 2-2.5 3.5-2.5s2.8.9 3.5 2.5M10 3v2h4V3"/>',
  coupon: '<path d="M4 4h9l7 7-9 9-7-7z"/><circle cx="8.5" cy="8.5" r="1.5"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  drag: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/>',
  text: '<path d="M5 6h14M5 12h10M5 18h7"/>',
  checkbox: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
  radio: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  section: '<path d="M4 6h16M4 12h16M4 18h16" stroke-dasharray="2 2"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  wing: '<path d="M3 19c5-1 9-4 11-9 1-3 3-5 7-7-1 4-2.5 6-4.5 7 1.7-.2 2.8-.8 3.8-1.4-1 2.6-3 4-5.6 4.4 1.2.3 2.2.3 3.2 0-2.2 2.6-6.4 5-14.9 6z"/>',
};
const I = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

let _uid = 0;
const uid = p => p + (++_uid);
const num = n => Number(n).toLocaleString('es-MX');
const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fd(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { d, m: MESES[m - 1], y, full: `${d} ${MESES[m - 1]} ${y}` };
}
const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);

const ESTADOS = { publico: ['Público', 'mint'], nolistado: ['No listado', 'cyan'], borrador: ['Borrador', 'gold'], privado: ['Privado', 'pink'] };
const RSVP = { confirmado: ['Confirmado', 'mint'], pendiente: ['Pendiente', 'gold'], rechazado: ['Rechazó', 'pink'] };
const CAT_TONE = { VIP: 'gold', Ponente: 'violet', Prensa: 'cyan', Patrocinador: 'pink', Staff: 'mint', General: 'gray' };
const SCAN = { ok: ['Acceso', 'mint'], dup: ['Duplicado', 'gold'], noconf: ['Sin confirmar', 'pink'], bad: ['No válido', 'red'] };
const ORDEN = { pagado: ['Pagado', 'mint'], reembolsado: ['Reembolsado', 'cyan'], incidencia: ['Incidencia', 'red'], pendiente: ['Pendiente', 'gold'], cancelado: ['Cancelado', 'gray'] };

const pill = (t, tone = 'violet') => `<span class="pill pill--${tone}">${t}</span>`;
const estadoPill = e => pill(...ESTADOS[e]);
const hueOf = s => [...s].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360;
const initials = n => n.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
const avatar = (n, c = '') => `<span class="avatar ${c}" style="--h:${hueOf(n)}deg">${initials(n)}</span>`;
const orb = (h = 260, c = '') => `<span class="orb ${c}" style="--h:${h}deg"></span>`;
const evById = id => DB.eventos.find(e => e.id === id);

// Logotipo VALK: V y A entrelazadas, L y K compartiendo el trazo vertical, dentro del marco.
const LOGO_PATHS = ['M930 484H81V73H949', 'M650 73V484', 'M949 73L666 356', 'M752 296L960 504', 'M90 87L352 349L400 301', 'M448 253L628 73', 'M98 466L262 302', 'M306 258L352 212L624 484'];
function logo(c = 'logo') {
  const id = uid('lc');
  return `<svg class="${c}" viewBox="65 57 900 443" aria-label="VALK" role="img"><defs><clipPath id="${id}"><rect x="65" y="57" width="900" height="443" rx="7"/></clipPath></defs><g clip-path="url(#${id})" fill="none" stroke="currentColor" stroke-width="32" stroke-linejoin="miter">${LOGO_PATHS.map(d => `<path d="${d}"/>`).join('')}</g></svg>`;
}
// Ficha circular con anillo segmentado (como las fichas de la referencia) para fechas y contadores.
const chip = (top, bottom, tone = 'violet', c = '') => `<span class="dchip dchip--${tone} ${c}"><b>${top}</b>${bottom ? `<small>${bottom}</small>` : ''}</span>`;

const ring = (p, label, c = '') => `<div class="ring ${c}" style="--p:${p}"><div class="ring__in"><b>${p}<i>%</i></b><small>${label}</small></div></div>`;

function smooth(pts) {
  const f = n => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
function areaChart(vals, h = 200) {
  const w = 600, max = Math.max(...vals) * 1.15, step = w / (vals.length - 1);
  const pts = vals.map((v, i) => [i * step, h - (v / max) * (h - 16)]);
  const line = smooth(pts), id = uid('ac');
  const grid = [0.25, 0.5, 0.75].map(g => `<line x1="0" x2="${w}" y1="${h * g}" y2="${h * g}" stroke="rgba(40,50,70,.09)" stroke-dasharray="4 6" vector-effect="non-scaling-stroke"/>`).join('');
  const last = pts[pts.length - 1];
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#4fd1c5"/><stop offset=".55" stop-color="#6c5cff"/><stop offset="1" stop-color="#b28cff"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a6bff" stop-opacity=".28"/><stop offset="1" stop-color="#7a6bff" stop-opacity="0"/></linearGradient></defs>
    ${grid}<path d="${line} L${w} ${h} L0 ${h}Z" fill="url(#${id}f)"/>
    <path d="${line}" fill="none" stroke="url(#${id}s)" stroke-width="2.5" vector-effect="non-scaling-stroke" class="chart__line"/>
    <line x1="${last[0]}" x2="${last[0]}" y1="${last[1]}" y2="${h}" stroke="rgba(40,50,70,.2)" vector-effect="non-scaling-stroke" stroke-dasharray="3 4"/></svg>`;
}
function spark(vals) {
  const w = 120, h = 32, max = Math.max(...vals), min = Math.min(...vals);
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 6)]);
  const id = uid('sp');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#4fd1c5"/><stop offset="1" stop-color="#6c5cff"/></linearGradient></defs><path d="${smooth(pts)}" fill="none" stroke="url(#${id})" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
function qr(seed = 'valk', n = 25) {
  let s = 7;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) % 2147483647;
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647;
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]];
  let rects = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on = null;
    for (const [fx, fy] of finders) {
      if (x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7) {
        const dx = x - fx, dy = y - fy;
        const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
        on = inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      }
    }
    if (on === null) on = rnd() > 0.52;
    if (on) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg class="qr" viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-label="Código QR"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><g fill="#0b0a16">${rects}</g></svg>`;
}
const hbars = rows => {
  const max = Math.max(...rows.map(r => r[1]));
  return `<div class="hbars">${rows.map(([l, v, tone]) => `<div class="hbar"><span>${l}</span><div class="bar"><i style="width:${(v / max) * 100}%"></i></div><b>${typeof v === 'number' && v > 9999 ? money(v) : num(v)}</b></div>`).join('')}</div>`;
};

// Lente de vidrio líquido: mapa de desplazamiento que curva el fondo cerca de los bordes.
// Se usa como backdrop-filter: url(#lens) en navegadores Chromium; los demás se quedan con el desenfoque.
function installLens() {
  const n = 192, c = document.createElement('canvas');
  c.width = c.height = n;
  const g = c.getContext('2d'), img = g.createImageData(n, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const u = (x / (n - 1)) * 2 - 1, v = (y / (n - 1)) * 2 - 1;
    const d = Math.min(1 - Math.abs(u), 1 - Math.abs(v));
    const s = d < 0.32 ? Math.pow(1 - d / 0.32, 2.2) : 0;
    const i = (y * n + x) * 4;
    img.data[i] = 128 - 127 * s * u;
    img.data[i + 1] = 128 - 127 * s * v;
    img.data[i + 2] = 128;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', 0); svg.setAttribute('height', 0);
  svg.style.position = 'absolute';
  svg.innerHTML = `<filter id="lens" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB" primitiveUnits="objectBoundingBox">
    <feImage href="${c.toDataURL()}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.004" result="soft"/>
    <feDisplacementMap in="soft" in2="map" scale="0.09" xChannelSelector="R" yChannelSelector="G"/>
  </filter>`;
  document.body.appendChild(svg);
}
function toast(msg, icon = 'spark') {
  const box = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${I(icon)}<span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2600);
  setTimeout(() => t.remove(), 3000);
}
