import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Use files served from `public/textures/` (absolute paths).
// Please move your texture files to: public/textures/
const TEXTURES = {
  map: '/textures/earth_atmos_2048.jpg',
  normal: '/textures/earth_normal_2048.jpg',
  specular: '/textures/earth_specular_2048.jpg',
  clouds: '/textures/earth_clouds_1024.png',
};

const Globe = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Use useLoader with Suspense so the component waits for textures before first render
  const [colorMap, normalMap, specMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    TEXTURES.map,
    TEXTURES.normal,
    TEXTURES.specular,
    TEXTURES.clouds,
  ]);

  // Ensure correct color space for color and clouds
  if (colorMap) { colorMap.encoding = THREE.sRGBEncoding; colorMap.needsUpdate = true; }
  if (cloudsMap) { cloudsMap.encoding = THREE.sRGBEncoding; cloudsMap.needsUpdate = true; }

  useFrame((state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.06;

    if (atmosphereRef.current) {
      const t = state.clock.getElapsedTime();
      const scale = 1.1 + Math.sin(t * 0.8) * 0.015;
      atmosphereRef.current.scale.set(scale, scale, scale);
    }
  });

  // compute Beijing vector in group's local space so light (as child) points to China
  const lat = 39.9; // Beijing latitude
  const lon = 116.4; // Beijing longitude
  const radius = 12;
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon) * Math.PI / 180;
  const lx = radius * Math.sin(phi) * Math.cos(theta);
  const ly = radius * Math.cos(phi);
  const lz = radius * Math.sin(phi) * Math.sin(theta);

  return (
    <group ref={groupRef} rotation={[0, 0, 23.5 * Math.PI / 180]}>
      {/* Directional light placed as child so it follows group's rotation and stays pointed at China */}
      <directionalLight position={[lx, ly, lz]} intensity={1.8} color="#ffffff" />
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[3, 96, 96]} />
        <meshStandardMaterial
          map={colorMap ?? undefined}
          normalMap={normalMap ?? undefined}
          normalScale={new THREE.Vector2(2.5, 2.5)}
          roughnessMap={specMap ?? undefined}
          roughness={0.35}
          metalness={0.05}
          color="#cffafe"
          emissive="#083344"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap ?? undefined}
          transparent={true}
          opacity={0.35}
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
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, outputColorSpace: THREE.SRGBColorSpace, physicallyCorrectLights: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lower ambient to keep contrast; hemisphere for subtle fill */}
          <ambientLight intensity={0.18} />
          <hemisphereLight skyColor={0xe8f7ff} groundColor={0x201000} intensity={0.25} />
          {/* Front fill light to keep surface details visible when main sun is at grazing angles */}
          <directionalLight position={[0, 3, 8]} intensity={0.6} color="#ffffff" />
          <spotLight position={[-10, 10, -5]} intensity={0.9} color="#0e7490" angle={0.5} penumbra={1} />
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