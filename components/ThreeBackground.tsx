import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Generate a star-like texture programmatically
const useStarTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      // Draw a soft glowing core
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.4, 'rgba(100, 200, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);

      // Draw a sharp cross shape for "star" look
      context.beginPath();
      context.moveTo(32, 10);
      context.lineTo(32, 54);
      context.moveTo(10, 32);
      context.lineTo(54, 32);
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      context.lineWidth = 2;
      context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
};

const MagicParticles = ({ count = 2000 }) => {
  const mesh = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();
  const texture = useStarTexture();

  // Particle state: position (x,y,z), velocity (vx,vy,vz), life/phase components
  const particles = useMemo(() => {
    const data = new Float32Array(count * 8); // x, y, z, vx, vy, vz, size, phase
    for (let i = 0; i < count; i++) {
      const i8 = i * 8;
      data[i8] = (Math.random() - 0.5) * 60;     // x
      data[i8 + 1] = (Math.random() - 0.5) * 40; // y
      data[i8 + 2] = (Math.random() - 0.5) * 20; // z

      data[i8 + 3] = (Math.random() - 0.5) * 0.05; // vx
      data[i8 + 4] = (Math.random() - 0.5) * 0.05; // vy
      data[i8 + 5] = 0; // vz

      data[i8 + 6] = Math.random(); // random size factor (0-1)
      data[i8 + 7] = Math.random() * Math.PI * 2; // phase for blinking
    }
    return data;
  }, [count]);

  const colors = useMemo(() => {
    const data = new Float32Array(count * 3);
    const c1 = new THREE.Color("#e0f2fe"); // Very light blue (star-like)
    const c2 = new THREE.Color("#ffffff"); // White
    const c3 = new THREE.Color("#7dd3fc"); // Light Sky

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random();
      let c;
      if (r < 0.6) c = c1;
      else if (r < 0.9) c = c2;
      else c = c3;

      data[i3] = c.r;
      data[i3 + 1] = c.g;
      data[i3 + 2] = c.b;
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Mouse target in world space
    const targetX = mouse.x * viewport.width / 2;
    const targetY = mouse.y * viewport.height / 2;
    const time = state.clock.getElapsedTime();

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const sizes = mesh.current.geometry.attributes.size.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i8 = i * 8;
      const i3 = i * 3; // buffer geometry index for position (only 3 floats)

      let x = particles[i8];
      let y = particles[i8 + 1];
      let z = particles[i8 + 2];
      let vx = particles[i8 + 3];
      let vy = particles[i8 + 4];
      let vz = particles[i8 + 5];

      const sizeBase = particles[i8 + 6];
      const phase = particles[i8 + 7];

      // 1. Noise / Flow Field (Simulated)
      const flowX = Math.sin(y * 0.05 + time * 0.2) * 0.005;
      const flowY = Math.cos(x * 0.05 + time * 0.2) * 0.005;

      vx += flowX * 0.5;
      vy += flowY * 0.5;

      // 2. Strong Mouse Interaction
      const dx = targetX - x;
      const dy = targetY - y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      if (dist < 10) {
        const force = (10 - dist) / 10;
        // Strong wake effect
        vx += -(dy / dist) * force * 0.1;
        vy += (dx / dist) * force * 0.1;
        vx += (dx / dist) * force * 0.05; // slight push out
        vy += (dy / dist) * force * 0.05;
      }

      // 3. Friction
      vx *= 0.95;
      vy *= 0.95;
      vz *= 0.95;

      // 4. Update Position
      x += vx;
      y += vy;
      z += vz;

      // 5. Wrap around
      const width = viewport.width / 2 + 5;
      const height = viewport.height / 2 + 5;

      if (x > width) x = -width;
      if (x < -width) x = width;
      if (y > height) y = -height;
      if (y < -height) y = height;

      // Save back
      particles[i8] = x;
      particles[i8 + 1] = y;
      particles[i8 + 2] = z;
      particles[i8 + 3] = vx;
      particles[i8 + 4] = vy;
      particles[i8 + 5] = vz;

      // Update Position Buffer
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // 6. Twinkle Effect (update local size)
      // Twinkle speed depends on phase + time.
      // Near mouse -> brighter/bigger?
      let s = sizeBase;
      const twinkle = Math.sin(time * 3 + phase);
      s = s * (0.8 + 0.5 * twinkle); // Base twinkle

      if (dist < 8) {
        s *= 1.5 + (8 - dist) / 8; // Enlarge near mouse
      }

      sizes[i] = s * 0.6; // Scale down global size factor
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={colors.length / 3}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={new Float32Array(count)}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent={true}
        vertexColors={true}
        uniforms={{
          time: { value: 0 },
          pointTexture: { value: texture }
        }}
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z); // Size attenuation
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
            gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          }
        `}
      />
    </points>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-slate-50 overflow-hidden">
      {/* Enhanced Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-200/30 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/20 blur-[130px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-blue-100/30 blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
        <MagicParticles count={1500} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-50/90 pointer-events-none"></div>
    </div>
  );
};

export default ThreeBackground;