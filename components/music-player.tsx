"use client";
import React, { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { musicTracks } from "@/config/music-config";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttemptedRef = useRef(false);
  const userHasInteractedRef = useRef(false); // Track if user has manually paused
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // All hooks must be called before any conditional returns
  const currentTrack =
    musicTracks.length > 0 ? musicTracks[currentTrackIndex] : null;

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    // Mark that user has interacted
    userHasInteractedRef.current = true;

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

      audio
        .play()
        .then(() => {
          console.log("Autoplay successful");
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((error) => {
          // Autoplay blocked by browser - this is expected in many browsers
          console.log(
            "Autoplay blocked by browser policy. User can click to play."
          );
          setIsPlaying(false);
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
          audioRef.current
            .play()
            .then(() => {
              console.log("Autoplay successful (fallback)");
              setIsPlaying(true);
              setHasError(false);
            })
            .catch((error) => {
              console.log("Autoplay blocked by browser policy (fallback).");
              setIsPlaying(false);
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
      audioRef.current.load();
      // Only auto-play next track if the previous track was playing
      // This handles playlist progression when a track ends naturally
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.warn("Failed to play next track:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack, isPlaying]);

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
        src={currentTrack.src}
        onEnded={handleTrackEnd}
        onError={handleError}
        onLoadedData={handleLoadedData}
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
