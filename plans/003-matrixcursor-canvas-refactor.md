# Plan 003: Refactor MatrixCursor to use canvas instead of React state for animation loop

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 843d2c8..HEAD -- components/MatrixCursor/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED — visual effect is preserved but the implementation approach changes entirely
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `843d2c8`, 2026-07-28

## Why this matters

The MatrixCursor component creates a new React state entry on every mousemove (throttled to every 16ms) and runs a 20ms setInterval that re-maps and filters the entire trail array. This causes continuous React reconciliation and repaints on every desktop page. On lower-powered machines, even the throttled state updates cause scroll jank and CPU spikes. After this refactor, the cursor trail renders directly on a canvas element using requestAnimationFrame — zero React state updates for the trail, zero unnecessary re-renders. The visual output (green characters fading out behind the cursor) looks identical.

## Current state

File: `components/MatrixCursor/MatrixCursor.tsx` (119 lines)

The component uses React state for the cursor trail:
```tsx
// Line 22
const [trail, setTrail] = useState<Point[]>([]);

// Lines 50-64 — Every mousemove pushes a new Point to state (throttled to 16ms)
const updatePosition = useThrottledCallback((e: MouseEvent) => {
    const newPoint = { x: e.clientX, y: e.clientY, id: Date.now(), char: getRandomChar(), initialOpacity: 1 };
    setTrail((prevTrail) => [newPoint, ...prevTrail.slice(0, TRAIL_LENGTH - 1)]);
}, THROTTLE_MS);

// Lines 73-90 — 20ms interval filters trail by opacity (another state update)
useEffect(() => {
    const timer = setInterval(() => {
        setTrail((prevTrail) => prevTrail.map(...).filter(...));
    }, FADE_INTERVAL);
}, [isEnabled]);

// Lines 95-117 — Renders DOM elements for each trail point
{trail.map((point, index) => (
    <div key={point.id} style={{ left, top, opacity, fontSize, filter, textShadow, transform }}>
        {point.char}
    </div>
))}
```

Trail is artificially limited to 30 points and opacity fades over 20ms steps. Despite `TRAIL_LENGTH=30` and throttling, this still creates a DOM update + reconciliation on every frame.

The component is already loaded dynamically with `ssr: false` in `app/layout.tsx:15-20`, so the component itself is lazy — but once loaded, the performance cost is constant.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/MatrixCursor/MatrixCursor.tsx` — rewrite rendering to use canvas

**Out of scope** (do NOT touch):
- `app/layout.tsx` — dynamic import is fine
- `components/MatrixCursor/DecodeText.tsx` — separate component, handled in Plan 005
- `app/globals.css` — no CSS changes needed for canvas
- Any other component or page

## Git workflow

- Branch: `advisor/003-matrixcursor-canvas-refactor`
- Commit per step
- Do NOT push or open a PR unless instructed

## Steps

### Step 1: Read and understand the current file

Read the existing component to understand the constants, behavior, and edge cases:

```bash
cat -n components/MatrixCursor/MatrixCursor.tsx
```

Note especially:
- Mobile/touch detection (lines 39–48) — preserves `isEnabled` logic
- The `TRAIL_LENGTH`, `FADE_INTERVAL`, `THROTTLE_MS`, `TRAIL_OPACITY_STEP` constants
- How `matrixChars` and `getRandomChar` work

### Step 2: Rewrite the component to use canvas rendering

Replace the entire content of `components/MatrixCursor/MatrixCursor.tsx` with a canvas-based implementation. The key principle: store trail data in a **ref** (not state), and render via **requestAnimationFrame** (not setInterval/setState).

Write this file:

```tsx
"use client";

import React, { useRef, useEffect, useCallback } from "react";

const TRAIL_LENGTH = 30;
const FADE_INTERVAL_MS = 20;
const THROTTLE_MS = 16;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 22;
const TRAIL_OPACITY_STEP = 0.04;

interface Point {
  x: number;
  y: number;
  char: string;
  opacity: number;
}

