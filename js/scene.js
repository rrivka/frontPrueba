/* Escena 3D — bloque de vidrio con el logotipo VALK incrustado (Three.js r165) */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointer = { x: 0, y: 0 };
addEventListener('pointermove', e => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = (e.clientY / innerHeight) * 2 - 1;
});

// Fondo pastel (lo que el vidrio refracta): manchas de color suaves sobre gris cálido.
function backdrop() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const g = c.getContext('2d');
  const base = g.createLinearGradient(0, 0, 1024, 1024);
  base.addColorStop(0, '#eef0f4'); base.addColorStop(1, '#dfe3ea');
  g.fillStyle = base; g.fillRect(0, 0, 1024, 1024);
  const blob = (x, y, r, col) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 1024, 1024);
  };
  blob(330, 380, 330, 'rgba(124,108,255,.85)');
  blob(700, 620, 340, 'rgba(79,209,197,.8)');
  blob(640, 300, 240, 'rgba(255,170,200,.75)');
  blob(300, 760, 260, 'rgba(255,196,140,.6)');
  // Color justo detrás del bloque para que la refracción se note
  blob(430, 470, 210, 'rgba(108,92,255,.9)');
  blob(610, 540, 200, 'rgba(52,195,176,.85)');
  blob(540, 420, 140, 'rgba(255,140,190,.8)');
  // Haces de luz diagonales, como la luz de ventana de las referencias
  g.globalCompositeOperation = 'soft-light';
  g.fillStyle = 'rgba(255,255,255,.32)';
  for (let i = -2; i < 6; i++) { g.save(); g.translate(i * 220, 0); g.rotate(-0.5); g.fillRect(0, -200, 70, 1600); g.restore(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Textura del logotipo a partir de los mismos trazos que usa la interfaz.
function logoTexture(color = '#3c474f') {
  const c = document.createElement('canvas');
  c.width = 1800; c.height = 886;
  const g = c.getContext('2d');
  g.scale(2, 2); g.translate(-65, -57);
  g.beginPath(); g.roundRect(65, 57, 900, 443, 7); g.clip();
  g.strokeStyle = color; g.lineWidth = 32; g.lineJoin = 'miter'; g.lineCap = 'butt';
  LOGO_PATHS.forEach(d => g.stroke(new Path2D(d)));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, 'rgba(30,40,60,.42)'); rg.addColorStop(1, 'rgba(30,40,60,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

const glass = (o = {}) => new THREE.MeshPhysicalMaterial({
  color: 0xffffff, metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.9, ior: 1.5,
  dispersion: 4, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 0.25, iridescenceIOR: 1.3,
  specularIntensity: 1, envMapIntensity: 1.1, ...o,
});

const PRESETS = {
  block(scene, renderer) {
    scene.background = backdrop();
    // El bloque refleja el propio fondo pastel (no el estudio gris) para verse transparente
    const eq = scene.background.clone();
    eq.mapping = THREE.EquirectangularReflectionMapping;
    eq.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(renderer);
    const pastelEnv = pm.fromEquirectangular(eq).texture;
    pm.dispose(); eq.dispose();
    const root = new THREE.Group();

    // Bloque de vidrio con el logotipo incrustado en capas (da volumen al trazo)
    const W = 3.2, H = W * (443 / 900), D = 0.62;
    const block = new THREE.Mesh(new RoundedBoxGeometry(W + 0.55, H + 0.55, D, 8, 0.24), glass({ envMap: pastelEnv, ior: 1.35, thickness: 0.4, dispersion: 2.5, iridescence: 0.6, envMapIntensity: 1, attenuationColor: new THREE.Color('#dfe8ff'), attenuationDistance: 2.5 }));
    root.add(block);
    // Logotipo grabado justo bajo la cara frontal: 4 capas muy juntas para que el trazo tenga grosor
    const ink = new THREE.MeshStandardMaterial({ map: logoTexture(), alphaTest: 0.5, roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide });
    const plane = new THREE.PlaneGeometry(W, H);
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(plane, ink);
      p.position.z = D / 2 - 0.1 + i * 0.012;
      root.add(p);
    }

    // Cápsulas de vidrio tintado (violeta y turquesa) como los botones de la referencia
    const capsule = new THREE.CapsuleGeometry(0.28, 1.1, 12, 32);
    const violet = new THREE.Mesh(capsule, glass({ attenuationColor: new THREE.Color('#6c5cff'), attenuationDistance: 0.5, thickness: 0.6 }));
    violet.rotation.z = Math.PI / 2; violet.position.set(-2.15, 1.35, -0.6);
    const teal = new THREE.Mesh(capsule, glass({ attenuationColor: new THREE.Color('#2fc4b2'), attenuationDistance: 0.5, thickness: 0.6 }));
    teal.rotation.z = Math.PI / 2; teal.position.set(2.2, -1.35, -0.4);
    const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.32, 48, 48), glass({ iridescence: 1, thickness: 0.4 }));
    pearl.position.set(2.05, 1.25, 0.3);
    scene.add(violet, teal, pearl);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 1.4), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    shadow.position.set(0.3, -1.75, -1.2); shadow.rotation.x = -1.2;
    scene.add(shadow, root);

    return {
      halfW: 2.9, halfH: 2.0, pad: 2.2,
      update(t, p) {
        root.rotation.y += ((-0.38 + Math.sin(t * 0.35) * 0.12 + p.x * 0.3) - root.rotation.y) * 0.05;
        root.rotation.x += ((0.18 + p.y * 0.14) - root.rotation.x) * 0.05;
        root.position.y = Math.sin(t * 0.8) * 0.06;
        violet.position.y = 1.35 + Math.sin(t * 0.9 + 1) * 0.1; violet.rotation.x = t * 0.3;
        teal.position.y = -1.35 + Math.sin(t * 0.7 + 2) * 0.1; teal.rotation.x = -t * 0.25;
        pearl.position.y = 1.25 + Math.sin(t * 1.1) * 0.12;
        shadow.material.opacity = 0.85 - Math.sin(t * 0.8) * 0.1;
      },
    };
  },
};

window.Scene3D = {
  mount(el, preset) {
    if (!PRESETS[preset]) return () => {};
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { el.classList.add('no3d'); return () => {}; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    pm.dispose();
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 4, 5);
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.6));

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const p = PRESETS[preset](scene, renderer);
    const t0 = performance.now();
    let raf = 0, alive = true;
    const draw = t => { p.update(t, pointer); renderer.render(scene, camera); };
    const fit = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, 0, Math.max(p.halfH / tan, p.halfW / (tan * camera.aspect)) + p.pad);
      camera.updateProjectionMatrix();
      draw((performance.now() - t0) / 1000);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    const loop = () => {
      if (!alive) return;
      if (!document.hidden) draw((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) loop();
    el.classList.add('is-ready');

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(m => { m.map?.dispose(); m.dispose(); });
      });
      scene.background?.dispose?.();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  },
};
dispatchEvent(new Event('scene-ready'));
