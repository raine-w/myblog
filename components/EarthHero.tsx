import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

const TEXTURES = {
  map: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  normal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  specular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
};

const Globe = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    TEXTURES.map,
    TEXTURES.normal,
    TEXTURES.specular,
    TEXTURES.clouds
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.06;
    
    if (atmosphereRef.current) {
        const t = state.clock.getElapsedTime();
        const scale = 1.1 + Math.sin(t * 0.8) * 0.015;
        atmosphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group rotation={[0, 0, 23.5 * Math.PI / 180]}>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(2, 2)}
          roughnessMap={specularMap}
          roughness={0.6}
          metalness={0.2}
          color="#cffafe"
          emissive="#083344"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          color="#ffffff"
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
         <sphereGeometry args={[3, 64, 64]} />
         <meshPhongMaterial 
            color="#06b6d4"
            transparent 
            opacity={0.15} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
         />
      </mesh>
      
       <mesh scale={[1.3, 1.3, 1.3]}>
         <sphereGeometry args={[3, 32, 32]} />
         <meshBasicMaterial 
            color="#22d3ee" 
            transparent 
            opacity={0.05} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
         />
      </mesh>
    </group>
  );
};

const LoadingFallback = () => (
    <Html center>
        <div className="flex flex-col items-center gap-2 backdrop-blur-md bg-white/30 p-4 rounded-xl">
            <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-cyan-800 text-[10px] font-mono tracking-widest">INITIALIZING...</div>
        </div>
    </Html>
);

const EarthHero: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-move">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 2]} 
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 5, 5]} intensity={3} color="#f0f9ff" />
            <spotLight position={[-10, 10, -5]} intensity={5} color="#0e7490" angle={0.5} penumbra={1} />
            <Stars radius={200} depth={50} count={4000} factor={4} saturation={0} fade speed={0.5} />
            <Globe />
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                minPolarAngle={Math.PI / 3} 
                maxPolarAngle={2 * Math.PI / 3} 
                rotateSpeed={0.4}
                autoRotate={true}
                autoRotateSpeed={0.3}
            />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 right-4 md:top-10 md:right-10 pointer-events-none select-none flex flex-col items-end gap-1 opacity-80">
          <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-mono text-cyan-600 font-bold">SATELLITE LINK</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-[9px] md:text-[10px] font-mono text-cyan-500/60">LIVE FEED • 4K RES</div>
      </div>
    </div>
  );
};

export default EarthHero;