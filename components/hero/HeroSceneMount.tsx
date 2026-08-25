'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// The only reference to the three/R3F chunk — loaded lazily, client-only.
// No loading component: the CSS poster fallback is already underneath.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const IDLE_TIMEOUT_MS = 1500;
const SETTIMEOUT_FALLBACK_MS = 800;

type MountStatus = 'idle' | 'ready' | 'dead';

function supportsWebgl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Gate for the 3D hero: mounts the lazy R3F scene only when the user accepts
 * motion, WebGL is available, and the main thread has gone idle. On WebGL
 * context loss the canvas layer unmounts permanently and the CSS poster
 * underneath takes over.
 */
export default function HeroSceneMount() {
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<MountStatus>('idle');

  useEffect(() => {
    if (status !== 'idle' || reducedMotion) return;
    if (!supportsWebgl()) return;

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setStatus('ready'), {
        timeout: IDLE_TIMEOUT_MS,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setStatus('ready'), SETTIMEOUT_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [status, reducedMotion]);

  const handleContextLost = useCallback(() => setStatus('dead'), []);

  if (status !== 'ready' || reducedMotion) return null;

  return (
    <div className="hero-scene-canvas">
      <HeroScene onContextLost={handleContextLost} />
    </div>
  );
}
