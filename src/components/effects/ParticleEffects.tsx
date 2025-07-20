"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  spread?: number;
  opacity?: number;
  className?: string;
}

// 3D Particle System Component
function ParticleSystem({
  count = 1000,
  color = "#ffffff",
  size = 0.05,
  speed = 0.5,
  spread = 10,
}: {
  count: number;
  color: string;
  size: number;
  speed: number;
  spread: number;
}) {
  const meshRef = useRef<THREE.Points>(null);

  // Generate particle positions and properties
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const i3 = i * 3;
      const radius = Math.random() * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;

      // Random sizes
      sizes[i] = Math.random() * size + size * 0.5;
    }

    return { positions, velocities, sizes };
  }, [count, size, speed, spread]);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position
        .array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Update positions with sine wave motion
        positions[i3] += particles.velocities[i3] * 0.01;
        positions[i3 + 1] +=
          particles.velocities[i3 + 1] * 0.01 + Math.sin(time + i) * 0.001;
        positions[i3 + 2] += particles.velocities[i3 + 2] * 0.01;

        // Reset particles that go too far
        if (
          Math.abs(positions[i3]) > spread ||
          Math.abs(positions[i3 + 1]) > spread ||
          Math.abs(positions[i3 + 2]) > spread
        ) {
          positions[i3] = (Math.random() - 0.5) * spread * 0.5;
          positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.5;
          positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;
        }
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Particle Effects Component
export default function ParticleEffects({
  count = 500,
  color = "#ffffff",
  size = 0.02,
  speed = 0.3,
  spread = 8,
  className = "",
}: ParticleSystemProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <ParticleSystem
          count={count}
          color={color}
          size={size}
          speed={speed}
          spread={spread}
        />
      </Canvas>
    </div>
  );
}

// Movie icons for floating elements
const MOVIE_ICONS = ["🎬", "🎭", "🍿", "🎪", "🎨", "🎵", "⭐", "🏆"];

// Floating Movie Elements Component
export function FloatingMovieElements({
  elements = 20,
  className = "",
}: {
  elements?: number;
  className?: string;
}) {
  const [isClient, setIsClient] = React.useState(false);
  const [elementData, setElementData] = React.useState<
    Array<{
      id: number;
      icon: string;
      initialX: number;
      animateX: number;
      initialY: number;
      duration: number;
      delay: number;
    }>
  >([]);

  // Initialize client-side only to prevent hydration mismatch
  React.useEffect(() => {
    setIsClient(true);

    // Generate deterministic element data
    const data = Array.from({ length: elements }, (_, i) => ({
      id: i,
      icon: MOVIE_ICONS[i % MOVIE_ICONS.length],
      initialX:
        (i * 123 + 456) %
        (typeof window !== "undefined" ? window.innerWidth : 1200),
      animateX:
        (i * 789 + 234) %
        (typeof window !== "undefined" ? window.innerWidth : 1200),
      initialY: typeof window !== "undefined" ? window.innerHeight + 100 : 800,
      duration: 10 + (i % 10),
      delay: i % 5,
    }));

    setElementData(data);
  }, [elements]);

  // Don't render anything on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {elementData.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-20"
          initial={{
            x: element.initialX,
            y: element.initialY,
            rotate: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            x: element.animateX,
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "linear",
            delay: element.delay,
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
}

// Interactive Background Particles
export function InteractiveParticles({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const particles = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }>
  >([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < 100; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 60 + 200}, 70%, ${
            50 + Math.random() * 30
          }%)`,
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Draw connections
        particles.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.2 * (1 - distance / 80);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    // Resize handler
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    handleResize();
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
