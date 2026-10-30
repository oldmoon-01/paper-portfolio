// Paper Crumple Portfolio
// 基于 item-develop/paper-crumple-demo (MIT) 改写：每个纸团 = 一个作品集项目。
// 纸团揉皱动画来自原作的 Houdini Vellum VAT，已预先烘焙成 assets/paper.bin。
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const PROJECTS = window.PROJECTS || [];
const isCompactViewport = () => innerWidth <= 760;
const renderPixelRatio = () => Math.min(devicePixelRatio || 1, isCompactViewport() ? 1 : 1.5);

// ==================================================
// 场景
// ==================================================
const COLORS = { wall: "#3a5bff", floor: "#dcdad0" }; // 墙 / 地面
const app = document.getElementById("app");
const ui = {
  root: document.documentElement,
  loader: document.getElementById("loader"),
  count: document.getElementById("count"),
  seen: document.getElementById("seen"),
  card: document.getElementById("card"),
  cardNo: document.getElementById("card-no"),
  cardTitle: document.getElementById("card-title"),
  cardMeta: document.getElementById("card-meta"),
  cardLink: document.getElementById("card-link"),
  cardClose: document.getElementById("card-close"),
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.wall);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.01, 100);
// 横屏：斜前方平视；竖屏：抬高机位俯视，并收窄舞台，让纸团铺满手机画面
const STAGE = { minX: -2.4, maxX: 2.4, minZ: -1.1, maxZ: 1.7 };
function placeCamera() {
  const a = camera.aspect;
  if (a < 0.9) {
    camera.fov = 50;
    camera.position.set(0, 3.6, 3.4);
    camera.lookAt(0, -0.1, 0);
    STAGE.maxX = Math.min(2.4, Math.max(0.95, a * 1.9));
  } else {
    camera.fov = 40;
    const k = Math.max(1, 1.45 / a); // 接近方形时稍微后退
    camera.position.set(0, 0.35 + 1.85 * k, 3.6 * k);
    camera.lookAt(0, 0.35, 0);
    STAGE.maxX = 2.4;
  }
  STAGE.minX = -STAGE.maxX;
  camera.updateProjectionMatrix();
}
placeCamera();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(renderPixelRatio());
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const FLOOR_Y = -0.1;
const WALL_Z = -1.1;
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 12),
  new THREE.MeshStandardMaterial({ color: COLORS.floor }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, FLOOR_Y, 1);
floor.receiveShadow = true;
scene.add(floor);

const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 6),
  new THREE.MeshStandardMaterial({ color: COLORS.wall }),
);
wall.position.set(0, FLOOR_Y + 3, WALL_Z);
wall.receiveShadow = true;
scene.add(wall);

scene.add(new THREE.AmbientLight(0xffffff, 1.25));
const key = new THREE.DirectionalLight(0xffffff, 1.15);
key.position.set(-2, 2.6, 1.4);
key.castShadow = true;
key.shadow.mapSize.set(isCompactViewport() ? 512 : 1024, isCompactViewport() ? 512 : 1024);
Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -3, near: 0.1, far: 12 });
key.shadow.bias = -0.001;
scene.add(key);

// SSAO 让褶皱和凹陷更有层次
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// SSAO 的离屏缓冲在小屏上代价高，移动端保留光影与阴影但跳过这一层细节。
let ssao = null;
if (!isCompactViewport()) {
  ssao = new SSAOPass(scene, camera, innerWidth, innerHeight);
  ssao.kernelRadius = 0.01;
  ssao.minDistance = 0.0001;
  ssao.maxDistance = 0.08;
  composer.addPass(ssao);
}
composer.addPass(new OutputPass());

