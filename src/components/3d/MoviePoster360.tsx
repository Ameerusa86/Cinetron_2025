"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Movie } from "@/types";

interface MoviePoster360Props {
  movie: Movie;
  imageUrl: string;
  backImageUrl?: string;
  autoRotate?: boolean;
  controls?: boolean;
  className?: string;
}

function RotatingPoster({
  imageUrl,
  backImageUrl,
  movie,
  autoRotate = true,
}: {
  imageUrl: string;
  backImageUrl?: string;
  movie: Movie;
  autoRotate: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load textures
  const frontTexture = useLoader(THREE.TextureLoader, imageUrl);
  const backTexture = useLoader(THREE.TextureLoader, backImageUrl || imageUrl);

  useFrame((state) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Front side */}
        <RoundedBox
          ref={meshRef}
          args={[2, 3, 0.15]}
          radius={0.1}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial map={frontTexture} side={THREE.FrontSide} />
        </RoundedBox>

        {/* Back side */}
        <RoundedBox args={[2, 3, 0.15]} radius={0.1} position={[0, 0, 0]}>
          <meshStandardMaterial map={backTexture} side={THREE.BackSide} />
        </RoundedBox>

        {/* Glowing rim */}
        <RoundedBox
          args={[2.05, 3.05, 0.05]}
          radius={0.15}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.2} />
        </RoundedBox>

        {/* Movie info */}
        <group position={[0, -2, 0.1]}>
          <Text
            fontSize={0.12}
            maxWidth={2.5}
            lineHeight={1.2}
            textAlign="center"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {movie.title}
          </Text>

          <Text
            position={[0, -0.25, 0]}
            fontSize={0.08}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
          >
            ⭐ {movie.vote_average.toFixed(1)} •{" "}
            {new Date(movie.release_date).getFullYear()}
          </Text>
        </group>

        {/* Particle effects around poster */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2.5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <mesh key={i} position={[x, Math.random() * 2 - 1, z]}>
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial color={`hsl(${i * 45}, 70%, 60%)`} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function MoviePoster360({
  movie,
  imageUrl,
  backImageUrl,
  autoRotate = true,
  controls = true,
  className = "",
}: MoviePoster360Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-full aspect-[3/4] ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 60 }}
        className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-purple-900"
      >
        {/* Dynamic Lighting */}
        <ambientLight intensity={0.3} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          decay={0}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <spotLight
          position={[-5, -5, 5]}
          angle={0.3}
          penumbra={1}
          decay={0}
          intensity={0.5}
          color="#ff6b35"
        />

        {/* Interactive Controls */}
        {controls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={autoRotate && !isHovered}
            autoRotateSpeed={2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />
        )}

        {/* 3D Rotating Poster */}
        <RotatingPoster
          imageUrl={imageUrl}
          backImageUrl={backImageUrl}
          movie={movie}
          autoRotate={autoRotate && !isHovered}
        />

        {/* Background particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10 - 5,
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.1 + Math.random() * 0.2}
            />
          </mesh>
        ))}
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>360° View</span>
        </div>
      </div>

      {/* Controls hint */}
      {controls && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          🖱️ Drag to rotate
        </div>
      )}
    </motion.div>
  );
}
