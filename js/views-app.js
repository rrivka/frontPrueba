/* Vistas del área privada — Propuesta 2 · Liquid Glass */
const NAV = [
  { id: 'panel', label: 'Panel', icon: 'grid' },
  { id: 'eventos', label: 'Eventos', icon: 'calendar' },
  { id: 'invitados', label: 'Invitados', icon: 'users' },
  { id: 'acceso', label: 'Acceso y QR', icon: 'qr' },
  { id: 'comunicacion', label: 'Comunicación', icon: 'mail' },
  { id: 'agenda', label: 'Agenda y logística', icon: 'agenda' },
  { id: 'boletos', label: 'Boletos y ventas', icon: 'ticket' },
  { id: 'metricas', label: 'Métricas', icon: 'chart' },
  { id: 'admin', label: 'Administración', icon: 'shield' },
];
const Views = {};
const Modals = {};

/* ---------- Piezas comunes ---------- */
const wsCur = () => DB.workspaces.find(w => w.id === App.state.ws);
const pendCount = () => DB.pendientes.filter(p => !App.state.retried.has(p.id)).length;
const phead = (eyebrow, title, sub, actions = '') => `<header class="phead"><div class="phead__txt"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>${actions ? `<div class="phead__act">${actions}</div>` : ''}</header>`;
const card = (title, right, body, cls = '') => `<section class="lg card ${cls}"><div class="card__head"><h3>${title}</h3>${right || ''}</div>${body}</section>`;
function tabsBar(group, items, def) {
  const cur = App.state.tabs[group] || def;
  return [`<div class="seg seg--tabs" role="tablist">${items.map(([k, l]) => `<button class="seg__i ${k === cur ? 'is-on' : ''}" data-act="tab" data-group="${group}" data-tab="${k}">${l}</button>`).join('')}</div>`, cur];
}
const scopeSelect = (k, withAll = false) => `<label class="select">${I('calendar')}<select data-change="scope" data-k="${k}">${withAll ? `<option value="todos" ${App.state.scope[k] === 'todos' ? 'selected' : ''}>Todos los eventos</option>` : ''}${DB.eventos.map(e => `<option value="${e.id}" ${App.state.scope[k] === e.id ? 'selected' : ''}>${e.nombre}</option>`).join('')}</select>${I('chevdown')}</label>`;
const sw = (label, on = true, msg = 'Preferencia actualizada') => `<label class="switch"><input type="checkbox" ${on ? 'checked' : ''} data-change="sw" data-msg="${msg}"><i></i><span>${label}</span></label>`;
const field = (label, input, cls = '') => `<label class="field ${cls}"><span>${label}</span>${input}</label>`;
const inp = (v = '', type = 'text', ph = '') => `<input type="${type}" value="${v}" placeholder="${ph}">`;
const sel = (opts, v) => `<select>${opts.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
const seg = (opts, on = 0) => `<div class="seg">${opts.map((o, i) => `<button type="button" class="seg__i ${i === on ? 'is-on' : ''}" data-act="seg">${o}</button>`).join('')}</div>`;
const empty = (title, txt) => `<div class="empty">${logo('empty__logo')}<b>${title}</b><p>${txt}</p></div>`;
const searchPill = (ph, target = '') => `<label class="search">${I('search')}<input placeholder="${ph}" ${target ? `data-input="filter" data-target="${target}"` : ''}><span class="search__go">${I('search')}</span></label>`;
const surface = (label, val, sub, tone, icon) => `<div class="surface surface--${tone}" data-tilt><span class="surface__ic">${I(icon)}</span><div class="surface__val">${val}</div><div class="surface__foot"><b>${label}</b><small>${sub}</small></div></div>`;
const scanPill = r => pill(...SCAN[r]);
const statusDot = { ok: 'ok', dup: 'warn', noconf: 'pink', bad: 'bad' };

function evCard(ev, href = `#/app/eventos/${ev.id}`) {
  const { d, m } = fd(ev.fecha), estado = App.state.pub[ev.id] || ev.estado, p = pct(ev.registrados, ev.capacidad);
  return `<a class="evc lg" href="${href}" data-tilt>
    <div class="evc__cover cover" style="--h:${ev.hue}deg">${chip(d, m, 'white')}${estadoPill(estado)}</div>
    <div class="evc__body">
      <span class="eyebrow">${ev.tipo} · ${ev.categoria}</span>
      <h3>${ev.nombre}</h3>
      <span class="meta">${I(ev.modalidad === 'Virtual' ? 'globe' : 'pin')}${ev.sede} · ${ev.ciudad}</span>
      <div class="cap"><div class="track"><i style="width:${p}%"></i></div><span>${num(ev.registrados)} / ${num(ev.capacidad)}</span></div>
    </div>
  </a>`;
}
const feedRow = s => `<div class="row-item"><span class="sdot sdot--${statusDot[s.res]}"></span>${avatar(s.nombre, 'sm')}<span class="grow"><b>${s.nombre}</b><small>${s.puerta} · ${s.t}</small></span>${scanPill(s.res)}</div>`;
const mailRow = p => `<div class="row-item"><span class="ic-glass">${I('mail')}</span><span class="grow"><b>${p.asunto}</b><small>${p.para} · ${p.error} · ${p.intentos} intentos</small></span><span class="mailrow__act">${App.state.retried.has(p.id) ? pill('Enviado', 'mint') : `<button class="btn btn--glass btn--sm" data-act="retry" data-id="${p.id}">${I('refresh')}Reintentar</button>`}</span></div>`;

/* ---------- Shell ---------- */
function shell(active, inner) {
  const ws = wsCur(), pend = pendCount();
  const badge = { eventos: DB.eventos.length, comunicacion: pend || '' };
  return `<div class="shell">
  <aside class="side lg lens">
    <a class="brand" href="#/app/panel">${logo()}<span>VALK</span></a>
    <div class="ws">
      <button class="ws__btn" data-act="ws-toggle"><span class="folder" style="--h:${ws.hue}deg"></span><span class="grow"><b>${ws.nombre}</b><small>${ws.plan} · ${ws.miembros} miembros</small></span>${I('chevdown')}</button>
      <div class="ws__menu lg ${App.state.wsOpen ? 'is-open' : ''}">${wsList(ws)}</div>
    </div>
    <nav class="side__nav">${NAV.map(n => `<a href="#/app/${n.id}" class="nav-i ${n.id === active ? 'is-on' : ''}">${I(n.icon)}<span>${n.label}</span>${n.id === 'acceso' ? '<i class="live-dot" title="Evento en curso"></i>' : badge[n.id] ? `<em>${badge[n.id]}</em>` : ''}</a>`).join('')}</nav>
    <div class="side__foot">
      <a class="nav-i" href="#/explorar">${I('compass')}<span>Sitio público</span></a>
      <a class="status" href="#/app/admin" data-act="tab" data-group="admin" data-tab="sistema"><span class="sdot sdot--ok"></span>Todo operativo<small>v2.4.0</small></a>
      <a class="me ${active === 'perfil' ? 'is-on' : ''}" href="#/app/perfil">${avatar(DB.user.nombre, 'halo')}<span class="grow"><b>${DB.user.nombre}</b><small>${DB.user.rol}</small></span></a>
    </div>
  </aside>
  <main class="main" id="main">
    <header class="topbar">
      <a class="m-brand only-m" href="#/app/panel">${logo()}</a>
      <button class="ws-mini only-m" data-act="more"><span class="folder sm" style="--h:${ws.hue}deg"></span><span class="ws-mini__t">${ws.nombre}</span>${I('chevdown')}</button>
      <div class="topbar__search lg lens">${searchPill('Buscar eventos, invitados u órdenes…')}</div>
      <span class="grow hide-m"></span>
      <button class="icon-btn lg" data-act="toast" data-msg="3 notificaciones: 1 incidencia de pago y 2 correos rebotados" aria-label="Notificaciones">${I('bell')}<i class="badge-dot"></i></button>
      <button class="btn btn--primary" data-act="modal" data-m="evento-nuevo">${I('plus')}<span>Nuevo evento</span></button>
    </header>
    <div class="view">${inner}</div>
  </main>
  <nav class="tabbar">
    <div class="tabbar__pill lg lens">
      ${[['panel', 'grid', 'Panel'], ['eventos', 'calendar', 'Eventos'], ['invitados', 'users', 'Invitados']].map(([id, ic, l]) => `<a href="#/app/${id}" class="${active === id ? 'is-on' : ''}">${I(ic)}<span>${l}</span></a>`).join('')}
      <button data-act="more" class="${['panel', 'eventos', 'acceso', 'invitados'].includes(active) ? '' : 'is-on'}">${I('menu')}<span>Más</span></button>
    </div>
    <a href="#/app/acceso" class="tabbar__scan lg lens ${active === 'acceso' ? 'is-on' : ''}" aria-label="Escanear">${I('scan')}</a>
  </nav>
</div>`;
}
function wsList(ws) {
  return `<p class="eyebrow ws__label">Tus workspaces</p>${DB.workspaces.map(w => `<button class="ws__opt ${w.id === ws.id ? 'is-on' : ''}" data-act="ws-set" data-id="${w.id}"><span class="folder sm" style="--h:${w.hue}deg"></span><span class="grow"><b>${w.nombre}</b><small>${w.plan} · ${w.miembros} miembros</small></span>${w.id === ws.id ? I('check') : ''}</button>`).join('')}<button class="ws__opt add" data-act="modal" data-m="ws-nuevo"><span class="add__ic">${I('plus')}</span><span class="grow"><b>Crear workspace</b><small>Usuarios, eventos y datos separados</small></span></button>`;
}

/* ---------- Panel ---------- */
Views.panel = () => {
  const live = evById('apis'), p = pct(App.state.checkins, live.confirmados);
  const tareas = DB.logistica.filter(l => l.estado !== 'confirmado');
  return `
  ${phead('Martes 13 de octubre', 'Buenas tardes, Ana', '')}
  <div class="grid g-hero">
    <section class="lg card today">
      <div class="today__txt">
        <div class="row"><span class="live">En curso</span><span class="eyebrow">${live.hora} · ${live.sede}, ${live.ciudad}</span></div>
        <h2>${live.nombre}</h2>
        <p class="sub">${App.state.checkins} de ${live.confirmados} personas confirmadas ya entraron. El torniquete A está conectado por API.</p>
        <div class="row"><a class="btn btn--primary" href="#/app/acceso">${I('scan')}Abrir escáner</a><a class="btn btn--glass" href="#/app/eventos/apis">Ver tablero</a></div>
      </div>
      <div class="today__ring">${ring(p, 'check-in', 'big')}</div>
    </section>
    <section class="pastel card invite" data-tilt>
      <span class="pastel__pill"></span>
      <h3>Invita a tu equipo</h3>
      <p>Hay 10 lugares libres en tu plan Pro.</p>
      <button class="btn btn--white" data-act="modal" data-m="invitado-nuevo">${I('plus')}Invitar miembro</button>
    </section>
  </div>
  <div class="grid g4">
    ${surface('Eventos activos', '5', '+2 este mes', 'coral', 'calendar')}
    ${surface('Registrados', num(3169), '+184 esta semana', 'violet', 'users')}
    ${surface('Check-ins hoy', num(App.state.checkins), 'En curso · Monterrey', 'mint', 'scan')}
    ${surface('Ventas del mes', money(2841500), '+18 % vs. septiembre', 'night', 'ticket')}
  </div>
  <div class="grid g-21">
    ${card('Registros de los últimos 30 días', `<a class="btn btn--glass btn--sm" href="#/app/metricas">${I('chart')}Métricas</a>`, `<div class="chart-box">${areaChart(DB.registrosDia)}</div><div class="chart-x"><span>14 sep</span><span>28 sep</span><span>13 oct</span></div>`)}
    ${card('Actividad en vivo', '<span class="live">Live</span>', `<div class="list">${App.state.scans.slice(0, 5).map(feedRow).join('')}</div>`)}
  </div>
  <section>
    <div class="sec-head"><h3>Próximos eventos</h3><a class="btn btn--glass btn--sm" href="#/app/eventos">Ver todos${I('arrow')}</a></div>
    <div class="evgrid">${DB.eventos.filter(e => e.estado !== 'borrador').slice(0, 4).map(e => evCard(e)).join('')}</div>
  </section>
  <div class="grid g2">
    ${card('Correos pendientes', `<a class="btn btn--glass btn--sm" href="#/app/comunicacion" data-act="tab" data-group="com" data-tab="pendientes">Ver cola</a>`, `<div class="list">${DB.pendientes.slice(0, 3).map(mailRow).join('')}</div>`)}
    ${card('Logística por resolver', `<a class="btn btn--glass btn--sm" href="#/app/agenda" data-act="tab" data-group="agenda" data-tab="logistica">Abrir</a>`, `<div class="list">${tareas.map(l => `<div class="row-item"><span class="ic-glass">${I('box')}</span><span class="grow"><b>${l.item}</b><small>${l.cat} · ${l.resp}</small></span>${pill(l.estado, l.estado === 'pendiente' ? 'pink' : 'gold')}</div>`).join('')}</div>`)}
  </div>`;
};

