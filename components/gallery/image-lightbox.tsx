"use client";

/**
 * ImageLightbox Component
 *
 * Uses native <img> tags (not Next.js <Image>) for lightbox display since
 * images are already optimized by the grid view and cached by the browser.
 * Native <img> provides instant navigation without re-optimization overhead.
 *
 * Preloading strategy:
 *   - Only the current image loads immediately (loading="eager")
 *   - Adjacent images (prev/next) are preloaded via hidden <img> elements
 *   - On navigation, updates the hidden preload targets to stay one ahead
 *   - No bulk preloading of the entire category — avoids burst network traffic
 *     for large categories (e.g. 12 nature images up to 5.7MB each)
 */

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/data/gallery-data";

interface ImageLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setActiveIndex(currentIndex);
    setImageLoaded(false);
  }, [currentIndex]);

  // Keyboard and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setImageLoaded(false);
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setImageLoaded(false);
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, images.length, onClose]);

  const handlePrevious = useCallback(() => {
    setImageLoaded(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setImageLoaded(false);
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[activeIndex];
  const prevIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
  const nextIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;

  // Target the image two steps ahead for preloading (covers rapid clicking)
  const nextNextIndex =
    nextIndex < images.length - 1 ? nextIndex + 1 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Current image - using native img for faster loading */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeIndex}
            src={currentImage.src}
            alt={currentImage.alt}
            className={`max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg transition-opacity duration-200 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />

          {/* Hidden preload: adjacent images for instant navigation */}
          <div className="hidden" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[prevIndex].src} alt="" loading="eager" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[nextIndex].src} alt="" loading="eager" />
            {/* Preload one more ahead for rapid clicking */}
            {nextNextIndex !== nextIndex && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={images[nextNextIndex].src} alt="" loading="lazy" />
            )}
          </div>
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
