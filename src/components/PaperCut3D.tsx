import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * PaperCut3D —— 3D 立体剪纸（纸灯笼）+ 粒子特效
 *
 * 纯前端 WebGL 场景，无需任何 3D 模型文件：
 *  - 灯笼主体：LatheGeometry 旋转体 + Canvas 手绘「红纸 + 金骨 + 镂空」贴图
 *  - 镂空透光：CanvasTexture 用 destination-out 挖出镂空，内部放置「灯火」发光体
 *  - 粒子特效一：金色星火（THREE.Points，加色混合，上升 + 环绕）
 *  - 粒子特效二：剪纸纸屑（InstancedMesh 小纸片，飘落 + 自转）
 *  - 交互：OrbitControls（拖拽旋转 / 滚轮缩放，可关闭）
 */
export type PaperCut3DProps = {
  className?: string;
  /** 是否自动旋转 */
  autoRotate?: boolean;
  /** 是否允许鼠标/触屏拖拽与缩放（首页装饰建议关闭，避免拦截滚动） */
  interactive?: boolean;
  /** 是否显示粒子特效 */
  showParticles?: boolean;
  /** 粒子密度系数（1 = 默认） */
  density?: number;
};

type World = {
  controls: OrbitControls;
  sparks: THREE.Points;
  confetti: THREE.InstancedMesh;
  setParticles: (v: boolean) => void;
};

// ---- 手绘灯笼贴图：红纸 + 金骨 + 镂空 -------------------------------------
function makeLanternTexture(): THREE.CanvasTexture {
  const W = 512; // 横向：环绕灯笼一圈（u）
  const H = 1024; // 纵向：灯笼上下（v）
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1) 红纸底色：竖向渐变，营造纸张受光感
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#8a2a1e");
  grad.addColorStop(0.16, "#c03a2b");
  grad.addColorStop(0.5, "#cf4b34");
  grad.addColorStop(0.84, "#b3321f");
  grad.addColorStop(1, "#8a2a1e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 2) 纸张纤维噪点
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#1c0a06";
  for (let i = 0; i < 420; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 3);
  }
  ctx.globalAlpha = 1;

  // 3) 金骨（竖向竹骨，纹理纵向 = 灯笼的经线骨）
  const ribCount = 8;
  const ribStep = W / ribCount;
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#e4c574";
  for (let i = 0; i < ribCount; i++) {
    const x = i * ribStep;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(70,20,12,0.55)";
  for (let i = 0; i < ribCount; i++) {
    const x = i * ribStep;
    ctx.beginPath();
    ctx.moveTo(x - 4.5, 0);
    ctx.lineTo(x - 4.5, H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 4.5, 0);
    ctx.lineTo(x + 4.5, H);
    ctx.stroke();
  }

  // 4) 纬线（横向圈）
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(228,197,116,0.85)";
  for (const t of [0.12, 0.5, 0.88]) {
    ctx.beginPath();
    ctx.moveTo(0, H * t);
    ctx.lineTo(W, H * t);
    ctx.stroke();
  }

  // 5) 挖镂空（destination-out 把红纸擦成透明 → 形成窗格）
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#000";
  const punchHole = (cx: number, cy: number, r: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  // 中部鼓腹：两排大圆孔（仿灯笼腹部的「铜钱/花瓣」镂空）
  for (const yf of [0.38, 0.62]) {
    for (let c = 0; c < ribCount; c++) {
      punchHole(c * ribStep + ribStep / 2, H * yf, 22);
    }
  }
  // 上下收口：小圆孔
  for (const yf of [0.2, 0.28, 0.72, 0.8]) {
    for (let c = 0; c < ribCount; c++) {
      punchHole(c * ribStep + ribStep / 2, H * yf, 12);
    }
  }
  // 极细星点孔
  for (let i = 0; i < 90; i++) {
    punchHole(Math.random() * W, Math.random() * H, 2 + Math.random() * 4);
  }
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 8;
  return tex;
}

// ---- 柔和圆形光斑贴图（粒子用） -------------------------------------------
function makeGlowSprite(): THREE.CanvasTexture {
  const s = 64;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.85)");
  g.addColorStop(0.6, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---- 组装灯笼 --------------------------------------------------------------
function buildLantern(
  scene: THREE.Scene,
  disposables: { dispose: () => void }[],
): THREE.Group {
  const group = new THREE.Group();

  const tex = makeLanternTexture();
  disposables.push(tex);

  const profile = [
    new THREE.Vector2(0.1, 1.05),
    new THREE.Vector2(0.16, 0.98),
    new THREE.Vector2(0.46, 0.8),
    new THREE.Vector2(0.8, 0.48),
    new THREE.Vector2(1.0, 0.0),
    new THREE.Vector2(0.8, -0.48),
    new THREE.Vector2(0.46, -0.8),
    new THREE.Vector2(0.16, -0.98),
    new THREE.Vector2(0.1, -1.05),
  ];
  const bodyGeo = new THREE.LatheGeometry(profile, 48);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: tex,
    side: THREE.DoubleSide,
    alphaTest: 0.45,
    transparent: true,
    roughness: 0.72,
    metalness: 0.05,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  disposables.push(bodyGeo, bodyMat);
  group.add(body);

  // 内部「灯火」发光体：透过镂空呈现暖光（拉长球体 ≈ 烛火）
  const flameCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xffe3b0 }),
  );
  flameCore.scale.set(1, 2.4, 1);
  flameCore.position.y = 0.02;
  group.add(flameCore);

  const flameHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 24, 16),
    new THREE.MeshBasicMaterial({
      color: 0xffa94d,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  flameHalo.scale.set(1, 2.4, 1);
  flameHalo.position.y = 0.02;
  group.add(flameHalo);

  // 顶部提环 + 金帽
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xc89b3c,
    roughness: 0.35,
    metalness: 0.7,
  });
  disposables.push(goldMat);
  const topCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.16, 24),
    goldMat,
  );
  topCap.position.y = 1.06;
  group.add(topCap);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 12, 24), goldMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.2;
  group.add(ring);

  // 底部金帽 + 穗
  const bottomCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.18, 0.14, 24),
    goldMat,
  );
  bottomCap.position.y = -1.06;
  group.add(bottomCap);
  const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), goldMat);
  thread.position.y = -1.36;
  group.add(thread);
  const tassel = new THREE.Mesh(
    new THREE.ConeGeometry(0.13, 0.42, 16),
    new THREE.MeshStandardMaterial({
      color: 0xc03a2b,
      roughness: 0.8,
      side: THREE.DoubleSide,
    }),
  );
  tassel.rotation.x = Math.PI; // 尖朝下
  tassel.position.y = -1.72;
  group.add(tassel);

  scene.add(group);
  return group;
}

