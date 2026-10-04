import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController } from './CameraController';
import { PrismGeometry } from './PrismGeometry';

interface SceneProps {
  scrollProgress: number;
  isLowPerformance: boolean;
}

export const Scene: React.FC<SceneProps> = ({ scrollProgress, isLowPerformance }) => {
  return (
    <div
      id="webgl-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 100 }}
        dpr={isLowPerformance ? 1 : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <Suspense fallback={null}>
          {/* Awwwards Minimalist Museum Fog matching Cotton Paper background */}
          <fog attach="fog" args={['#FBF8F6', 8, 25]} />

          {/* Natural Gallery Daylight & Studio Key Lighting */}
          <ambientLight intensity={0.9} color="#FFFFFF" />
          <directionalLight
            position={[10, 16, 8]}
            intensity={1.25}
            color="#FFFDF8"
          />
          <directionalLight
            position={[-8, 10, -6]}
            intensity={0.35}
            color="#F1F5F9"
          />

          {/* Smooth Continuous Camera Orbit */}
          <CameraController scrollProgress={scrollProgress} />

          {/* Sculptural Gallery Geometry */}
          <PrismGeometry
            scrollProgress={scrollProgress}
            isLowPerformance={isLowPerformance}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
