import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Flower2, RefreshCw } from 'lucide-react';

interface LoveScene3DProps {
  partnerName?: string;
  onHeartClick?: () => void;
}

export const LoveScene3D: React.FC<LoveScene3DProps> = ({
  partnerName = 'Sweetheart',
  onHeartClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeMode, setThemeMode] = useState<'crystal' | 'starlight' | 'sakura'>('crystal');
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // References to THREE objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const petalsRef = useRef<THREE.InstancedMesh | null>(null);
  const burstParticlesRef = useRef<THREE.Points | null>(null);
  const burstDataRef = useRef<{ positions: Float32Array; velocities: Float32Array; life: Float32Array } | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Mouse tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Create 3D Heart geometry using Bezier curves and ExtrudeGeometry
  const createHeartGeometry = () => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 12,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.14,
    };

    const geom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geom.center();
    // Rotate to orient right side up
    geom.rotateZ(Math.PI);
    geom.rotateY(Math.PI);
    return geom;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff4081, 3.5, 50);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 50);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const backlight = new THREE.DirectionalLight(0xffffff, 1.8);
    backlight.position.set(0, 5, -4);
    scene.add(backlight);

    // MAIN HEART GROUP
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);
    heartGroupRef.current = heartGroup;

    // Heart geometry & material
    const heartGeo = createHeartGeometry();

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff3366,
      emissive: 0x550022,
      roughness: 0.12,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.35,
      ior: 1.5,
      thickness: 0.8,
      specularColor: 0xffe4e6,
    });

    const heartMesh = new THREE.Mesh(heartGeo, crystalMaterial);
    heartMesh.scale.set(1.4, 1.4, 1.4);
    heartGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // Inner glowing core
    const innerHeartGeo = heartGeo.clone();
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff99bb,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerHeartGeo, innerMaterial);
    innerMesh.scale.set(1.35, 1.35, 1.35);
    heartGroup.add(innerMesh);

    // FLOATING ORBITING SPARKLE PARTICLES
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xff69b4),
      new THREE.Color(0xffb6c1),
      new THREE.Color(0xff1493),
      new THREE.Color(0xffd700),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,182,193,0.8)');
      grad.addColorStop(1, 'rgba(255,105,180,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // CLICK BURST PARTICLES SYSTEM
    const burstCount = 60;
    const burstGeo = new THREE.BufferGeometry();
    const bPositions = new Float32Array(burstCount * 3);
    const bVelocities = new Float32Array(burstCount * 3);
    const bLife = new Float32Array(burstCount);

    for (let i = 0; i < burstCount; i++) {
      bPositions[i * 3] = 0;
      bPositions[i * 3 + 1] = 0;
      bPositions[i * 3 + 2] = 0;
      bLife[i] = 0; // inactive
    }

    burstGeo.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));
    const burstMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      color: 0xff3366,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const burstPoints = new THREE.Points(burstGeo, burstMat);
    scene.add(burstPoints);
    burstParticlesRef.current = burstPoints;
    burstDataRef.current = { positions: bPositions, velocities: bVelocities, life: bLife };

    // SAKURA PETALS (InstancedMesh)
    const petalCount = 45;
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.08, 0.12, 0.1, 0.25, 0, 0.35);
    petalShape.bezierCurveTo(-0.1, 0.25, -0.08, 0.12, 0, 0);

    const petalGeom = new THREE.ShapeGeometry(petalShape);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffccd9,
      side: THREE.DoubleSide,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85,
    });

    const petals = new THREE.InstancedMesh(petalGeom, petalMat, petalCount);
    const dummy = new THREE.Object3D();
    const petalData: { pos: THREE.Vector3; rot: THREE.Euler; speed: number; rotSpeed: THREE.Vector3 }[] = [];

    for (let i = 0; i < petalCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 4 - 1,
        (Math.random() - 0.5) * 4
      );
      const rot = new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.position.copy(pos);
      dummy.rotation.copy(rot);
      dummy.scale.setScalar(0.7 + Math.random() * 0.6);
      dummy.updateMatrix();
      petals.setMatrixAt(i, dummy.matrix);

      petalData.push({
        pos,
        rot,
        speed: 0.008 + Math.random() * 0.015,
        rotSpeed: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
      });
    }
    petals.instanceMatrix.needsUpdate = true;
    scene.add(petals);
    petalsRef.current = petals;

    // POINTER LISTENER
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // RESIZE LISTENER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && rendererRef.current) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    let pulseTime = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Heartbeat pulse calculation
      // Simulate double pulse (lub-dub) every 1.5 seconds
      pulseTime = (time % 1.6) / 1.6;
      let pulseScale = 1.0;
      if (pulseTime < 0.12) {
        pulseScale = 1.0 + Math.sin((pulseTime / 0.12) * Math.PI) * 0.12;
      } else if (pulseTime > 0.18 && pulseTime < 0.32) {
        pulseScale = 1.0 + Math.sin(((pulseTime - 0.18) / 0.14) * Math.PI) * 0.08;
      }

      if (heartGroupRef.current) {
        // Base idle floating & tilt towards pointer
        heartGroupRef.current.position.y = Math.sin(time * 1.5) * 0.12;
        heartGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          heartGroupRef.current.rotation.y,
          mouseRef.current.x * 0.8 + Math.sin(time * 0.8) * 0.2,
          0.05
        );
        heartGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          heartGroupRef.current.rotation.x,
          -mouseRef.current.y * 0.6 + Math.cos(time * 0.8) * 0.1,
          0.05
        );

        const currentScale = heartGroupRef.current.scale.x;
        const targetScale = pulseScale;
        const lerpedScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.2);
        heartGroupRef.current.scale.set(lerpedScale, lerpedScale, lerpedScale);
      }

      // Rotating particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.08;
        particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
      }

      // Update Sakura Petals
      if (petalsRef.current) {
        for (let i = 0; i < petalCount; i++) {
          const item = petalData[i];
          item.pos.y -= item.speed;
          item.pos.x += Math.sin(time + i) * 0.003;
          item.rot.x += item.rotSpeed.x;
          item.rot.y += item.rotSpeed.y;
          item.rot.z += item.rotSpeed.z;

          if (item.pos.y < -2.2) {
            item.pos.y = 2.4;
            item.pos.x = (Math.random() - 0.5) * 5;
          }

          dummy.position.copy(item.pos);
          dummy.rotation.copy(item.rot);
          dummy.updateMatrix();
          petalsRef.current.setMatrixAt(i, dummy.matrix);
        }
        petalsRef.current.instanceMatrix.needsUpdate = true;
      }

      // Update Burst Particles
      if (burstDataRef.current && burstParticlesRef.current) {
        const { positions, velocities, life } = burstDataRef.current;
        let anyActive = false;
        for (let i = 0; i < burstCount; i++) {
          if (life[i] > 0) {
            anyActive = true;
            positions[i * 3] += velocities[i * 3] * delta;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * delta;
            velocities[i * 3 + 1] -= 0.6 * delta; // gravity
            life[i] -= delta * 1.2;
          }
        }
        if (anyActive) {
          burstParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update materials when theme changes
  useEffect(() => {
    if (!heartMeshRef.current || !particlesRef.current || !petalsRef.current) return;

    if (themeMode === 'crystal') {
      const mat = heartMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.setHex(0xff3366);
      mat.roughness = 0.12;
      mat.clearcoat = 1.0;
      petalsRef.current.visible = true;
      particlesRef.current.visible = true;
    } else if (themeMode === 'starlight') {
      const mat = heartMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.setHex(0x9933ff);
      mat.roughness = 0.25;
      mat.clearcoat = 0.8;
      petalsRef.current.visible = false;
      particlesRef.current.visible = true;
    } else if (themeMode === 'sakura') {
      const mat = heartMeshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.setHex(0xff7799);
      mat.roughness = 0.35;
      mat.clearcoat = 0.4;
      petalsRef.current.visible = true;
      particlesRef.current.visible = true;
    }
  }, [themeMode]);

  // Click handler on 3D heart
  const handleHeartInteraction = (e: React.MouseEvent) => {
    sound.playHeartbeat();
    sound.playChime('pop');
    setClickCount((c) => c + 1);

    // Heart bounce
    if (heartGroupRef.current) {
      heartGroupRef.current.scale.set(1.4, 1.4, 1.4);
    }

    // Trigger burst particles in 3D
    if (burstDataRef.current && burstParticlesRef.current) {
      const { positions, velocities, life } = burstDataRef.current;
      const count = life.length;
      for (let i = 0; i < count; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = 1.2 + Math.random() * 2.2;

        velocities[i * 3] = Math.cos(theta) * Math.cos(phi) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * speed + 0.8;
        velocities[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * speed;

        life[i] = 1.0;
      }
      burstParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Canvas confetti hearts
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2) / window.innerWidth;
    const y = (e.clientY || rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 22,
      spread: 70,
      origin: { x, y },
      colors: ['#ff4d88', '#ff70a6', '#ff97b7', '#ffccd9', '#ffd166'],
      shapes: ['circle'],
      scalar: 1.3,
    });

    if (onHeartClick) onHeartClick();
  };

  return (
    <div
      id="3d-heart-interactive-card"
      className="relative w-full h-[460px] md:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-b from-pink-50/80 via-rose-50/40 to-pink-100/60 border border-pink-200/80 shadow-[0_12px_40px_rgba(255,182,193,0.35)] backdrop-blur-sm group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleHeartInteraction}
        className="w-full h-full cursor-pointer relative z-10"
        title="Click the heart to send love!"
      />

      {/* Decorative Floating Overlay Info */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-6 z-20 pointer-events-none max-w-[170px] xs:max-w-[210px] sm:max-w-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-pink-200 shadow-xs text-[10px] sm:text-xs font-medium text-pink-700">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 animate-ping inline-block" />
          Interactive 3D Heart
        </div>
        <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-rose-950 mt-1 tracking-tight truncate">
          Beating For {partnerName}
        </h2>
        <p className="text-[10px] sm:text-xs md:text-sm text-rose-700/80 mt-0.5 line-clamp-1 sm:line-clamp-none">
          {clickCount === 0
            ? 'Tap to send heartbeats'
            : `Felt ${clickCount} heartbeat${clickCount > 1 ? 's' : ''}! 💕`}
        </p>
      </div>

      {/* Mode Selector Pill */}
      <div className="absolute top-3 sm:top-5 right-3 sm:right-6 z-20 flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-xs">
        <button
          id="mode-crystal-btn"
          onClick={() => setThemeMode('crystal')}
          className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-all cursor-pointer ${
            themeMode === 'crystal'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline-block mr-0.5 sm:mr-1" />
          Crystal
        </button>
        <button
          id="mode-starlight-btn"
          onClick={() => setThemeMode('starlight')}
          className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-all cursor-pointer ${
            themeMode === 'starlight'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline-block mr-0.5 sm:mr-1" />
          Starlight
        </button>
        <button
          id="mode-sakura-btn"
          onClick={() => setThemeMode('sakura')}
          className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full transition-all cursor-pointer ${
            themeMode === 'sakura'
              ? 'bg-pink-500 text-white shadow-xs'
              : 'text-pink-700 hover:bg-pink-50'
          }`}
        >
          <Flower2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline-block mr-0.5 sm:mr-1" />
          Sakura
        </button>
      </div>

      {/* Floating Center Tap Prompt (fades out after clicks) */}
      {clickCount === 0 && (
        <div
          onClick={handleHeartInteraction}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer pointer-events-auto"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 border border-pink-300 shadow-md text-pink-700 font-medium text-sm hover:scale-105 transition-transform animate-bounce">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Tap my heart!</span>
          </div>
        </div>
      )}

      {/* Click counter badge */}
      {clickCount > 0 && (
        <div className="absolute bottom-5 right-6 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium shadow-xs">
            <span>❤️ {clickCount} love pulses</span>
          </div>
        </div>
      )}
    </div>
  );
};