// ==================================================
// 动画数据（烘焙后的 VAT）
// ==================================================
async function loadAnimData() {
  let meta, buf;
  if (window.__PAPER_META && window.__PAPER_BIN) {
    meta = window.__PAPER_META;
    const bin = atob(window.__PAPER_BIN);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    buf = bytes.buffer;
  } else {
    const base = import.meta.url.replace(/[^/]*$/, "") + "../assets/";
    [meta, buf] = await Promise.all([
      fetch(base + "paper.json").then((r) => r.json()),
      fetch(base + "paper.bin").then((r) => r.arrayBuffer()),
    ]);
  }
  const P = meta.pointCount, F = meta.frameCount, I = meta.indexCount;
  let off = 0;
  const uvs = new Float32Array(buf, off, P * 2); off += P * 8;
  const indices = new Uint16Array(buf, off, I); off += I * 2;
  const q = new Int16Array(buf, off, P * 3 * F);

  const positions = new Float32Array(q.length);
  for (let i = 0; i < q.length; i++) {
    const k = i % 3;
    positions[i] = meta.min[k] + ((q[i] + 32768) / 65535) * (meta.max[k] - meta.min[k]);
  }

  // 每帧的平滑法线（共享顶点 → computeVertexNormals 即可）
  const normals = new Float32Array(positions.length);
  const tmp = new THREE.BufferGeometry();
  tmp.setIndex(new THREE.BufferAttribute(indices, 1));
  for (let f = 0; f < F; f++) {
    tmp.setAttribute("position", new THREE.BufferAttribute(positions.subarray(f * P * 3, (f + 1) * P * 3), 3));
    tmp.deleteAttribute("normal");
    tmp.computeVertexNormals();
    normals.set(tmp.getAttribute("normal").array, f * P * 3);
  }
  tmp.dispose();

  return { vertexCount: P, frameCount: F, uvs, indices, positions, normals, flat: meta.flat, crumple: meta.crumple };
}

// ==================================================
// 纸面设计：方格纸 + 手写字 + 项目封面
// ==================================================
const PAPER_TEXTURE = {
  thumbnail: { width: 512, height: 700 },
  detail: { width: 1024, height: 1400 },
};
const DESIGN_W = 1024, DESIGN_H = 1400;
const SANS = '"Space Grotesk", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const MONO = '"IBM Plex Mono", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", monospace';
const INK = "#1b1d22";
const ACCENT = "#2c46c4";
const IMG = { x: 113, y: 430, w: 798, h: 449 };
const paperStates = [];

const pad2 = (n) => String(n).padStart(2, "0");

function drawPaper(state) {
  const { ctx, project, index, canvas } = state;
  ctx.setTransform(canvas.width / DESIGN_W, 0, 0, canvas.height / DESIGN_H, 0, 0);
  ctx.fillStyle = "#eae8e1";
  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);
  ctx.strokeStyle = "rgba(44,70,196,0.13)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 32; x <= DESIGN_W; x += 64) { ctx.moveTo(x, 0); ctx.lineTo(x, DESIGN_H); }
  for (let y = 32; y <= DESIGN_H; y += 64) { ctx.moveTo(0, y); ctx.lineTo(DESIGN_W, y); }
  ctx.stroke();

  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";
  // 编号与年份
  ctx.font = `700 42px ${MONO}`;
  ctx.fillStyle = ACCENT;
  ctx.fillText(`No.${pad2(index + 1)}`, IMG.x, 132);
  ctx.fillStyle = INK;
  ctx.font = `500 42px ${MONO}`;
  ctx.textAlign = "right";
  ctx.fillText(String(project.year || ""), IMG.x + IMG.w, 132);
  ctx.textAlign = "left";

  // 标题（中文）+ 英文副标题
  fitText(ctx, project.title, SANS, 112, 60, IMG.w, IMG.x, 280, 900);
  ctx.globalAlpha = 0.7;
  fitText(ctx, project.en || "", SANS, 44, 28, IMG.w, IMG.x, 360, 500);
  ctx.globalAlpha = 1;

  // 封面
  const image = state.quality === "detail" ? state.fullImage || state.thumbnailImage : state.thumbnailImage;
  if (image && image.complete && image.naturalWidth) {
    const im = image;
    const s = Math.max(IMG.w / im.naturalWidth, IMG.h / im.naturalHeight);
    ctx.save();
    ctx.beginPath(); ctx.rect(IMG.x, IMG.y, IMG.w, IMG.h); ctx.clip();
    ctx.drawImage(im, IMG.x + (IMG.w - im.naturalWidth * s) / 2, IMG.y + (IMG.h - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s);
    ctx.restore();
  } else {
    drawPlaceholderCover(ctx, project, index);
  }
  ctx.strokeStyle = "#3a3a38";
  ctx.lineWidth = 3;
  ctx.strokeRect(IMG.x, IMG.y, IMG.w, IMG.h);

  // 分类 + 简介
  ctx.fillStyle = INK;
  ctx.font = `700 50px ${SANS}`;
  ctx.fillText(`# ${project.category || ""}`, IMG.x, IMG.y + IMG.h + 100);
  ctx.font = `400 42px ${SANS}`;
  wrapText(ctx, project.summary || "", IMG.x, IMG.y + IMG.h + 175, IMG.w, 64, 3);

  // 角落提示
  ctx.font = `500 40px ${SANS}`;
  ctx.textAlign = "right";
  ctx.fillText(project.link ? "查看详情 →" : "即将上线", IMG.x + IMG.w, DESIGN_H - 70);
  ctx.textAlign = "left";

  state.texture.needsUpdate = true;
}

