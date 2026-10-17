/* Vistas públicas y de acceso — Propuesta 2 · Liquid Glass */
const pubNav = () => `<header class="pubnav"><div class="pubnav__in lg lens">
  <a class="brand" href="#/explorar">${logo()}<span>VALK</span></a>
  <nav><a class="btn btn--glass btn--sm" href="#/explorar">${I('compass')}<span>Explorar</span></a><a class="btn btn--primary btn--sm" href="#/login">${I('user')}<span>Organizar eventos</span></a></nav>
</div></header>`;

/* ---------- Iniciar sesión / crear cuenta / recuperar ---------- */
Views.login = () => `<div class="login">
  <section class="login__stage">
    <div class="scene3d" data-scene="block"><div class="scene-fallback">${logo('scene-fallback__logo')}</div></div>
    <div class="login__caption lg lens">
      <b>Registro y acceso a eventos</b>
      <span>Invitados, boletos, QR y métricas en un solo lugar.</span>
    </div>
  </section>
  <section class="login__panel">
    <a class="brand brand--lg" href="#/explorar">${logo()}<span>VALK</span></a>
    <div class="auth lg lens" data-mode="${App.state.authMode}">
      <div class="seg auth__tabs"><button class="seg__i" data-act="auth" data-mode="login">Iniciar sesión</button><button class="seg__i" data-act="auth" data-mode="signup">Crear cuenta</button></div>
      <form class="auth__pane pane-login" onsubmit="return false">
        <div><h2 class="mtitle">Bienvenida de vuelta</h2><p class="sub">Entra a tu workspace para gestionar tus eventos.</p></div>
        ${field('Correo', '<input type="email" value="ana.valdes@nornas.mx" autocomplete="email">')}
        ${field('Contraseña', '<input type="password" value="••••••••••" autocomplete="current-password">')}
        <div class="row between"><label class="perm"><input type="checkbox" checked><i></i><span>Recordarme</span></label><button type="button" class="link" data-act="auth" data-mode="recover">¿Olvidaste tu contraseña?</button></div>
        <button type="button" class="btn btn--primary btn--lg block" data-act="enter">Entrar${I('arrow')}</button>
        <div class="or">o continúa con</div>
        <div class="row"><button type="button" class="btn btn--glass grow" data-act="enter">${I('globe')}Google</button><button type="button" class="btn btn--glass grow" data-act="enter">${I('grid')}Microsoft</button></div>
      </form>
      <form class="auth__pane pane-signup" onsubmit="return false">
        <div><h2 class="mtitle">Crea tu workspace</h2><p class="sub">Gratis hasta 100 invitados por evento.</p></div>
        <div class="form-grid">${field('Nombre', '<input placeholder="Tu nombre">')}${field('Organización', '<input placeholder="Nombre del workspace">')}</div>
        ${field('Correo de trabajo', '<input type="email" placeholder="tu@empresa.com">')}
        ${field('Contraseña', '<input type="password" placeholder="Mínimo 10 caracteres">')}
        <label class="perm"><input type="checkbox"><i></i><span>Acepto los términos y el aviso de privacidad</span></label>
        <button type="button" class="btn btn--primary btn--lg block" data-act="enter">${I('spark')}Crear cuenta</button>
      </form>
      <form class="auth__pane pane-recover" onsubmit="return false">
        <div><h2 class="mtitle">Recupera tu acceso</h2><p class="sub">Te enviaremos un enlace para crear una nueva contraseña. Caduca en 30 minutos.</p></div>
        ${field('Correo', '<input type="email" placeholder="tu@empresa.com">')}
        <button type="button" class="btn btn--primary btn--lg block" data-act="toast" data-msg="Enlace de recuperación enviado" data-icon="send">${I('send')}Enviar enlace</button>
        <button type="button" class="link center" data-act="auth" data-mode="login">${I('back')}Volver a iniciar sesión</button>
      </form>
    </div>
    <div class="login__links">
      <a href="#/explorar" class="btn btn--glass btn--sm">${I('compass')}Explorar eventos públicos</a>
      <a href="#/rsvp/gala" class="btn btn--glass btn--sm">${I('mail')}Ver invitación de ejemplo</a>
    </div>
  </section>
</div>`;

