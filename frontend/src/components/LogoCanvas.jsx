// components/LogoCanvas.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, MeshWobbleMaterial } from '@react-three/drei';

const LogoSphere = () => (
  <Float speed={1.5} rotationIntensity={1.2} floatIntensity={2}>
    <mesh>
      <sphereGeometry args={[0.9, 32, 32]} />
      <MeshWobbleMaterial
        color="#3b82f6"
        factor={0.6}
        speed={1.5}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  </Float>
);

const LogoCanvas = () => (
  <div style={{ width: 48, height: 48 }}>
    <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2} />
      <LogoSphere />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  </div>
);

export default LogoCanvas;