// ---- 粒子一：金色星火 -------------------------------------------------------
function buildSparks(scene: THREE.Scene, count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const params: {
    angle: number;
    radius: number;
    y: number;
    speed: number;
    swirl: number;
    phase: number;
    tw: number;
  }[] = [];

  const GOLD = new THREE.Color(1.0, 0.78, 0.4);
  const HOT = new THREE.Color(1.0, 0.95, 0.78);

  for (let i = 0; i < count; i++) {
    const p = {
      angle: Math.random() * Math.PI * 2,
      radius: 1.15 + Math.random() * 1.6,
      y: -1.7 + Math.random() * 3.6,
      speed: 0.28 + Math.random() * 0.55,
      swirl: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2,
      tw: 0.4 + Math.random() * 1.6,
    };
    params.push(p);
    const t = Math.random();
    const c = t < 0.72 ? GOLD : HOT;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const sprite = makeGlowSprite();
  const mat = new THREE.PointsMaterial({
    size: 0.1,
    map: sprite,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  return { points, params, geo, mat, sprite };
}

// ---- 粒子二：剪纸纸屑（InstancedMesh 小纸片） --------------------------------
function buildConfetti(scene: THREE.Scene, count: number) {
  const geo = new THREE.PlaneGeometry(0.07, 0.07);
  const mat = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const params: {
    x: number;
    y: number;
    z: number;
    vy: number;
    sway: number;
    phase: number;
    rx: number;
    ry: number;
    rz: number;
    sx: number;
    sy: number;
    sz: number;
    scale: number;
  }[] = [];

  const RED = new THREE.Color(0xc03a2b);
  const DEEP = new THREE.Color(0x96281b);
  const GOLD = new THREE.Color(0xe4c574);

  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const p = {
      x: (Math.random() - 0.5) * 6,
      y: -2.4 + Math.random() * 5,
      z: (Math.random() - 0.5) * 6,
      vy: 0.15 + Math.random() * 0.4,
      sway: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      sx: (Math.random() - 0.5) * 3,
      sy: (Math.random() - 0.5) * 3,
      sz: (Math.random() - 0.5) * 3,
      scale: 0.6 + Math.random() * 1.2,
    };
    params.push(p);

    const t = Math.random();
    const c = t < 0.6 ? RED : t < 0.82 ? DEEP : GOLD;
    mesh.setColorAt(i, c);

    dummy.position.set(p.x, p.y, p.z);
    dummy.rotation.set(p.rx, p.ry, p.rz);
    dummy.scale.setScalar(p.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  scene.add(mesh);
  return { mesh, params, geo, mat };
}

// ---- 组件 -------------------------------------------------------------------
export function PaperCut3D({
  className,
  autoRotate = true,
  interactive = true,
  showParticles = true,
  density = 1,
}: PaperCut3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 渲染器（透明背景，融入米纸底色）
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0.9, 6.2);

    // 交互
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.05, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enableRotate = interactive;
    controls.enableZoom = interactive;
    controls.enablePan = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = 3.4;
    controls.maxDistance = 12;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.82;

    // 纯展示模式：解除事件监听，避免拦截页面滚动 / 触屏手势
    if (!interactive) {
      controls.disconnect();
      renderer.domElement.style.pointerEvents = "none";
    }

    // 灯光
    const hemi = new THREE.HemisphereLight(0xfff4e0, 0x6d3a2a, 1.6);
    const dir = new THREE.DirectionalLight(0xfff1d8, 2.8);
    dir.position.set(4, 6, 5);
    const inner = new THREE.PointLight(0xffc069, 90, 9, 1.8);
    inner.position.set(0, 0, 0);
    scene.add(hemi, dir, inner);

    const disposables: { dispose: () => void }[] = [];
    buildLantern(scene, disposables);
    const sparks = buildSparks(scene, Math.round(340 * density));
    const confetti = buildConfetti(scene, Math.round(150 * density));

    sparks.points.visible = showParticles;
    confetti.mesh.visible = showParticles;

    // 尺寸同步
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // 不可见时暂停渲染，省资源
    let running = true;
    const io = new IntersectionObserver(
      (entries) => {
        running = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(container);

    // 动画循环
    const clock = new THREE.Clock();
    const TOP = 1.9;
    const BOTTOM = -1.9;
    const posAttr = sparks.geo.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    renderer.setAnimationLoop(() => {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);

      // 星火：上升 + 环绕
      const p = sparks.params;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < p.length; i++) {
        const s = p[i];
        s.y += s.speed * dt;
        s.angle += s.swirl * dt;
        s.phase += s.tw * dt;
        if (s.y > TOP) {
          s.y = BOTTOM + Math.random() * 0.4;
          s.angle = Math.random() * Math.PI * 2;
        }
        const r = s.radius * (1 + 0.2 * Math.sin(s.phase));
        arr[i * 3] = Math.cos(s.angle) * r;
        arr[i * 3 + 1] = s.y;
        arr[i * 3 + 2] = Math.sin(s.angle) * r;
      }
      posAttr.needsUpdate = true;

      // 纸屑：缓慢飘落 + 自转 + 左右摇摆
      const dummy = new THREE.Object3D();
      const c = confetti.params;
      for (let i = 0; i < c.length; i++) {
        const f = c[i];
        f.y -= f.vy * dt;
        f.phase += dt * 0.9;
        f.rx += f.sx * dt;
        f.ry += f.sy * dt;
        f.rz += f.sz * dt;
        if (f.y < BOTTOM - 0.4) {
          f.y = TOP + Math.random() * 0.6;
          f.x = (Math.random() - 0.5) * 6;
          f.z = (Math.random() - 0.5) * 6;
        }
        const swayX = Math.sin(f.phase) * f.sway * 0.25;
        dummy.position.set(f.x + swayX, f.y, f.z);
        dummy.rotation.set(f.rx, f.ry, f.rz);
        dummy.scale.setScalar(f.scale);
        dummy.updateMatrix();
        confetti.mesh.setMatrixAt(i, dummy.matrix);
      }
      confetti.mesh.instanceMatrix.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    });

    worldRef.current = {
      controls,
      sparks: sparks.points,
      confetti: confetti.mesh,
      setParticles: (v: boolean) => {
        sparks.points.visible = v;
        confetti.mesh.visible = v;
      },
    };

    // 清理（StrictMode 下会卸载再挂载，必须彻底释放）
    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      sparks.geo.dispose();
      sparks.mat.dispose();
      sparks.sprite.dispose();
      confetti.geo.dispose();
      confetti.mat.dispose();
      // 释放灯笼内其余几何体 / 材质（火焰、金帽、流苏等）
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 响应式属性更新（不重建场景）
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.controls.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    worldRef.current?.setParticles(showParticles);
  }, [showParticles]);

  return <div ref={containerRef} className={className} aria-label="3D 立体剪纸" />;
}
