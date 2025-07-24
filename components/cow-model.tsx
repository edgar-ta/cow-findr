"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function HeroHome() {
  const { scene } = useGLTF("/models/cowfindr_collar.glb");


  return (
    <section className="relative">
      {/* Otros contenidos arriba... */}

      <h1
                    className="mb-6 border-y text-2xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:text-4xl text-center"

      >
        Modelo en 3D
      </h1>

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
