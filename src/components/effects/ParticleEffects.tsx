"use client";

import React, { useRef, useState, useEffect } from "react";
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

// Simple CSS-based Particle Effects (no Three.js)
export default function ParticleEffects({
  count = 50,
  color = "#ffffff",
  size = 0.02,
  className = "",
}: ParticleSystemProps) {
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      initialX: number;
      initialY: number;
      animateX: number;
      animateY: number;
      initialScale: number;
      animateScale: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setIsClient(true);

    // Generate deterministic particle data to prevent hydration mismatch
    const particleData = Array.from({ length: count }, (_, i) => {
      // Use seeded random based on index to make it deterministic
      const seed = i * 12345;
      const random1 = (seed % 1000) / 1000;
      const random2 = ((seed * 2) % 1000) / 1000;
      const random3 = ((seed * 3) % 1000) / 1000;
      const random4 = ((seed * 4) % 1000) / 1000;
      const random5 = ((seed * 5) % 1000) / 1000;
      const random6 = ((seed * 6) % 1000) / 1000;
      const random7 = ((seed * 7) % 1000) / 1000;

      const windowWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;
      const windowHeight =
        typeof window !== "undefined" ? window.innerHeight : 800;

      return {
        id: i,
        initialX: random1 * windowWidth,
        initialY: random2 * windowHeight,
        animateX: random3 * windowWidth,
        animateY: random4 * windowHeight,
        initialScale: 0.5 + random5 * 1,
        animateScale: 0.3 + random6 * 0.7,
        duration: 15 + random7 * 20,
        delay: (i % 10) * 1, // Deterministic delay
      };
    });

    setParticles(particleData);
  }, [count]);

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            background: color,
            width: `${size * 1000}px`,
            height: `${size * 1000}px`,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.initialScale,
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            scale: particle.animateScale,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
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
  const [isClient, setIsClient] = useState(false);
  const [elementData, setElementData] = useState<
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
  useEffect(() => {
    setIsClient(true);

    // Generate deterministic element data
    const data = Array.from({ length: elements }, (_, i) => {
      // Use deterministic values based on index for consistent SSR
      const seed = i * 31415; // Use pi digits for pseudo-randomness
      const iconIndex = i % MOVIE_ICONS.length;
      const windowWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;
      const windowHeight =
        typeof window !== "undefined" ? window.innerHeight : 800;

      return {
        id: i,
        icon: MOVIE_ICONS[iconIndex],
        initialX: (((seed * 123) % 1000) / 1000) * windowWidth,
        animateX: (((seed * 456) % 1000) / 1000) * windowWidth,
        initialY: windowHeight + 100,
        duration: 10 + (i % 10), // Deterministic duration
        delay: i % 5, // Deterministic delay
      };
    });

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles with deterministic values for SSR consistency
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < 100; i++) {
        // Use deterministic values based on index
        const seed = i * 7919; // Large prime for distribution
        const x = (seed % 1000) / 1000;
        const y = ((seed * 2) % 1000) / 1000;
        const vx = (((seed * 3) % 1000) / 1000 - 0.5) * 2;
        const vy = (((seed * 4) % 1000) / 1000 - 0.5) * 2;
        const size = (((seed * 5) % 1000) / 1000) * 3 + 1;
        const hue = ((seed * 6) % 60) + 200;
        const lightness = ((seed * 7) % 30) + 50;

        particles.current.push({
          x: x * canvas.width,
          y: y * canvas.height,
          vx,
          vy,
          size,
          color: `hsl(${hue}, 70%, ${lightness}%)`,
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
  }, [isClient]);

  // Don't render on server
  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
