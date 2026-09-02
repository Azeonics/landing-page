'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { Box, Line, Sphere, Stars } from '@react-three/drei';
import { AdditiveBlending, BackSide } from 'three';
import type { Group } from 'three';
import { gsapReady } from '@/lib/animation';

interface HeroSceneProps {
  /** Fired once when the WebGL context is lost — the mount swaps back to the CSS poster. */
  onContextLost?: () => void;
}

const EARTH_POS: [number, number, number] = [1.4, -1.1, 0];
const EARTH_RADIUS = 1.9;
const ORBIT_RADIUS = 2.6;
const ORBIT_INCLINATION = (28 * Math.PI) / 180;
const ORBIT_SPEED = 0.25; // rad/s
const EARTH_SPIN_SPEED = 0.02; // rad/s
const CITY_LIGHT_COUNT = 400;
const ORBIT_SEGMENTS = 128;

/** Small screens cap the canvas DPR lower — fewer fragments on phone GPUs. */
const SMALL_SCREEN_QUERY = '(max-width: 720px)';
const DPR_RANGE_DEFAULT: [number, number] = [1, 1.75];
const DPR_RANGE_SMALL: [number, number] = [1, 1.5];

const CAMERA_BASE_Z = 4.2;
const CAMERA_BASE_Y = 0.4;
const SCROLL_DOLLY_Z = 0.9;
const SCROLL_RISE_Y = 0.5;
const SCROLL_SPIN_OFFSET = 0.35;

const TEAL = '#0197BA';
const TEAL_BRIGHT = '#00C2EA';
const EARTH_NAVY = '#06183B';
const ICE_WHITE = '#EAF2FF';
const KEY_LIGHT_TINT = '#CFE4FF';

const COS_I = Math.cos(ORBIT_INCLINATION);
const SIN_I = Math.sin(ORBIT_INCLINATION);

/** Point on the inclined circular orbit at parameter t (radians), local to the Earth group. */
function orbitPoint(t: number): [number, number, number] {
  return [
    ORBIT_RADIUS * Math.cos(t),
    ORBIT_RADIUS * Math.sin(t) * SIN_I,
    ORBIT_RADIUS * Math.sin(t) * COS_I,
  ];
}

/** ~400 teal shimmer points on the sphere surface, biased toward a mid-latitude band. */
function buildCityLights(): Float32Array {
  const positions = new Float32Array(CITY_LIGHT_COUNT * 3);
  for (let i = 0; i < CITY_LIGHT_COUNT; i += 1) {
    // Latitude clamped to ±~54° so the points read as populated bands, not poles.
    const lat = (Math.random() - 0.5) * Math.PI * 0.6;
    const lon = Math.random() * Math.PI * 2;
    const r = EARTH_RADIUS * 1.004;
    positions[i * 3] = r * Math.cos(lat) * Math.cos(lon);
    positions[i * 3 + 1] = r * Math.sin(lat);
    positions[i * 3 + 2] = r * Math.cos(lat) * Math.sin(lon);
  }
  return positions;
}

