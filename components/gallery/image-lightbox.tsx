"use client";

/**
 * ImageLightbox Component
 *
 * Uses Next.js <Image> with fill + sizes so fullscreen images get
 * optimized WebP/AVIF variants with proper compression — same as the
 * grid thumbnails. Adjacent images are preloaded via JS (new Image())
 * for instant navigation without rendering hidden DOM elements.
 *
 * Preloading strategy:
 *   - Current image: <Image> with priority, loads immediately
 *   - Adjacent images (prev/next/next-next): JS preload via useEffect
 *   - No bulk preloading of the entire category
 */

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
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
  const preloadedRef = useRef<Set<string>>(new Set());

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

  // Preload adjacent images for instant navigation
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const prevIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    const nextIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    const nextNextIndex = nextIndex < images.length - 1 ? nextIndex + 1 : 0;

    const preload = (src: string) => {
      if (preloadedRef.current.has(src)) return;
      preloadedRef.current.add(src);
      const img = new window.Image();
      img.src = src;
    };

    preload(images[prevIndex].src);
    preload(images[nextIndex].src);
    if (nextNextIndex !== nextIndex) {
      preload(images[nextNextIndex].src);
    }
  }, [isOpen, activeIndex, images]);

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

          {/* Current image — Next.js optimized */}
          <div className="relative w-full h-full max-h-[90vh]">
            <Image
              key={activeIndex}
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="(max-width: 1200px) 90vw, 1200px"
              className={`rounded-lg transition-opacity duration-200 object-contain ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              priority
              quality={85}
              placeholder={currentImage.blurDataURL ? "blur" : "empty"}
              blurDataURL={currentImage.blurDataURL}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
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
