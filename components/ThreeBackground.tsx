import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Generate an enhanced magical texture with glow
const useMagicTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      // Draw multiple gradient layers for enhanced glow
      const centerX = 64;
      const centerY = 64;
      
      // Outer glow
      const outerGlow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 64);
      outerGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      outerGlow.addColorStop(0.2, 'rgba(200, 230, 255, 0.8)');
      outerGlow.addColorStop(0.4, 'rgba(150, 200, 255, 0.4)');
      outerGlow.addColorStop(0.7, 'rgba(100, 150, 255, 0.1)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = outerGlow;
      context.fillRect(0, 0, 128, 128);

      // Add sparkle effect
      context.save();
      context.translate(centerX, centerY);
      for (let i = 0; i < 4; i++) {
        context.rotate(Math.PI / 4);
        context.beginPath();
        context.moveTo(0, -50);
        context.lineTo(0, -10);
        const sparkGrad = context.createLinearGradient(0, -50, 0, -10);
        sparkGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sparkGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
        sparkGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.strokeStyle = sparkGrad;
        context.lineWidth = 2;
        context.stroke();
      }
      context.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
};

const MagicParticles = ({ count = 2000 }) => {
  const mesh = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();
  const texture = useMagicTexture();
  
  // Track mouse trail for magical effects
  const mouseTrail = useRef<Array<{x: number, y: number, time: number}>>([]);
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0, time: 0 });

  // Particle state: position (x,y,z), velocity (vx,vy,vz), size, phase, hue, life
  const particles = useMemo(() => {
    const data = new Float32Array(count * 10); // Extended to 10 components
    for (let i = 0; i < count; i++) {
      const i10 = i * 10;
      data[i10] = (Math.random() - 0.5) * 60;     // x
      data[i10 + 1] = (Math.random() - 0.5) * 40; // y
      data[i10 + 2] = (Math.random() - 0.5) * 20; // z

      data[i10 + 3] = (Math.random() - 0.5) * 0.05; // vx
      data[i10 + 4] = (Math.random() - 0.5) * 0.05; // vy
      data[i10 + 5] = 0; // vz

      data[i10 + 6] = Math.random() * 1.5 + 0.5; // random size factor (0.5-2)
      data[i10 + 7] = Math.random() * Math.PI * 2; // phase for effects
      data[i10 + 8] = Math.random() * 360; // hue for rainbow colors
      data[i10 + 9] = 1.0; // life/energy (0-1)
    }
    return data;
  }, [count]);

  const colors = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i10 = i * 10;
      const hue = particles[i10 + 8];
      const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.7);
      
      data[i3] = color.r;
      data[i3 + 1] = color.g;
      data[i3 + 2] = color.b;
    }
    return data;
  }, [count, particles]);

  useFrame((state) => {
    if (!mesh.current) return;

    // Mouse target in world space
    const targetX = mouse.x * viewport.width / 2;
    const targetY = mouse.y * viewport.height / 2;
    const time = state.clock.getElapsedTime();

    // Update mouse velocity and trail
    const currentTime = Date.now();
    const deltaTime = currentTime - lastMouse.current.time;
    if (deltaTime > 0) {
      const vx = (targetX - lastMouse.current.x) / deltaTime * 1000;
      const vy = (targetY - lastMouse.current.y) / deltaTime * 1000;
      setMouseVelocity({ x: vx, y: vy });
      
      // Add to trail
      mouseTrail.current.push({ x: targetX, y: targetY, time: currentTime });
      // Keep only recent trail (last 500ms)
      mouseTrail.current = mouseTrail.current.filter(p => currentTime - p.time < 500);
    }
    lastMouse.current = { x: targetX, y: targetY, time: currentTime };

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const sizes = mesh.current.geometry.attributes.size.array as Float32Array;
    const colorAttr = mesh.current.geometry.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i10 = i * 10;
      const i3 = i * 3;

      let x = particles[i10];
      let y = particles[i10 + 1];
      let z = particles[i10 + 2];
      let vx = particles[i10 + 3];
      let vy = particles[i10 + 4];
      let vz = particles[i10 + 5];

      const sizeBase = particles[i10 + 6];
      const phase = particles[i10 + 7];
      let hue = particles[i10 + 8];
      let life = particles[i10 + 9];

      // 1. Enhanced Flow Field with more variation
      const flowX = Math.sin(y * 0.08 + time * 0.3) * 0.008 + Math.cos(z * 0.1 + time * 0.2) * 0.006;
      const flowY = Math.cos(x * 0.08 + time * 0.3) * 0.008 + Math.sin(z * 0.1 + time * 0.2) * 0.006;
      const flowZ = Math.sin(x * 0.05 + y * 0.05 + time * 0.25) * 0.002;

      vx += flowX * 0.6;
      vy += flowY * 0.6;
      vz += flowZ * 0.3;

      // 2. Enhanced Mouse Interaction with vortex effect
      const dx = targetX - x;
      const dy = targetY - y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Larger interaction radius
      const interactionRadius = 15;
      
      if (dist < interactionRadius && dist > 0.1) {
        const force = (interactionRadius - dist) / interactionRadius;
        const angle = Math.atan2(dy, dx);
        
        // Vortex rotation around mouse
        const rotationSpeed = force * 0.15;
        const vortexAngle = angle + Math.PI / 2;
        vx += Math.cos(vortexAngle) * rotationSpeed;
        vy += Math.sin(vortexAngle) * rotationSpeed;
        
        // Attraction/repulsion based on mouse velocity
        const mouseSpeed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
        const attractionForce = force * 0.08 * (1 + mouseSpeed * 0.01);
        vx += (dx / dist) * attractionForce;
        vy += (dy / dist) * attractionForce;
        
        // Wake effect from mouse trail
        if (mouseSpeed > 5) {
          const perpAngle = angle + Math.PI / 2;
          vx += Math.cos(perpAngle) * force * mouseSpeed * 0.002;
          vy += Math.sin(perpAngle) * force * mouseSpeed * 0.002;
        }
        
        // Increase particle energy near mouse
        life = Math.min(1.0, life + force * 0.05);
        
        // Rainbow color shift near mouse
        hue = (hue + force * 10 * (mouseSpeed * 0.1 + 1)) % 360;
      } else {
        // Gradual energy decay when far from mouse
        life *= 0.995;
        if (life < 0.3) life = 0.3; // Minimum energy
      }

      // 3. Trail interaction - particles follow mouse trail
      for (const trailPoint of mouseTrail.current) {
        const tdx = trailPoint.x - x;
        const tdy = trailPoint.y - y;
        const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
        const trailAge = (currentTime - trailPoint.time) / 500;
        
        if (tdist < 8 && tdist > 0.1) {
          const trailForce = (1 - trailAge) * 0.03;
          vx += (tdx / tdist) * trailForce;
          vy += (tdy / tdist) * trailForce;
        }
      }

      // 4. Reduced Friction for smoother movement
      vx *= 0.96;
      vy *= 0.96;
      vz *= 0.96;

      // 5. Update Position
      x += vx;
      y += vy;
      z += vz;

      // 6. Wrap around with smooth transitions
      const width = viewport.width / 2 + 8;
      const height = viewport.height / 2 + 8;

      if (x > width) x = -width;
      if (x < -width) x = width;
      if (y > height) y = -height;
      if (y < -height) y = height;
      if (z > 10) z = -10;
      if (z < -10) z = 10;

      // Save back
      particles[i10] = x;
      particles[i10 + 1] = y;
      particles[i10 + 2] = z;
      particles[i10 + 3] = vx;
      particles[i10 + 4] = vy;
      particles[i10 + 5] = vz;
      particles[i10 + 8] = hue;
      particles[i10 + 9] = life;

      // Update Position Buffer
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // 7. Enhanced size and color effects
      let s = sizeBase;
      
      // Pulsing/twinkling effect
      const twinkle = Math.sin(time * 4 + phase) * 0.5 + 0.5;
      s = s * (0.6 + 0.8 * twinkle * life);
      
      // Size based on proximity to mouse
      if (dist < interactionRadius) {
        const sizeMult = 1 + (interactionRadius - dist) / interactionRadius * 1.5;
        s *= sizeMult;
      }

      // Size variation by depth
      s *= 1 + (z / 20) * 0.3;

      sizes[i] = s * 0.8;

      // Update color with rainbow effect
      const color = new THREE.Color().setHSL(hue / 360, 0.7 + life * 0.2, 0.5 + life * 0.3);
      colorAttr[i3] = color.r;
      colorAttr[i3 + 1] = color.g;
      colorAttr[i3 + 2] = color.b;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
    mesh.current.geometry.attributes.color.needsUpdate = true;
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
          varying float vAlpha;
          void main() {
            vColor = color;
            // Enhanced alpha based on color brightness
            vAlpha = (color.r + color.g + color.b) / 3.0;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            // Enhanced glow effect
            vec3 finalColor = vColor * (1.0 + vAlpha * 0.5);
            gl_FragColor = vec4(finalColor, texColor.a * vAlpha);
          }
        `}
      />
    </points>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-slate-50 overflow-hidden">
      {/* Enhanced Gradient Blobs with more colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-200/30 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/20 blur-[130px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-blue-100/30 blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-[50%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-purple-100/20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
      <div className="absolute bottom-[30%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-pink-100/15 blur-[140px] animate-pulse-slow" style={{ animationDelay: '8s' }}></div>

      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
        <MagicParticles count={2500} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-50/90 pointer-events-none"></div>
    </div>
  );
};

export default ThreeBackground;