// 没有封面图时，用项目主色画一个可辨认的占位封面
function drawPlaceholderCover(ctx, project, index) {
  const { x, y, w, h } = IMG;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = project.color || "#555";
  ctx.fillRect(x, y, w, h);
  // 每个项目一种不同的几何图形
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 6;
  const cx = x + w * 0.72, cy = y + h * 0.5;
  const kind = index % 4;
  if (kind === 0) {
    for (let r = 60; r < 420; r += 60) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  } else if (kind === 1) {
    for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(x + i * 70, y + h); ctx.lineTo(x + i * 70 + h, y); ctx.stroke(); }
  } else if (kind === 2) {
    for (let gx = 0; gx < 6; gx++) for (let gy = 0; gy < 4; gy++) {
      ctx.beginPath(); ctx.arc(x + w * 0.42 + gx * 80, y + 70 + gy * 100, 22, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    ctx.beginPath(); ctx.moveTo(cx - 200, y + h); ctx.lineTo(cx, y + 40); ctx.lineTo(cx + 200, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `700 52px ${SANS}`;
  ctx.fillText("项目缩略图占位", x + 40, y + h - 96);
  ctx.font = `400 36px ${SANS}`;
  ctx.fillText("640 × 336 preview", x + 40, y + h - 40);
}

function fitText(ctx, text, family, max, min, width, x, y, weight = 400) {
  let size = max;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > width && size > min) {
    size -= 4;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  ctx.fillText(text, x, y);
}

function wrapText(ctx, text, x, y, maxW, lineH, maxLines) {
  let line = "", lines = 0;
  for (const ch of Array.from(text)) {
    if (ctx.measureText(line + ch).width > maxW && line) {
      ctx.fillText(line, x, y + lines * lineH);
      line = ch;
      if (++lines >= maxLines) return;
    } else line += ch;
  }
  if (line) ctx.fillText(line, x, y + lines * lineH);
}

function textureSize(quality) {
  return PAPER_TEXTURE[quality] || PAPER_TEXTURE.thumbnail;
}

function drawAtQuality(state, quality) {
  const { width, height } = textureSize(quality);
  if (state.quality === quality && state.canvas.width === width && state.canvas.height === height) return;
  state.quality = quality;
  state.canvas.width = width;
  state.canvas.height = height;
  state.ctx = state.canvas.getContext("2d");
  drawPaper(state);
}

function loadProjectImage(state, variant) {
  const src = variant === "full" ? state.project.image : state.project.thumbnail;
  const imageKey = variant === "full" ? "fullImage" : "thumbnailImage";
  const requestedKey = variant === "full" ? "fullRequested" : "thumbnailRequested";
  if (!src || state[requestedKey]) return;
  state[requestedKey] = true;
  const image = new Image();
  image.decoding = "async";
  image.onload = () => drawPaper(state);
  image.onerror = () => { state[imageKey] = null; drawPaper(state); };
  state[imageKey] = image;
  image.src = src;
}

function releaseFullImage(state) {
  if (!state.fullImage) return;
  state.fullImage.onload = null;
  state.fullImage.onerror = null;
  state.fullImage.src = "";
  state.fullImage = null;
  state.fullRequested = false;
}

function upgradePaperTexture(index) {
  const state = paperStates[index];
  if (!state) return;
  drawAtQuality(state, "detail");
  loadProjectImage(state, "full");
}

function downgradePaperTexture(index) {
  const state = paperStates[index];
  if (!state) return;
  drawAtQuality(state, "thumbnail");
  releaseFullImage(state);
}

function getPaperMaterial(index) {
  if (paperStates[index]) return paperStates[index].material;
  const project = PROJECTS[index];
  const canvas = document.createElement("canvas");
  const { width, height } = textureSize("thumbnail");
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 1;
  texture.rotation = Math.PI;
  texture.center.set(0.5, 0.5);
  texture.repeat.set(1, -1);
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0, side: THREE.DoubleSide });
  const state = {
    project, index, canvas, ctx: canvas.getContext("2d"), texture, material,
    quality: "thumbnail", thumbnailImage: null, fullImage: null,
    thumbnailRequested: false, fullRequested: false,
  };
  drawPaper(state);
  paperStates[index] = state;
  loadProjectImage(state, "thumbnail");
  return material;
}

// 手写字体加载完成后重绘
if (document.fonts) {
  Promise.all([
    ...["400", "500", "700", "900"].flatMap((w) => [
      document.fonts.load(`${w} 100px "Noto Sans SC"`, PROJECTS.map((p) => p.title + p.category + p.summary + p.en).join("") + "封面图占位查看详情即将上线No.0123456789"),
      document.fonts.load(`${w} 100px "Space Grotesk"`, "PROJECT ONE 2023 2024 2025 2026 No.0123456789"),
      document.fonts.load(`${w} 100px "IBM Plex Mono"`, "No.0123456789"),
    ]),
  ]).then(() => paperStates.forEach((s) => s && drawPaper(s))).catch(() => {});
}

function createPaperMesh(anim, index) {
  const { vertexCount, uvs, indices, positions, normals } = anim;
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(new Float32Array(positions.subarray(0, vertexCount * 3)), 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  const nrmAttr = new THREE.BufferAttribute(new Float32Array(normals.subarray(0, vertexCount * 3)), 3);
  nrmAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("position", posAttr);
  geo.setAttribute("normal", nrmAttr);
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  return { mesh: new THREE.Mesh(geo, getPaperMaterial(index)), positionAttr: posAttr, normalAttr: nrmAttr };
}

// 帧号可以是小数：相邻两帧线性插值
function setFrame(paper, frameIdx) {
  const { vertexCount, frameCount, positions, normals } = anim;
  const len = vertexCount * 3;
  const f0 = Math.floor(frameIdx), t = frameIdx - f0;
  const o0 = f0 * len, o1 = Math.min(f0 + 1, frameCount - 1) * len, s = 1 - t;
  const pa = paper.positionAttr.array, na = paper.normalAttr.array;
  for (let i = 0; i < len; i++) {
    pa[i] = positions[o0 + i] * s + positions[o1 + i] * t;
    na[i] = normals[o0 + i] * s + normals[o1 + i] * t;
  }
  paper.positionAttr.needsUpdate = true;
  paper.normalAttr.needsUpdate = true;
  paper.mesh.geometry.computeBoundingSphere();
}

// ==================================================
// 物理（纸团 = 球形刚体）
// ==================================================
const OPEN_FRAME = 4;          // 展开时停在第几帧：0 = 完全摊平，稍大一点保留褶皱感
const OPEN_SCREEN_RATIO = 0.78; // 展开的纸占屏幕高度
const OPEN_DISTANCE = 1.5;
const CLOSED_SCALE = 0.82;
const OPEN_DURATION = 1.15 / 1.5;
const DISCARD_DURATION = 1.25 / 1.5;
const ROLL_LIN = 2.6, ROLL_ANG = 4.5, SETTLE = 0.018;
const MASS = 0.16;
const GRAB_LIFT = 0.5, GRAB_STIFF = 14, GRAB_MAX = 4.5, THROW_MAX = 3.2, CLICK_PX = 6;

let anim = null;
let radius = 0.25, restCenterY = FLOOR_Y + 0.25, restMeshY = 0.02;
const crumpleCenter = new THREE.Vector3();
const flatSize = { width: 1, depth: 1.414 };
const papers = [];
let active = null;
const seen = new Set();

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -7, 0) });
world.allowSleep = false;
const paperMat = new CANNON.Material("paper");
const floorMat = new CANNON.Material("floor");
world.addContactMaterial(new CANNON.ContactMaterial(paperMat, floorMat, { friction: 1, restitution: 0.12 }));
world.addContactMaterial(new CANNON.ContactMaterial(paperMat, paperMat, { friction: 0.6, restitution: 0.3 }));
const floorBody = new CANNON.Body({ mass: 0, material: floorMat, shape: new CANNON.Plane() });
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