/* ---------- Explorar ---------- */
const CIUDADES = ['Todas', 'Ciudad de México', 'Monterrey', 'Guadalajara', 'En línea'];
function pubCard(ev) {
  const desde = ev.pago ? 'Desde ' + money(Math.min(...DB.boletos.map(b => b.precio)) * (ev.id === 'synth' ? 0.6 : 1)) : 'Gratis';
  return evCard(ev, `#/e/${ev.id}`).replace('<div class="cap">', `<div class="pub-price"><b>${desde}</b><span class="go">${I('arrow')}</span></div><div class="cap" hidden>`);
}
const pubList = () => DB.eventos.filter(e => (App.state.pub[e.id] || e.estado) === 'publico' && (App.state.city === 'Todas' || e.ciudad === App.state.city));
const expGrid = () => {
  const l = pubList();
  return l.length ? l.map(pubCard).join('') : `<div class="span-all">${empty('Sin eventos en ' + App.state.city, 'Prueba con otra ciudad o activa “Cerca de mí”.')}</div>`;
};

Views.explorar = () => `<div class="pub">
  ${pubNav()}
  <section class="pubhero">
    <div class="pubhero__txt">
      <p class="eyebrow">Eventos públicos</p>
      <h1>Encuentra tu próximo evento</h1>
      <p class="lead">Conferencias, conciertos y encuentros abiertos al público. Busca por ciudad o por cercanía y regístrate en segundos.</p>
      <div class="finder lg lens">
        <label>${I('search')}<input placeholder="Evento, artista o tema" data-input="filter" data-target="#exp-grid > .evc"></label>
        <label class="finder__city">${I('pin')}<select data-change="city">${CIUDADES.map(c => `<option ${App.state.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        <button class="btn btn--primary" data-act="near">${I('target')}<span>Cerca de mí</span></button>
      </div>
    </div>
    <div class="pubhero__stage"><div class="scene3d" data-scene="block"><div class="scene-fallback">${logo('scene-fallback__logo')}</div></div></div>
  </section>
  <section class="pubsec">
    <div class="sec-head"><div class="chips" id="city-chips">${CIUDADES.map(c => `<button class="check-pill ${App.state.city === c ? 'is-on' : ''}" data-act="city" data-v="${c}"><i>${I('check')}</i>${c}</button>`).join('')}</div><span class="dim small" id="exp-count">${pubList().length} eventos</span></div>
    <div class="evgrid" id="exp-grid">${expGrid()}</div>
  </section>
  <footer class="pubfoot"><span>${logo()} VALK · 2026</span><span>Aviso de privacidad · Soporte · Estado del servicio</span></footer>
</div>`;

/* ---------- Ficha y sitio público del evento ---------- */
Views.publico = id => {
  const ev = evById(id) || evById('aurora'), { d, m } = fd(ev.fecha);
  return `<div class="pub">
  ${pubNav()}
  <section class="pev-hero cover" style="--h:${ev.hue}deg">
    <div class="pev-hero__in">
      <a class="back" href="#/explorar">${I('back')}Explorar</a>
      <div class="pev-hero__glass lg lens">
        ${chip(d, m, 'white', 'big')}
        <div class="grow"><div class="row">${pill(ev.tipo, 'violet')}${pill(ev.modalidad, 'cyan')}</div>
        <h1>${ev.nombre}</h1>
        <div class="row meta-row"><span class="meta">${I('clock')}${ev.hora}</span><span class="meta">${I('pin')}${ev.sede}, ${ev.ciudad}</span></div></div>
      </div>
    </div>
  </section>
  <div class="pev">
    <div class="stack">
      ${card('Acerca del evento', '', `<p class="lead">${ev.desc}</p>
        <div class="kvs">${[['Organiza', 'Nornas Producciones'], ['Capacidad', num(ev.capacidad) + ' personas'], ['Categoría', ev.categoria], ['Idioma', 'Español']].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>`)}
      ${card('Agenda', '<span class="dim small">Día 1</span>', DB.agenda.map(s => `<p class="eyebrow mt">${s.sec}</p><div class="timeline">${s.items.map(it => `<div class="tl-it">${chip(it.h, it.f, 'white')}<div class="tl-it__body lg"><div class="grow"><b>${it.t}</b><small>${it.p ? it.p + ' · ' : ''}${it.l}</small></div>${it.link ? `<span class="tag">${I('link')}Transmisión</span>` : ''}</div></div>`).join('')}</div>`).join(''))}
      ${card('Cómo llegar', '', `<div class="map-mock"><div class="map-mock__grid"></div><span class="map-mock__pin">${I('pin')}</span><div class="map-mock__label lg"><b>${ev.sede}</b><small>${ev.ciudad}</small></div></div>`)}
      <p class="sub small">Al registrarte aceptas el <u>aviso de privacidad</u> de Nornas Producciones. Tus datos se usan solo para gestionar tu acceso.</p>
    </div>
    <aside class="reg-card lg lens">${regPanel(ev)}</aside>
  </div>
</div>`;
};

function regPanel(ev) {
  const s = App.state;
  if (s.pubStep === 'done') {
    return `<p class="eyebrow center">Registro completo</p>
    <h2 class="mtitle center">¡Te esperamos!</h2>
    <p class="sub center small">Enviamos tu código QR a <b>sofia.ramirez@lumen.org</b>. También puedes guardarlo ahora.</p>
    <div class="center-col">${ticket(ev, 'Sofía Ramírez', ev.pago ? 'General' : 'Asistente')}</div>
    <div class="row center mt"><button class="btn btn--glass btn--sm" data-act="toast" data-msg="Evento agregado a tu calendario">${I('calendar')}Calendario</button><button class="btn btn--glass btn--sm" data-act="export" data-v="comprobante (PDF)">${I('receipt')}Comprobante</button></div>
    <button class="link center mt" data-act="pub-reset">Registrar a otra persona</button>`;
  }
  if (!ev.auto) {
    return `<p class="eyebrow">Registro por invitación</p><h2 class="mtitle">Este evento es solo con invitación</h2>
    <p class="sub">Si recibiste una invitación, confirma desde el enlace de tu correo.</p><a class="btn btn--primary block" href="#/rsvp/${ev.id}">${I('mail')}Ver invitación de ejemplo</a>`;
  }
  if (ev.pago) {
    const items = DB.boletos.map(b => ({ ...b, q: s.cart[b.id] || 0 }));
    const sub = items.reduce((a, b) => a + b.q * b.precio, 0), desc = s.coupon ? Math.round(sub * 0.2) : 0;
    return `<p class="eyebrow">Boletos</p><h2 class="mtitle">Elige tus boletos</h2>
    <div class="list">${items.map(b => {
      const out = b.vendidos >= b.total;
      return `<div class="tkrow ${out ? 'is-out' : ''}"><div class="grow"><b>${b.nombre}</b><small>${b.desc}</small><span class="tkrow__price">${money(b.precio)}</span></div>
      ${out ? `<button class="btn btn--glass btn--sm" data-act="toast" data-msg="Te uniste a la lista de espera. Te avisaremos si se libera un lugar." data-icon="clock">Lista de espera</button>` : `<div class="stepper"><button data-act="qty" data-id="${b.id}" data-d="-1" aria-label="Menos">${I('minus')}</button><b>${b.q}</b><button data-act="qty" data-id="${b.id}" data-d="1" aria-label="Más">${I('plus')}</button></div>`}</div>`;
    }).join('')}</div>
    <label class="search coupon">${I('coupon')}<input id="coupon" placeholder="Código de descuento" value="${s.coupon || ''}"><button class="search__go" data-act="coupon" aria-label="Aplicar cupón">${I('check')}</button></label>
    <div class="sum"><span>Subtotal</span><b>${money(sub)}</b>${desc ? `<span>Cupón ${s.coupon}</span><b class="tone-green">−${money(desc)}</b>` : ''}<span class="sum__total">Total</span><b class="sum__total">${money(sub - desc)}</b></div>
    <button class="btn btn--primary btn--lg block" data-act="pay" ${sub ? '' : 'disabled'}>${I('lock')}Pagar con Stripe</button>
    <p class="dim small center">Pago seguro con Stripe Checkout</p>`;
  }
  return `<p class="eyebrow">Registro gratuito</p><h2 class="mtitle">Reserva tu lugar</h2>
  <div class="stack">${App.state.formQ.filter(q => q.tipo !== 'Sección').map(q => q.tipo === 'Casilla' ? `<label class="perm"><input type="checkbox"><i></i><span>${q.label}</span></label>`
    : q.opts ? field(q.label, sel(q.opts, q.opts[0])) : q.tipo === 'Sí / No' ? `<div class="field"><span>${q.label}</span>${seg(['Sí', 'No'], 1)}</div>` : field(q.label + (q.req ? ' *' : ''), inp('', q.tipo === 'Correo' ? 'email' : 'text'))).join('')}
  <button class="btn btn--primary btn--lg block" data-act="register">${I('check')}Registrarme</button></div>
  <p class="dim small center">${num(ev.capacidad - ev.registrados)} lugares disponibles</p>`;
}

/* ---------- Confirmar o rechazar asistencia (desde correo) ---------- */
Views.rsvp = id => {
  const ev = evById(id) || evById('gala'), r = App.state.rsvp, { d, m } = fd(ev.fecha);
  return `<div class="pub">${pubNav()}
  <div class="rsvp">
    <section class="rsvp__card lg lens">
      <div class="rsvp__cover cover" style="--h:${ev.hue}deg">${chip(d, m, 'white', 'big')}</div>
      <div class="rsvp__body">
        ${r === 'si' ? `<p class="eyebrow center">Asistencia confirmada</p><h1 class="mtitle center">¡Te esperamos, Sofía!</h1><p class="sub center">Tu código de acceso para <b>${ev.nombre}</b> está listo. También lo enviamos a tu correo.</p><div class="center-col">${ticket(ev, 'Sofía Ramírez', 'VIP')}</div><div class="row center mt"><button class="btn btn--glass btn--sm" data-act="toast" data-msg="Agregado a tu calendario">${I('calendar')}Agregar al calendario</button><button class="link" data-act="rsvp" data-v="">Cambiar respuesta</button></div>`
        : r === 'no' ? `<p class="eyebrow center">Respuesta registrada</p><h1 class="mtitle center">Lamentamos que no puedas venir</h1><p class="sub center">Avisamos al equipo organizador. Si cambias de opinión, puedes confirmar mientras haya lugares.</p><div class="row center"><button class="btn btn--primary" data-act="rsvp" data-v="si">${I('check')}Sí podré asistir</button></div>`
        : `<p class="eyebrow center">Hola, Sofía Ramírez</p><h1 class="mtitle center">¿Nos acompañas a ${ev.nombre}?</h1>
          <div class="kvs">${[['Fecha', fd(ev.fecha).full], ['Horario', ev.hora], ['Lugar', ev.sede], ['Invitación', 'Personal · 1 acompañante']].map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
          <div class="rsvp__act"><button class="btn btn--glass btn--lg" data-act="rsvp" data-v="no">${I('x')}No podré asistir</button><button class="btn btn--primary btn--lg" data-act="rsvp" data-v="si">${I('check')}Confirmar asistencia</button></div>
          <p class="dim small center">Enlace personal · no lo compartas</p>`}
      </div>
    </section>
  </div></div>`;
};
