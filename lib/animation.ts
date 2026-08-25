'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
export function gsapReady() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export const EASE = { out: 'expo.out', cinematic: 'power4.inOut' } as const;
export const DUR = { fast: 0.4, normal: 0.8, slow: 1.4 } as const;