const _off = new THREE.Vector3();
const crumpleOffset = (scale, q) => _off.copy(crumpleCenter).multiplyScalar(scale).applyQuaternion(q);

function syncBodyToMesh(p) {
  const o = crumpleOffset(p.mesh.scale.x, p.mesh.quaternion);
  p.body.position.set(p.mesh.position.x + o.x, p.mesh.position.y + o.y, p.mesh.position.z + o.z);
  p.body.quaternion.set(p.mesh.quaternion.x, p.mesh.quaternion.y, p.mesh.quaternion.z, p.mesh.quaternion.w);
}

function syncMeshToBody(p, scale = CLOSED_SCALE) {
  const b = p.body;
  p.mesh.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
  const o = crumpleOffset(scale, p.mesh.quaternion);
  p.mesh.position.set(b.position.x - o.x, b.position.y - o.y, b.position.z - o.z);
  p.mesh.scale.setScalar(scale);
}

function setDynamic(p, on) {
  const b = p.body;
  b.type = on ? CANNON.Body.DYNAMIC : CANNON.Body.KINEMATIC;
  b.mass = on ? MASS : 0;
  b.collisionFilterGroup = b.collisionFilterMask = on ? 1 : 0;
  if (!on) { b.velocity.setZero(); b.angularVelocity.setZero(); }
  b.updateMassProperties();
  b.wakeUp();
}

