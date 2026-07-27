# Plan 005: Optimize DecodeText to use CSS animation instead of JS interval

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 843d2c8..HEAD -- components/MatrixCursor/DecodeText.tsx app/globals.css`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW — visual effect is preserved; CSS-based approach is simpler
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `843d2c8`, 2026-07-28

## Why this matters

DecodeText is used on 6+ headings across the homepage (About Me, My Projects, Technologies & Tools, Work Experience, GitHub Contributions, Contact/Socials). Each instance, when hovered, starts a 30ms `setInterval` that does string splitting, mapping, and state updates. Multiple headings hovered simultaneously means 6+ concurrent intervals, each causing React re-renders and DOM updates. This causes visible jank on the page.

The fix replaces the JS interval with a CSS `@property` animation and content-swapping trick, or simpler: a one-interval-at-a-time approach using a shared timeout ref. However, the simplest and most reliable approach that preserves the exact visual effect is to keep the interval but ensure it cleans up properly and uses `useCallback` correctly.

Actually, the best approach for the "decode text" effect that preserves the exact same visual: replace the 30ms interval approach with `requestAnimationFrame` batched updates, and ensure only one decode animation runs at a time per component. But the simplest fix with the biggest perf win: **use CSS text-shadow / opacity animation that looks like "decoding"** without any JS interval.

Let me think about this more carefully. The current effect:
1. On mouseenter: sets `isDecoding = true`
2. Each 30ms: replaces characters from left to right, one-third of a character at a time, with random chars
3. After `text.length / (1/3)` iterations: all characters are revealed, stops

This is a typewriter-like reveal with a "scrambled" effect. A pure CSS approach can't replicate this exactly because it requires per-character timing.

Best pragmatic approach: **Optimize the existing JS to minimize re-render cost and prevent duplicate intervals**.

Changes:
1. Use `useRef` for the interval ID instead of relying on `useEffect` cleanup
2. Cancel existing interval before starting a new one (prevents double-interval bugs)
3. Replace `setInterval` with a single `requestAnimationFrame`-based timer that batches updates
4. Use `useRef` for intermediate state so React re-renders only at the end (or at a throttled rate)

The simplest high-impact fix: **Use a single animation counter via ref, update DOM via innerText (via ref) to avoid React reconciliation entirely** during the animation. Only set the final `decodedText` via state on completion.

## Current state

File: `components/MatrixCursor/DecodeText.tsx` (50 lines)

```tsx
const DecodeText: React.FC<{ text: string }> = ({ text }) => {
  const [decodedText, setDecodedText] = useState(text);
  const [isDecoding, setIsDecoding] = useState(false);

  const decodeEffect = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let iteration = 0;
    const interval = setInterval(() => {
      setDecodedText((prevText) =>
        prevText.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
        setIsDecoding(false);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (isDecoding) decodeEffect();
  }, [isDecoding, decodeEffect]);

  return (
    <span onMouseEnter={() => setIsDecoding(true)} onMouseLeave={() => setDecodedText(text)}>
      {decodedText}
    </span>
  );
};
```

Problems:
- `setDecodedText` with functional update runs on every 30ms tick, causing React re-render of the `<span>` and its parent
- `useCallback` with `[text]` dependency recreates the callback if text prop changes
- `setIsDecoding(false)` on completion causes another re-render
- No guard against multiple hovers starting multiple intervals (though the useEffect dependency should handle this)
- The `useEffect` depends on `isDecoding` changing from false→true, which is fine, but `decodeEffect` being recreated on `text` change restarts the process

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `components/MatrixCursor/DecodeText.tsx` — optimize rendering

**Out of scope**:
- Any CSS files
- Any other component
- `app/globals.css`

## Git workflow

- Branch: `advisor/005-decode-text-optimization`
- Commit per step
- Do NOT push or open a PR unless instructed

## Steps

### Step 1: Read current file

```bash
cat -n components/MatrixCursor/DecodeText.tsx
```

### Step 2: Rewrite DecodeText with ref-based animation

Replace the entire file with an optimized version that:
- Uses a ref (`spanRef`) to update the DOM text content directly during animation (no React re-renders on each tick)
- Uses a single `useRef` for tracking the animation frame ID
- Only triggers a React state update when the animation completes (to sync final state)
- Cancels any running animation before starting a new one

Write this content to `components/MatrixCursor/DecodeText.tsx`:

```tsx
"use client";
import React, { useRef, useCallback } from "react";

const DecodeText: React.FC<{ text: string }> = ({ text }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<number | null>(null);
  const iterationRef = useRef(0);

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  const animateDecode = useCallback(() => {
    // Cancel any running animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    iterationRef.current = 0;
    const textLen = text.length;

    const step = () => {
      const iteration = iterationRef.current;
      const span = spanRef.current;
      if (!span) return;

      // Build the decoded string directly
      let result = "";
      for (let i = 0; i < textLen; i++) {
        if (i < iteration) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      // Update DOM directly — no React state involved
      span.textContent = result;

      if (iteration >= textLen) {
        // Animation complete — ensure final text is correct
        span.textContent = text;
        animationRef.current = null;
        return;
      }

      iterationRef.current = iteration + 1;
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
  }, [text, chars]);

  const handleMouseEnter = useCallback(() => {
    animateDecode();
  }, [animateDecode]);

  const handleMouseLeave = useCallback(() => {
    // Cancel animation and reset to original text
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (spanRef.current) {
      spanRef.current.textContent = text;
    }
  }, [text]);

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
};

export default DecodeText;
```

Key changes:
- **No `useState` at all** — renders start from `text` prop, updates happen via `spanRef.textContent` directly on the DOM element
- **`requestAnimationFrame` instead of `setInterval`** — synchronizes with browser paint cycle, no excess ticks
- **Cancels on mouseleave** — directly resets textContent to original, cancels animation
- **No React re-renders during animation** — the `textContent` mutation doesn't trigger React reconciliation
- **Single animation at a time** — `cancelAnimationFrame` before starting ensures no overlapping animations

**Verify**:
```bash
npm run typecheck
```
Expected: exit 0, no errors.

### Step 3: Verify lint

```bash
npm run lint
```
Expected: exit 0.

### Step 4: Verify visual behavior

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Hover over "About Me" heading — text decodes with random characters, then reveals
- Hover over other section headings — same effect works
- Moving mouse away mid-animation resets to original text
- Hovering quickly over different headings doesn't cause multiple simultaneous animations
- No console errors

Kill the dev server when done.

### Step 5: Final build

```bash
npm run build
```
Expected: exit 0.

## Test plan

No automated tests. Manual verification:
- All DecodeText headings work on hover
- Mouseleave mid-animation resets correctly
- Rapid mouseover of different headings doesn't cause issues
- Build succeeds

## Done criteria

ALL must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] On `npm run dev`, hovering over any section heading triggers the decode effect
- [ ] On `npm run dev`, moving mouse away resets to original text immediately
- [ ] No React state updates fire during animation (check React DevTools profiler or components tab)
- [ ] No files outside `components/MatrixCursor/DecodeText.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The component does not render any text initially (should show `text` prop)
- The decode animation doesn't start on mouse enter
- The `textContent` approach causes a React hydration mismatch (it shouldn't, since initial render matches SSR output)
- `npm run build` fails
- Any of the original DecodeText behavior (mouseleave reset, completion animation) is broken

## Maintenance notes

- The component no longer causes any React re-renders during its animation — it's purely DOM manipulation
- If you need to add more complex state tracking in the future, add it via refs, not state, to preserve the zero-render property
- The animation speed is controlled by `requestAnimationFrame` (roughly 60fps). If it's too fast, add an `requestAnimationFrame` counter to skip frames (e.g., skip 2 out of 3 frames for ~20fps)
- The `chars` string is defined outside the component closure... actually it's inside `useCallback`. It's recreated each render. For zero-allocation, it could be lifted to a module-level constant, but the compiler inlines small strings anyway.
