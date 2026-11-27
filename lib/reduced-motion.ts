/**
 * One-shot match-media check for event handlers and one-time setup —
 * not reactive. For React-rendered motion use useReducedMotion() (framer)
 * instead. Kept framer-free so plain-client modules don't pull the library.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