function SceneRig() {
  const earthRef = useRef<Group>(null);
  const satelliteRef = useRef<Group>(null);
  const spinRef = useRef(0);
  const scrollRef = useRef({ p: 0 });

  const cityLightPositions = useMemo(() => buildCityLights(), []);

  const orbitPath = useMemo<[number, number, number][]>(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i <= ORBIT_SEGMENTS; i += 1) {
      points.push(orbitPoint((i / ORBIT_SEGMENTS) * Math.PI * 2));
    }
    return points;
  }, []);

  useEffect(() => {
    const gsap = gsapReady();
    const tween = gsap.to(scrollRef.current, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-stage',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useFrame((state, delta) => {
    const p = scrollRef.current.p;

    // Scroll choreography: gentle dolly-in + rise as the stage scrolls away.
    state.camera.position.z = CAMERA_BASE_Z - SCROLL_DOLLY_Z * p;
    state.camera.position.y = CAMERA_BASE_Y + SCROLL_RISE_Y * p;

    // Slow continuous spin + scroll-driven extra rotation.
    spinRef.current += delta * EARTH_SPIN_SPEED;
    if (earthRef.current) {
      earthRef.current.rotation.y = spinRef.current + SCROLL_SPIN_OFFSET * p;
    }

    // Parametric inclined orbit, satellite nose along the velocity vector.
    const t = state.clock.elapsedTime * ORBIT_SPEED;
    const [x, y, z] = orbitPoint(t);
    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, y, z);
      satelliteRef.current.lookAt(
        EARTH_POS[0] + x - Math.sin(t),
        EARTH_POS[1] + y + Math.cos(t) * SIN_I,
        EARTH_POS[2] + z + Math.cos(t) * COS_I,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-3, 2, 2]} intensity={1.4} color={KEY_LIGHT_TINT} />

      <Stars radius={60} depth={30} count={3000} factor={3} saturation={0} fade speed={0.4} />

      <group position={EARTH_POS}>
        {/* Earth body + city-light shimmer rotate together. */}
        <group ref={earthRef}>
          <Sphere args={[EARTH_RADIUS, 64, 64]}>
            <meshStandardMaterial color={EARTH_NAVY} roughness={0.9} metalness={0.1} />
          </Sphere>
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[cityLightPositions, 3]} />
            </bufferGeometry>
            <pointsMaterial
              color={TEAL_BRIGHT}
              size={0.012}
              transparent
              opacity={0.5}
              blending={AdditiveBlending}
              depthWrite={false}
              sizeAttenuation
            />
          </points>
        </group>

        {/* Atmosphere glow + outer halo falloff (BackSide additive shells). */}
        <Sphere args={[EARTH_RADIUS * 1.035, 64, 64]}>
          <meshBasicMaterial
            color={TEAL_BRIGHT}
            transparent
            opacity={0.22}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>
        <Sphere args={[EARTH_RADIUS * 1.08, 64, 64]}>
          <meshBasicMaterial
            color={TEAL}
            transparent
            opacity={0.07}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </Sphere>

        <Line points={orbitPath} color={TEAL_BRIGHT} lineWidth={1} transparent opacity={0.35} />

        <group ref={satelliteRef}>
          <Box args={[0.07, 0.05, 0.05]}>
            <meshStandardMaterial
              color={ICE_WHITE}
              emissive={ICE_WHITE}
              emissiveIntensity={0.35}
              roughness={0.4}
              metalness={0.3}
            />
          </Box>
          <Box args={[0.16, 0.008, 0.06]} position={[0.155, 0, 0]}>
            <meshStandardMaterial color={TEAL} metalness={0.8} roughness={0.35} />
          </Box>
          <Box args={[0.16, 0.008, 0.06]} position={[-0.155, 0, 0]}>
            <meshStandardMaterial color={TEAL} metalness={0.8} roughness={0.35} />
          </Box>
        </group>
      </group>
    </>
  );
}

export default function HeroScene({ onContextLost }: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Read once at mount: phones don't cross the 720px boundary, so no
  // resize/matchMedia listener churn for a value that never changes.
  const [dprRange] = useState<[number, number]>(() =>
    typeof window !== 'undefined' && window.matchMedia(SMALL_SCREEN_QUERY).matches
      ? DPR_RANGE_SMALL
      : DPR_RANGE_DEFAULT,
  );

  // Pause the frameloop entirely while the hero is scrolled out of view.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      setIsInView(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleCreated = (state: RootState) => {
    state.gl.domElement.addEventListener(
      'webglcontextlost',
      (event) => {
        event.preventDefault();
        onContextLost?.();
      },
      { once: true },
    );
  };

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={dprRange}
        camera={{ position: [0, CAMERA_BASE_Y, CAMERA_BASE_Z], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
        frameloop={isInView ? 'always' : 'never'}
        onCreated={handleCreated}
      >
        <SceneRig />
      </Canvas>
    </div>
  );
}
