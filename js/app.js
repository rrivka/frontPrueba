/* Router, estado e interacciones — Propuesta 2 */
const App = {
  state: {
    ws: 'w1', wsOpen: false, authMode: 'login',
    evFilter: 'todos', evView: 'grid', tabs: {}, pub: {},
    scope: { acceso: 'apis', agenda: 'aurora', boletos: 'aurora', metricas: 'todos', comunicacion: 'aurora' },
    sel: new Set(), gcat: 'todas', gev: 'todos',
    scans: DB.scans.slice(), lastScan: null, scanIdx: 0, scanMode: 'camara', checkins: 132,
    retried: new Set(), mesaSel: 1, support: true, ordFilter: 'todos', synced: false,
    wiz: 0, apiStep: 0, metRange: '30d',
    cart: {}, coupon: null, pubStep: 'form', rsvp: null, city: 'Todas',
    formQ: DB.preguntas.map(q => ({ ...q })),
  },
  cleanups: [],
  last: '',
};

function render() {
  App.cleanups.forEach(f => f());
  App.cleanups = [];
  const parts = (location.hash.replace(/^#\/?/, '') || 'login').split('/');
  const same = App.last === location.hash;
  const scroller = () => document.getElementById('main') || document.scrollingElement;
  const prev = same ? scroller().scrollTop : 0;
  let html;
  switch (parts[0]) {
    case 'app': {
      const v = Views[parts[1]] ? parts[1] : 'panel';
      html = shell(v, Views[v](parts.slice(2)));
      break;
    }
    case 'explorar': html = Views.explorar(); break;
    case 'e': html = Views.publico(parts[1]); break;
    case 'rsvp': html = Views.rsvp(parts[1]); break;
    default: html = Views.login();
  }
  const root = document.getElementById('app');
  root.innerHTML = html;
  root.classList.toggle('is-same', same);
  document.body.dataset.route = parts[0] === 'app' ? 'app' : 'pub';
  scroller().scrollTop = prev;
  App.last = location.hash;
  mountScenes();
}

// El módulo 3D carga después que este script; las escenas pendientes se montan al estar listo.
function mountScenes() {
  if (!window.Scene3D) return;
  document.querySelectorAll('[data-scene]:not(.is-ready)').forEach(el => App.cleanups.push(Scene3D.mount(el, el.dataset.scene)));
}
addEventListener('scene-ready', mountScenes);

/* ---------- Overlay: modales, drawer y hoja inferior ---------- */
const overlay = () => document.getElementById('overlay');
function openModal(name, data = {}, kind = 'modal') {
  const o = overlay();
  o.innerHTML = `<div class="ov-bg" data-act="close"></div><div class="${kind} glass" role="dialog" aria-modal="true">${Modals[name]({ ...data })}</div>`;
  o.className = 'is-open ov-' + kind;
}
function closeOverlay() {
  overlay().className = '';
  overlay().innerHTML = '';
}

const CONFIRM = {
  reset() { App.state.scans = []; App.state.checkins = 0; App.state.lastScan = null; toast('Conteos restablecidos · registrado en auditoría', 'refresh'); },
  'del-event'() { toast('Evento eliminado', 'trash'); location.hash = '#/app/eventos'; },
  'del-guests'() { App.state.sel.clear(); toast('Invitados eliminados', 'trash'); },
  refund(id) { DB.ordenes.find(o => o.id === id).estado = 'reembolsado'; toast(`Reembolso de ${id} enviado a Stripe`, 'refresh'); },
  cancel(id) { DB.ordenes.find(o => o.id === id).estado = 'cancelado'; toast(`Venta ${id} cancelada`); },
  revoke() { toast('Clave revocada', 'key'); },
};

function stamp() {
  const d = new Date(2026, 9, 13, 18, 52, 14 + (App.state.scanIdx + 1) * 23);
  return d.toTimeString().slice(0, 8);
}

const ACTIONS = {
  close: closeOverlay,
  'close-nav': () => closeOverlay(),
  toast: a => toast(a.dataset.msg, a.dataset.icon || 'spark'),
  copy: a => { navigator.clipboard?.writeText(a.dataset.v).catch(() => {}); toast('Copiado al portapapeles', 'copy'); },
  export: a => toast(`Preparando ${a.dataset.v}…`, 'download'),
  modal: a => openModal(a.dataset.m, a.dataset),
  more: () => openModal('more', {}, 'sheet'),
  seg: a => { a.parentElement.querySelectorAll(':scope > *').forEach(b => b.classList.toggle('is-on', b === a)); },
  chip: a => a.classList.toggle('is-on'),
  tab: a => { App.state.tabs[a.dataset.group] = a.dataset.tab; if (a.tagName !== 'A') render(); },

  /* sesión y workspaces */
  auth: a => { App.state.authMode = a.dataset.mode; document.querySelector('.auth').dataset.mode = a.dataset.mode; },
  enter: () => { location.hash = '#/app/panel'; },
  'ws-toggle': () => { App.state.wsOpen = !App.state.wsOpen; document.querySelector('.ws__menu')?.classList.toggle('is-open', App.state.wsOpen); },
  'ws-set': a => { App.state.ws = a.dataset.id; App.state.wsOpen = false; closeOverlay(); render(); toast(`Cambiaste a ${wsCur().nombre}`, 'grid'); },
  'ws-ok': () => { closeOverlay(); toast('Workspace creado', 'plus'); },

  /* eventos */
  'ev-filter': a => { App.state.evFilter = a.dataset.v; render(); },
  'ev-view': a => { App.state.evView = a.dataset.v; render(); },
  wiz: a => { App.state.wiz = Math.max(0, Math.min(3, App.state.wiz + Number(a.dataset.d))); openModal('evento-nuevo'); },
  'wiz-done': () => { App.state.wiz = 0; closeOverlay(); toast('Evento creado como borrador', 'spark'); },
  pub: a => { App.state.pub[a.dataset.id] = a.dataset.v; render(); toast(`Publicación: ${ESTADOS[a.dataset.v][0]}`, 'globe'); },
  'q-add': a => { App.state.formQ.splice(App.state.formQ.length - 1, 0, { id: Date.now(), label: `Nueva pregunta (${a.dataset.t.toLowerCase()})`, tipo: a.dataset.t, req: false }); render(); },
  'q-del': a => { App.state.formQ = App.state.formQ.filter(q => q.id != a.dataset.id); render(); },

  /* invitados */
  sel: a => { const id = +a.dataset.id, s = App.state.sel; s.has(id) ? s.delete(id) : s.add(id); render(); },
  'sel-all': a => { const s = App.state.sel; if (s.size) s.clear(); else document.querySelectorAll('[data-act="sel"]').forEach(c => s.add(+c.dataset.id)); render(); },
  'sel-clear': () => { App.state.sel.clear(); render(); },
  bulk: a => { toast(a.dataset.v, 'check'); App.state.sel.clear(); render(); },
  guest: a => openModal('guest', { id: a.dataset.id }, 'drawer'),
  'import-ok': () => { closeOverlay(); toast('125 invitados importados en Cumbre Aurora 2026', 'upload'); },
  'guest-ok': () => { closeOverlay(); toast('Invitado guardado e invitación enviada', 'check'); },
  'assign-ok': () => { closeOverlay(); App.state.sel.clear(); render(); toast('Invitados asignados al evento', 'calendar'); },

  /* acceso */
  'scan-mode': a => { App.state.scanMode = a.dataset.v; render(); },
  'scan-sim': () => {
    const s = App.state, p = DB.scanPool[s.scanIdx % DB.scanPool.length];
    const scan = { ...p, t: stamp(), puerta: s.scanMode === 'api' ? 'Torniquete A · API' : 'Acceso A · Cámara' };
    s.scanIdx++;
    s.scans.unshift(scan);
    s.lastScan = scan;
    if (scan.res === 'ok') s.checkins++;
    render();
  },
  'scan-confirm': () => {
    const s = App.state;
    s.lastScan = { ...s.lastScan, res: 'ok' };
    s.scans[0] = s.lastScan;
    s.checkins++;
    render();
    toast('Asistencia confirmada manualmente', 'check');
  },
  'manual-ok': a => {
    const s = App.state, scan = { nombre: a.dataset.n, res: 'ok', t: stamp(), puerta: 'Confirmación manual' };
    s.scanIdx++; s.scans.unshift(scan); s.lastScan = scan; s.checkins++;
    render();
    toast(`${a.dataset.n} entró al salón`, 'check');
  },
  'confirm-ok': a => { closeOverlay(); CONFIRM[a.dataset.done]?.(a.dataset.arg); render(); },

  /* comunicación */
  retry: a => {
    App.state.retried.add(a.dataset.id);
    a.closest('.mailrow__act').innerHTML = pill('Enviado', 'mint');
    toast('Correo reenviado', 'send');
  },
  'retry-all': () => { DB.pendientes.forEach(p => App.state.retried.add(p.id)); render(); toast('Todos los correos pendientes se reenviaron', 'send'); },
  var: a => {
    const t = document.getElementById('compose');
    if (!t) return;
    const i = t.selectionStart ?? t.value.length;
    t.value = t.value.slice(0, i) + a.dataset.v + t.value.slice(i);
    t.focus();
  },

  /* agenda / mesas */
  mesa: a => { App.state.mesaSel = +a.dataset.id; render(); },
  'seat-assign': a => {
    const m = DB.mesas.find(x => x.id === App.state.mesaSel);
    if (m.inv.length >= m.cap) return toast('La mesa está llena', 'alert');
    DB.sinMesa.splice(DB.sinMesa.indexOf(a.dataset.n), 1);
    m.inv.push(a.dataset.n);
    render();
  },
  'seat-remove': a => {
    const m = DB.mesas.find(x => x.id === App.state.mesaSel);
    m.inv.splice(m.inv.indexOf(a.dataset.n), 1);
    DB.sinMesa.unshift(a.dataset.n);
    render();
  },

  /* ventas */
  sync: () => { App.state.synced = true; render(); toast('14 órdenes conciliadas con Stripe · 1 corregida', 'refresh'); },
  'ord-filter': a => { App.state.ordFilter = a.dataset.v; render(); },
  'wait-offer': a => { DB.espera[a.dataset.i].estado = 'reservado'; render(); toast('Lugar reservado por 24 h y correo enviado', 'send'); },
  'coupon-ok': () => { closeOverlay(); toast('Cupón NORNAS25 creado', 'coupon'); },

  /* métricas / admin */
  range: a => { App.state.metRange = a.dataset.v; render(); },
  support: () => { App.state.support = !App.state.support; render(); toast(App.state.support ? 'Acceso de soporte concedido por 3 días' : 'Acceso de soporte revocado', App.state.support ? 'key' : 'lock'); },
  'api-gen': () => { App.state.apiStep = 1; openModal('api-nueva'); },
  'pw-ok': () => { closeOverlay(); toast('Contraseña actualizada', 'lock'); },

  /* público */
  city: a => setCity(a.dataset.v),
  near: () => { setCity('Ciudad de México'); toast('Mostrando eventos cerca de Ciudad de México', 'target'); },
  qty: a => { const c = App.state.cart; c[a.dataset.id] = Math.max(0, (c[a.dataset.id] || 0) + Number(a.dataset.d)); render(); },
  coupon: () => {
    const v = document.getElementById('coupon').value.trim().toUpperCase();
    if (v === 'AURORA20') { App.state.coupon = v; render(); toast('Cupón aplicado: 20 % de descuento', 'coupon'); }
    else toast('Ese código no es válido para este evento', 'alert');
  },
  pay: () => {
    toast('Redirigiendo a Stripe Checkout…', 'lock');
    setTimeout(() => { App.state.pubStep = 'done'; App.state.cart = {}; App.state.coupon = null; render(); toast('Pago confirmado · QR enviado por correo', 'check'); }, 1300);
  },
  register: () => { App.state.pubStep = 'done'; render(); toast('Registro confirmado · QR enviado por correo', 'check'); },
  'pub-reset': () => { App.state.pubStep = 'form'; render(); },
  rsvp: a => { App.state.rsvp = a.dataset.v || null; render(); },
};

function setCity(c) {
  App.state.city = c;
  document.getElementById('exp-grid').innerHTML = expGrid();
  document.getElementById('exp-count').textContent = `${pubList().length} eventos`;
  document.querySelectorAll('#city-chips .chip').forEach(b => b.classList.toggle('is-on', b.dataset.v === c));
  const s = document.querySelector('[data-change="city"]');
  if (s) s.value = c;
}

/* ---------- Delegación de eventos ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!e.target.closest('.ws') && App.state.wsOpen) ACTIONS['ws-toggle']();
  if (!a || a.disabled) return;
  const fn = ACTIONS[a.dataset.act];
  if (!fn) return;
  e.preventDefault();
  fn(a, e);
  // Enlaces con acción: primero la acción (p. ej. elegir pestaña), luego navegar.
  const href = a.tagName === 'A' && a.getAttribute('href');
  if (href) location.hash === href ? render() : (location.hash = href);
});

document.addEventListener('change', e => {
  const t = e.target, c = t.dataset.change;
  if (!c) return;
  if (c === 'scope') { App.state.scope[t.dataset.k] = t.value; render(); }
  else if (c === 'gfilter') { App.state[t.dataset.k] = t.value; render(); }
  else if (c === 'city') setCity(t.value);
  else if (c === 'role') toast(`Rol actualizado: ${t.value}`, 'shield');
  else if (c === 'q-req') { const q = App.state.formQ.find(x => x.id == t.dataset.id); q.req = t.checked; render(); }
  else if (c === 'sw') toast(t.dataset.msg || 'Preferencia actualizada', 'check');
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.input !== 'filter') return;
  const q = t.value.trim().toLowerCase();
  document.querySelectorAll(t.dataset.target).forEach(el => { el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none'; });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOverlay();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { const s = document.querySelector('.search input'); if (s) { e.preventDefault(); s.focus(); } }
});

/* Inclinación 3D de tarjetas con el puntero */
let tilted = null;
document.addEventListener('pointermove', e => {
  const el = e.target.closest?.('[data-tilt]');
  if (tilted && tilted !== el) { tilted.style.removeProperty('--rx'); tilted.style.removeProperty('--ry'); tilted = null; }
  if (!el || e.pointerType === 'touch') return;
  const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  const k = Math.min(1, 320 / Math.max(r.width, r.height));
  el.style.setProperty('--rx', `${(-y * 12 * k).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${(x * 14 * k).toFixed(2)}deg`);
  el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
  el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
  tilted = el;
});

// ?tabs=grupo.pestaña,grupo.pestaña abre pestañas internas directamente (útil para revisar pantallas).
new URLSearchParams(location.search).get('tabs')?.split(',').forEach(p => { const [g, t] = p.split('.'); App.state.tabs[g] = t; });

addEventListener('hashchange', () => { closeOverlay(); App.state.wsOpen = false; if (!location.hash.startsWith('#/e/')) App.state.pubStep = 'form'; render(); });
installLens();
render();
