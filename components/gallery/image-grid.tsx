"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { GalleryImage } from "@/data/gallery-data";
import ImageLightbox from "./image-lightbox";

interface ImageGridProps {
  images: GalleryImage[];
  priority?: boolean;
}

export default function ImageGrid({
  images,
  priority = false,
}: ImageGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <>
      <div className="columns-1 sm:columns-2 gap-6">
        {images.map((image, index) => {
          const isPriority = priority && index < 6;
          return (
            <div
              key={image.id}
              className="relative w-full mb-4 break-inside-avoid overflow-hidden rounded-lg border-2 border-green-600 dark:border-green-500 shadow-[0_0_10px_rgba(0,128,0,0.3)] dark:shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_15px_rgba(0,128,0,0.5)] dark:hover:shadow-[0_0_15px_rgba(0,255,0,0.5)] transition-all duration-300 group cursor-pointer"
              onClick={() => handleImageClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleImageClick(index);
                }
              }}
              aria-label={`View ${image.alt} in full size`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="relative w-full h-auto max-h-[400px] max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                priority={isPriority}
                quality={85}
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL}
                loading={isPriority ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