const onGround = (b) => b.position.y <= restCenterY + 0.05;
function rollingResistance(b, dt) {
  const l = Math.exp(-ROLL_LIN * dt), a = Math.exp(-ROLL_ANG * dt);
  b.velocity.x *= l; b.velocity.z *= l;
  b.angularVelocity.scale(a, b.angularVelocity);
}

function keepInStage(dt) {
  const minX = STAGE.minX + radius, maxX = STAGE.maxX - radius;
  const minZ = STAGE.minZ + radius, maxZ = STAGE.maxZ - radius;
  for (const p of papers) {
    const b = p.body;
    if (b.type !== CANNON.Body.DYNAMIC) continue;
    if (b.position.x < minX) { if (b.velocity.x < 0) b.velocity.x *= -0.42; b.velocity.x += 3 * dt; }
    else if (b.position.x > maxX) { if (b.velocity.x > 0) b.velocity.x *= -0.42; b.velocity.x -= 3 * dt; }
    if (b.position.z < minZ) { if (b.velocity.z < 0) b.velocity.z *= -0.42; b.velocity.z += 3 * dt; }
    else if (b.position.z > maxZ) { if (b.velocity.z > 0) b.velocity.z *= -0.42; b.velocity.z -= 3 * dt; }
  }
}

// 某些 WebGL / Cannon 组合下，静态 Plane 的碰撞面会在初始化后丢失更新，
// 导致纸团穿过可见地面。这里把动态球心限制在纸团的静止高度，保留横向碰撞与拖拽手感。
function keepOnFloor() {
  for (const p of papers) {
    const b = p.body;
    if (b.type !== CANNON.Body.DYNAMIC || b.position.y >= restCenterY) continue;
    b.position.y = restCenterY;
    if (b.velocity.y < 0) b.velocity.y = 0;
    b.aabbNeedsUpdate = true;
  }
}

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => t * t * t;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const snapshot = (p) => ({ position: p.mesh.position.clone(), quaternion: p.mesh.quaternion.clone(), scale: p.mesh.scale.x, frameIdx: p.frameIdx });

// 展开后的位置：相机正前方、正对镜头，略微上移给底部信息条留位置
const _dir = new THREE.Vector3();
function openPose() {
  camera.getWorldDirection(_dir);
  const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * OPEN_DISTANCE;
  const viewW = viewH * camera.aspect;
  const narrow = camera.aspect < 0.9;
  const ratio = narrow ? 0.68 : OPEN_SCREEN_RATIO;
  const position = camera.position.clone().addScaledVector(_dir, OPEN_DISTANCE).addScaledVector(up, viewH * (narrow ? 0.1 : 0.05));
  const y = _dir.clone().negate();
  const x = new THREE.Vector3().crossVectors(y, up);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, up));
  const scale = Math.min((viewH * ratio) / flatSize.depth, (viewW * 0.9) / flatSize.width);
  return { position, quaternion, scale };
}

