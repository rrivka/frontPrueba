/* Datos de ejemplo — Propuesta 1 (solo para maquetar) */
(function () {
  const NOMBRES = ['Marco Treviño', 'Inés Robles', 'Pablo Arce', 'Elena Quiroga', 'Rodrigo Paz', 'Daniela Cruz', 'Gael Sandoval',
    'Renata Solís', 'Iván Lozano', 'Paola Méndez', 'Luis Treviño', 'Carla Benítez', 'Héctor Garza', 'Mariana Treviño', 'Óscar Medina',
    'Alma Reyes', 'Julián Mora', 'Natalia Ponce', 'Santiago Gil', 'Victoria Luna', 'Adrián Cano', 'Elisa Prado', 'Hugo Ferrer',
    'Abril Montes', 'Nicolás Ruiz', 'Clara Ávila', 'Joaquín Rey', 'Lorena Vidal', 'Martín Ochoa', 'Sara Lugo', 'Ramiro Paz',
    'Diana Soto', 'Felipe Nava', 'Miranda Gómez', 'Esteban Toro', 'Julia Ibáñez', 'Raúl Campos', 'Isabel Mejía', 'Bruno Lara',
    'Teresa Olmos', 'Ángel Zamora', 'Lucía Varela', 'Germán Ríos', 'Pilar Rangel', 'Mauricio Leal', 'Carmen Salas', 'Rafael Durán',
    'Olivia Serna', 'Simón Pardo', 'Andrea Lagos', 'Jorge Ugalde', 'Beatriz Cota', 'Leonel Ávalos', 'Rocío Peña', 'Arturo Bravo',
    'Gabriela Uribe', 'Ernesto Villa', 'Marisol Tapia', 'Fabián Leyva', 'Patricia Mora', 'Roberto Lima', 'Silvia Barco', 'Tadeo Coria',
    'Valentina Rocha', 'Emiliano Vera', 'Jimena Castro', 'Gonzalo Pineda', 'Ariadna Fuentes', 'Ricardo Solano', 'Mónica Haro'];

  let k = 0;
  const mesa = (id, nombre, cap, n) => ({ id, nombre, cap, inv: Array.from({ length: n }, () => NOMBRES[k++ % NOMBRES.length]) });

  window.DB = {
    user: { nombre: 'Ana Valdés', email: 'ana.valdes@nornas.mx', rol: 'Propietaria', tel: '+52 55 4821 9930', puesto: 'Directora de producción' },

    workspaces: [
      { id: 'w1', nombre: 'Nornas Producciones', plan: 'Pro', miembros: 12, hue: 250 },
      { id: 'w2', nombre: 'Fundación Lumen', plan: 'Equipo', miembros: 5, hue: 170 },
      { id: 'w3', nombre: 'Tec Forum MX', plan: 'Pro', miembros: 8, hue: 320 },
    ],

    eventos: [
      { id: 'aurora', nombre: 'Cumbre Aurora 2026', tipo: 'Conferencia', categoria: 'Tecnología', estado: 'publico', fecha: '2026-11-14', fin: '2026-11-15', hora: '09:00 – 18:00', sede: 'Centro Citibanamex', ciudad: 'Ciudad de México', modalidad: 'Presencial', capacidad: 1200, registrados: 964, confirmados: 812, ventas: 1284500, pago: true, auto: true, hue: 0, desc: 'Dos días de charlas, talleres y demos sobre el futuro de las interfaces, la IA aplicada y el diseño de experiencias.' },
      { id: 'apis', nombre: 'Foro APIs Abiertas', tipo: 'Meetup', categoria: 'Tecnología', estado: 'publico', fecha: '2026-10-13', hora: '18:30 – 21:30', sede: 'Distrito Tec', ciudad: 'Monterrey', modalidad: 'Híbrido', enlace: 'https://meet.valk.app/apis', capacidad: 180, registrados: 171, confirmados: 150, ventas: 0, pago: false, auto: true, hue: 140, desc: 'Charlas relámpago sobre integración de sistemas, diseño de APIs y automatización.' },
      { id: 'gala', nombre: 'Gala Anual Lumen', tipo: 'Gala', categoria: 'Filantropía', estado: 'nolistado', fecha: '2026-10-24', hora: '20:00 – 01:00', sede: 'Museo Soumaya', ciudad: 'Ciudad de México', modalidad: 'Presencial', capacidad: 320, registrados: 298, confirmados: 276, ventas: 0, pago: false, auto: false, hue: 60, desc: 'Cena de recaudación con subasta silenciosa y mesas asignadas.' },
      { id: 'liderazgo', nombre: 'Taller de Liderazgo Interno', tipo: 'Taller', categoria: 'Capacitación', estado: 'privado', fecha: '2026-10-29', hora: '10:00 – 14:00', sede: 'Sala virtual', ciudad: 'En línea', modalidad: 'Virtual', enlace: 'https://meet.valk.app/lider', capacidad: 40, registrados: 36, confirmados: 31, ventas: 0, pago: false, auto: false, hue: 100, desc: 'Sesión interna para coordinadores de área.' },
      { id: 'synth', nombre: 'Noche Synth · Concierto', tipo: 'Concierto', categoria: 'Música', estado: 'publico', fecha: '2026-12-05', hora: '21:00 – 00:30', sede: 'Foro Independencia', ciudad: 'Guadalajara', modalidad: 'Presencial', capacidad: 2500, registrados: 1730, confirmados: 1730, ventas: 1557000, pago: true, auto: true, hue: 200, desc: 'Synth en vivo, visuales inmersivos y una noche entera de música electrónica.' },
      { id: 'expo', nombre: 'Expo Diseño Contemporáneo', tipo: 'Exposición', categoria: 'Diseño', estado: 'borrador', fecha: '2027-01-22', hora: '11:00 – 20:00', sede: 'Por definir', ciudad: 'Ciudad de México', modalidad: 'Presencial', capacidad: 600, registrados: 0, confirmados: 0, ventas: 0, pago: true, auto: false, hue: 280, desc: 'Muestra de diseño industrial, objetos y materiales.' },
    ],

    invitados: [
      { id: 1, nombre: 'Sofía Ramírez', email: 'sofia.ramirez@lumen.org', empresa: 'Fundación Lumen', cat: 'VIP', equipo: 'Dirección', eventos: ['aurora', 'gala'], rsvp: 'confirmado', checkin: false, tel: '55 1029 3847', rep: true },
      { id: 2, nombre: 'Diego Herrera', email: 'dherrera@kappa.mx', empresa: 'Kappa Labs', cat: 'Ponente', equipo: 'Externo', eventos: ['aurora', 'apis'], rsvp: 'confirmado', checkin: true, tel: '81 2290 1144' },
      { id: 3, nombre: 'Valeria Núñez', email: 'vnunez@nornas.mx', empresa: 'Nornas Producciones', cat: 'Staff', equipo: 'Operaciones', eventos: ['aurora', 'apis', 'synth'], rsvp: 'confirmado', checkin: true, tel: '55 9031 2277' },
      { id: 4, nombre: 'Mateo Castillo', email: 'mateo@prensa.mx', empresa: 'Prensa Digital', cat: 'Prensa', equipo: 'Externo', eventos: ['aurora'], rsvp: 'pendiente', checkin: false, tel: '55 7720 0193' },
      { id: 5, nombre: 'Camila Ortega', email: 'camila.o@astra.com', empresa: 'Astra Seguros', cat: 'Patrocinador', equipo: 'Ventas', eventos: ['aurora', 'gala'], rsvp: 'confirmado', checkin: false, tel: '33 4410 8820', rep: true },
      { id: 6, nombre: 'Javier Morales', email: 'jmorales@gmail.com', empresa: '—', cat: 'General', equipo: '—', eventos: ['synth'], rsvp: 'confirmado', checkin: false, tel: '33 1200 4455' },
      { id: 7, nombre: 'Lucía Fernández', email: 'lucia.f@lumen.org', empresa: 'Fundación Lumen', cat: 'VIP', equipo: 'Dirección', eventos: ['gala'], rsvp: 'rechazado', checkin: false, tel: '55 6612 0091' },
      { id: 8, nombre: 'Andrés Vega', email: 'avega@kappa.dev', empresa: 'Kappa Dev', cat: 'Ponente', equipo: 'Externo', eventos: ['apis'], rsvp: 'confirmado', checkin: true, tel: '81 3345 9902' },
      { id: 9, nombre: 'Regina Salas', email: 'regina@nornas.mx', empresa: 'Nornas Producciones', cat: 'Staff', equipo: 'Marketing', eventos: ['aurora', 'synth'], rsvp: 'confirmado', checkin: false, tel: '55 2093 4471' },
      { id: 10, nombre: 'Emilio Rojas', email: 'erojas@outlook.com', empresa: '—', cat: 'General', equipo: '—', eventos: ['apis'], rsvp: 'pendiente', checkin: false, tel: '81 9087 1122' },
      { id: 11, nombre: 'Ximena Duarte', email: 'xd@astra.com', empresa: 'Astra Seguros', cat: 'Patrocinador', equipo: 'Ventas', eventos: ['aurora'], rsvp: 'pendiente', checkin: false, tel: '33 7781 2030' },
      { id: 12, nombre: 'Tomás Ibarra', email: 'tomas.ibarra@uanl.mx', empresa: 'UANL', cat: 'General', equipo: '—', eventos: ['apis'], rsvp: 'confirmado', checkin: true, tel: '81 1124 5567' },
      { id: 13, nombre: 'Fernanda León', email: 'fleon@revista.mx', empresa: 'Revista Forma', cat: 'Prensa', equipo: 'Externo', eventos: ['synth', 'aurora'], rsvp: 'confirmado', checkin: false, tel: '55 3341 7789' },
      { id: 14, nombre: 'Bruno Galindo', email: 'bruno@lumen.org', empresa: 'Fundación Lumen', cat: 'VIP', equipo: 'Dirección', eventos: ['gala'], rsvp: 'pendiente', checkin: false, tel: '55 8810 3321' },
    ],

    categorias: ['VIP', 'Ponente', 'Prensa', 'Patrocinador', 'Staff', 'General'],
    equipos: ['Dirección', 'Ventas', 'Marketing', 'Operaciones', 'Externo'],

    reps: [
      { nombre: 'Camila Ortega', empresa: 'Astra Seguros', evento: 'aurora', limite: 5, invitados: ['Ximena Duarte', 'Rodrigo Paz', 'Elena Quiroga'] },
      { nombre: 'Sofía Ramírez', empresa: 'Fundación Lumen', evento: 'gala', limite: 8, invitados: ['Bruno Galindo', 'Lucía Fernández', 'Marco Treviño', 'Inés Robles', 'Pablo Arce'] },
    ],

    colaboradores: [
      { nombre: 'Valeria Núñez', email: 'vnunez@nornas.mx', rol: 'Editor' },
      { nombre: 'Regina Salas', email: 'regina@nornas.mx', rol: 'Editor' },
      { nombre: 'Paula Ríos', email: 'paula.rios@nornas.mx', rol: 'Operador de acceso' },
      { nombre: 'Óscar Medina', email: 'omedina@nornas.mx', rol: 'Solo lectura' },
    ],

    preguntas: [
      { id: 1, label: 'Nombre completo', tipo: 'Texto', req: true, fixed: true },
      { id: 2, label: 'Correo electrónico', tipo: 'Correo', req: true, fixed: true },
      { id: 3, label: 'Empresa u organización', tipo: 'Texto', req: false },
      { id: 4, label: 'Puesto', tipo: 'Texto', req: false },
      { id: 5, label: 'Restricciones alimentarias', tipo: 'Opción múltiple', req: false, opts: ['Ninguna', 'Vegetariana', 'Vegana', 'Sin gluten'] },
      { id: 6, label: '¿Asistirás con acompañante?', tipo: 'Sí / No', req: true },
      { id: 7, label: 'Acepto el aviso de privacidad', tipo: 'Casilla', req: true, fixed: true },
    ],

    scans: [
      { t: '18:52:14', nombre: 'Tomás Ibarra', res: 'ok', puerta: 'Acceso A · Cámara' },
      { t: '18:51:40', nombre: 'Andrés Vega', res: 'ok', puerta: 'Torniquete A · API' },
      { t: '18:50:02', nombre: 'Emilio Rojas', res: 'noconf', puerta: 'Acceso A · Cámara' },
      { t: '18:49:31', nombre: 'Diego Herrera', res: 'dup', puerta: 'Torniquete A · API' },
      { t: '18:47:55', nombre: 'Valeria Núñez', res: 'ok', puerta: 'Acceso A · Cámara' },
      { t: '18:46:10', nombre: 'Mariana Treviño', res: 'ok', puerta: 'Torniquete A · API' },
      { t: '18:44:37', nombre: 'Código desconocido', res: 'bad', puerta: 'Acceso A · Cámara' },
      { t: '18:43:02', nombre: 'Héctor Garza', res: 'ok', puerta: 'Torniquete A · API' },
    ],
    scanPool: [
      { nombre: 'Paola Méndez', res: 'ok' }, { nombre: 'Luis Treviño', res: 'ok' }, { nombre: 'Emilio Rojas', res: 'noconf' },
      { nombre: 'Carla Benítez', res: 'ok' }, { nombre: 'Tomás Ibarra', res: 'dup' }, { nombre: 'Gael Sandoval', res: 'ok' },
      { nombre: 'Código desconocido', res: 'bad' }, { nombre: 'Renata Solís', res: 'ok' },
    ],

    boletos: [
      { id: 't1', nombre: 'Preventa', precio: 1490, vendidos: 300, total: 300, espera: 42, desc: 'Preventa limitada' },
      { id: 't2', nombre: 'General', precio: 2290, vendidos: 412, total: 700, espera: 0, desc: 'Acceso a los dos días' },
      { id: 't3', nombre: 'VIP · Salón', precio: 5900, vendidos: 88, total: 120, espera: 0, desc: 'Lounge, cena y primera fila' },
      { id: 't4', nombre: 'Estudiante', precio: 890, vendidos: 64, total: 80, espera: 0, desc: 'Con credencial vigente' },
    ],
    cupones: [
      { codigo: 'AURORA20', desc: '20 %', usos: 84, limite: 150, vigencia: '31 oct 2026', estado: 'activo' },
      { codigo: 'PRENSA100', desc: '100 %', usos: 12, limite: 20, vigencia: '14 nov 2026', estado: 'activo' },
      { codigo: 'VIP-ASTRA', desc: '15 %', usos: 3, limite: 10, vigencia: '10 nov 2026', estado: 'activo' },
      { codigo: 'APIS300', desc: '$300', usos: 40, limite: 40, vigencia: '30 sep 2026', estado: 'agotado' },
    ],
    ordenes: [
      { id: 'VK-10482', comprador: 'Javier Morales', email: 'jmorales@gmail.com', evento: 'synth', boletos: '2 × General', total: 1800, estado: 'pagado', fecha: '12 oct · 21:14' },
      { id: 'VK-10481', comprador: 'Fernanda León', email: 'fleon@revista.mx', evento: 'aurora', boletos: '1 × VIP · Salón', total: 5900, estado: 'pagado', fecha: '12 oct · 19:02' },
      { id: 'VK-10479', comprador: 'Iván Lozano', email: 'ivan.l@correo.mx', evento: 'aurora', boletos: '1 × General', total: 2290, estado: 'reembolsado', fecha: '11 oct · 10:47' },
      { id: 'VK-10476', comprador: 'Renata Solís', email: 'renata@studio.mx', evento: 'aurora', boletos: '3 × General', total: 6870, estado: 'incidencia', fecha: '10 oct · 18:30' },
      { id: 'VK-10473', comprador: 'Gael Sandoval', email: 'gael.s@uni.mx', evento: 'aurora', boletos: '1 × Estudiante', total: 890, estado: 'pendiente', fecha: '10 oct · 12:05' },
      { id: 'VK-10470', comprador: 'Alma Reyes', email: 'alma.reyes@mail.com', evento: 'synth', boletos: '4 × General', total: 3600, estado: 'pagado', fecha: '09 oct · 22:41' },
      { id: 'VK-10468', comprador: 'Julián Mora', email: 'jmora@corp.mx', evento: 'aurora', boletos: '2 × General', total: 4580, estado: 'cancelado', fecha: '08 oct · 09:12' },
    ],
    espera: [
      { nombre: 'Natalia Ponce', email: 'nponce@mail.com', boleto: 'Preventa', cant: 2, desde: '09 oct', estado: 'en espera' },
      { nombre: 'Santiago Gil', email: 'sgil@empresa.mx', boleto: 'Preventa', cant: 1, desde: '09 oct', estado: 'reservado' },
      { nombre: 'Victoria Luna', email: 'vluna@mail.com', boleto: 'Preventa', cant: 1, desde: '10 oct', estado: 'en espera' },
      { nombre: 'Adrián Cano', email: 'acano@mail.com', boleto: 'Preventa', cant: 3, desde: '11 oct', estado: 'en espera' },
    ],

    agenda: [
      { sec: 'Día 1 · Apertura', items: [
        { h: '08:30', f: '09:30', t: 'Registro y bienvenida', l: 'Lobby principal', k: 'Logística' },
        { h: '09:30', f: '10:15', t: 'Keynote · Interfaces del nuevo milenio', p: 'Diego Herrera', l: 'Sala Aurora', k: 'Keynote', link: true },
        { h: '10:30', f: '11:30', t: 'Panel · Diseño que se siente en 3D', p: 'Fernanda León, Andrés Vega', l: 'Sala Aurora', k: 'Panel' },
        { h: '11:30', f: '12:00', t: 'Coffee break', l: 'Terraza', k: 'Pausa' },
      ] },
      { sec: 'Día 1 · Tarde', items: [
        { h: '13:00', f: '14:30', t: 'Talleres simultáneos', l: 'Salas B, C y D', k: 'Taller' },
        { h: '15:00', f: '16:00', t: 'Demo day · Startups', l: 'Sala Aurora', k: 'Demo', link: true },
        { h: '17:00', f: '18:00', t: 'Cierre y networking', l: 'Terraza', k: 'Social' },
      ] },
    ],

    mesas: [
      { id: 1, nombre: 'Honor', cap: 10, inv: ['Sofía Ramírez', 'Bruno Galindo', 'Camila Ortega', 'Marco Treviño', 'Inés Robles', 'Pablo Arce', 'Elena Quiroga', 'Rodrigo Paz'] },
      mesa(2, 'Mesa 2', 10, 10), mesa(3, 'Mesa 3', 10, 9), mesa(4, 'Mesa 4', 10, 10),
      mesa(5, 'Mesa 5', 10, 7), mesa(6, 'Mesa 6', 10, 10), mesa(7, 'Mesa 7', 8, 6), mesa(8, 'Mesa 8', 8, 4),
    ],
    sinMesa: ['Mateo Castillo', 'Fernanda León', 'Javier Morales', 'Regina Salas', 'Tomás Ibarra', 'Ximena Duarte'],

    logistica: [
      { item: 'Pantalla LED 6 × 3 m', cat: 'Audiovisual', cant: 2, resp: 'Valeria Núñez', estado: 'confirmado', costo: 84000 },
      { item: 'Catering · coffee break', cat: 'Alimentos', cant: 1200, resp: 'Regina Salas', estado: 'cotizando', costo: 156000 },
      { item: 'Gafetes PVC holográficos', cat: 'Impresión', cant: 1400, resp: 'Regina Salas', estado: 'confirmado', costo: 21000 },
      { item: 'Staff de registro', cat: 'Personal', cant: 18, resp: 'Valeria Núñez', estado: 'confirmado', costo: 54000 },
      { item: 'Lectores QR de torniquete', cat: 'Equipo', cant: 6, resp: 'Paula Ríos', estado: 'en tránsito', costo: 18000 },
      { item: 'Escenografía · arco de luz', cat: 'Producción', cant: 1, resp: 'Valeria Núñez', estado: 'pendiente', costo: 132000 },
    ],
    finanzas: { presupuesto: 1450000, comprometido: 980000, pagado: 610000, ingresos: 1284500,
      partidas: [['Producción', 420000], ['Alimentos', 310000], ['Audiovisual', 190000], ['Personal', 140000], ['Impresión', 60000], ['Equipo', 40000]] },

    campanas: [
      { asunto: 'Tu acceso a Cumbre Aurora 2026', tipo: 'QR', evento: 'aurora', enviados: 812, abiertos: 640, pend: 1, fecha: '08 oct' },
      { asunto: 'Confirma tu asistencia · Gala Lumen', tipo: 'Confirmación', evento: 'gala', enviados: 298, abiertos: 251, pend: 1, fecha: '05 oct' },
      { asunto: 'Hoy es el Foro APIs Abiertas', tipo: 'Personalizado', evento: 'apis', enviados: 171, abiertos: 149, pend: 1, fecha: '13 oct' },
      { asunto: 'Bienvenida · Noche Synth', tipo: 'Registro', evento: 'synth', enviados: 1730, abiertos: 1302, pend: 1, fecha: '01 oct' },
    ],
    pendientes: [
      { id: 'p1', para: 'xd@astra.com', asunto: 'Tu acceso a Cumbre Aurora 2026', error: 'Buzón lleno', intentos: 2 },
      { id: 'p2', para: 'erojas@outlook.com', asunto: 'Hoy es el Foro APIs Abiertas', error: 'Rebote temporal', intentos: 1 },
      { id: 'p3', para: 'bruno@lumen.org', asunto: 'Confirma tu asistencia · Gala Lumen', error: 'Tiempo de espera SMTP', intentos: 3 },
      { id: 'p4', para: 'nponce@mail.com', asunto: 'Bienvenida · Noche Synth', error: 'Servidor no disponible', intentos: 1 },
    ],

    usuarios: [
      { nombre: 'Ana Valdés', email: 'ana.valdes@nornas.mx', rol: 'Propietaria', lectura: false, ultimo: 'Ahora' },
      { nombre: 'Valeria Núñez', email: 'vnunez@nornas.mx', rol: 'Administrador', lectura: false, ultimo: 'Hace 5 min' },
      { nombre: 'Regina Salas', email: 'regina@nornas.mx', rol: 'Editor', lectura: false, ultimo: 'Hace 1 h' },
      { nombre: 'Paula Ríos', email: 'paula.rios@nornas.mx', rol: 'Operador de acceso', lectura: false, ultimo: 'Hace 3 min' },
      { nombre: 'Óscar Medina', email: 'omedina@nornas.mx', rol: 'Solo lectura', lectura: true, ultimo: 'Ayer' },
    ],
    roles: [
      ['Propietaria', 'Todo, incluida facturación y eliminación del workspace'],
      ['Administrador', 'Usuarios, roles, API, eventos y ventas'],
      ['Editor', 'Eventos, invitados, agenda y comunicación'],
      ['Operador de acceso', 'Escáner, check-in y búsqueda de invitados'],
      ['Solo lectura', 'Consulta de datos y exportaciones, sin cambios'],
    ],

    apikeys: [
      { id: 'k1', nombre: 'Lector torniquete A', prefijo: 'vk_live_8f3a…', permisos: ['qr:validar', 'asistencia:escribir'], uso: 'Hace 1 min', llamadas: 18432 },
      { id: 'k2', nombre: 'CRM Sync', prefijo: 'vk_live_c21d…', permisos: ['invitados:leer', 'invitados:escribir', 'confirmaciones:leer'], uso: 'Hace 2 h', llamadas: 5210 },
      { id: 'k3', nombre: 'Logística ERP', prefijo: 'vk_live_77b0…', permisos: ['logistica:leer', 'sync'], uso: 'Ayer', llamadas: 880 },
    ],
    apilog: [
      { t: '18:52:14', key: 'Lector torniquete A', m: 'POST', ruta: '/v1/qr/validate', st: 200, ms: 84 },
      { t: '18:51:40', key: 'Lector torniquete A', m: 'POST', ruta: '/v1/qr/validate', st: 200, ms: 79 },
      { t: '18:49:31', key: 'Lector torniquete A', m: 'POST', ruta: '/v1/qr/validate', st: 409, ms: 91 },
      { t: '16:40:02', key: 'CRM Sync', m: 'PUT', ruta: '/v1/invitados/batch', st: 200, ms: 412 },
      { t: '16:39:58', key: 'CRM Sync', m: 'GET', ruta: '/v1/confirmaciones?evento=aurora', st: 200, ms: 133 },
      { t: '09:12:44', key: 'Logística ERP', m: 'GET', ruta: '/v1/logistica', st: 401, ms: 22 },
    ],
    auditoria: [
      { t: '13 oct · 18:40', u: 'Valeria Núñez', a: 'Restableció conteos de escaneo', o: 'Foro APIs Abiertas' },
      { t: '13 oct · 16:40', u: 'API · CRM Sync', a: 'Importó 120 invitados', o: 'Cumbre Aurora 2026' },
      { t: '13 oct · 12:02', u: 'Ana Valdés', a: 'Cambió la publicación a Público', o: 'Cumbre Aurora 2026' },
      { t: '12 oct · 20:15', u: 'Sistema', a: 'Concilió 14 órdenes con Stripe', o: 'Ventas' },
      { t: '12 oct · 11:30', u: 'Óscar Medina', a: 'Exportó ventas (Excel)', o: 'Noche Synth' },
      { t: '11 oct · 09:00', u: 'Ana Valdés', a: 'Concedió acceso de soporte', o: 'Workspace' },
      { t: '10 oct · 17:22', u: 'Regina Salas', a: 'Editó la plantilla de correo QR', o: 'Cumbre Aurora 2026' },
    ],
    servicios: [
      { n: 'API pública', s: 'ok', d: '84 ms' }, { n: 'Envío de correo', s: 'ok', d: '99.9 %' },
      { n: 'Pagos · Stripe', s: 'ok', d: 'Conectado' }, { n: 'Validación QR', s: 'ok', d: '62 ms' },
      { n: 'Exportaciones', s: 'warn', d: 'Cola lenta' }, { n: 'Almacenamiento', s: 'ok', d: '38 % usado' },
    ],
    novedades: [
      { v: '2.4.0', fecha: '07 oct 2026', items: ['Lista de espera con reservas automáticas', 'Conciliación de órdenes con Stripe', 'Auditoría exportable a Excel'] },
      { v: '2.3.2', fecha: '18 sep 2026', items: ['Lector externo de QR mediante API', 'Reintento de correos pendientes'] },
      { v: '2.3.0', fecha: '28 ago 2026', items: ['Mesas con reporte imprimible', 'Representantes con invitados delegados'] },
    ],

    privacidad: 'Nornas Producciones, S.A. de C.V., con domicilio en Ciudad de México, es responsable del tratamiento de tus datos personales. Los datos que proporciones en este registro se usarán para gestionar tu acceso al evento, enviarte tu código QR y comunicarte cambios en la agenda. Puedes ejercer tus derechos ARCO escribiendo a privacidad@nornas.mx.',

    registrosDia: [42, 38, 51, 47, 60, 58, 72, 66, 81, 77, 90, 85, 96, 110, 104, 98, 121, 133, 127, 140, 152, 149, 161, 170, 166, 182, 190, 201, 214, 226],
  };
})();