/* ---------- Eventos ---------- */
Views.eventos = p => {
  if (p[0]) return eventoDetalle(p[0], p[1] || 'tablero');
  const f = App.state.evFilter, list = DB.eventos.filter(e => f === 'todos' || (App.state.pub[e.id] || e.estado) === f);
  const c = k => DB.eventos.filter(e => (App.state.pub[e.id] || e.estado) === k).length;
  const filtros = [['todos', 'Todos', DB.eventos.length], ['publico', 'Público', c('publico')], ['nolistado', 'No listado', c('nolistado')], ['borrador', 'Borrador', c('borrador')], ['privado', 'Privado', c('privado')]];
  const grid = App.state.evView === 'grid';
  return `${phead(wsCur().nombre, 'Eventos', 'Crea, configura y publica. Cada evento tiene su propio formulario, acceso y tablero.')}
  <div class="toolbar">
    <div class="seg">${filtros.map(([k, l, n]) => `<button class="seg__i ${f === k ? 'is-on' : ''}" data-act="ev-filter" data-v="${k}">${l}<em>${n}</em></button>`).join('')}</div>
    ${searchPill('Buscar evento…', '.evgrid > .evc, .tbl tbody tr')}
    <div class="seg seg--icons"><button class="seg__i ${grid ? 'is-on' : ''}" data-act="ev-view" data-v="grid" aria-label="Cuadrícula">${I('grid')}</button><button class="seg__i ${grid ? '' : 'is-on'}" data-act="ev-view" data-v="list" aria-label="Lista">${I('list')}</button></div>
  </div>
  ${!list.length ? empty('Sin eventos aquí', 'No hay eventos con este estado de publicación.') : grid
    ? `<div class="evgrid">${list.map(e => evCard(e)).join('')}<button class="evc evc--new" data-act="modal" data-m="evento-nuevo"><span class="plus-orb">${I('plus')}</span><b>Nuevo evento</b><small>Presencial, virtual o híbrido</small></button></div>`
    : `<div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Evento</th><th>Fecha</th><th>Sede</th><th>Estado</th><th>Registro</th><th>Ventas</th><th></th></tr></thead><tbody>
      ${list.map(e => `<tr class="clickable" onclick="location.hash='#/app/eventos/${e.id}'"><td><div class="cell-user"><span class="mini-cover cover" style="--h:${e.hue}deg"></span><span><b>${e.nombre}</b><small>${e.tipo} · ${e.categoria}</small></span></div></td><td>${fd(e.fecha).full}</td><td>${e.sede}<small class="block">${e.ciudad}</small></td><td>${estadoPill(App.state.pub[e.id] || e.estado)}</td><td><div class="cap"><div class="track"><i style="width:${pct(e.registrados, e.capacidad)}%"></i></div><span>${pct(e.registrados, e.capacidad)} %</span></div></td><td>${e.pago ? money(e.ventas) : '<span class="dim">Gratuito</span>'}</td><td>${I('chevron', 'dim')}</td></tr>`).join('')}
    </tbody></table></div></div>`}`;
};

const EV_TABS = [['tablero', 'Tablero'], ['configuracion', 'Configuración'], ['formulario', 'Formulario y contenido'], ['publicacion', 'Publicación'], ['colaboradores', 'Colaboradores']];
function eventoDetalle(id, tab) {
  const ev = evById(id);
  if (!ev) return empty('Evento no encontrado', 'Puede que haya sido eliminado.');
  const estado = App.state.pub[id] || ev.estado, { d, m } = fd(ev.fecha);
  return `<a class="back" href="#/app/eventos">${I('back')}Eventos</a>
  <section class="evhead cover" style="--h:${ev.hue}deg">
    <div class="evhead__glass lg lens">
      ${chip(d, m, 'white', 'big')}
      <div class="grow">
        <div class="row">${estadoPill(estado)}<span class="eyebrow">${ev.tipo} · ${ev.categoria}</span></div>
        <h1>${ev.nombre}</h1>
        <div class="row meta-row"><span class="meta">${I('clock')}${ev.hora}</span><span class="meta">${I(ev.modalidad === 'Virtual' ? 'globe' : 'pin')}${ev.sede} · ${ev.ciudad}</span><span class="meta">${I('users')}${num(ev.capacidad)} lugares</span></div>
      </div>
      <div class="row evhead__act">
        <a class="btn btn--white" href="#/e/${id}">${I('eye')}Página pública</a>
        <button class="icon-btn lg" data-act="copy" data-v="https://valk.app/e/${id}" aria-label="Copiar enlace">${I('link')}</button>
        <button class="icon-btn lg" data-act="modal" data-m="confirm" data-title="Eliminar ${ev.nombre}" data-text="Se eliminarán el evento, su formulario, QR y asignaciones. Los invitados se conservan en el directorio." data-ok="Eliminar evento" data-done="del-event" aria-label="Eliminar">${I('trash')}</button>
      </div>
    </div>
  </section>
  <nav class="seg seg--tabs">${EV_TABS.map(([k, l]) => `<a class="seg__i ${k === tab ? 'is-on' : ''}" href="#/app/eventos/${id}/${k}">${l}</a>`).join('')}</nav>
  ${(EvTabs[tab] || EvTabs.tablero)(ev, estado)}`;
}

