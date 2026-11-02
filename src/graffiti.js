// ==================================================
// 墙面涂鸦：用 Canvas 程序化“喷”出来，作为贴花贴在蓝墙上
// 喷漆主体 + 外圈雾化 + 颗粒飞溅 + 流淌 + 褪色/斑驳
// 贴花用 MeshStandardMaterial，和墙一样受光、接收纸团投影，所以像喷在墙上
// ==================================================

// 贴花覆盖的墙面区域（世界坐标，单位同场景）：中央偏右，避开顶部导航与底部纸团
export const GRAFFITI_RECT = { x0: -0.55, x1: 2.65, y0: 0.12, y1: 1.3 };
const PX_PER_UNIT = 560;
const S = PX_PER_UNIT / 640; // 版式坐标按 640px/单位 写，统一缩放

// 配色：薰衣草紫主字 + 深紫描边阴影 + 少量白色 + 一点洋红点缀
const C = {
  lilac: "#d6c2ff",
  lilacHi: "#f1eaff",
  violet: "#6b3cf0",
  white: "#ffffff",
  magenta: "#ff4fcf",
};

const TAG_FONT = '"Sedgwick Ave Display", "Permanent Marker", "Marker Felt", cursive';
const MARKER_FONT = '"Permanent Marker", "Sedgwick Ave Display", "Marker Felt", cursive';

// 可复现的随机数（每次刷新涂鸦形状一致）
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

// 把一行字逐字画进遮罩：每个字母随机倾斜、上下错位、大小变化 → 不规则手写
function drawHandLine(mctx, text, { x, y, size, rot, font, stroke, track = 0.92, jitter = 1 }, R) {
  mctx.save();
  mctx.translate(x, y);
  mctx.rotate(rot);
  let cx = 0;
  for (const ch of text) {
    if (ch === " ") { cx += size * 0.32; continue; }
    const s = size * (0.9 + R() * 0.22 * jitter);
    mctx.font = `${s}px ${font}`;
    const w = mctx.measureText(ch).width;
    mctx.save();
    mctx.translate(cx, (R() - 0.5) * size * 0.16 * jitter);
    mctx.rotate((R() - 0.5) * 0.22 * jitter);
    mctx.lineJoin = "round";
    mctx.lineWidth = stroke;
    mctx.strokeText(ch, 0, 0);
    mctx.fillText(ch, 0, 0);
    mctx.restore();
    cx += w * track;
  }
  mctx.restore();
  return cx;
}

// 用遮罩 + 颜色做一层“喷漆”
function tint(mask, color) {
  const c = makeCanvas(mask.width, mask.height);
  const x = c.getContext("2d");
  x.drawImage(mask, 0, 0);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}

