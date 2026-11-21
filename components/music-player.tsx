"use client";
import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { musicTracks } from "@/config/music-config";

// Player lifecycle as one explicit status instead of a pile of booleans:
//
//   idle ──play()──▶ loading ──ok──▶ playing ⇄ paused (user pause)
//                     │                │
//                     │                └─track end─▶ next track (still playing)
//                     ├─fail (no gesture yet)─▶ blocked ──interaction──▶ loading
//                     └─fail (load/media)─────▶ error ──click──▶ loading
//
// Every playback start goes through startPlayback(), which is the only place
// that sets "loading"/"playing"; failure handling is per-transition.
type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "blocked"
  | "error";

const VOLUME = 0.24; // -76% from full volume (20% quieter than the previous 0.3)

// Equalizer bars — stays mounted while paused (frozen mid-bounce via
// .equalizer-paused) so play/pause doesn't pop. Defined at module scope so
// React keeps the DOM subtree (and its CSS animation position) across
// MusicPlayer re-renders.
function EqualizerBars({
  active,
  hasPlayed,
}: {
  active: boolean;
  hasPlayed: boolean;
}) {
  if (!active && !hasPlayed) return null;

  // Different animation classes for each bar to create random bouncing effect
  const barClasses = [
    "equalizer-bar equalizer-bar-1",
    "equalizer-bar equalizer-bar-2",
    "equalizer-bar equalizer-bar-3",
    "equalizer-bar equalizer-bar-4",
  ];

  return (
    <div
      className={`flex items-end gap-0.5 ml-1 h-3 ${
        active ? "" : "equalizer-paused"
      }`}
    >
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`${barClasses[index]} w-0.5 h-full bg-green-500 rounded-full`}
        />
      ))}
    </div>
  );
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttemptedRef = useRef(false); // one autoplay attempt per mount
  const resumeOnLoadRef = useRef(false); // continue playlist after track switch
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [hasPlayed, setHasPlayed] = useState(false); // frozen bars show only after first play
  const [trackIndex, setTrackIndex] = useState(0);
  const [src, setSrc] = useState<string | undefined>(musicTracks[0]?.src);

  const currentTrack = musicTracks.length > 0 ? musicTracks[trackIndex] : null;
  // "loading" counts as active so the button/eq bars react immediately,
  // matching the old optimistic flip (cached audio resolves in ~a frame).
  const active = status === "playing" || status === "loading";

  const startPlayback = React.useCallback(
    (audio: HTMLAudioElement, onFailure: () => void) => {
      audio.volume = VOLUME;
      setStatus("loading");
      audio
        .play()
        .then(() => {
          setStatus("playing");
          setHasPlayed(true);
        })
        .catch(onFailure);
    },
    []
  );

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || status === "loading") return;
    if (status === "playing") {
      audio.pause();
      setStatus("paused");
      return;
    }
    // idle/paused/blocked/error → (re)start. A click is a user gesture, so a
    // failure here is a load/media problem, not autoplay policy.
    startPlayback(audio, () => setStatus("error"));
  };

  const handleTrackEnd = () => {
    // Single track loops via the `loop` attribute (ended never fires there).
    if (musicTracks.length <= 1 || status !== "playing") return;
    resumeOnLoadRef.current = true;
    setTrackIndex((i) => (i + 1) % musicTracks.length);
  };

  const handleError = () => {
    console.warn("Audio loading error");
    setStatus("error");
  };

  // Follow the selected track (mount + playlist progression): swap the
  // element's src and let the browser load; continuation happens in
  // handleLoadedData. Kept off `status` deps on purpose — pause/play must
  // never reload the track (that used to rewind the song to 0:00).
  useEffect(() => {
    if (currentTrack) setSrc(currentTrack.src);
  }, [trackIndex, currentTrack]);

  const attemptAutoplay = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio || autoplayAttemptedRef.current) return;
    autoplayAttemptedRef.current = true;
    startPlayback(audio, () => {
      console.log(
        "Autoplay blocked by browser policy; will retry on first interaction."
      );
      setStatus("blocked");
    });
  }, [startPlayback]);

  const handleLoadedData = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    if (resumeOnLoadRef.current) {
      resumeOnLoadRef.current = false;
      startPlayback(audio, () => setStatus("error"));
      return;
    }
    attemptAutoplay();
  };

  // With preload="none" nothing loads until play() is called, so the mount
  // effect makes the one autoplay attempt directly (play() starts loading).
  useEffect(() => {
    attemptAutoplay();
  }, [attemptAutoplay]);

  // While autoplay is blocked, retry on the first interaction anywhere.
  // The listeners live exactly as long as the "blocked" state: success flips
  // status so the cleanup removes them, a failure leaves them armed (they are
  // re-attached because startPlayback passes through "loading" → re-render).
  useEffect(() => {
    if (status !== "blocked") return;
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => startPlayback(audio, () => setStatus("blocked"));
    document.addEventListener("click", tryPlay);
    document.addEventListener("keydown", tryPlay);
    document.addEventListener("touchstart", tryPlay);
    document.addEventListener("mousedown", tryPlay);
    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
      document.removeEventListener("mousedown", tryPlay);
    };
  }, [status, startPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  // If no tracks configured, don't render the player
  if (musicTracks.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={handleTrackEnd}
        onError={handleError}
        onLoadedData={handleLoadedData}
        loop={musicTracks.length === 1}
      />
      <button
        onClick={handlePlayPause}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center active:scale-97"
        aria-label={active ? "Pause music" : "Play music"}
      >
        {/* Crossfade play/pause icons instead of a hard swap */}
        <span className="relative inline-flex h-3 w-3">
          <Volume2
            className={`absolute inset-0 h-3 w-3 transition-opacity duration-150 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />
          <VolumeX
            className={`absolute inset-0 h-3 w-3 transition-opacity duration-150 ${
              active ? "opacity-0" : "opacity-100"
            }`}
          />
        </span>
        <span className="ml-1">{active ? "Pause" : "Play"}</span>
        <EqualizerBars active={active} hasPlayed={hasPlayed} />
      </button>
    </>
  );
}