const EvTabs = {
  tablero(ev) {
    const isLive = ev.id === 'apis', checkins = isLive ? App.state.checkins : 0;
    const serie = Array.from({ length: 24 }, (_, i) => Math.max(4, Math.round((ev.registrados / 24) * (0.4 + i / 20 + Math.sin(i * 0.8 + ev.hue) * 0.25))));
    const guests = DB.invitados.filter(g => g.eventos.includes(ev.id));
    const mix = [['General', 0.52], ['VIP', 0.12], ['Patrocinador', 0.1], ['Staff', 0.12], ['Prensa', 0.08], ['Ponente', 0.06]].map(([l, f]) => [l, Math.round(ev.registrados * f)]);
    return `<div class="grid g4">
      ${surface('Registrados', num(ev.registrados), `${pct(ev.registrados, ev.capacidad)} % de capacidad`, 'violet', 'users')}
      ${surface('Confirmados', num(ev.confirmados), `${pct(ev.confirmados, ev.registrados)} % de registrados`, 'mint', 'check')}
      ${surface('Check-in', num(checkins), isLive ? 'En curso' : 'Abre el día del evento', 'coral', 'scan')}
      ${ev.pago ? surface('Ventas', money(ev.ventas), 'Conciliado con Stripe', 'night', 'ticket') : surface('Lugares libres', num(ev.capacidad - ev.registrados), 'Registro gratuito', 'night', 'spark')}
    </div>
    <div class="grid g-21">
      ${card('Registros acumulados', seg(['24 días', 'Todo']), `<div class="chart-box">${areaChart(serie)}</div>`)}
      ${card('Capacidad', '', `<div class="center-col">${ring(pct(ev.registrados, ev.capacidad), 'ocupado', 'big')}<p class="sub">${num(ev.registrados)} de ${num(ev.capacidad)} lugares</p></div>`)}
    </div>
    <div class="grid g-12">
      ${card('Por categoría', '', hbars(mix))}
      ${card('Asistentes', `<a class="btn btn--glass btn--sm" href="#/app/invitados">Directorio${I('arrow')}</a>`, `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Invitado</th><th>Categoría</th><th>Confirmación</th><th>Check-in</th></tr></thead><tbody>
        ${guests.map(g => `<tr class="clickable" data-act="guest" data-id="${g.id}"><td><div class="cell-user">${avatar(g.nombre, 'sm')}<span><b>${g.nombre}</b><small>${g.email}</small></span></div></td><td>${pill(g.cat, CAT_TONE[g.cat])}</td><td>${pill(...RSVP[g.rsvp])}</td><td>${g.checkin && isLive ? pill('Dentro', 'mint') : '<span class="dim">—</span>'}</td></tr>`).join('')}
        </tbody></table></div>`)}
    </div>`;
  },

  configuracion(ev) {
    const mod = ['Presencial', 'Virtual', 'Híbrido'].indexOf(ev.modalidad);
    return `<div class="grid g2">
      ${card('Fecha y horario', '', `<div class="form-grid">${field('Inicio', inp(ev.fecha, 'date'))}${field('Fin', inp(ev.fin || ev.fecha, 'date'))}${field('Hora de inicio', inp(ev.hora.split(' – ')[0], 'time'))}${field('Hora de fin', inp(ev.hora.split(' – ')[1], 'time'))}${field('Zona horaria', sel(['America/Mexico_City (GMT-6)', 'America/Monterrey (GMT-6)', 'America/Tijuana (GMT-8)'], 'America/Mexico_City (GMT-6)'), 'full')}</div>`)}
      ${card('Sede o enlace virtual', '', `<div class="stack">${seg(['Presencial', 'Virtual', 'Híbrido'], mod)}<div class="form-grid">${field('Sede', inp(ev.sede))}${field('Ciudad', inp(ev.ciudad))}${field('Dirección', inp('Av. del Conscripto 311, Lomas de Sotelo'), 'full')}${field('Enlace virtual', inp(ev.enlace || '', 'url', 'https://'), 'full')}</div></div>`)}
      ${card('Capacidad y clasificación', '', `<div class="form-grid">${field('Capacidad', inp(ev.capacidad, 'number'))}${field('Categoría', sel(['Tecnología', 'Música', 'Filantropía', 'Diseño', 'Capacitación'], ev.categoria))}${field('Tipo', sel(['Conferencia', 'Meetup', 'Gala', 'Concierto', 'Exposición', 'Taller'], ev.tipo))}${field('Visibilidad', `<a class="input-link" href="#/app/eventos/${ev.id}/publicacion">${ESTADOS[App.state.pub[ev.id] || ev.estado][0]}${I('chevron')}</a>`)}</div>`)}
      ${card('Registro', '', `<div class="stack">${sw('Permitir autorregistro desde la página pública', ev.auto)}${sw('Registro con pago (boletos)', ev.pago)}${sw('Requerir aprobación manual', false)}${sw('Permitir registro delegado por representantes', true)}</div>`)}
    </div>
    <div class="row end"><button class="btn btn--glass" data-act="toast" data-msg="Cambios descartados">Descartar</button><button class="btn btn--primary" data-act="toast" data-msg="Configuración guardada" data-icon="check">${I('check')}Guardar cambios</button></div>`;
  },

  formulario(ev) {
    const qs = App.state.formQ;
    const tipos = [['Texto', 'text'], ['Opción múltiple', 'radio'], ['Casillas', 'checkbox'], ['Fecha', 'calendar'], ['Archivo', 'file'], ['Sección', 'section']];
    return `<div class="grid g-21">
      <div class="stack">
        ${card('Preguntas del registro', `<span class="dim small">${qs.length} campos</span>`, `<div class="stack">${qs.map(q => `<div class="q">
            <span class="q__drag">${I('drag')}</span>
            <div class="grow"><span class="eyebrow">${q.tipo}${q.fixed ? ' · fijo' : ''}</span><b>${q.label}</b>${q.opts ? `<div class="chips">${q.opts.map(o => `<span class="chip sm">${o}</span>`).join('')}</div>` : ''}</div>
            <label class="switch sm"><input type="checkbox" ${q.req ? 'checked' : ''} ${q.fixed ? 'disabled' : ''} data-change="q-req" data-id="${q.id}"><i></i><span>Obligatoria</span></label>
            ${q.fixed ? `<span class="icon-btn sm ghost">${I('lock')}</span>` : `<button class="icon-btn sm" data-act="q-del" data-id="${q.id}" aria-label="Quitar">${I('trash')}</button>`}
          </div>`).join('')}</div>
          <p class="eyebrow mt">Agregar pregunta</p>
          <div class="palette">${tipos.map(([t, ic]) => `<button class="pal" data-act="q-add" data-t="${t}">${I(ic)}<span>${t}</span></button>`).join('')}</div>`)}
        ${card('Contenido público', '', `<div class="stack"><div class="dropzone">${I('image')}<b>Portada del evento</b><span>Arrastra una imagen 1600 × 900 o <u>explora</u></span></div>
          ${field('Descripción', `<textarea>${ev.desc}</textarea>`)}
          <div class="form-grid">${field('Texto del botón', inp('Registrarme'))}${field('Mensaje al confirmar', inp('¡Listo! Te enviamos tu QR por correo.'))}</div></div>`)}
      </div>
      <aside class="sticky">
        <p class="eyebrow center mb">Vista previa en teléfono</p>
        <div class="phone-mock" data-tilt><div class="phone-mock__screen">
          <div class="pm-cover cover" style="--h:${ev.hue}deg"></div>
          <div class="pm-body"><span class="eyebrow">${fd(ev.fecha).full} · ${ev.ciudad}</span><b class="pm-title">${ev.nombre}</b>
          ${qs.filter(q => q.tipo !== 'Sección').map(q => q.tipo === 'Casilla' ? `<label class="pm-check"><i></i>${q.label}</label>` : `<div class="pm-field"><span>${q.label}${q.req ? ' *' : ''}</span><i></i></div>`).join('')}
          <span class="btn btn--primary btn--sm block">Registrarme</span></div>
        </div></div>
      </aside>
    </div>`;
  },

  publicacion(ev, estado) {
    const OPTS = [
      ['privado', 'lock', 'Privado', 'Solo personas invitadas por tu equipo. No aparece en búsquedas.', 'pink'],
      ['borrador', 'edit', 'Borrador', 'En preparación. Nadie fuera del equipo puede abrirlo.', 'gold'],
      ['nolistado', 'link', 'No listado', 'Abierto solo con el enlace. No aparece en Explorar.', 'cyan'],
      ['publico', 'globe', 'Público', 'Visible en Explorar y en búsquedas por ciudad o cercanía.', 'mint'],
    ];
    return `<div class="pubopts">${OPTS.map(([k, ic, t, d, tone]) => `<button class="pubopt lg tone-${tone} ${estado === k ? 'is-on' : ''}" data-act="pub" data-id="${ev.id}" data-v="${k}" data-tilt><span class="pubopt__ic">${I(ic)}</span><span class="pubopt__check">${I('check')}</span><b>${t}</b><small>${d}</small></button>`).join('')}</div>
    <div class="grid g2">
      ${card('Enlace público', '', `<div class="copybox"><span class="mono">valk.app/e/${ev.id}</span><button class="btn btn--primary btn--sm" data-act="copy" data-v="https://valk.app/e/${ev.id}">${I('copy')}Copiar</button></div>
        <div class="row mt"><a class="btn btn--glass btn--sm" href="#/e/${ev.id}">${I('eye')}Ver sitio del evento</a><button class="btn btn--glass btn--sm" data-act="toast" data-msg="QR del enlace descargado">${I('qr')}QR del enlace</button></div>`)}
      ${card('Reglas de acceso', '', `<div class="stack">${sw('Autorregistro habilitado', ev.auto)}${sw('Mostrar agenda pública', true)}${sw('Mostrar lugares disponibles', false)}${sw('Cerrar registro al llegar a la capacidad', true)}</div>`)}
    </div>`;
  },

  colaboradores() {
    return `<div class="grid g-21">
      ${card('Equipo del evento', `<span class="dim small">${DB.colaboradores.length + 1} personas</span>`, `<div class="invite-row"><input class="input" placeholder="correo@empresa.com">${sel(['Editor', 'Operador de acceso', 'Solo lectura'], 'Editor')}<button class="btn btn--primary btn--sm" data-act="toast" data-msg="Invitación enviada">${I('send')}Invitar</button></div>
        <div class="list mt">
          <div class="row-item">${avatar(DB.user.nombre, 'halo')}<span class="grow"><b>${DB.user.nombre}</b><small>${DB.user.email}</small></span>${pill('Propietaria', 'violet')}</div>
          ${DB.colaboradores.map(c => `<div class="row-item">${avatar(c.nombre)}<span class="grow"><b>${c.nombre}</b><small>${c.email}</small></span><label class="select sm"><select data-change="role">${['Editor', 'Operador de acceso', 'Solo lectura'].map(r => `<option ${r === c.rol ? 'selected' : ''}>${r}</option>`).join('')}</select>${I('chevdown')}</label><button class="icon-btn sm" data-act="toast" data-msg="Acceso de ${c.nombre} retirado" aria-label="Retirar">${I('x')}</button></div>`).join('')}
        </div>`)}
      ${card('Qué puede hacer cada rol', '', `<div class="stack">${[['Editor', 'Configura el evento, formulario, agenda, invitados y correos.'], ['Operador de acceso', 'Usa el escáner, confirma asistencia y busca invitados.'], ['Solo lectura', 'Consulta el tablero y exporta reportes.']].map(([r, d]) => `<div class="kv"><b>${r}</b><span>${d}</span></div>`).join('')}</div>`)}
    </div>`;
  },
};

