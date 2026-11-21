import { useReducedMotion } from "framer-motion";

/** Strong ease-out for entrances/UI response — mirrors --ease-out in globals.css. */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.23, 1, 0.32, 1,
];

/**
 * One-shot match-media check for event handlers and one-time setup —
 * not reactive. For React-rendered motion use useReducedMotion() instead.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full `transform` strings are hardware-accelerated (unlike framer's
 * x/y/scale shorthands), but MotionConfig's reducedMotion="user" only
 * intercepts the shorthands — route literal transforms through here so
 * reduced-motion users get opacity-only animation.
 */
export function useEnterTransform(transform: string): string | undefined {
  return useReducedMotion() ? undefined : transform;
}
