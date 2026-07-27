"use client";
import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { musicTracks } from "@/config/music-config";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttemptedRef = useRef(false);
  const userHasInteractedRef = useRef(false); // Track if user has manually paused
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false); // Track if autoplay was blocked by browser
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);

  // All hooks must be called before any conditional returns
  const currentTrack =
    musicTracks.length > 0 ? musicTracks[currentTrackIndex] : null;

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

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.warn("Failed to play audio:", error);
          setHasError(true);
          setIsPlaying(false);
        });
        setIsPlaying(true);
        setHasError(false);
      }
    } catch (error) {
      console.warn("Error toggling audio:", error);
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const handleTrackEnd = () => {
    // Only continue playing if it was playing when track ended
    // (This handles natural track progression, not user pause)
    if (!isPlaying) return;

    if (musicTracks.length > 1) {
      // Playlist: move to next song
      const nextIndex = (currentTrackIndex + 1) % musicTracks.length;
      setCurrentTrackIndex(nextIndex);
      // Audio will auto-play when src changes (handled by useEffect)
    } else {
      // Single song: restart (loop) only if it was playing
      if (audioRef.current && isPlaying) {
        audioRef.current.volume = 0.3;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.warn("Failed to replay audio:", error);
        });
      }
    }
  };

  const handleError = () => {
    console.warn("Audio loading error");
    setHasError(true);
    setIsPlaying(false);
  };

  const handleLoadedData = () => {
    // Primary autoplay mechanism - fires when audio data is loaded
    const audio = audioRef.current;

    // Set volume to 30% (70% reduction from original)
    if (audio) {
      audio.volume = 0.3;
    }

    // Only attempt autoplay if:
    // 1. Audio element exists
    // 2. User hasn't manually interacted yet
    // 3. We haven't already attempted autoplay
    if (
      audio &&
      !userHasInteractedRef.current &&
      !autoplayAttemptedRef.current
    ) {
      autoplayAttemptedRef.current = true;

      // Ensure volume is set before playing
      audio.volume = 0.3;
      audio
        .play()
        .then(() => {
          console.log("Autoplay successful");
          setIsPlaying(true);
          setHasError(false);
          setAutoplayBlocked(false);
        })
        .catch((error) => {
          // Autoplay blocked by browser - this is expected in many browsers
          console.log(
            "Autoplay blocked by browser policy. User can click to play."
          );
          setIsPlaying(false);
          setAutoplayBlocked(true);
          // Don't reset autoplayAttemptedRef - we tried once, that's enough
        });
    }
  };

  // Fallback autoplay attempt (only if onLoadedData didn't fire)
  // This is a minimal fallback - primary autoplay happens in handleLoadedData
  useEffect(() => {
    const audio = audioRef.current;

    // Only attempt if:
    // 1. Audio exists and track exists
    // 2. User hasn't interacted
    // 3. We haven't attempted autoplay yet
    // 4. Audio is already loaded (readyState >= 2 means data is available)
    if (
      audio &&
      currentTrack &&
      !userHasInteractedRef.current &&
      !autoplayAttemptedRef.current &&
      audio.readyState >= 2
    ) {
      // Small delay to let onLoadedData have first chance
      const timeoutId = setTimeout(() => {
        if (
          !userHasInteractedRef.current &&
          !autoplayAttemptedRef.current &&
          audioRef.current
        ) {
          autoplayAttemptedRef.current = true;
          audioRef.current.volume = 0.3;
          audioRef.current
            .play()
            .then(() => {
              console.log("Autoplay successful (fallback)");
              setIsPlaying(true);
              setHasError(false);
              setAutoplayBlocked(false);
            })
            .catch((error) => {
              console.log("Autoplay blocked by browser policy (fallback).");
              setIsPlaying(false);
              setAutoplayBlocked(true);
            });
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentTrack]);

  // Update audio source when track changes (playlist progression)
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (!audioSrc) {
        setAudioSrc(currentTrack.src);
        return;
      }
      audioRef.current.load();
      // Set volume to 30% (70% reduction from original) - after load()
      audioRef.current.volume = 0.3;
      // Only auto-play next track if the previous track was playing
      // This handles playlist progression when a track ends naturally
      if (isPlaying) {
        // Ensure volume is set before playing
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch((error) => {
          console.warn("Failed to play next track:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack, isPlaying, audioSrc]);

  // Global interaction listener - retry autoplay after first user interaction
  useEffect(() => {
    // Check if we should set up listeners
    // Only set up if autoplay was blocked and user hasn't manually interacted
    if (!autoplayBlocked || userHasInteractedRef.current || isPlaying) {
      return;
    }

    let listenersActive = true;

    const handleUserInteraction = () => {
      if (!listenersActive) return;

      const audio = audioRef.current;

      // Only attempt to play if:
      // 1. Audio exists
      // 2. Autoplay was blocked
      // 3. User hasn't manually paused
      // 4. Audio is not currently playing
      if (
        audio &&
        autoplayBlocked &&
        !userHasInteractedRef.current &&
        !isPlaying
      ) {
        audio.volume = 0.3;
        audio
          .play()
          .then(() => {
            console.log("Autoplay successful after user interaction");
            setIsPlaying(true);
            setHasError(false);
            setAutoplayBlocked(false);
            listenersActive = false;
            // Remove listeners after successful playback
            removeListeners();
          })
          .catch((error) => {
            console.log("Failed to play after user interaction:", error);
            // Keep listeners in case user interacts again
          });
      } else {
        // Remove listeners if conditions aren't met
        listenersActive = false;
        removeListeners();
      }
    };

    const removeListeners = () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("mousedown", handleUserInteraction);
    };

    // Add event listeners for various user interactions
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("keydown", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("mousedown", handleUserInteraction, {
      once: true,
    });

    // Cleanup: remove listeners on unmount or when dependencies change
    return () => {
      listenersActive = false;
      removeListeners();
    };
  }, [autoplayBlocked, isPlaying]);

  // Set initial volume when component mounts
  useEffect(() => {
    if (audioRef.current) {
      // Set volume to 30% (70% reduction from original)
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  // Equalizer bars component
  const EqualizerBars = () => {
    if (!isPlaying) return null;

    // Different animation classes for each bar to create random bouncing effect
    const barClasses = [
      "equalizer-bar equalizer-bar-1",
      "equalizer-bar equalizer-bar-2",
      "equalizer-bar equalizer-bar-3",
      "equalizer-bar equalizer-bar-4",
    ];

    return (
      <div className="flex items-end gap-0.5 ml-1 h-3">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`${barClasses[index]} w-0.5 h-full bg-green-500 rounded-full`}
          />
        ))}
      </div>
    );
  };

  // If no tracks configured, don't render the player
  if (musicTracks.length === 0 || !currentTrack) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleTrackEnd}
        onError={handleError}
        onLoadedData={handleLoadedData}
        onCanPlay={() => {
          // Set volume whenever audio can play
          if (audioRef.current) {
            audioRef.current.volume = 0.3;
          }
        }}
        loop={musicTracks.length === 1}
      />
      <button
        onClick={handlePlayPause}
        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs font-bold py-1 px-2 rounded flex items-center"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        disabled={hasError}
      >
        {isPlaying ? (
          <Volume2 className="h-3 w-3" />
        ) : (
          <VolumeX className="h-3 w-3" />
        )}
        <span className="ml-1">{isPlaying ? "Pause" : "Play"}</span>
        <EqualizerBars />
      </button>
    </>
  );
}