/* ---------- Invitados ---------- */
Views.invitados = () => {
  const [tabs, cur] = tabsBar('inv', [['directorio', 'Directorio'], ['representantes', 'Representantes'], ['clasificacion', 'Categorías y equipos']], 'directorio');
  return `${phead('Invitados y registro', 'Invitados', 'Un directorio por workspace. Asigna personas a uno o varios eventos y sigue sus confirmaciones.',
    `<button class="btn btn--glass" data-act="modal" data-m="importar">${I('upload')}Importar CSV</button><button class="btn btn--primary" data-act="modal" data-m="invitado-nuevo">${I('plus')}Nuevo invitado</button>`)}
  ${tabs}${InvTabs[cur]()}`;
};
const InvTabs = {
  directorio() {
    const { gcat, gev } = App.state;
    const list = DB.invitados.filter(g => (gcat === 'todas' || g.cat === gcat) && (gev === 'todos' || g.eventos.includes(gev)));
    const n = App.state.sel.size;
    return `<div class="toolbar">
      ${searchPill('Nombre, correo o empresa…', '.tbl tbody tr')}
      <label class="select">${I('filter')}<select data-change="gfilter" data-k="gcat"><option value="todas">Todas las categorías</option>${DB.categorias.map(c => `<option ${gcat === c ? 'selected' : ''}>${c}</option>`).join('')}</select>${I('chevdown')}</label>
      <label class="select">${I('calendar')}<select data-change="gfilter" data-k="gev"><option value="todos">Todos los eventos</option>${DB.eventos.map(e => `<option value="${e.id}" ${gev === e.id ? 'selected' : ''}>${e.nombre}</option>`).join('')}</select>${I('chevdown')}</label>
      <span class="grow right dim small">${list.length} de ${DB.invitados.length}</span>
    </div>
    ${n ? `<div class="bulk lg lens"><b>${n} seleccionado${n > 1 ? 's' : ''}</b><button class="btn btn--white btn--sm" data-act="modal" data-m="asignar">${I('calendar')}Asignar a evento</button><button class="btn btn--glass btn--sm" data-act="bulk" data-v="Asignaciones retiradas">${I('minus')}Retirar de evento</button><button class="btn btn--glass btn--sm" data-act="bulk" data-v="Correo en cola">${I('mail')}Enviar correo</button><button class="btn btn--danger btn--sm" data-act="modal" data-m="confirm" data-title="Eliminar ${n} invitado${n > 1 ? 's' : ''}" data-text="Se eliminarán sus registros, QR y respuestas en todos los eventos." data-ok="Eliminar" data-done="del-guests">${I('trash')}Eliminar</button><button class="icon-btn sm" data-act="sel-clear" aria-label="Limpiar selección">${I('x')}</button></div>` : ''}
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th><input type="checkbox" class="cb" data-act="sel-all" ${n === list.length && n ? 'checked' : ''} aria-label="Seleccionar todos"></th><th>Invitado</th><th>Categoría</th><th>Equipo / área</th><th>Eventos</th><th>Confirmación</th><th>QR</th><th></th></tr></thead><tbody>
    ${list.map(g => `<tr class="clickable ${App.state.sel.has(g.id) ? 'is-sel' : ''}" data-act="guest" data-id="${g.id}">
      <td><input type="checkbox" class="cb" data-act="sel" data-id="${g.id}" ${App.state.sel.has(g.id) ? 'checked' : ''} aria-label="Seleccionar"></td>
      <td><div class="cell-user">${avatar(g.nombre)}<span><b>${g.nombre}${g.rep ? ` <span class="tag">Representante</span>` : ''}</b><small>${g.email}</small></span></div></td>
      <td>${pill(g.cat, CAT_TONE[g.cat])}</td><td>${g.equipo}</td>
      <td><div class="ev-dots">${g.eventos.map(id => `<span class="mini-cover cover" style="--h:${evById(id).hue}deg" title="${evById(id).nombre}"></span>`).join('')}<small>${g.eventos.length}</small></div></td>
      <td>${pill(...RSVP[g.rsvp])}</td>
      <td><button class="icon-btn sm" data-act="modal" data-m="qr" data-id="${g.id}" aria-label="Ver QR">${I('qr')}</button></td>
      <td>${I('chevron', 'dim')}</td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  representantes() {
    return `<p class="sub">Los representantes registran a sus propios invitados con un enlace delegado, dentro del límite que les asignes.</p>
    <div class="grid g2">${DB.reps.map(r => `<section class="lg card" data-tilt>
      <div class="row">${avatar(r.nombre, 'big halo')}<div class="grow"><h3>${r.nombre}</h3><p class="sub small">${r.empresa} · ${evById(r.evento).nombre}</p></div>${chip(r.invitados.length, `de ${r.limite}`, 'violet')}</div>
      <div class="track mt"><i style="width:${pct(r.invitados.length, r.limite)}%"></i></div>
      <div class="list mt">${r.invitados.map(n => `<div class="row-item">${avatar(n, 'sm')}<b class="grow">${n}</b>${pill('Registrado', 'mint')}</div>`).join('')}</div>
      <div class="row mt"><button class="btn btn--glass btn--sm" data-act="modal" data-m="invitado-nuevo">${I('plus')}Agregar invitado</button><button class="btn btn--glass btn--sm" data-act="toast" data-msg="Enlace de registro delegado reenviado a ${r.nombre}">${I('send')}Reenviar enlace</button></div>
    </section>`).join('')}</div>`;
  },
  clasificacion() {
    const cnt = (k, v) => DB.invitados.filter(g => g[k] === v).length;
    return `<div class="grid g2">
      ${card('Categorías', `<button class="btn btn--glass btn--sm" data-act="toast" data-msg="Categoría creada">${I('plus')}Nueva</button>`, `<div class="folders">${DB.categorias.map(c => `<button class="folder-card" data-tilt><span class="folder big tone-${CAT_TONE[c]}"></span><b>${c}</b><small>${cnt('cat', c)} invitados</small></button>`).join('')}</div>`)}
      ${card('Equipos o áreas', `<button class="btn btn--glass btn--sm" data-act="toast" data-msg="Equipo creado">${I('plus')}Nuevo</button>`, `<div class="list">${DB.equipos.map(c => `<div class="row-item"><span class="folder sm" style="--h:${hueOf(c)}deg"></span><b class="grow">${c}</b><span class="dim small">${cnt('equipo', c)} invitados</span><button class="icon-btn sm" aria-label="Editar">${I('edit')}</button></div>`).join('')}</div>`)}
    </div>`;
  },
};

/* ---------- Acceso y QR ---------- */
Views.acceso = () => {
  const [tabs, cur] = tabsBar('acc', [['escaner', 'Escáner'], ['codigos', 'Códigos QR'], ['distintivos', 'Distintivos y tickets'], ['plantilla', 'Plantilla de correo']], 'escaner');
  return `${phead('Acceso, asistencia y QR', 'Control de acceso', 'Valida con cámara, lector externo o búsqueda manual. Cada escaneo queda registrado.', scopeSelect('acceso'))}
  ${tabs}${AccTabs[cur](evById(App.state.scope.acceso))}`;
};
const AccTabs = {
  escaner(ev) {
    const s = App.state, last = s.lastScan, mode = s.scanMode;
    const dup = s.scans.filter(x => x.res === 'dup').length, bad = s.scans.filter(x => x.res === 'bad' || x.res === 'noconf').length;
    const RES = {
      ok: ['ok', 'check', 'Acceso válido', 'Puede pasar'],
      dup: ['dup', 'alert', 'Ya registrado', 'Este QR se usó hoy a las 18:49'],
      noconf: ['noconf', 'alert', 'Sin confirmar', 'Está invitado pero no confirmó su asistencia'],
      bad: ['bad', 'x', 'QR no válido', 'No pertenece a este evento o fue revocado'],
    };
    const r = last && RES[last.res];
    const pend = DB.invitados.filter(g => g.eventos.includes(ev.id) && g.rsvp === 'pendiente');
    return `<div class="grid g-21">
      <div class="stack">
        <section class="lg card">
          <div class="card__head"><div class="seg">${[['camara', 'camera', 'Cámara'], ['api', 'api', 'Lector externo · API']].map(([k, ic, l]) => `<button class="seg__i ${mode === k ? 'is-on' : ''}" data-act="scan-mode" data-v="${k}">${I(ic)}${l}</button>`).join('')}</div><span class="dim small">${ev.nombre}</span></div>
          <div class="scanner">
            <div class="scanner__blobs"></div>
            <div class="scanner__card lg"><div class="mini-ticket__top cover" style="--h:${ev.hue}deg"></div>${qr('demo' + s.scanIdx)}</div>
            <div class="scanner__frame"><i></i><i></i><i></i><i></i></div>
            <div class="scanner__line"></div>
            <div class="scanner__hud"><span class="glass-tag">${mode === 'api' ? 'Torniquete A · POST /v1/qr/validate' : 'Cámara trasera · 1080p'}</span><span class="glass-tag"><span class="live">Escaneando</span></span></div>
          </div>
          <div class="row mt"><button class="btn btn--primary" data-act="scan-sim">${I('scan')}Simular escaneo</button><span class="sub small">Prueba la validación sin un código real.</span></div>
        </section>
        ${r ? `<section class="result result--${r[0]} lg">
          <span class="result__ic">${I(r[1])}</span>
          <div class="grow"><span class="eyebrow">${last.t} · ${last.puerta}</span><h3>${r[2]}</h3><p>${last.nombre} — ${r[3]}</p></div>
          ${last.res === 'noconf' ? `<button class="btn btn--primary" data-act="scan-confirm">${I('check')}Confirmar y dar acceso</button>` : ''}
        </section>` : `<section class="result result--idle lg"><span class="result__ic">${I('qr')}</span><div class="grow"><h3>Esperando código</h3><p>Acerca un QR al recuadro o usa el lector externo.</p></div></section>`}
      </div>
      <div class="stack">
        ${card('Conteo de hoy', '', `<div class="count">${ring(pct(s.checkins, ev.confirmados || 1), 'dentro')}
            <div class="count__kv">${[[s.checkins, 'Ingresos', 'violet'], [ev.confirmados, 'Confirmados', 'mint'], [dup, 'Duplicados', 'gold'], [bad, 'Rechazados', 'pink']].map(([v, l, t]) => `<div>${chip(v, '', t, 'sm')}<small>${l}</small></div>`).join('')}</div></div>
          <button class="btn btn--danger btn--sm block mt" data-act="modal" data-m="confirm" data-title="Restablecer conteos" data-text="Se pondrán en cero los ingresos y el historial de escaneos de hoy. Esta acción queda en la auditoría." data-ok="Restablecer" data-done="reset">${I('refresh')}Restablecer conteos</button>`)}
        ${card('Confirmar manualmente', '', `${searchPill('Buscar por nombre o correo', '.manual .row-item')}
          <div class="list manual mt">${pend.length ? pend.map(g => `<div class="row-item">${avatar(g.nombre, 'sm')}<span class="grow"><b>${g.nombre}</b><small>${g.email}</small></span><button class="btn btn--glass btn--sm" data-act="manual-ok" data-n="${g.nombre}">${I('check')}Dar acceso</button></div>`).join('') : '<p class="sub small">No hay invitados pendientes en este evento.</p>'}</div>`)}
        ${card('Escaneos', `<button class="btn btn--glass btn--sm" data-act="export" data-v="escaneos (CSV)">${I('download')}CSV</button>`, `<div class="list scroll">${s.scans.length ? s.scans.slice(0, 8).map(feedRow).join('') : '<p class="sub small">Sin escaneos todavía.</p>'}</div>`)}
      </div>
    </div>`;
  },
  codigos(ev) {
    const st = ['Enviado', 'Abierto', 'Generado', 'Abierto', 'Sin generar', 'Enviado', 'Abierto'];
    const tone = { Enviado: 'cyan', Abierto: 'mint', Generado: 'violet', 'Sin generar': 'gray' };
    const list = DB.invitados.filter(g => g.eventos.includes(ev.id));
    return `<div class="toolbar"><button class="btn btn--glass" data-act="toast" data-msg="2 códigos QR generados">${I('qr')}Generar faltantes</button><button class="btn btn--primary" data-act="toast" data-msg="QR enviados a ${ev.confirmados} confirmados" data-icon="send">${I('send')}Enviar QR a confirmados</button><span class="grow"></span><button class="btn btn--glass btn--sm" data-act="export" data-v="códigos QR (ZIP)">${I('download')}Descargar ZIP</button></div>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Invitado</th><th>Código</th><th>Estado</th><th>Escaneos</th><th></th></tr></thead><tbody>
    ${list.map((g, i) => `<tr><td><div class="cell-user">${avatar(g.nombre, 'sm')}<span><b>${g.nombre}</b><small>${g.email}</small></span></div></td><td class="mono">VK-${ev.id.slice(0, 3).toUpperCase()}-${1040 + g.id * 7}</td><td>${pill(st[i % st.length], tone[st[i % st.length]])}</td><td class="mono">${g.checkin ? 1 : 0}</td><td><div class="row nowrap"><button class="icon-btn sm" data-act="modal" data-m="qr" data-id="${g.id}" aria-label="Ver QR">${I('eye')}</button><button class="btn btn--glass btn--sm" data-act="toast" data-msg="QR reenviado a ${g.email}">${I('send')}Reenviar</button></div></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  distintivos(ev) {
    return `<div class="grid g2">
      <section class="center-col stage-soft">${ticket(ev, 'Sofía Ramírez', 'VIP')}</section>
      ${card('Configuración', '', `<div class="stack">${seg(['Ticket', 'Gafete', 'Pulsera'])}
        <div class="form-grid">${field('Tamaño', sel(['Ticket 8 × 20 cm', 'Gafete 9 × 13 cm', 'A6'], 'Ticket 8 × 20 cm'))}${field('Generar para', sel(['Confirmados', 'Todos los invitados', 'Selección'], 'Confirmados'))}</div>
        ${sw('Mostrar categoría', true)}${sw('Mostrar empresa', true)}${sw('Acabado translúcido', true)}${sw('Incluir agenda en el reverso', false)}
        <button class="btn btn--primary" data-act="toast" data-msg="Generando ${ev.confirmados} distintivos en PDF…">${I('download')}Generar ${num(ev.confirmados)} distintivos (PDF)</button></div>`)}
    </div>`;
  },
  plantilla(ev) {
    return `<div class="grid g2">
      ${card('Plantilla del correo con QR', '', `<div class="stack"><div class="dropzone sm">${logo('dz-logo')}<span><b>Logotipo</b><br><span class="sub small">PNG o SVG · máx. 1 MB · <u>Reemplazar</u></span></span></div>
        ${field('Asunto', inp(`Tu acceso a ${ev.nombre}`))}
        ${field('Mensaje', `<textarea>Hola {{nombre}}, este es tu código de acceso para ${ev.nombre}. Preséntalo en la entrada desde tu teléfono o impreso.</textarea>`)}
        <div class="field"><span>Color de acento</span><div class="swatches">${[248, 172, 330, 28, 210].map((h, i) => `<button class="swatch ${i === 0 ? 'is-on' : ''}" style="--h:${h}deg" data-act="seg" aria-label="Color"></button>`).join('')}</div></div>
        <div class="row end"><button class="btn btn--glass" data-act="modal" data-m="email">${I('eye')}Vista previa</button><button class="btn btn--primary" data-act="toast" data-msg="Plantilla guardada">${I('check')}Guardar</button></div></div>`)}
      <section>${mailMock(ev)}</section>
    </div>`;
  },
};
function ticket(ev, nombre, cat) {
  return `<div class="ticket" data-tilt>
    <div class="ticket__top cover" style="--h:${ev.hue}deg"><div class="ticket__brand">${logo()}<span>Acceso</span></div><b>${ev.nombre}</b><span>${fd(ev.fecha).full} · ${ev.hora.split(' – ')[0]}</span></div>
    <div class="ticket__bottom"><div><span class="eyebrow">Invitado</span><b>${nombre}</b>${pill(cat, 'violet')}<span class="eyebrow mt">${ev.sede}</span></div>${qr(nombre + ev.id)}</div>
  </div>`;
}
function mailMock(ev, body) {
  return `<div class="mail-mock lg">
    <div class="mail-mock__bar"><span></span><span></span><span></span><b>Bandeja de entrada</b></div>
    <div class="mail-mock__head"><b>Tu acceso a ${ev.nombre}</b><small>De: ${wsCur().nombre} &lt;eventos@valk.app&gt;</small></div>
    <div class="mail-mock__body">
      <div class="mail-mock__brand">${logo()}</div>
      <p>${body || `Hola <b>Sofía</b>, este es tu código de acceso para <b>${ev.nombre}</b>. Preséntalo en la entrada.`}</p>
      ${qr('mail' + ev.id)}
      <p class="small">${fd(ev.fecha).full} · ${ev.hora}<br>${ev.sede}, ${ev.ciudad}</p>
      <span class="mail-mock__btn">Agregar al calendario</span>
      <p class="tiny">Recibes este correo porque te registraste en el evento. Aviso de privacidad · Darte de baja</p>
    </div>
  </div>`;
}

/* ---------- Comunicación ---------- */
Views.comunicacion = () => {
  const [tabs, cur] = tabsBar('com', [['campanas', 'Envíos'], ['redactar', 'Redactar'], ['pendientes', `Pendientes · ${pendCount()}`], ['privacidad', 'Aviso de privacidad']], 'campanas');
  return `${phead('Comunicación y privacidad', 'Comunicación', 'Correos de registro, confirmación y personalizados, con reintentos y vista previa.', `<button class="btn btn--primary" data-act="tab" data-group="com" data-tab="redactar">${I('edit')}Redactar correo</button>`)}
  ${tabs}${ComTabs[cur]()}`;
};
const ComTabs = {
  campanas() {
    const tone = { QR: 'violet', Confirmación: 'cyan', Personalizado: 'pink', Registro: 'mint' };
    return `<div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Asunto</th><th>Tipo</th><th>Evento</th><th>Enviados</th><th>Aperturas</th><th>Fecha</th><th></th></tr></thead><tbody>
    ${DB.campanas.map(c => `<tr><td><b>${c.asunto}</b></td><td>${pill(c.tipo, tone[c.tipo])}</td><td>${evById(c.evento).nombre}</td><td class="mono">${num(c.enviados)}</td><td><div class="cap"><div class="track"><i style="width:${pct(c.abiertos, c.enviados)}%"></i></div><span>${pct(c.abiertos, c.enviados)} %</span></div></td><td class="mono">${c.fecha}</td><td><button class="btn btn--glass btn--sm" data-act="modal" data-m="email" data-ev="${c.evento}">${I('eye')}Vista previa</button></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  redactar() {
    const ev = evById('aurora');
    return `<div class="grid g2">
      ${card('Nuevo correo', '', `<div class="stack">
          <div class="form-grid">${field('Evento', sel(DB.eventos.map(e => e.nombre), ev.nombre))}${field('Tipo', sel(['Personalizado', 'Registro', 'Confirmación', 'Recordatorio con QR'], 'Personalizado'))}</div>
          <div class="field"><span>Destinatarios</span><div class="chips">${['Confirmados · 812', 'Pendientes · 152', 'VIP', 'Ponentes', 'Prensa'].map((c, i) => `<button class="check-pill ${i === 0 ? 'is-on' : ''}" data-act="chip"><i>${I('check')}</i>${c}</button>`).join('')}</div></div>
          ${field('Asunto', inp('Lo que necesitas saber antes de la Cumbre Aurora'))}
          ${field('Mensaje', `<textarea id="compose" rows="7">Hola {{nombre}}, faltan pocos días para ${ev.nombre}. Te compartimos la agenda y tu código de acceso.</textarea>`)}
          <div class="row"><span class="eyebrow">Variables</span>${['{{nombre}}', '{{evento}}', '{{fecha}}', '{{qr}}', '{{enlace_confirmacion}}'].map(v => `<button class="chip sm" data-act="var" data-v="${v}">${v}</button>`).join('')}</div>
          ${sw('Adjuntar código QR', true)}${sw('Incluir botones Confirmar / Rechazar', false)}
          <div class="row end"><button class="btn btn--glass" data-act="toast" data-msg="Correo de prueba enviado a ${DB.user.email}">Enviarme una prueba</button><button class="btn btn--primary" data-act="toast" data-msg="812 correos en cola de envío" data-icon="send">${I('send')}Enviar a 812</button></div>
        </div>`)}
      <section><p class="eyebrow center mb">Vista previa</p>${mailMock(ev, 'Hola <b>Sofía</b>, faltan pocos días para <b>Cumbre Aurora 2026</b>. Te compartimos la agenda y tu código de acceso.')}</section>
    </div>`;
  },
  pendientes() {
    return `<div class="toolbar"><p class="sub grow">Correos que no se pudieron entregar. VALK reintenta automáticamente 3 veces; aquí puedes forzarlo.</p><button class="btn btn--primary" data-act="retry-all">${I('refresh')}Reintentar todos</button></div>
    <section class="lg card"><div class="list">${DB.pendientes.map(mailRow).join('')}</div></section>`;
  },
  privacidad() {
    return `<div class="grid g-21">
      ${card('Aviso de privacidad del evento', scopeSelect('comunicacion'), `<div class="stack">${field('Texto del aviso', `<textarea rows="9">${DB.privacidad}</textarea>`)}
        ${sw('Mostrar en el formulario de registro', true)}${sw('Requerir aceptación para registrarse', true)}${sw('Incluir enlace en todos los correos', true)}
        <div class="row end"><button class="btn btn--primary" data-act="toast" data-msg="Aviso de privacidad publicado (versión 4)">${I('check')}Publicar versión 4</button></div></div>`)}
      ${card('Versiones', '', `<div class="list">${[['v3', '02 oct 2026', 'Ana Valdés'], ['v2', '14 ago 2026', 'Regina Salas'], ['v1', '03 jun 2026', 'Ana Valdés']].map(([v, f, u]) => `<div class="row-item">${chip(v, '', 'white', 'sm')}<span class="grow"><b>${f}</b><small>${u}</small></span><button class="icon-btn sm" aria-label="Ver">${I('eye')}</button></div>`).join('')}</div>`)}
    </div>`;
  },
};

/* ---------- Agenda, mesas y logística ---------- */
Views.agenda = () => {
  const [tabs, cur] = tabsBar('agenda', [['agenda', 'Agenda'], ['mesas', 'Mesas'], ['logistica', 'Logística'], ['finanzas', 'Finanzas']], 'agenda');
  return `${phead('Agenda, mesas y logística', 'Orden del día', 'Arma la agenda pública, acomoda mesas y lleva el control logístico y financiero.', scopeSelect('agenda'))}
  ${tabs}${AgTabs[cur](evById(App.state.scope.agenda))}`;
};
const AgTabs = {
  agenda() {
    return `<div class="toolbar">${sw('Agenda publicada en el sitio del evento', true, 'Visibilidad de la agenda actualizada')}<span class="grow"></span><button class="btn btn--glass" data-act="toast" data-msg="Sección agregada">${I('section')}Nueva sección</button><button class="btn btn--primary" data-act="toast" data-msg="Bloque agregado">${I('plus')}Nuevo bloque</button></div>
    ${DB.agenda.map(s => `<section class="lg card"><div class="card__head"><h3>${s.sec}</h3><button class="icon-btn sm" aria-label="Editar sección">${I('edit')}</button></div>
      <div class="timeline">${s.items.map(it => `<div class="tl-it">${chip(it.h, it.f, 'white')}<div class="tl-it__body lg"><div class="grow"><b>${it.t}</b><small>${it.p ? it.p + ' · ' : ''}${it.l}</small></div><div class="row nowrap">${it.link ? `<span class="tag">${I('link')}Enlace</span>` : ''}${pill(it.k, 'violet')}<button class="icon-btn sm" aria-label="Más">${I('more')}</button></div></div></div>`).join('')}</div></section>`).join('')}`;
  },
  mesas() {
    const m = DB.mesas.find(x => x.id === App.state.mesaSel);
    const total = DB.mesas.reduce((a, x) => a + x.inv.length, 0), cap = DB.mesas.reduce((a, x) => a + x.cap, 0);
    return `<div class="toolbar"><span class="sub">Plano de <b>Gala Anual Lumen</b> · ${total}/${cap} lugares asignados · ${DB.sinMesa.length} sin mesa</span><span class="grow"></span><button class="btn btn--glass" data-act="toast" data-msg="Mesa creada">${I('plus')}Nueva mesa</button><button class="btn btn--primary" data-act="export" data-v="reporte de mesas (PDF)">${I('download')}Reporte de mesas</button></div>
    <div class="grid g-21">
      <section class="floorplan lg"><div class="fp-stage">Escenario</div><div class="floorplan__grid">${DB.mesas.map(x => `<button class="mesa ${x.id === m.id ? 'is-sel' : ''}" data-act="mesa" data-id="${x.id}" aria-label="${x.nombre}">
        ${Array.from({ length: x.cap }, (_, i) => `<i class="seat ${i < x.inv.length ? 'on' : ''}" style="--i:${i};--n:${x.cap}"></i>`).join('')}
        <span class="mesa__top"><b>${x.id}</b><small>${x.inv.length}/${x.cap}</small></span></button>`).join('')}</div></section>
      <div class="stack">
        ${card(m.nombre, pill(`${m.inv.length}/${m.cap}`, m.inv.length >= m.cap ? 'gold' : 'mint'), `<div class="list">${m.inv.map(n => `<div class="row-item">${avatar(n, 'sm')}<b class="grow">${n}</b><button class="icon-btn sm" data-act="seat-remove" data-n="${n}" aria-label="Quitar de la mesa">${I('x')}</button></div>`).join('') || '<p class="sub small">Mesa vacía.</p>'}</div>`)}
        ${card('Sin mesa', `<span class="dim small">${DB.sinMesa.length}</span>`, `<div class="list">${DB.sinMesa.map(n => `<div class="row-item">${avatar(n, 'sm')}<b class="grow">${n}</b><button class="btn btn--glass btn--sm" data-act="seat-assign" data-n="${n}" ${m.inv.length >= m.cap ? 'disabled' : ''}>${I('plus')}Mesa ${m.id}</button></div>`).join('') || '<p class="sub small">Todos tienen mesa.</p>'}</div>`)}
      </div>
    </div>`;
  },
  logistica(ev) {
    const tone = { confirmado: 'mint', cotizando: 'gold', 'en tránsito': 'cyan', pendiente: 'pink' };
    return `<div class="toolbar"><span class="sub">Elementos y asignaciones de <b>${ev.nombre}</b></span><span class="grow"></span><button class="btn btn--glass btn--sm" data-act="export" data-v="logística (Excel)">${I('download')}Excel</button><button class="btn btn--primary" data-act="toast" data-msg="Elemento agregado">${I('plus')}Agregar elemento</button></div>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Elemento</th><th>Categoría</th><th>Cantidad</th><th>Responsable</th><th>Estado</th><th>Costo</th><th></th></tr></thead><tbody>
    ${DB.logistica.map(l => `<tr><td><div class="cell-user"><span class="ic-glass">${I('box')}</span><b>${l.item}</b></div></td><td>${l.cat}</td><td class="mono">${num(l.cant)}</td><td><div class="cell-user">${avatar(l.resp, 'sm')}${l.resp}</div></td><td>${pill(l.estado, tone[l.estado])}</td><td class="mono">${money(l.costo)}</td><td><button class="icon-btn sm" aria-label="Más">${I('more')}</button></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  finanzas() {
    const f = DB.finanzas;
    return `<div class="grid g4">${surface('Presupuesto', money(f.presupuesto), 'Aprobado el 01 sep', 'night', 'dollar')}${surface('Comprometido', money(f.comprometido), pct(f.comprometido, f.presupuesto) + ' % del presupuesto', 'violet', 'receipt')}${surface('Pagado', money(f.pagado), pct(f.pagado, f.comprometido) + ' % de lo comprometido', 'mint', 'check')}${surface('Ingresos por boletos', money(f.ingresos), 'Balance ' + money(f.ingresos - f.comprometido), 'coral', 'ticket')}</div>
    <div class="grid g2">
      ${card('Uso del presupuesto', '', `<div class="stackbar"><i style="width:${pct(f.pagado, f.presupuesto)}%" class="s1"></i><i style="width:${pct(f.comprometido - f.pagado, f.presupuesto)}%" class="s2"></i></div>
        <div class="legend"><span><i class="s1"></i>Pagado</span><span><i class="s2"></i>Comprometido</span><span><i></i>Disponible ${money(f.presupuesto - f.comprometido)}</span></div>`)}
      ${card('Por partida', '', hbars(f.partidas))}
    </div>`;
  },
};

/* ---------- Boletos y ventas ---------- */
Views.boletos = () => {
  const [tabs, cur] = tabsBar('bol', [['tipos', 'Tipos de boleto'], ['cupones', 'Cupones'], ['ordenes', 'Órdenes'], ['espera', 'Lista de espera']], 'tipos');
  return `${phead('Boletos y ventas', 'Boletos', 'Registro con pago mediante Stripe Checkout: tipos, cupones, órdenes, reembolsos y lista de espera.', scopeSelect('boletos'))}
  <div class="stripe lg lens"><span class="stripe__logo">S</span><div class="grow"><b>Stripe conectado</b><small>acct_…4821 · Modo producción · ${App.state.synced ? 'Conciliado hace un momento · 0 diferencias' : 'Última conciliación: hoy 12:00 · 1 diferencia'}</small></div><button class="btn btn--white btn--sm" data-act="sync">${I('refresh')}Conciliar con Stripe</button><button class="btn btn--glass btn--sm" data-act="export" data-v="ventas (Excel)">${I('download')}Exportar ventas</button></div>
  ${tabs}${BolTabs[cur]()}`;
};
const BolTabs = {
  tipos() {
    const tones = ['coral', 'violet', 'night', 'mint'];
    return `<div class="toolbar">${sw('Registro con pago', true)}${sw('Lista de espera automática al agotarse', true)}${sw('Reservar lugar 24 h al liberar', true)}</div>
    <div class="ttgrid">${DB.boletos.map((b, i) => {
      const out = b.vendidos >= b.total;
      return `<article class="tt" data-tilt><div class="tt__top surface--${tones[i]}"><span>${b.desc}</span>${out ? pill('Agotado', 'red') : pill('A la venta', 'mint')}</div>
      <div class="tt__body"><h3>${b.nombre}</h3><div class="tt__price">${money(b.precio)}</div>
      <div class="cap"><div class="track"><i style="width:${pct(b.vendidos, b.total)}%"></i></div><span>${b.vendidos}/${b.total}</span></div>
      ${b.espera ? `<span class="tag mt">${I('clock')}${b.espera} en lista de espera</span>` : ''}
      <div class="row mt"><button class="btn btn--glass btn--sm">${I('edit')}Editar</button><button class="btn btn--glass btn--sm" data-act="toast" data-msg="${out ? 'Se liberaron 20 lugares' : 'Venta pausada'}">${out ? 'Liberar lugares' : 'Pausar'}</button></div></div></article>`;
    }).join('')}<button class="tt tt--new" data-act="toast" data-msg="Nuevo tipo de boleto creado"><span class="plus-orb">${I('plus')}</span><b>Nuevo tipo de boleto</b></button></div>`;
  },
  cupones() {
    return `<div class="toolbar"><span class="grow"></span><button class="btn btn--primary" data-act="modal" data-m="cupon-nuevo">${I('plus')}Nuevo cupón</button></div>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Código</th><th>Descuento</th><th>Usos</th><th>Vigencia</th><th>Estado</th><th></th></tr></thead><tbody>
    ${DB.cupones.map(c => `<tr><td><span class="code">${I('coupon')}${c.codigo}</span></td><td class="mono">${c.desc}</td><td><div class="cap"><div class="track"><i style="width:${pct(c.usos, c.limite)}%"></i></div><span>${c.usos}/${c.limite}</span></div></td><td class="mono">${c.vigencia}</td><td>${c.estado === 'activo' ? pill('Activo', 'mint') : pill('Agotado', 'gray')}</td><td><button class="icon-btn sm" aria-label="Más">${I('more')}</button></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  ordenes() {
    const f = App.state.ordFilter, list = DB.ordenes.filter(o => f === 'todos' || o.estado === f);
    return `<div class="toolbar"><div class="seg">${[['todos', 'Todas'], ['pagado', 'Pagadas'], ['pendiente', 'Pendientes'], ['incidencia', 'Incidencias'], ['reembolsado', 'Reembolsadas']].map(([k, l]) => `<button class="seg__i ${f === k ? 'is-on' : ''}" data-act="ord-filter" data-v="${k}">${l}</button>`).join('')}</div>${searchPill('Orden, comprador o correo', '.tbl tbody tr')}</div>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Orden</th><th>Comprador</th><th>Evento</th><th>Boletos</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
    ${list.map(o => `<tr><td class="mono">${o.id}<small class="block">${o.fecha}</small></td><td><div class="cell-user">${avatar(o.comprador, 'sm')}<span><b>${o.comprador}</b><small>${o.email}</small></span></div></td><td>${evById(o.evento).nombre}</td><td>${o.boletos}</td><td class="mono">${money(o.total)}</td><td>${pill(...ORDEN[o.estado])}</td>
      <td><div class="row nowrap"><button class="icon-btn sm" title="Comprobante" data-act="export" data-v="comprobante ${o.id} (PDF)">${I('receipt')}</button><button class="icon-btn sm" title="Reenviar QR" data-act="toast" data-msg="QR reenviado a ${o.email}">${I('send')}</button>${o.estado === 'pagado' || o.estado === 'incidencia' ? `<button class="btn btn--danger btn--sm" data-act="modal" data-m="confirm" data-title="Reembolsar ${o.id}" data-text="Se reembolsarán ${money(o.total)} a ${o.comprador} mediante Stripe y se revocarán sus códigos QR." data-ok="Reembolsar" data-done="refund" data-arg="${o.id}">Reembolsar</button>` : ''}${o.estado === 'pendiente' ? `<button class="btn btn--glass btn--sm" data-act="modal" data-m="confirm" data-title="Cancelar ${o.id}" data-text="La orden se cancelará y se liberarán los lugares." data-ok="Cancelar venta" data-done="cancel" data-arg="${o.id}">Cancelar</button>` : ''}</div></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  espera() {
    return `<p class="sub">Cuando se libera un lugar, la siguiente persona recibe una reserva por 24 h para completar su compra.</p>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Persona</th><th>Boleto</th><th>Cantidad</th><th>Desde</th><th>Estado</th><th></th></tr></thead><tbody>
    ${DB.espera.map((w, i) => `<tr><td>${chip(i + 1, '', 'white', 'xs')}</td><td><div class="cell-user">${avatar(w.nombre, 'sm')}<span><b>${w.nombre}</b><small>${w.email}</small></span></div></td><td>${w.boleto}</td><td class="mono">${w.cant}</td><td class="mono">${w.desde}</td><td>${w.estado === 'reservado' ? pill('Reservado · 18 h', 'cyan') : pill('En espera', 'gold')}</td><td>${w.estado === 'reservado' ? '' : `<button class="btn btn--glass btn--sm" data-act="wait-offer" data-i="${i}">${I('send')}Ofrecer lugar</button>`}</td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
};

/* ---------- Métricas ---------- */
Views.metricas = () => {
  const r = App.state.metRange, mult = { '7d': 0.3, '30d': 1, '90d': 2.6, 'año': 7.5 }[r];
  const serie = r === '7d' ? DB.registrosDia.slice(-7) : r === '30d' ? DB.registrosDia : Array.from({ length: 30 }, (_, i) => Math.round(30 + i * 6 + Math.sin(i) * 20));
  const cats = [['General', 41, 250], ['VIP', 12, 30], ['Patrocinador', 10, 330], ['Staff', 9, 165], ['Prensa', 8, 200], ['Ponente', 6, 280]];
  let acc = 0;
  const conic = cats.map(([, v, h]) => { const s = acc; acc += v; return `hsl(${h} 80% 66%) ${(s / 86) * 100}% ${(acc / 86) * 100}%`; }).join(',');
  return `${phead('Métricas y exportaciones', 'Métricas', 'Busca y filtra por fechas. Todo se puede exportar a CSV o Excel.')}
  <div class="toolbar">
    <div class="seg">${[['7d', '7 días'], ['30d', '30 días'], ['90d', '90 días'], ['año', 'Este año']].map(([k, l]) => `<button class="seg__i ${r === k ? 'is-on' : ''}" data-act="range" data-v="${k}">${l}</button>`).join('')}</div>
    <label class="select">${I('calendar')}<input type="date" value="2026-09-14" aria-label="Desde"><span class="dim">→</span><input type="date" value="2026-10-13" aria-label="Hasta"></label>
    ${scopeSelect('metricas', true)}
    ${searchPill('Buscar asistente o evento…')}
  </div>
  <div class="grid g4">
    ${surface('Registros', num(Math.round(3169 * mult)), '+12 % vs. periodo anterior', 'violet', 'users')}
    ${surface('Tasa de confirmación', '86 %', '+3 puntos', 'mint', 'check')}
    ${surface('Asistencia real', '78 %', 'Promedio de eventos cerrados', 'coral', 'scan')}
    ${surface('Ingresos', money(Math.round(2841500 * mult)), 'Neto de reembolsos', 'night', 'ticket')}
  </div>
  <div class="grid g-21">
    ${card('Registros por día', '', `<div class="chart-box">${areaChart(serie)}</div>`)}
    ${card('Embudo', '', `<div class="funnel">${[['Invitados', 4120, 100, 'violet'], ['Registrados', 3169, 86, 'cyan'], ['Confirmados', 2720, 72, 'mint'], ['Asistieron', 2118, 58, 'coral']].map(([l, v, w, t]) => `<div class="funnel__s tone-${t}" style="--w:${w}%"><span>${l}</span><b>${num(v)}</b></div>`).join('')}</div>`)}
  </div>
  <div class="grid g2">
    ${card('Asistentes por categoría', '', `<div class="donut-wrap"><div class="donut" style="--conic:conic-gradient(${conic})"><span><b>3,169</b><small>total</small></span></div><div class="legend col">${cats.map(([l, v, h]) => `<span><i style="background:hsl(${h} 80% 66%)"></i>${l}<b>${Math.round((v / 86) * 100)} %</b></span>`).join('')}</div></div>`)}
    ${card('Asistencia por evento', '', `<div class="vbars">${DB.eventos.filter(e => e.registrados).map(e => `<div class="vbar"><b>${pct(e.confirmados, e.registrados)}%</b><i style="height:${pct(e.confirmados, e.registrados)}%"></i><span>${e.nombre.split(' ')[0]}</span></div>`).join('')}</div>`)}
  </div>
  ${card('Exportaciones', '', `<div class="tiles">${[['Confirmaciones', 'users'], ['Listas de asistencia', 'scan'], ['Reporte de auditoría', 'shield'], ['Resultados de ventas', 'ticket']].map(([l, ic]) => `<div class="tile" data-tilt><span class="ic-glass">${I(ic)}</span><b>${l}</b><div class="row"><button class="btn btn--glass btn--sm" data-act="export" data-v="${l} (CSV)">CSV</button><button class="btn btn--glass btn--sm" data-act="export" data-v="${l} (Excel)">Excel</button></div></div>`).join('')}</div>`)}`;
};

/* ---------- Administración ---------- */
Views.admin = () => {
  const [tabs, cur] = tabsBar('admin', [['usuarios', 'Usuarios y roles'], ['soporte', 'Acceso de soporte'], ['api', 'API e integraciones'], ['auditoria', 'Auditoría'], ['sistema', 'Sistema'], ['ayuda', 'Ayuda']], 'usuarios');
  return `${phead('Administración e integraciones', 'Administración', `Usuarios, permisos, integraciones y estado de ${wsCur().nombre}.`)}
  ${tabs}${AdmTabs[cur]()}`;
};
const AdmTabs = {
  usuarios() {
    return `<div class="grid g-21">
      ${card('Usuarios del workspace', `<span class="dim small">${DB.usuarios.length} de 15 lugares</span>`, `<div class="invite-row"><input class="input" placeholder="Invitar por correo">${sel(DB.roles.map(r => r[0]).slice(1), 'Editor')}<button class="btn btn--primary btn--sm" data-act="toast" data-msg="Invitación enviada">${I('send')}Invitar</button></div>
        <div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>Usuario</th><th>Rol</th><th>Solo lectura</th><th>Último acceso</th><th></th></tr></thead><tbody>
        ${DB.usuarios.map((u, i) => `<tr><td><div class="cell-user">${avatar(u.nombre)}<span><b>${u.nombre}</b><small>${u.email}</small></span></div></td><td>${i === 0 ? pill('Propietaria', 'violet') : `<label class="select sm"><select data-change="role">${DB.roles.slice(1).map(r => `<option ${r[0] === u.rol ? 'selected' : ''}>${r[0]}</option>`).join('')}</select>${I('chevdown')}</label>`}</td><td>${i === 0 ? '<span class="dim">—</span>' : `<label class="switch sm"><input type="checkbox" ${u.lectura ? 'checked' : ''} data-change="sw" data-msg="Modo solo lectura actualizado para ${u.nombre}"><i></i></label>`}</td><td class="dim">${u.ultimo}</td><td><button class="icon-btn sm" aria-label="Más">${I('more')}</button></td></tr>`).join('')}
        </tbody></table></div>`)}
      ${card('Roles', `<button class="btn btn--glass btn--sm" data-act="toast" data-msg="Rol personalizado creado">${I('plus')}Rol</button>`, `<div class="stack">${DB.roles.map(([r, d]) => `<div class="kv"><b>${r}</b><span>${d}</span></div>`).join('')}</div>`)}
    </div>`;
  },
  soporte() {
    const on = App.state.support;
    return `<section class="lg card support ${on ? 'is-on' : ''}">
      <span class="support__avatar">${I(on ? 'help' : 'lock')}</span>
      <div class="grow"><p class="eyebrow">Acceso de soporte</p><h2>${on ? 'Soporte VALK tiene acceso' : 'Sin acceso de soporte'}</h2>
        <p class="sub">${on ? 'Concedido por Ana Valdés el 11 oct 2026 para el ticket #4821. Vence el 20 oct 2026. Cada acción queda en la auditoría.' : 'El equipo de soporte no puede ver los datos de este workspace. Concede acceso temporal cuando lo necesites.'}</p>
        ${on ? '' : `<div class="form-grid narrow mt">${field('Duración', sel(['24 horas', '3 días', '7 días'], '3 días'))}${field('Ticket de referencia', inp('', 'text', '#0000'))}</div>`}
      </div>
      <button class="btn ${on ? 'btn--danger' : 'btn--primary'}" data-act="support">${I(on ? 'lock' : 'key')}${on ? 'Revocar acceso' : 'Conceder acceso'}</button>
    </section>`;
  },
  api() {
    return `<section class="pastel card api-hero"><span class="pastel__pill"></span><div class="api-hero__in"><p class="eyebrow">API e integraciones</p><h2>Conecta VALK con tus sistemas</h2><p>API REST para invitados, confirmaciones, QR, logística y sincronización de datos.</p><div class="row"><button class="btn btn--primary" data-act="modal" data-m="api-nueva">${I('key')}Nueva clave de API</button><button class="btn btn--white" data-act="toast" data-msg="Abriendo la documentación de la API">${I('book')}Documentación</button></div></div><div class="api-hero__code lg"><span class="method m-POST">POST</span><span class="mono">/v1/qr/validate</span><pre>{ "codigo": "VK-AUR-1047",\n  "puerta": "torniquete-a" }</pre><span class="pill pill--mint">200 · acceso válido</span></div></section>
    ${card('Claves de API', '', `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Nombre</th><th>Clave</th><th>Permisos</th><th>Último uso</th><th>Llamadas</th><th></th></tr></thead><tbody>
      ${DB.apikeys.map(k => `<tr><td><b>${k.nombre}</b></td><td><span class="code">${k.prefijo}</span></td><td><div class="chips">${k.permisos.map(p => `<span class="chip sm">${p}</span>`).join('')}</div></td><td class="dim">${k.uso}</td><td class="mono">${num(k.llamadas)}</td><td><button class="btn btn--danger btn--sm" data-act="modal" data-m="confirm" data-title="Revocar ${k.nombre}" data-text="Las integraciones que usen esta clave dejarán de funcionar de inmediato." data-ok="Revocar clave" data-done="revoke">Revocar</button></td></tr>`).join('')}
      </tbody></table></div>`)}
    ${card('Registro de uso', seg(['Todo', 'Errores']), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Hora</th><th>Clave</th><th>Petición</th><th>Estado</th><th>Tiempo</th></tr></thead><tbody>
      ${DB.apilog.map(l => `<tr><td class="mono">${l.t}</td><td>${l.key}</td><td><span class="method m-${l.m}">${l.m}</span> <span class="mono">${l.ruta}</span></td><td>${pill(l.st, l.st < 300 ? 'mint' : l.st === 409 ? 'gold' : 'red')}</td><td class="mono dim">${l.ms} ms</td></tr>`).join('')}
      </tbody></table></div>`)}`;
  },
  auditoria() {
    return `<div class="toolbar">${searchPill('Usuario, acción u objeto', '.tbl tbody tr')}<label class="select">${I('calendar')}<input type="date" value="2026-10-01" aria-label="Desde"><span class="dim">→</span><input type="date" value="2026-10-13" aria-label="Hasta"></label><span class="grow"></span><button class="btn btn--glass btn--sm" data-act="export" data-v="auditoría (CSV)">CSV</button><button class="btn btn--glass btn--sm" data-act="export" data-v="auditoría (Excel)">Excel</button></div>
    <div class="lg card flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Fecha</th><th>Quién</th><th>Acción</th><th>Objeto</th></tr></thead><tbody>
    ${DB.auditoria.map(a => `<tr><td class="mono">${a.t}</td><td><div class="cell-user">${a.u.startsWith('API') || a.u === 'Sistema' ? `<span class="ic-glass sm">${I(a.u === 'Sistema' ? 'activity' : 'api')}</span>` : avatar(a.u, 'sm')}${a.u}</div></td><td>${a.a}</td><td class="dim">${a.o}</td></tr>`).join('')}
    </tbody></table></div></div>`;
  },
  sistema() {
    const n = DB.novedades[0];
    return `<div class="grid g-12">
      <section class="glass-block card" data-tilt><span class="eyebrow">Versión instalada</span><div class="version__num">${n.v}</div><p class="sub small">Publicada el ${n.fecha}</p>${logo('version__logo')}</section>
      ${card('Estado del sistema', pill('Operativo', 'mint'), `<div class="svc-grid">${DB.servicios.map(s => `<div class="svc"><span class="sdot sdot--${s.s === 'ok' ? 'ok' : 'warn'}"></span><b>${s.n}</b><span class="dim small">${s.d}</span></div>`).join('')}</div>
        <div class="uptime">${Array.from({ length: 60 }, (_, i) => `<i class="${i === 41 ? 'warn' : ''}"></i>`).join('')}</div><div class="row between dim small"><span>Hace 60 días</span><span>99.98 % disponibilidad</span><span>Hoy</span></div>`)}
    </div>
    ${card('Novedades', '', `<div class="timeline">${DB.novedades.map(v => `<div class="tl-it">${chip('v' + v.v.split('.').slice(0, 2).join('.'), v.v.split('.')[2] !== '0' ? '.' + v.v.split('.')[2] : '', 'violet')}<div class="tl-it__body lg"><div class="grow"><b>Versión ${v.v}</b><small>${v.fecha}</small><ul class="ul">${v.items.map(i => `<li>${i}</li>`).join('')}</ul></div></div></div>`).join('')}</div>`)}`;
  },
  ayuda() {
    return `<div class="tiles">${[['Documentación', 'book', 'Guías paso a paso para cada módulo'], ['Referencia de la API', 'api', 'Endpoints, ejemplos y webhooks'], ['Centro de soporte', 'help', 'Preguntas frecuentes y tickets'], ['Estado del servicio', 'activity', 'Incidentes y mantenimientos'], ['Novedades', 'spark', 'Historial de versiones'], ['Contactar a soporte', 'mail', 'Respuesta en menos de 4 h']].map(([t, ic, d]) => `<button class="tile" data-tilt data-act="toast" data-msg="Abriendo ${t}"><span class="ic-glass">${I(ic)}</span><b>${t}</b><small>${d}</small></button>`).join('')}</div>`;
  },
};

/* ---------- Perfil ---------- */
Views.perfil = () => `${phead('Tu cuenta', 'Perfil', 'Tus datos, contraseña y sesiones activas.', `<a class="btn btn--danger" href="#/login">${I('logout')}Cerrar sesión</a>`)}
  <div class="grid g-12">
    <section class="lg card profile" data-tilt>${avatar(DB.user.nombre, 'xl halo')}<h3>${DB.user.nombre}</h3><span class="sub">${DB.user.puesto}</span>${pill(DB.user.rol, 'violet')}<button class="btn btn--glass btn--sm">${I('image')}Cambiar foto</button></section>
    ${card('Datos personales', '', `<div class="form-grid">${field('Nombre', inp(DB.user.nombre))}${field('Correo', inp(DB.user.email, 'email'))}${field('Teléfono', inp(DB.user.tel, 'tel'))}${field('Puesto', inp(DB.user.puesto))}${field('Idioma', sel(['Español (México)', 'English'], 'Español (México)'))}${field('Zona horaria', sel(['America/Mexico_City'], 'America/Mexico_City'))}</div>
      <div class="row end mt"><button class="btn btn--primary" data-act="toast" data-msg="Perfil actualizado">${I('check')}Guardar</button></div>`)}
  </div>
  <div class="grid g2">
    ${card('Seguridad', '', `<div class="list"><div class="row-item"><span class="ic-glass">${I('lock')}</span><span class="grow"><b>Contraseña</b><small>Actualizada hace 3 meses</small></span><button class="btn btn--glass btn--sm" data-act="modal" data-m="password">Cambiar</button></div><div class="row-item"><span class="ic-glass">${I('shield')}</span><span class="grow"><b>Verificación en dos pasos</b><small>App autenticadora</small></span>${pill('Activa', 'mint')}</div></div>`)}
    ${card('Sesiones activas', '', `<div class="list">${[['Chrome · Windows', 'Ciudad de México · ahora', true], ['Safari · iPhone', 'Monterrey · hace 2 h'], ['App VALK · Android', 'Guadalajara · hace 3 días']].map(([d, w, cur]) => `<div class="row-item"><span class="ic-glass">${I(cur ? 'globe' : 'user')}</span><span class="grow"><b>${d}</b><small>${w}</small></span>${cur ? pill('Esta sesión', 'cyan') : `<button class="btn btn--glass btn--sm" data-act="toast" data-msg="Sesión cerrada">Cerrar</button>`}</div>`).join('')}</div>`)}
  </div>`;

/* ---------- Modales ---------- */
const mhead = (kicker, title) => `<div class="mhead"><div><p class="eyebrow">${kicker}</p><h2 class="mtitle">${title}</h2></div><button class="icon-btn sm" data-act="close" aria-label="Cerrar">${I('x')}</button></div>`;
const mfoot = (ok, act = 'close') => `<div class="mfoot"><button class="btn btn--glass" data-act="close">Cancelar</button><button class="btn btn--primary" data-act="${act}">${ok}</button></div>`;

Modals['evento-nuevo'] = () => {
  const s = App.state.wiz, steps = ['Básicos', 'Fecha y sede', 'Registro', 'Publicación'];
  const body = [
    `<div class="form-grid">${field('Nombre del evento', inp('', 'text', 'Ej. Cumbre Aurora 2027'), 'full')}${field('Tipo', sel(['Conferencia', 'Meetup', 'Gala', 'Concierto', 'Exposición', 'Taller'], 'Conferencia'))}${field('Categoría', sel(['Tecnología', 'Música', 'Filantropía', 'Diseño', 'Capacitación'], 'Tecnología'))}${field('Descripción corta', '<textarea rows="3" placeholder="Qué vivirán tus invitados"></textarea>', 'full')}</div>`,
    `<div class="stack">${seg(['Presencial', 'Virtual', 'Híbrido'])}<div class="form-grid">${field('Inicio', inp('2026-12-10', 'date'))}${field('Hora', inp('09:00', 'time'))}${field('Sede', inp('', 'text', 'Nombre del recinto'))}${field('Ciudad', inp('Ciudad de México'))}${field('Capacidad', inp('300', 'number'))}${field('Enlace virtual', inp('', 'url', 'https://'))}</div></div>`,
    `<div class="stack">${sw('Autorregistro desde la página pública', true)}${sw('Registro con pago (Stripe)', false)}${sw('Permitir representantes', false)}${sw('Enviar QR al confirmar', true)}</div>`,
    `<div class="pubopts sm">${[['lock', 'Privado', 'pink'], ['edit', 'Borrador', 'gold'], ['link', 'No listado', 'cyan'], ['globe', 'Público', 'mint']].map(([ic, t, tone], i) => `<button class="pubopt lg tone-${tone} ${i === 1 ? 'is-on' : ''}" data-act="seg"><span class="pubopt__ic">${I(ic)}</span><span class="pubopt__check">${I('check')}</span><b>${t}</b></button>`).join('')}</div><p class="sub small mt">Puedes cambiarlo cuando quieras desde la pestaña Publicación.</p>`,
  ];
  return `${mhead(`Paso ${s + 1} de 4`, 'Nuevo evento')}
  <div class="steps">${steps.map((t, i) => `<span class="${i < s ? 'done' : i === s ? 'on' : ''}"><i>${i < s ? I('check') : i + 1}</i>${t}</span>`).join('')}</div>
  ${body[s]}
  <div class="mfoot">${s ? `<button class="btn btn--glass" data-act="wiz" data-d="-1">${I('back')}Atrás</button>` : '<button class="btn btn--glass" data-act="close">Cancelar</button>'}${s < 3 ? `<button class="btn btn--primary" data-act="wiz" data-d="1">Continuar${I('arrow')}</button>` : `<button class="btn btn--primary" data-act="wiz-done">${I('check')}Crear evento</button>`}</div>`;
};
Modals.importar = () => `${mhead('Carga masiva', 'Importar invitados')}
  <div class="dropzone">${I('upload')}<b>invitados_aurora.csv</b><span>128 filas · 6 columnas detectadas · <u>Cambiar archivo</u></span></div>
  <p class="eyebrow mt">Relación de columnas</p>
  <div class="map">${[['nombre_completo', 'Nombre completo'], ['correo', 'Correo electrónico'], ['empresa', 'Empresa'], ['tipo', 'Categoría'], ['area', 'Equipo / área'], ['telefono', 'Teléfono']].map(([a, b]) => `<div class="map__row"><span class="code">${a}</span>${I('arrow', 'dim')}${sel([b, 'Ignorar'], b)}</div>`).join('')}</div>
  <div class="form-grid mt">${field('Asignar a evento', sel(DB.eventos.map(e => e.nombre), 'Cumbre Aurora 2026'))}${field('Si el correo ya existe', sel(['Actualizar datos', 'Omitir fila'], 'Actualizar datos'))}</div>
  <div class="note mt">${I('alert')}<span>3 filas sin correo se omitirán. También puedes cargar por API con <span class="code">PUT /v1/invitados/batch</span>.</span></div>
  ${mfoot(`${I('upload')}Importar 125 invitados`, 'import-ok')}`;
Modals['invitado-nuevo'] = () => `${mhead('Directorio', 'Nuevo invitado')}
  <div class="form-grid">${field('Nombre', inp('', 'text', 'Nombre y apellidos'))}${field('Correo', inp('', 'email', 'correo@dominio.com'))}${field('Empresa', inp())}${field('Teléfono', inp('', 'tel'))}${field('Categoría', sel(DB.categorias, 'General'))}${field('Equipo / área', sel(DB.equipos, 'Externo'))}</div>
  <div class="field mt"><span>Asignar a eventos</span><div class="chips">${DB.eventos.slice(0, 4).map((e, i) => `<button type="button" class="check-pill ${i === 0 ? 'is-on' : ''}" data-act="chip"><i>${I('check')}</i>${e.nombre}</button>`).join('')}</div></div>
  <div class="stack mt">${sw('Enviar invitación con enlace de confirmación', true)}${sw('Es representante (puede registrar invitados)', false)}</div>
  ${mfoot(`${I('check')}Guardar invitado`, 'guest-ok')}`;
Modals.asignar = () => `${mhead(`${App.state.sel.size} invitados`, 'Asignar a evento')}
  <div class="list">${DB.eventos.map((e, i) => `<label class="radio-row"><input type="radio" name="ev" ${i === 0 ? 'checked' : ''}><span class="mini-cover cover" style="--h:${e.hue}deg"></span><span class="grow"><b>${e.nombre}</b><small>${fd(e.fecha).full} · ${e.ciudad}</small></span>${estadoPill(App.state.pub[e.id] || e.estado)}</label>`).join('')}</div>
  ${mfoot(`${I('check')}Asignar`, 'assign-ok')}`;
Modals['ws-nuevo'] = () => `${mhead('Workspaces', 'Crear workspace')}
  <p class="sub">Cada workspace tiene sus propios usuarios, eventos, catálogos, archivos y datos.</p>
  <div class="form-grid mt">${field('Nombre', inp('', 'text', 'Ej. Agencia Norte'), 'full')}${field('Dirección', `<div class="prefix"><span>valk.app/</span><input placeholder="agencia-norte"></div>`, 'full')}${field('Plan', sel(['Pro', 'Equipo', 'Gratuito'], 'Pro'))}${field('Zona horaria', sel(['America/Mexico_City'], 'America/Mexico_City'))}</div>
  ${mfoot(`${I('plus')}Crear workspace`, 'ws-ok')}`;
Modals['cupon-nuevo'] = () => `${mhead('Boletos y ventas', 'Nuevo cupón')}
  <div class="form-grid">${field('Código', inp('NORNAS25'))}${field('Tipo', seg(['Porcentaje', 'Monto fijo']))}${field('Descuento', inp('25', 'number'))}${field('Límite de usos', inp('100', 'number'))}${field('Válido desde', inp('2026-10-13', 'date'))}${field('Válido hasta', inp('2026-11-13', 'date'))}</div>
  <div class="field mt"><span>Aplica a</span><div class="chips">${DB.boletos.map((b, i) => `<button type="button" class="check-pill ${i ? 'is-on' : ''}" data-act="chip"><i>${I('check')}</i>${b.nombre}</button>`).join('')}</div></div>
  ${mfoot(`${I('coupon')}Crear cupón`, 'coupon-ok')}`;
Modals['api-nueva'] = () => App.state.apiStep === 0
  ? `${mhead('API e integraciones', 'Nueva clave')}
  <div class="form-grid">${field('Nombre', inp('', 'text', 'Ej. Lector torniquete B'), 'full')}</div>
  <p class="eyebrow mt">Permisos</p>
  <div class="perm-grid">${['invitados:leer', 'invitados:escribir', 'confirmaciones:leer', 'qr:validar', 'asistencia:escribir', 'logistica:leer', 'logistica:escribir', 'sync'].map((p, i) => `<label class="perm"><input type="checkbox" ${i === 3 || i === 4 ? 'checked' : ''}><i></i><span class="mono">${p}</span></label>`).join('')}</div>
  ${mfoot(`${I('key')}Generar clave`, 'api-gen')}`
  : `${mhead('API e integraciones', 'Clave creada')}
  <div class="note">${I('alert')}<span>Copia la clave ahora. Por seguridad no volverá a mostrarse completa.</span></div>
  <div class="copybox mt"><span class="mono">vk_live_5e1b9c03d7a24f6e8b11c0aa94d2f7e3</span><button class="btn btn--primary btn--sm" data-act="copy" data-v="vk_live_5e1b9c03d7a24f6e8b11c0aa94d2f7e3">${I('copy')}Copiar</button></div>
  <div class="mfoot"><button class="btn btn--primary" data-act="close">Listo</button></div>`;
Modals.confirm = d => `${mhead('Confirmación', d.title)}<p class="sub">${d.text}</p>
  <div class="mfoot"><button class="btn btn--glass" data-act="close">Cancelar</button><button class="btn btn--danger solid" data-act="confirm-ok" data-done="${d.done}" data-arg="${d.arg || ''}">${d.ok}</button></div>`;
Modals.qr = d => {
  const g = DB.invitados.find(x => x.id == d.id);
  return `${mhead('Código de acceso', g.nombre)}<div class="center-col stage-soft">${ticket(evById(g.eventos[0]), g.nombre, g.cat)}</div>
  <div class="mfoot"><button class="btn btn--glass" data-act="export" data-v="QR de ${g.nombre} (PNG)">${I('download')}Descargar</button><button class="btn btn--primary" data-act="toast" data-msg="QR reenviado a ${g.email}">${I('send')}Reenviar por correo</button></div>`;
};
Modals.email = d => `${mhead('Vista previa', 'Correo para invitados')}${mailMock(evById(d.ev || 'aurora'))}`;
Modals.password = () => `${mhead('Seguridad', 'Cambiar contraseña')}
  <div class="form-grid">${field('Contraseña actual', inp('', 'password'), 'full')}${field('Nueva contraseña', inp('', 'password'))}${field('Confirmar', inp('', 'password'))}</div>
  <div class="strength"><i></i><i></i><i></i><i></i><span class="small">Fuerte</span></div>
  ${mfoot(`${I('lock')}Actualizar`, 'pw-ok')}`;
Modals.guest = d => {
  const g = DB.invitados.find(x => x.id == d.id);
  return `<div class="mhead"><span></span><button class="icon-btn sm" data-act="close" aria-label="Cerrar">${I('x')}</button></div>
  <div class="guest-head">${avatar(g.nombre, 'xl halo')}<div><h2 class="mtitle">${g.nombre}</h2><p class="sub">${g.email}</p><div class="row mt">${pill(g.cat, CAT_TONE[g.cat])}${g.rep ? pill('Representante', 'violet') : ''}</div></div></div>
  <div class="kvs">${[['Empresa', g.empresa], ['Equipo', g.equipo], ['Teléfono', g.tel], ['ID', 'INV-' + String(g.id).padStart(5, '0')]].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  <p class="eyebrow mt">Eventos asignados</p>
  <div class="list">${g.eventos.map(id => { const e = evById(id); return `<div class="row-item"><span class="mini-cover cover" style="--h:${e.hue}deg"></span><span class="grow"><b>${e.nombre}</b><small>${fd(e.fecha).full}</small></span>${pill(...RSVP[g.rsvp])}<button class="icon-btn sm" data-act="toast" data-msg="${g.nombre} retirado de ${e.nombre}" aria-label="Retirar">${I('x')}</button></div>`; }).join('')}
  <label class="select block">${I('plus')}<select data-change="sw" data-msg="Invitado asignado"><option>Asignar a otro evento…</option>${DB.eventos.filter(e => !g.eventos.includes(e.id)).map(e => `<option>${e.nombre}</option>`).join('')}</select>${I('chevdown')}</label></div>
  <p class="eyebrow mt">Respuestas del registro</p>
  <div class="kvs">${[['Restricciones alimentarias', 'Vegetariana'], ['Acompañante', 'Sí'], ['Puesto', 'Directora'], ['Aviso de privacidad', 'Aceptado · v3']].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
  <p class="eyebrow mt">Código QR</p>
  <div class="qr-row lg">${qr(g.nombre)}<div class="stack"><span class="mono">VK-${g.eventos[0].slice(0, 3).toUpperCase()}-${1040 + g.id * 7}</span><span class="sub small">Enviado el 08 oct · abierto 2 veces</span><button class="btn btn--glass btn--sm" data-act="toast" data-msg="QR reenviado a ${g.email}">${I('send')}Reenviar</button></div></div>
  <p class="eyebrow mt">Historial</p>
  <div class="mini-tl">${[['13 oct 18:52', g.checkin ? 'Check-in en Acceso A' : 'Abrió el correo con QR'], ['08 oct 10:14', 'Recibió correo con QR'], ['02 oct 09:30', 'Confirmó asistencia'], ['28 sep 16:02', 'Importado desde CSV']].map(([t, a]) => `<div><span class="mono dim">${t}</span><span>${a}</span></div>`).join('')}</div>
  <div class="mfoot"><button class="btn btn--danger" data-act="modal" data-m="confirm" data-title="Eliminar a ${g.nombre}" data-text="Se eliminarán sus registros, QR y respuestas." data-ok="Eliminar" data-done="del-guests">${I('trash')}Eliminar</button><button class="btn btn--primary" data-act="modal" data-m="invitado-nuevo">${I('edit')}Editar</button></div>`;
};
Modals.more = () => {
  const ws = wsCur();
  return `<div class="sheet__grip"></div>
  <p class="eyebrow">Workspace</p><div class="list ws-sheet">${wsList(ws)}</div>
  <p class="eyebrow mt">Módulos</p>
  <div class="more-grid">${NAV.map(n => `<a href="#/app/${n.id}" data-act="close-nav"><span class="ic-glass">${I(n.icon)}</span><span>${n.label}</span></a>`).join('')}<a href="#/app/perfil" data-act="close-nav"><span class="ic-glass">${I('user')}</span><span>Perfil</span></a><a href="#/explorar" data-act="close-nav"><span class="ic-glass">${I('compass')}</span><span>Sitio público</span></a></div>`;
};