function refreshOpenPose() {
  if (!active) return;
  const pose = openPose();
  if (active.state === "opening") Object.assign(active.target, pose, { frameIdx: OPEN_FRAME });
  else if (active.state === "open") {
    active.mesh.position.copy(pose.position);
    active.mesh.quaternion.copy(pose.quaternion);
    active.mesh.scale.setScalar(pose.scale);
  }
}

// ==================================================
// 生成纸团
// ==================================================
function spawnPaper(index, i) {
  const base = createPaperMesh(anim, index);
  base.mesh.castShadow = true;
  base.mesh.rotation.set(0, Math.PI + rand(-0.25, 0.25), rand(-0.18, 0.18));
  // 前三个落在固定位置，其余随机散在舞台中间
  const w = STAGE.maxX - radius * 1.5;
  const fixed = [[-0.52, -0.1], [0, 0.12], [0.52, -0.06]][i];
  const [x, z] = fixed ? [fixed[0] * w, fixed[1]] : [rand(-w, w) * 0.8, rand(-0.75, 1.0)];
  base.mesh.position.set(x, restMeshY, z);
  base.mesh.scale.setScalar(CLOSED_SCALE);
  scene.add(base.mesh);

  const o = crumpleOffset(CLOSED_SCALE, base.mesh.quaternion);
  const body = new CANNON.Body({
    mass: MASS, material: paperMat, shape: new CANNON.Sphere(radius),
    linearDamping: 0.15, angularDamping: 0.35,
    position: new CANNON.Vec3(x + o.x, restMeshY + o.y + rand(2.2, 4.4), z + o.z),
  });
  body.quaternion.set(base.mesh.quaternion.x, base.mesh.quaternion.y, base.mesh.quaternion.z, base.mesh.quaternion.w);
  body.angularVelocity.set(rand(-1.5, 1.5), rand(-0.5, 0.5), rand(-1.5, 1.5));
  world.addBody(body);

  const paper = { ...base, index, body, frameIdx: anim.frameCount - 1, state: "rolling", time: 0, settle: 0, start: null, target: null };
  setFrame(paper, paper.frameIdx);
  syncMeshToBody(paper);
  papers.push(paper);
}

async function init() {
  anim = await loadAnimData();
  flatSize.width = anim.flat.width;
  flatSize.depth = anim.flat.depth;
  crumpleCenter.fromArray(anim.crumple.center);
  radius = anim.crumple.radius * CLOSED_SCALE;
  restCenterY = FLOOR_Y + radius * 1.08;
  restMeshY = restCenterY - crumpleCenter.y * CLOSED_SCALE;
  floorBody.position.y = restCenterY - radius;

  ui.loader.hidden = true;
  ui.count.textContent = pad2(PROJECTS.length);
  updateSeen();
  // 纸团依次从上方落下
  PROJECTS.forEach((_, i) => setTimeout(() => spawnPaper(i, i), 250 + i * 110 + rand(0, 90)));
}

// ==================================================
// 交互：点击展开 / 拖拽抓起 / 甩出去
// ==================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const grabPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hitPoint = new THREE.Vector3();
let ptr = null;
const canvas = renderer.domElement;
canvas.style.touchAction = "none";

function pick(e) {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(papers.map((p) => p.mesh));
  return hit.length ? papers.find((p) => p.mesh === hit[0].object) : null;
}
const grabbable = (p) => p.state === "closed" || p.state === "rolling";

canvas.addEventListener("pointerdown", (e) => {
  if (!anim || ptr) return;
  const p = pick(e);
  ptr = { paper: p, id: e.pointerId, x: e.clientX, y: e.clientY, grabbing: false };
  try { canvas.setPointerCapture(e.pointerId); } catch {}
  if (p && p.state === "rolling") beginGrab(p, e);
});