function spray(ctx, mask, color, R, opt = {}) {
  const { haze = 0.32, hazeBlur = 16, edgeBlur = 1.4, dots = 1, drips = 1, dripMax = 120, dripColor = color } = opt;
  const W = mask.width, H = mask.height;
  const painted = tint(mask, color);

  // 1) 外圈雾化（喷罐离墙远一点的那层薄雾）
  ctx.save();
  ctx.globalAlpha = haze;
  ctx.filter = `blur(${hazeBlur}px)`;
  ctx.drawImage(painted, 0, 0);
  ctx.restore();

  // 2) 主体，边缘轻微发虚
  ctx.save();
  ctx.filter = `blur(${edgeBlur}px)`;
  ctx.drawImage(painted, 0, 0);
  ctx.restore();

  // 3) 边缘颗粒：在模糊后的遮罩“过渡带”里撒点
  const blur = makeCanvas(W, H);
  const bx = blur.getContext("2d");
  bx.filter = "blur(9px)";
  bx.drawImage(mask, 0, 0);
  const a = bx.getImageData(0, 0, W, H).data;
  const n = Math.round(W * H * 0.05 * dots);
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const px = (R() * W) | 0, py = (R() * H) | 0;
    const v = a[(py * W + px) * 4 + 3];
    if (v < 6 || v > 200) continue;
    if (R() > (v / 255) * 1.6) continue;
    const r = 0.5 + R() * 1.6;
    ctx.globalAlpha = 0.35 + R() * 0.6;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 4) 流淌：找字母底边，往下拉出变细的漆痕，末端一颗漆珠
  const ma = mask.getContext("2d").getImageData(0, 0, W, H).data;
  const alphaAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : ma[(y * W + x) * 4 + 3]);
  const tries = Math.round(W * 0.9 * drips);
  ctx.fillStyle = dripColor;
  ctx.strokeStyle = dripColor;
  ctx.lineCap = "round";
  let made = 0;
  const used = [];
  for (let i = 0; i < tries && made < 14 * drips; i++) {
    const x = (R() * W) | 0;
    // 从下往上找到这一列最低的实心像素
    let y = H - 1;
    while (y > 0 && alphaAt(x, y) < 160) y--;
    if (y <= 0 || alphaAt(x, y + 4) > 20) continue;
    if (R() > 0.3) continue;
    // 和已有流痕保持距离，避免像一排梳齿
    if (used.some((u) => Math.abs(u - x) < 46)) continue;
    used.push(x);
    made++;
    const len = 14 + Math.pow(R(), 2.2) * dripMax;
    const w0 = 6 + R() * 7;
    const steps = 16;
    let px = x, py = y - 2;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const nx = x + Math.sin(t * 3 + x) * 1.5;
      const ny = y - 2 + t * len;
      ctx.lineWidth = w0 * (1 - t * 0.5) * (s === 0 ? 1.5 : 1);
      ctx.globalAlpha = 0.95 - t * 0.25;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      px = nx; py = ny;
    }
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(px, py + 1, w0 * 0.62, w0 * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// 一圈喷出来的光环
function sprayRing(ctx, cx, cy, rx, ry, rot, color, R) {
  const W = ctx.canvas.width, H = ctx.canvas.height;
  const m = makeCanvas(W, H);
  const mx = m.getContext("2d");
  mx.scale(S, S);
  mx.strokeStyle = "#000";
  mx.lineCap = "round";
  for (let k = 0; k < 2; k++) {
    mx.lineWidth = 9 + k * 4;
    mx.beginPath();
    mx.ellipse(cx + k * 3, cy - k * 2, rx * (1 - k * 0.04), ry, rot, 0.15 + k * 0.6, Math.PI * 2 - 0.2 + k * 0.3);
    mx.stroke();
  }
  spray(ctx, m, color, R, { haze: 0.4, hazeBlur: 10, dots: 1.2, drips: 0.25, dripMax: 50 });
}

// 白色四角闪光
function sparkle(ctx, x, y, r, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.18;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

// 飞溅：几团大漆点 + 周围细点
function splatter(ctx, x, y, r, color, R) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 26; i++) {
    const a = R() * Math.PI * 2, d = r * (1.2 + R() * 3.5);
    ctx.globalAlpha = 0.5 + R() * 0.5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 0.8 + R() * r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// 褪色与斑驳：把漆面的透明度按噪声打薄，并刮掉一些细小斑点
function weather(ctx, R) {
  const { width: W, height: H } = ctx.canvas;
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  // 低分辨率噪声网格（每 8px 一格）做大块褪色，再加一点逐像素颗粒
  const G = 8, gw = Math.ceil(W / G) + 1, gh = Math.ceil(H / G) + 1;
  const grid = new Float32Array(gw * gh);
  const f = [R() * 0.03 + 0.02, R() * 0.08 + 0.05, R() * 0.2 + 0.15];
  const ph = [R() * 6, R() * 6, R() * 6, R() * 6, R() * 6, R() * 6];
  for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
    grid[gy * gw + gx] =
      Math.sin(gx * f[0] + ph[0]) * Math.cos(gy * f[0] * 1.3 + ph[1]) * 0.5 +
      Math.sin(gx * f[1] + ph[2] + gy * 0.02) * Math.cos(gy * f[1] + ph[3]) * 0.3 +
      Math.sin(gx * f[2] + ph[4]) * Math.sin(gy * f[2] + ph[5]) * 0.2;
  }
  for (let y = 0; y < H; y++) {
    const row = ((y / G) | 0) * gw;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4 + 3;
      if (!d[i]) continue;
      const n = grid[row + ((x / G) | 0)];
      d[i] = Math.max(0, Math.min(255, d[i] * (0.85 + n * 0.15 + (R() - 0.5) * 0.16)));
    }
  }
  ctx.putImageData(img, 0, 0);
  // 刮痕 / 掉漆小点
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 900; i++) {
    ctx.globalAlpha = 0.25 + R() * 0.6;
    ctx.beginPath();
    ctx.arc(R() * W, R() * H, 0.6 + Math.pow(R(), 3) * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function paintGraffiti() {
  const W = Math.round((GRAFFITI_RECT.x1 - GRAFFITI_RECT.x0) * PX_PER_UNIT);
  const H = Math.round((GRAFFITI_RECT.y1 - GRAFFITI_RECT.y0) * PX_PER_UNIT);
  const out = makeCanvas(W, H);
  const ctx = out.getContext("2d");
  const R = rng(20261101);

  const newMask = () => {
    const m = makeCanvas(W, H);
    const x = m.getContext("2d");
    x.scale(S, S);
    x.fillStyle = x.strokeStyle = "#000";
    x.textBaseline = "alphabetic";
    return [m, x];
  };

  // —— 第一行 CRUMPLE（最大、最张扬）——
  const L1 = { x: 330, y: 330, size: 300, rot: -0.1, font: TAG_FONT, stroke: 16, track: 0.88 };
  const L2 = { x: 610, y: 610, size: 250, rot: -0.05, font: TAG_FONT, stroke: 14, track: 0.86 };

  const [m1, x1] = newMask();
  drawHandLine(x1, "CRUMPLE", L1, rng(11));
  const [m2, x2] = newMask();
  drawHandLine(x2, "THE RULES", L2, rng(12));

  // 深紫“影子层”往右下错开，做出叠字的厚度
  for (const [m] of [[m1], [m2]]) {
    ctx.save();
    ctx.translate(14 * S, 12 * S);
    spray(ctx, m, C.violet, R, { haze: 0.18, hazeBlur: 12, dots: 0.4, drips: 0.35, dripMax: 70 });
    ctx.restore();
  }
  spray(ctx, m1, C.lilac, R, { haze: 0.35, dots: 1, drips: 1, dripMax: 150 });
  spray(ctx, m2, C.lilac, R, { haze: 0.35, dots: 1, drips: 1, dripMax: 130 });

  // 主字上的高光细线（喷枪补的亮色）
  {
    const [mh, xh] = newMask();
    xh.globalAlpha = 1;
    drawHandLine(xh, "CRUMPLE", { ...L1, x: L1.x - 4, y: L1.y - 8, stroke: 0, size: L1.size * 0.985 }, rng(11));
    xh.globalCompositeOperation = "destination-in";
    xh.fillStyle = "#000";
    // 只保留每个字母的上半部分
    xh.fillRect(0, 0, W, L1.y - L1.size * 0.42);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.filter = "blur(2px)";
    ctx.drawImage(tint(mh, C.lilacHi), 0, 0);
    ctx.restore();
  }

  // —— 白色 CREATE YOUR OWN：斜着压在两行之间 ——
  const [m3, x3] = newMask();
  drawHandLine(x3, "CREATE YOUR OWN", { x: 720, y: 462, size: 132, rot: -0.13, font: MARKER_FONT, stroke: 5, track: 0.95, jitter: 0.6 }, rng(13));
  ctx.save();
  ctx.translate(6 * S, 6 * S);
  ctx.globalAlpha = 0.55;
  ctx.drawImage(tint(m3, C.violet), 0, 0);
  ctx.restore();
  spray(ctx, m3, C.white, R, { haze: 0.25, hazeBlur: 10, edgeBlur: 1, dots: 0.8, drips: 0.5, dripMax: 70, dripColor: C.magenta });

  // —— 洋红光环 + 白色闪光 + 飞溅 ——
  sprayRing(ctx, 1790, 120, 170, 46, -0.12, C.magenta, R);
  ctx.save();
  ctx.scale(S, S);
  sparkle(ctx, 245, 150, 46, C.white);
  sparkle(ctx, 1960, 300, 30, C.white);
  sparkle(ctx, 1500, 720, 22, C.white);
  splatter(ctx, 200, 610, 14, C.lilac, R);
  splatter(ctx, 2000, 640, 16, C.lilac, R);
  splatter(ctx, 1720, 260, 9, C.magenta, R);
  splatter(ctx, 520, 90, 12, C.lilac, R);
  ctx.restore();

  // 一条洋红喷漆下划线箭头
  {
    const [mu, xu] = newMask();
    xu.lineCap = "round";
    xu.lineWidth = 12;
    xu.beginPath();
    xu.moveTo(640, 690);
    xu.bezierCurveTo(900, 720, 1250, 700, 1560, 650);
    xu.stroke();
    xu.beginPath();
    xu.moveTo(1500, 610); xu.lineTo(1565, 650); xu.lineTo(1505, 700);
    xu.stroke();
    spray(ctx, mu, C.magenta, R, { haze: 0.35, hazeBlur: 9, dots: 1, drips: 0.4, dripMax: 50 });
  }

  weather(ctx, R);
  return out;
}

// 给墙面一张很淡的灰泥/混凝土底纹（乘在墙色上）
export function paintWallGrain(size = 512) {
  const c = makeCanvas(size, size);
  const x = c.getContext("2d");
  const img = x.createImageData(size, size);
  const R = rng(7);
  for (let i = 0; i < size * size; i++) {
    const v = 243 + R() * 12;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  return c;
}
