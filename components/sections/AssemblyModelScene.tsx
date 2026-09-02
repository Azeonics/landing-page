'use client';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useGLTF } from '@react-three/drei';
import { Box3, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';

// EXPERIMENTAL — not wired in yet. To enable: copy models-src/mcs1.glb to
// public/models/mcs1.glb and swap this scene into CapabilityAssembly.
const MODEL_URL = '/models/mcs1.glb';

interface AssemblyModelSceneProps {
  /** Scroll progress 0..1 written by the pinned ScrollTrigger — read every frame. */
  progressRef: React.MutableRefObject<number>;
  /** Fired once when the WebGL context is lost — parent swaps to the static variant. */
  onContextLost?: () => void;
}

const TEAL = '#0197BA';
const KEY_LIGHT_TINT = '#CFE4FF';

/** Assembly runs over p ∈ [0, ASSEMBLED]; the last stage is the flight-ready spin. */
const ASSEMBLED = 5 / 6;
const QUAL_S = 3 / 6;
const QUAL_E = 4 / 6;
/** How far parts sit from their seat at p = 0, in normalized model units. */
const PART_SPAN = 0.22;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

type PartAnim = {
  mesh: Mesh;
  basePos: Vector3;
  /** Unit direction the part retreats along when exploded. */
  dir: Vector3;
  /** Window start within [0, 1] of the assembly span. */
  start: number;
};

function Rig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  // Third arg enables drei's built-in meshopt decoder (EXT_meshopt_compression).
  const { scene } = useGLTF(MODEL_URL, false, true);
  const groupRef = useRef<Group>(null);

  /**
   * Normalize the CAD model (millimetre units, arbitrary origin) and build the
   * per-part assembly order: core parts seat first, outer parts follow, each
   * with its own staggered window — coordinated complexity from one rule.
   */
  const { parts, explodeDist } = useMemo<{ parts: PartAnim[]; explodeDist: number }>(() => {
    // drei caches the parsed scene, and React StrictMode double-invokes memos:
    // normalizing twice would re-measure the already-scaled scene and undo the
    // scale. Cache the whole computation on the scene itself — idempotent.
    if (scene.userData.__assembly) return scene.userData.__assembly;

    // Gather all part centroids first — CAD exports often carry stray
    // reference geometry far from the assembly, so raw scene bounds are
    // unusable for framing. Use the median centroid + a robust radius.
    // World-space centroids: quantized GLBs bake dequantization into node
    // transforms, so geometry-space bounding boxes all sit near the origin.
    scene.updateMatrixWorld(true);
    const meshes: { mesh: Mesh; centroid: Vector3; dist: number }[] = [];
    scene.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        const centroid = new Box3().setFromObject(mesh).getCenter(new Vector3());
        meshes.push({ mesh, centroid, dist: 0 });
        const mat = mesh.material as MeshStandardMaterial;
        if (mat) {
          mat.metalness = 0.6;
          mat.roughness = 0.42;
        }
      }
    });

    const median = (values: number[]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)] ?? 0;
    };
    const center = new Vector3(
      median(meshes.map((m) => m.centroid.x)),
      median(meshes.map((m) => m.centroid.y)),
      median(meshes.map((m) => m.centroid.z)),
    );
    meshes.forEach((m) => {
      m.dist = m.centroid.distanceTo(center);
    });
    meshes.sort((a, b) => a.dist - b.dist);
    // Robust radius: 92nd-percentile part distance — outliers don't inflate it.
    const p92 = meshes[Math.floor((meshes.length - 1) * 0.92)]?.dist ?? 1;
    const maxDim = Math.max(p92 * 2, 1);
    const scale = 3.5 / maxDim;
    // Recenter in WORLD space: the position offset must be scaled, because the
    // scene's own scale does not apply to its own position.
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    scene.scale.setScalar(scale);

    const n = meshes.length;
    const built = meshes.map((entry, i) => {
      const dir = entry.centroid.clone().sub(center);
      if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
      dir.normalize();
      // Core-outward stagger: part i owns [start, start + PART_SPAN] of the span.
      const start = (i / Math.max(n - 1, 1)) * (1 - PART_SPAN);
      return { mesh: entry.mesh, basePos: entry.mesh.position.clone(), dir, start };
    });
    const computed = { parts: built, explodeDist: maxDim * 1.0 };
    scene.userData.__assembly = computed;
    return computed;
  }, [scene]);

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    // Assembly span: 0 at p=0 → 1 at p=ASSEMBLED.
    const span = clamp01(p / ASSEMBLED);

    for (const part of parts) {
      const k = smooth((span - part.start) / PART_SPAN);
      const d = explodeDist * (1 - k);
      part.mesh.position.set(
        part.basePos.x + part.dir.x * d,
        part.basePos.y + part.dir.y * d,
        part.basePos.z + part.dir.z * d,
      );
      const mat = part.mesh.material as MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.12 + 0.88 * k;
        // Transparency only while fading — 469 transparent materials would
        // wreck depth sorting and fill-rate once assembled.
        mat.transparent = k < 0.999;
      }
    }

    // Qualification window: the whole assembly vibrates, enveloped to zero outside it.
    const qualT = smooth((p - QUAL_S) / (QUAL_E - QUAL_S));
    const envelope = Math.sin(clamp01(qualT) * Math.PI);
    const finalT = smooth((p - ASSEMBLED) / (1 - ASSEMBLED));

    group.position.x = Math.sin(t * 43) * 0.03 * envelope;
    group.position.y = Math.cos(t * 57) * 0.022 * envelope + Math.sin(t * 1.2) * 0.06 * finalT;
    group.rotation.y = -0.8 + p * 1.9 + finalT * t * 0.16;
    group.rotation.x = 0.32 - finalT * 0.1;
    const s = 1 - finalT * 0.12;
    group.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * The pinned "watch it come together" canvas: the real MCS-1 CAD model
 * (469 parts, meshopt-compressed GLB) self-assembles core-outward as the
 * user scrolls — every part staggered on one rule, fully seek-safe.
 */
export default function AssemblyModelScene({ progressRef, onContextLost }: AssemblyModelSceneProps) {
  const dpr = useMemo<[number, number]>(
    () => (typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches ? [1, 1.5] : [1, 1.75]),
    [],
  );
  const lostRef = useRef(false);

  useEffect(() => {
    useGLTF.preload(MODEL_URL, false, true);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.3, 0.55, 9.2], fov: 38 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          if (!lostRef.current) {
            lostRef.current = true;
            onContextLost?.();
          }
        });
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 7, 5]} intensity={1.6} color={KEY_LIGHT_TINT} />
      <directionalLight position={[-6, -3, -4]} intensity={0.5} color={TEAL} />
      <pointLight position={[-4, 2, 5]} intensity={30} color={TEAL} />
      <Stars radius={40} depth={18} count={650} factor={2.4} saturation={0} fade speed={0.4} />
      <Suspense fallback={null}>
        <Rig progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
