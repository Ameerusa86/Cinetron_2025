"use client";

import React, { useRef } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
  enableScale?: boolean;
  enableRotation?: boolean;
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
  zIndex?: number;
}

// Individual Parallax Layer Component
export function ParallaxLayer({
  children,
  speed,
  className = "",
  zIndex = 0,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smoothProgress, [0, 1], [0, speed * -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        opacity,
        zIndex,
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Main Parallax Scroll Container
export default function ParallaxScroll({
  children,
  speed = 0.5,
  direction = "vertical",
  className = "",
  enableScale = false,
  enableRotation = false,
}: ParallaxScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Transform values based on scroll progress
  const yTransform = useTransform(
    smoothProgress,
    [0, 1],
    direction === "vertical" ? [100 * speed, -100 * speed] : [0, 0]
  );

  const xTransform = useTransform(
    smoothProgress,
    [0, 1],
    direction === "horizontal" ? [100 * speed, -100 * speed] : [0, 0]
  );

  const scaleTransform = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    enableScale ? [0.8, 1.1, 0.8] : [1, 1, 1]
  );

  const rotateTransform = useTransform(
    smoothProgress,
    [0, 1],
    enableRotation ? [0, 360 * speed] : [0, 0]
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        ref={ref}
        style={{
          y: yTransform,
          x: xTransform,
          scale: scaleTransform,
          rotate: rotateTransform,
        }}
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{
          opacity: inView ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Cinematic Parallax Background Component
export function CinematicParallax({
  backgroundImage,
  overlayImage,
  children,
  className = "",
}: {
  backgroundImage?: string;
  overlayImage?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const overlayY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  );

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Background Layer */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            y: backgroundY,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      )}

      {/* Overlay Layer */}
      {overlayImage && (
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            y: overlayY,
            backgroundImage: `url(${overlayImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"
        style={{ opacity }}
      />

      {/* Content Layer */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{ y: contentY }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Multi-layer Parallax Section
export function MultiLayerParallax({
  layers,
  className = "",
}: {
  layers: Array<{
    content: React.ReactNode;
    speed: number;
    zIndex?: number;
    className?: string;
  }>;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {layers.map((layer, index) => (
        <ParallaxLayer
          key={index}
          speed={layer.speed}
          zIndex={layer.zIndex || index}
          className={layer.className}
        >
          {layer.content}
        </ParallaxLayer>
      ))}
    </div>
  );
}
