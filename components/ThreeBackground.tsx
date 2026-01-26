import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const InteractiveParticles = ({ count = 300, color = "#0ea5e9" }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60; 
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 30 - 10;
      
      const speed = 0.2 + Math.random() * 0.5;
      const factor = 1 + Math.random() * 2;
      
      const ox = x;
      const oy = y;
      const oz = z;
      
      // Random phase for breathing effect
      const phase = Math.random() * Math.PI * 2;

      temp.push({ x, y, z, ox, oy, oz, speed, factor, phase });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const { mouse, clock } = state;
    const time = clock.getElapsedTime();
    
    // Normalize mouse input for the scene
    const mouseX = mouse.x * 25;
    const mouseY = mouse.y * 25;

    particles.forEach((p, i) => {
      const t = time * p.speed;
      
      // Calculate distance to mouse cursor for repulsion
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let xOffset = 0;
      let yOffset = 0;
      
      if (dist < 8) {
        const force = (8 - dist) / 8;
        xOffset = -(dx / dist) * force * 2;
        yOffset = -(dy / dist) * force * 2;
      }

      // Parallax effect
      const parallaxX = mouse.x * p.factor * 0.5;
      const parallaxY = mouse.y * p.factor * 0.5;

      // Update position
      p.x = p.ox + Math.cos(t) * 0.5 + parallaxX + xOffset * 0.1;
      p.y = p.oy + Math.sin(t) * 0.5 + parallaxY + yOffset * 0.1;
      
      dummy.position.set(
          p.ox + Math.sin(t * 0.3) + parallaxX - xOffset, 
          p.oy + Math.cos(t * 0.5) + parallaxY - yOffset, 
          p.z
      );
      
      // Breathing scale effect
      // Base scale based on depth (z)
      const baseScale = (p.z + 20) / 40;
      // Pulse varies with time and particle's unique phase
      const pulse = 1 + Math.sin(time * 2 + p.phase) * 0.3;
      
      const finalScale = Math.max(0.05, baseScale * 0.3) * pulse;
      
      dummy.scale.set(finalScale, finalScale, finalScale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </instancedMesh>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-slate-50 overflow-hidden">
      {/* CSS Ambient Breathing Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-100/40 blur-[120px] animate-pulse-slow mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 blur-[100px] animate-pulse-slow mix-blend-multiply" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-indigo-50/50 blur-[80px] animate-pulse-slow mix-blend-multiply" style={{ animationDelay: '4s' }}></div>

      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#f8fafc', 5, 40]} />
        <InteractiveParticles count={400} color="#94a3b8" />
        <InteractiveParticles count={150} color="#38bdf8" />
        <InteractiveParticles count={60} color="#06b6d4" />
      </Canvas>
      
      {/* Overlay gradient to blend bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/80 pointer-events-none"></div>
    </div>
  );
};

export default ThreeBackground;