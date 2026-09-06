import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface OpeningIntro3DProps {
  partnerName: string;
  onEnter: () => void;
}

export const OpeningIntro3D: React.FC<OpeningIntro3DProps> = ({
  partnerName,
  onEnter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPopped, setHasPopped] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // References for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Create Heart Geometry
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
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 3,
      bevelSize: 0.14,
      bevelThickness: 0.16,
    };

    const geom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geom.center();
    geom.rotateZ(Math.PI);
    geom.rotateY(Math.PI);
    return geom;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xfff0f5, 1.8);
    scene.add(ambient);

    const mainLight = new THREE.PointLight(0xff2266, 4.5, 60);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xf472b6, 3.2, 50);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Heart Group
    const heartGroup = new THREE.Group();
    // Start deep and tiny for the pop-out explosion!
    heartGroup.position.set(0, 0, -4);
    heartGroup.scale.set(0.01, 0.01, 0.01);
    scene.add(heartGroup);
    heartGroupRef.current = heartGroup;

    // 3D Heart Mesh
    const heartGeo = createHeartGeometry();
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: 0xff2a6d,
      emissive: 0x4a0018,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.45,
      ior: 1.6,
      thickness: 1.2,
      specularColor: 0xffe4e6,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(1.65, 1.65, 1.65);
    heartGroup.add(heartMesh);

    // Outer Halo wireframe
    const haloGeo = heartGeo.clone();
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff99bb,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.scale.set(1.72, 1.72, 1.72);
    heartGroup.add(haloMesh);

    // Orbiting Stardust Particles - subtle & delicate
    const starCount = 50;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xff4d88),
      new THREE.Color(0xffb6c1),
      new THREE.Color(0xffd700),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 1.4 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      starPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      starPositions[i * 3 + 1] = radius * Math.sin(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Particle sprite
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.3, 'rgba(255,182,193,0.8)');
      g.addColorStop(1, 'rgba(255,105,180,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const pTexture = new THREE.CanvasTexture(c);

    const starMat = new THREE.PointsMaterial({
      size: 0.14,
      map: pTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Pop-out timeline animation
    let startTime: number | null = null;
    const duration = 1.5; // seconds to pop out

    // Mouse listener
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);

    const handleResize = () => {
      if (!rendererRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Play initial sound
    sound.playChime('sparkle');
    sound.playHeartbeat();

    // Loop
    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Pop-out spring easing
      if (heartGroupRef.current) {
        if (elapsed < duration) {
          const progress = elapsed / duration;
          // Overshoot elastic easing for pop-out
          const t = progress;
          const scaleVal =
            1 + 0.15 * Math.sin(t * Math.PI * 3) * Math.exp(-t * 2);
          const currentScale = THREE.MathUtils.lerp(0.01, scaleVal, Math.min(1, t * 1.3));

          heartGroupRef.current.scale.set(currentScale, currentScale, currentScale);
          heartGroupRef.current.position.z = THREE.MathUtils.lerp(-4, 0.2, Math.min(1, t * 1.2));
          heartGroupRef.current.rotation.y = (1 - t) * Math.PI * 2;
        } else {
          // Floating idle & gentle heartbeat breathing
          if (!hasPopped) {
            setHasPopped(true);
            setShowText(true);
            setTimeout(() => setShowButton(true), 500);
          }

          const pulseTime = (elapsed % 1.6) / 1.6;
          let pulseScale = 1.0;
          if (pulseTime < 0.12) {
            pulseScale = 1.0 + Math.sin((pulseTime / 0.12) * Math.PI) * 0.1;
          } else if (pulseTime > 0.18 && pulseTime < 0.32) {
            pulseScale = 1.0 + Math.sin(((pulseTime - 0.18) / 0.14) * Math.PI) * 0.06;
          }

          heartGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.1;
          heartGroupRef.current.rotation.y = THREE.MathUtils.lerp(
            heartGroupRef.current.rotation.y,
            mouseRef.current.x * 0.6 + Math.sin(elapsed * 0.8) * 0.15,
            0.05
          );
          heartGroupRef.current.rotation.x = THREE.MathUtils.lerp(
            heartGroupRef.current.rotation.x,
            -mouseRef.current.y * 0.4,
            0.05
          );

          const targetScale = pulseScale;
          const currentScale = THREE.MathUtils.lerp(
            heartGroupRef.current.scale.x,
            targetScale,
            0.15
          );
          heartGroupRef.current.scale.set(currentScale, currentScale, currentScale);
        }
      }

      starField.rotation.y = elapsed * 0.06;
      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const handleEnterWebsite = () => {
    sound.playChime('sparkle');
    // Automatically begin recommended music playback
    if (!sound.getIsPlaying()) {
      sound.startMusicBox();
    }
    onEnter();
  };

  return (
    <motion.div
      id="opening-3d-intro-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1a0814] via-[#2c0f20] to-[#160612] text-white overflow-hidden"
    >
      {/* Three.js Background Canvas */}
      <div
        ref={containerRef}
        onClick={handleEnterWebsite}
        className="absolute inset-0 cursor-pointer"
        title="Tap to enter!"
      />

      {/* Floating Center Overlay with Her Name directly in between / across the 3D heart */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6 max-w-xl">
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              className="flex flex-col items-center"
            >
              {/* Glowing Top Eyebrow Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-pink-200 mb-3 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>A Little World For You</span>
              </div>

              {/* Her Name Centered Over The 3D Heart */}
              <h1
                className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,105,180,0.8)] font-romantic select-none py-1"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                For {partnerName}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-pink-200/90 font-medium tracking-wide drop-shadow-md">
                Together Since 1 January 2025 • Forever & Always
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter Button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 pointer-events-auto"
            >
              <button
                id="enter-website-btn"
                onClick={handleEnterWebsite}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-sm shadow-[0_8px_30px_rgba(244,63,94,0.6)] hover:shadow-[0_12px_40px_rgba(244,63,94,0.8)] transition-all active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform animate-pulse" />
                <span>Open With All My Love</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <span className="text-xs text-pink-300/60 tracking-wider uppercase font-medium">
          Tap anywhere to explore
        </span>
      </div>
    </motion.div>
  );
};
