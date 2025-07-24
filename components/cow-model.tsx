"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function HeroHome() {
  const { scene } = useGLTF("/models/cow-model.glb");


  return (
    <section className="relative">
      {/* Otros contenidos arriba... */}

      {/* Modelo 3D de la vaca */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-xl mt-10">
            <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />
      <primitive object={scene} scale={1.5} />
    </Canvas>

      </div>
    </section>
  );
}