canvas.addEventListener("pointermove", (e) => {
  if (!ptr) {
    if (!anim) return;
    const p = pick(e);
    canvas.style.cursor = p ? (grabbable(p) ? "grab" : "pointer") : "";
    return;
  }
  if (e.pointerId !== ptr.id) return;
  if (!ptr.grabbing && ptr.paper && grabbable(ptr.paper) && Math.hypot(e.clientX - ptr.x, e.clientY - ptr.y) > CLICK_PX) {
    beginGrab(ptr.paper, e);
  }
  if (ptr.grabbing) aimGrab(ptr.paper, e);
});

canvas.addEventListener("pointerup", (e) => {
  if (!ptr || e.pointerId !== ptr.id) return;
  if (ptr.grabbing) releaseGrab(ptr.paper, true);
  else handleClick(e);
  ptr = null;
});
canvas.addEventListener("pointercancel", (e) => {
  if (!ptr || e.pointerId !== ptr.id) return;
  if (ptr.grabbing) releaseGrab(ptr.paper, false);
  ptr = null;
});

function handleClick(e) {
  const p = pick(e);
  const prev = active;
  // 点空白处或点已展开的纸：把它揉回去
  if (!p || p === prev) { if (prev) closeActive(); return; }
  if (p.state !== "closed") return;
  if (prev) closeActive();
  openPaper(p);
}

function beginGrab(p, e) {
  ptr.grabbing = true;
  p.state = "grabbed";
  const b = p.body;
  b.type = CANNON.Body.KINEMATIC;
  b.mass = 0;
  b.updateMassProperties();
  b.velocity.setZero();
  b.angularVelocity.setZero();
  b.collisionFilterGroup = b.collisionFilterMask = 1;
  p.grab = new THREE.Vector3(b.position.x, restCenterY + GRAB_LIFT, b.position.z);
  aimGrab(p, e);
  canvas.style.cursor = "grabbing";
}

function aimGrab(p, e) {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  grabPlane.constant = -(restCenterY + GRAB_LIFT);
  if (!raycaster.ray.intersectPlane(grabPlane, hitPoint)) return;
  p.grab.set(
    THREE.MathUtils.clamp(hitPoint.x, STAGE.minX + radius, STAGE.maxX - radius),
    restCenterY + GRAB_LIFT,
    THREE.MathUtils.clamp(hitPoint.z, STAGE.minZ + radius, STAGE.maxZ - radius),
  );
}

function releaseGrab(p, toss) {
  const b = p.body;
  let vx = toss ? b.velocity.x : 0, vz = toss ? b.velocity.z : 0;
  const sp = Math.hypot(vx, vz);
  if (sp > THROW_MAX) { vx *= THROW_MAX / sp; vz *= THROW_MAX / sp; }
  b.type = CANNON.Body.DYNAMIC;
  b.mass = MASS;
  b.updateMassProperties();
  b.velocity.set(vx, 0, vz);
  b.angularVelocity.set((vz / radius) * 0.6, 0, (-vx / radius) * 0.6);
  b.wakeUp();
  p.state = "rolling";
  p.settle = 0;
  canvas.style.cursor = "grab";
}

function openPaper(p) {
  // 仅在用户打开这个项目时，为这一张纸生成高清纹理并请求原图。
  upgradePaperTexture(p.index);
  setDynamic(p, false);
  syncMeshToBody(p);
  p.state = "opening";
  p.time = 0;
  p.start = snapshot(p);
  p.target = { ...openPose(), frameIdx: OPEN_FRAME };
  active = p;
  seen.add(p.index);
  updateSeen();
  showCard(p.index);
}

function closeActive() {
  if (!active) return;
  discard(active);
  active = null;
  hideCard();
}

function discard(p) {
  if (p.state === "discarding" || p.state === "rolling") return;
  const dir = new THREE.Vector3(rand(-1, 1), 0, rand(-1.3, -0.45)).normalize();
  p.state = "discarding";
  p.time = 0;
  p.start = snapshot(p);
  setDynamic(p, true);
  syncBodyToMesh(p);
  p.body.velocity.set(dir.x * rand(1.4, 2), rand(0.5, 0.9), dir.z * rand(1.4, 2));
  p.body.angularVelocity.set(rand(-2.4, 2.4), rand(-0.8, 0.8), rand(-2.4, 2.4));
  p.settle = 0;
}

