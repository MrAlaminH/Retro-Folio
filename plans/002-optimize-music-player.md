# Plan 002: Compress MP3 and lazy-load audio source

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 843d2c8..HEAD -- public/music/ components/music-player.tsx config/music-config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW — the audio element behaviors (play, pause, autoplay, track-end) are unchanged
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `843d2c8`, 2026-07-28

## Why this matters

The NavBar (rendered in the root layout on every single page) includes `MusicPlayer`, which references a 5.5MB MP3 file. Every visitor downloads this entire file regardless of whether they ever press Play. For ambient background music, the current bitrate is far higher than needed. After this plan, the MP3 is compressed to ~192kbps (appropriate for ambient music), and the audio `src` is not set until the user's first interaction with the player, avoiding the preload download entirely. The music player button, autoplay attempt, equalizer bars, and all behaviors are visually identical.

## Current state

File: `public/music/song1.mp3` — 5,631,854 bytes (5.5MB)

The music player component: `components/music-player.tsx`
- Line 307–320: `<audio>` element with static `src={currentTrack.src}` — the browser starts downloading the MP3 as soon as the component mounts.
- The component renders inside `components/NavBar.tsx:64`, which is part of `app/layout.tsx` (the root layout), so it's on every page.

Music config: `config/music-config.ts`
```ts
export const musicTracks: MusicTrack[] = [
  { src: "/music/song1.mp3", name: "Song 1" },
];
```

The component already has an `autoplayBlocked` state and a user-interaction listener (lines 186–256) that retries playback after the user clicks anywhere. We can piggyback on this: only set the `src` attribute after that first interaction, or after the user clicks the play button.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Compress MP3 | `ffmpeg -i public/music/song1.mp3 -b:a 192k -map_metadata 0 public/music/song1-compressed.mp3` (see step 1) | Creates compressed file |
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

## Scope

**In scope**:
- `public/music/song1.mp3` — replace with compressed version
- `components/music-player.tsx` — add lazy src loading
- `config/music-config.ts` — no changes needed (just reference)

**Out of scope** (do NOT touch):
- Any gallery images or gallery components (handled by Plan 001)
- `components/NavBar.tsx` — the MusicPlayer rendering location is fine
- `app/layout.tsx` — the root layout is fine
- Any CSS or animation code

## Git workflow

- Branch: `advisor/002-optimize-music-player`
- Commit per step
- Do NOT push or open a PR unless instructed

## Steps

### Step 1: Compress the MP3 file

Compress the audio file to a reasonable bitrate for ambient background music:

```bash
# Check if ffmpeg is available first
which ffmpeg
```

If ffmpeg is not installed, install it:
- macOS: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`
- Windows: download from https://ffmpeg.org/

Then compress:

```bash
ffmpeg -i public/music/song1.mp3 -b:a 192k -map_metadata 0 -y public/music/song1-compressed.mp3
```

**Verify**: Check the compressed file size:

```bash
ls -lh public/music/song1-compressed.mp3
```

Expected: significantly smaller than the original. The original is 5.5MB; the compressed version should be ~1–1.5MB (ambient music compresses well at 192kbps).

If ffmpeg is not available, use an alternative method:
- Use Node.js with `lame` or `ffmpeg-static`:
  ```bash
  npx ffmpeg-static -i public/music/song1.mp3 -b:a 192k -y public/music/song1-compressed.mp3
  ```

### Step 2: Replace the original with the compressed version

```bash
mv public/music/song1-compressed.mp3 public/music/song1.mp3
```

**Verify**:
```bash
ls -lh public/music/song1.mp3
```

Expected: file is now ~1–1.5MB instead of 5.5MB.

### Step 3: Add lazy src loading to MusicPlayer

Now modify `components/music-player.tsx` so the audio `src` is not set until the user interacts.

Read the current file first:
```bash
wc -l components/music-player.tsx
```

Find the `<audio>` element (around line 307). Currently it looks like:
```tsx
<audio
  ref={audioRef}
  src={currentTrack.src}
  onEnded={handleTrackEnd}
  onError={handleError}
  onLoadedData={handleLoadedData}
  onCanPlay={() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }}
  loop={musicTracks.length === 1}
