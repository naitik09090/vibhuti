import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function BankModel() {
  const buildingRef = useRef();

  useFrame((state) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={buildingRef}>
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.4, 8]} />
        <meshStandardMaterial color="#78350f" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.4, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
      </mesh>

      {[-1.4, -0.5, 0.5, 1.4].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.2, 0.8]}>
            <cylinderGeometry args={[0.14, 0.14, 2.0, 8]} />
            <meshPhysicalMaterial color="#14b8a6" metalness={0.8} roughness={0.2} transmission={0.2} thickness={0.4} />
          </mesh>
          <mesh position={[x, -0.2, -0.8]}>
            <cylinderGeometry args={[0.14, 0.14, 2.0, 8]} />
            <meshPhysicalMaterial color="#14b8a6" metalness={0.8} roughness={0.2} transmission={0.2} thickness={0.4} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3.2, 2.0, 1.4]} />
        <meshPhysicalMaterial
          color="#0d9488"
          transparent
          opacity={0.6}
          transmission={0.8}
          roughness={0.15}
          metalness={0.25}
          thickness={1.5}
        />
      </mesh>

      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[3.8, 0.4, 2.0]} />
        <meshStandardMaterial color="#78350f" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.2, 0.7, 4]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

function CurrencySymbols() {
  const symbolsRef = useRef();

  useFrame((state) => {
    if (symbolsRef.current) {
      symbolsRef.current.rotation.y = -state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={symbolsRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5} position={[-3.3, 0.5, 1.5]}>
        <mesh>
          <torusGeometry args={[0.3, 0.08, 8, 24]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} emissive="#14b8a6" emissiveIntensity={0.15} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2} position={[3.3, 0.8, -1.5]}>
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.35]} />
            <meshStandardMaterial color="#1e70e6" metalness={0.7} roughness={0.2} emissive="#1e70e6" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0.08, 0.18, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.35]} />
            <meshStandardMaterial color="#1e70e6" metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0.08, 0.04, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.35]} />
            <meshStandardMaterial color="#1e70e6" metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1} position={[-2.5, -0.7, -2.5]}>
        <mesh>
          <torusGeometry args={[0.26, 0.07, 8, 16, Math.PI * 1.35]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function FlowOrbits() {
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (ringRef1.current) ringRef1.current.rotation.z = elapsed * 0.3;
    if (ringRef2.current) ringRef2.current.rotation.x = elapsed * 0.2;
  });

  return (
    <group rotation={[Math.PI / 3.5, 0, 0]}>
      <mesh ref={ringRef1}>
        <ringGeometry args={[4.4, 4.45, 64]} />
        <meshBasicMaterial color="#14b8a6" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[4.8, 4.83, 64]} />
        <meshBasicMaterial color="#0d9488" side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function ThreeBankBuilding() {
  return (
    <div className="w-full h-[300px] sm:h-[360px] md:h-[420px] relative z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.3, 7.8]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[8, 10, 8]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-8, -8, -8]} intensity={0.5} color="#0d9488" />
        <directionalLight position={[4, 10, 4]} intensity={1.5} color="#fbbf24" />
        <BankModel />
        <CurrencySymbols />
        <FlowOrbits />
      </Canvas>
    </div>
  );
}