export default function MatrixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Point[]>([]);
  const isEnabledRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastFadeTimeRef = useRef(0);

  const matrixChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";

  const getRandomChar = useCallback(
    () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
    [matrixChars]
  );

  // Detect mobile/touch devices — same as before
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    isEnabledRef.current = !isTouchDevice && !isMobile;
  }, []);

  // Mouse move handler — writes to ref (no state update)
  useEffect(() => {
    if (!isEnabledRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTimeRef.current < THROTTLE_MS) return;
      lastMoveTimeRef.current = now;

      const trail = trailRef.current;
      trail.unshift({
        x: e.clientX,
        y: e.clientY,
        char: getRandomChar(),
        opacity: 1,
      });
      if (trail.length > TRAIL_LENGTH) {
        trail.length = TRAIL_LENGTH;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [getRandomChar]);

  // Animation loop — renders to canvas via requestAnimationFrame
  useEffect(() => {
    if (!isEnabledRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Fade trail points at a controlled interval
      if (timestamp - lastFadeTimeRef.current >= FADE_INTERVAL_MS) {
        lastFadeTimeRef.current = timestamp;
        const trail = trailRef.current;
        for (let i = trail.length - 1; i >= 0; i--) {
          trail[i].opacity -= TRAIL_OPACITY_STEP;
          if (trail[i].opacity <= 0) {
            trail.splice(i, 1);
          }
        }
      }

      // Clear canvas (semi-transparent for motion blur effect)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      ctx.font = `${MAX_FONT_SIZE}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < trailRef.current.length; i++) {
        const p = trailRef.current[i];
        const t = 1 - i / TRAIL_LENGTH; // 1 = newest, 0 = oldest
        const opacity = p.opacity * t;
        if (opacity <= 0) continue;

        const fontSize = Math.max(
          MIN_FONT_SIZE,
          MAX_FONT_SIZE - i * 0.2
        );
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = `rgba(34, 197, 94, ${opacity})`;
        ctx.shadowColor = "rgba(34, 197, 94, 0.5)";
        ctx.shadowBlur = 5;
        ctx.fillText(p.char, p.x, p.y);
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  if (typeof window !== "undefined") {
    // We use the isEnabledRef pattern to avoid rendering on mobile
    // The canvas is always mounted but only starts animating if enabled
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
```

Write this exact content to `components/MatrixCursor/MatrixCursor.tsx`.

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0, no errors.

### Step 3: Check lint

```bash
npm run lint
```
Expected: exit 0. If there are lint warnings about unused variables (`isEnabledRef` pattern), suppress them only if necessary — the ref is used for the condition check, but the canvas is always mounted.

### Step 4: Verify visual behavior

```bash
npm run dev
```

Open `http://localhost:3000` on a desktop browser. Confirm:
- Moving the mouse shows green character trail (same as before)
- Characters fade out as they age (same as before)
- The trail length is limited (same as before)
- On mobile or touch devices, nothing renders (check by resizing to mobile width)
- No console errors

While the page is open, check the Performance tab in DevTools to confirm no React state updates are happening on mousemove.

Kill the dev server when done.

### Step 5: Final build verification

```bash
npm run build
```
Expected: exit 0, successful build.

## Test plan

No automated tests exist for this component. Manual verification:
- Desktop: cursor trail renders and fades correctly
- Mobile viewport (Chrome DevTools device mode): no canvas trail renders
- Build succeeds with no type errors

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] On `npm run dev`, moving the mouse on desktop shows the green character trail
- [ ] On `npm run dev` with mobile viewport, no trail renders
- [ ] Performance tab in DevTools shows zero React state changes on mousemove
- [ ] No files outside `components/MatrixCursor/MatrixCursor.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The component has been significantly refactored since this plan was written (check drift)
- The visual output of the canvas trail looks significantly different from the DOM-based trail (it should look very close; minor differences in glow/shadow are acceptable, but the general character-trail-fading effect must be preserved)
- `npm run build` fails
- The canvas does not resize properly on window resize (the resize handler should handle this)
- The component causes console errors on desktop mouse movement

## Maintenance notes

- The canvas is now a semi-transparent overlay; it does not block pointer events (via `pointer-events-none`).
- Future changes to the trail effect (color, speed, length) are adjusted via the constants at the top and the render loop.
- No React state is used for the trail animation, so it won't cause re-renders of the React tree.
- The `getRandomChar` memoization is no longer critical (no re-renders), but is kept for consistency.
- If browser `window.innerWidth`/`innerHeight` behavior changes or the layout moves to a sub-canvas, the resize handler should be updated.