/>
```

Replace `src={currentTrack.src}` with a conditionally set src that only activates after user interaction:

Add a state at the top of the component (after the existing state declarations around line 12):
```tsx
const [shouldLoadAudio, setShouldLoadAudio] = useState(false);
```

Then add a new ref that tracks whether the user has interacted:
```tsx
// Add after userHasInteractedRef (line 9)
const userActivatedRef = useRef(false);
```

Now, in the existing `handlePlayPause` function (around line 19), add a guard that sets `shouldLoadAudio` on first click. At the top of `handlePlayPause`:
```tsx
const handlePlayPause = () => {
  if (!audioRef.current) return;
  
  // Lazy-load audio src on first user interaction
  if (!userActivatedRef.current) {
    userActivatedRef.current = true;
    setShouldLoadAudio(true);
    // Don't proceed with play/pause on first activation;
    // the useEffect for shouldLoadAudio will set src and start playback
    return;
  }
  
  // ... rest of existing function unchanged
```

Wait — this changes the behavior because the first click would "activate" but not play. That's a UX regression. Better approach: keep the `handlePlayPause` behavior exactly as-is, but conditionally set the `src` prop.

The cleanest approach: add a `useEffect` that sets the audio source when the user first interacts, and don't set `src` on the `<audio>` tag at all until then.

Here's the minimal change:

1. Add to state declarations (after line 13):
```tsx
const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
```

2. Add a `useEffect` that triggers on first interaction:
```tsx
// Lazy-load audio source on first user interaction
useEffect(() => {
  const handleFirstInteraction = () => {
    if (audioSrc === undefined && currentTrack) {
      setAudioSrc(currentTrack.src);
    }
  };

  // Various interaction events
  document.addEventListener("click", handleFirstInteraction, { once: true });
  document.addEventListener("keydown", handleFirstInteraction, { once: true });
  document.addEventListener("touchstart", handleFirstInteraction, { once: true });

  return () => {
    document.removeEventListener("click", handleFirstInteraction);
    document.removeEventListener("keydown", handleFirstInteraction);
    document.removeEventListener("touchstart", handleFirstInteraction);
  };
}, [audioSrc, currentTrack]);
```

3. Change the `<audio>` tag to use the lazy src:
```tsx
<audio
  ref={audioRef}
  src={audioSrc}
  // ... rest unchanged
```

4. In `handlePlayPause`, if `audioSrc` is undefined, set it first:
```tsx
const handlePlayPause = () => {
  if (!audioRef.current) return;
  
  // Ensure audio source is loaded
  if (!audioSrc && currentTrack) {
    setAudioSrc(currentTrack.src);
  }
  
  // Set volume to 30%
  audioRef.current.volume = 0.3;
  
  // ... rest of existing function unchanged
```

5. In the `handleTrackEnd` and `useEffect` that handles track changes (around line 167), also ensure `audioSrc` is set before trying to play next tracks:
   
   In the track-change effect (lines 167-183), modify it to also work with `audioSrc`:
```tsx
useEffect(() => {
  if (audioRef.current && currentTrack) {
    if (!audioSrc) {
      setAudioSrc(currentTrack.src);
      return;
    }
    audioRef.current.load();
    audioRef.current.volume = 0.3;
    if (isPlaying) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((error) => {
        console.warn("Failed to play next track:", error);
        setIsPlaying(false);
      });
    }
  }
}, [currentTrackIndex, currentTrack, isPlaying, audioSrc]);
```

**The exact edits:**

Edit 1 — Add state after line 13 (`const [hasError, setHasError] = useState(false);`):
```tsx
const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
```

Edit 2 — Modify `handlePlayPause` to set audioSrc on first click (around line 19):
Change from:
```tsx
const handlePlayPause = () => {
    if (!audioRef.current) return;
    // Mark that user has interacted
    userHasInteractedRef.current = true;
    // Set volume to 30% (70% reduction from original)
    audioRef.current.volume = 0.3;
```

To:
```tsx
const handlePlayPause = () => {
    if (!audioRef.current) return;
    // Mark that user has interacted
    userHasInteractedRef.current = true;
    // Lazy-load audio source on first play attempt
    if (!audioSrc && currentTrack) {
      setAudioSrc(currentTrack.src);
    }
    // Set volume to 30% (70% reduction from original)
    audioRef.current.volume = 0.3;
```

Edit 3 — In the track-change `useEffect` (around line 167), add `audioSrc` to deps and guard:
Change deps from `[currentTrackIndex, currentTrack, isPlaying]` to `[currentTrackIndex, currentTrack, isPlaying, audioSrc]`.

Edit 4 — Change the `<audio>` element (around line 307):
Change `src={currentTrack.src}` to `src={audioSrc}`.

**Verify**:
Read the modified file and confirm:
```bash
grep -n "src=" components/music-player.tsx
```
Expected: two results — one in the `<audio>` tag showing `src={audioSrc}` (not `src={currentTrack.src}`), and one where `setAudioSrc(currentTrack.src)` is called.

```bash
npm run typecheck
```
Expected: exit 0, no errors.

### Step 4: Verify the full dev experience

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Open the browser's Network tab and filter for "song1". Confirm:
- The MP3 file is **NOT** loaded on initial page load
- Click the Play button in the navbar — the MP3 starts loading and plays
- The equalizer bars show when playing
- Pause/play toggling works
- No console errors

Kill the dev server when done.

**Verify**:
```bash
npm run build
```
Expected: exit 0, successful build.

## Test plan

No new tests. The music player has no test infrastructure. Manual verification on the dev server is sufficient:
- Initial page load does not request the MP3 (check Network tab)
- Clicking Play loads and plays the MP3
- Pause works
- Autoplay is still attempted (should still be blocked by browser as before)

## Done criteria

ALL must hold:

- [ ] `ls -lh public/music/song1.mp3` shows ≤2.6MB (was 5.6MB; 54% reduction at 128kbps — realistic for a 2:19 stereo track with embedded metadata)
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] On `npm run dev`, the Network tab shows no MP3 request on initial page load
- [ ] On `npm run dev`, clicking Play loads the MP3 and audio plays
- [ ] No files outside `public/music/song1.mp3` and `components/music-player.tsx` are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The code in `components/music-player.tsx` differs significantly from the excerpts above — the component may have been refactored since this plan was written
- `ffmpeg` is not available and you cannot install it
- After compression, the audio sounds noticeably distorted or hissy (192kbps should be transparent for ambient music; report if not)
- Lazy-loading the src breaks the autoplay-attempt-after-user-interaction behavior (the existing logic around lines 186–256 should still work because it references `audioRef.current` which exists even without src)
- `npm run build` fails
