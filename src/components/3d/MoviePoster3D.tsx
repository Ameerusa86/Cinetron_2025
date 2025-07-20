"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Movie } from "@/types";
import Image from "next/image";

interface MoviePoster3DProps {
  movie: Movie;
  imageUrl: string;
  isHovered?: boolean;
  onClick?: () => void;
}

// 3D Poster Mesh Component
function PosterMesh({
  imageUrl,
  movie,
  isHovered,
}: {
  imageUrl: string;
  movie: Movie;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  // Load poster texture
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Rotation on hover
      if (isHovered) {
        meshRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.2;
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.scale.setScalar(1);
      }
    }

    if (textRef.current && isHovered) {
      textRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {/* Main poster */}
      <RoundedBox
        ref={meshRef}
        args={[2, 3, 0.1]}
        radius={0.1}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={texture} />
      </RoundedBox>

      {/* Glowing border effect on hover */}
      {isHovered && (
        <RoundedBox
          args={[2.1, 3.1, 0.05]}
          radius={0.15}
          position={[0, 0, -0.1]}
        >
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.3} />
        </RoundedBox>
      )}

      {/* Movie title text */}
      {isHovered && (
        <group ref={textRef} position={[0, 1.8, 0.1]}>
          <Text
            fontSize={0.15}
            maxWidth={2}
            lineHeight={1}
            textAlign="center"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {movie.title}
          </Text>

          {/* Rating */}
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.12}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
          >
            ⭐ {movie.vote_average.toFixed(1)}
          </Text>

          {/* Release year */}
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.1}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
          >
            {new Date(movie.release_date).getFullYear()}
          </Text>
        </group>
      )}
    </Float>
  );
}

// Main 3D Movie Poster Component
export default function MoviePoster3D({
  movie,
  imageUrl,
  isHovered = false,
  onClick,
}: MoviePoster3DProps) {
  const [hover, setHover] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);

  const displayImage = fallbackImage ? "/placeholder-poster.svg" : imageUrl;

  const handleImageError = () => {
    setFallbackImage(true);
  };

  return (
    <motion.div
      className="relative w-full h-full aspect-[2/3] cursor-pointer group"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 75 }}
        className="rounded-xl overflow-hidden"
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={1}
          castShadow
        />
        <pointLight
          position={[-10, -10, -10]}
          color="#ff6b35"
          intensity={0.3}
        />

        {/* 3D Poster */}
        <PosterMesh
          imageUrl={displayImage}
          movie={movie}
          isHovered={hover || isHovered}
        />
      </Canvas>

      {/* Fallback 2D Image (hidden behind canvas) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={displayImage}
          alt={movie.title}
          fill
          className="object-cover rounded-xl"
          onError={handleImageError}
        />
      </div>

      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

      {/* Corner accent */}
      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

      {/* Loading indicator */}
      {!displayImage.includes("placeholder") && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent" />
        </div>
      )}
    </motion.div>
  );
}