// ==================================================
// HTML 信息条
// ==================================================
function showCard(i) {
  const pr = PROJECTS[i];
  ui.cardNo.textContent = `No.${pad2(i + 1)}`;
  ui.cardTitle.textContent = pr.title;
  ui.cardMeta.textContent = `${pr.category} · ${pr.year}`;
  if (pr.link) {
    ui.cardLink.href = pr.link;
    ui.cardLink.textContent = "查看项目 →";
    ui.cardLink.removeAttribute("aria-disabled");
  } else {
    ui.cardLink.removeAttribute("href");
    ui.cardLink.textContent = "即将上线";
    ui.cardLink.setAttribute("aria-disabled", "true");
  }
  ui.root.classList.add("is-open");
  ui.card.hidden = false;
}
function hideCard() {
  ui.root.classList.remove("is-open");
  ui.card.hidden = true;
}
function updateSeen() {
  ui.seen.textContent = pad2(seen.size);
}
ui.cardClose.addEventListener("click", closeActive);
// 打开“关于 / 联系”面板时，把展开的纸揉回去
addEventListener("portfolio:route", (e) => { if (e.detail !== "work") closeActive(); });
addEventListener("keydown", (e) => { if (e.key === "Escape") closeActive(); });

// ==================================================
// 主循环
// ==================================================
let last = performance.now() / 1000;
renderer.setAnimationLoop(() => {
  const now = performance.now() / 1000;
  const dt = Math.min(now - last, 0.05);
  last = now;
  if (anim) {
    world.step(1 / 60, dt, 3);
    keepOnFloor();
    keepInStage(dt);
    for (const p of papers) update(p, dt);
  }
  composer.render();
});

function update(p, dt) {
  const maxF = anim.frameCount - 1;
  if (p.state === "opening") {
    p.time += dt;
    const t = clamp01(p.time / OPEN_DURATION), e = easeOut(t);
    p.mesh.position.lerpVectors(p.start.position, p.target.position, e);
    p.mesh.quaternion.slerpQuaternions(p.start.quaternion, p.target.quaternion, e);
    p.mesh.scale.setScalar(lerp(p.start.scale, p.target.scale, e));
    p.frameIdx = lerp(p.start.frameIdx, p.target.frameIdx, easeIn(t));
    setFrame(p, p.frameIdx);
    if (t >= 1) { p.state = "open"; syncBodyToMesh(p); }
  } else if (p.state === "discarding") {
    p.time += dt;
    const t = clamp01(p.time / DISCARD_DURATION), e = easeOut(t);
    p.frameIdx = lerp(p.start.frameIdx, maxF, e);
    syncMeshToBody(p, lerp(p.start.scale, CLOSED_SCALE, e));
    setFrame(p, p.frameIdx);
    if (t >= 1) {
      p.state = "rolling";
      p.frameIdx = maxF;
      setFrame(p, maxF);
      // 项目被揉回纸团后释放大图，恢复低分辨率常态纹理。
      downgradePaperTexture(p.index);
    }
  } else if (p.state === "grabbed") {
    const b = p.body, g = p.grab;
    let vx = (g.x - b.position.x) * GRAB_STIFF, vy = (g.y - b.position.y) * GRAB_STIFF, vz = (g.z - b.position.z) * GRAB_STIFF;
    const sp = Math.hypot(vx, vy, vz);
    if (sp > GRAB_MAX) { const k = GRAB_MAX / sp; vx *= k; vy *= k; vz *= k; }
    b.velocity.set(vx, vy, vz);
    syncMeshToBody(p);
  } else if (p.state === "rolling") {
    const g = onGround(p.body);
    if (g) rollingResistance(p.body, dt);
    syncMeshToBody(p);
    const sp = p.body.velocity.lengthSquared() + p.body.angularVelocity.lengthSquared() * 0.02;
    p.settle = g && sp < SETTLE ? p.settle + dt : 0;
    if (p.settle > 0.35) p.state = "closed";
  } else if (p.state === "closed") {
    if (onGround(p.body)) rollingResistance(p.body, dt);
    syncMeshToBody(p);
  }
}

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  placeCamera();
  renderer.setPixelRatio(renderPixelRatio());
  composer.setPixelRatio(renderPixelRatio());
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  refreshOpenPose();
});

init().catch((err) => {
  console.error(err);
  ui.loader.textContent = "加载失败：" + err.message;
});
