"use client";

import { useState, useMemo, useCallback } from "react";
import { GalleryImage } from "@/data/gallery-data";
import ImageGrid from "./image-grid";

interface SeeMoreButtonProps {
  category: string;
  initialImages: GalleryImage[];
  allImages: GalleryImage[];
  imagesPerLoad?: number;
}

export default function SeeMoreButton({
  category,
  initialImages,
  allImages,
  imagesPerLoad = 6,
}: SeeMoreButtonProps) {
  const [visibleCount, setVisibleCount] = useState(initialImages.length);
  const [isLoading, setIsLoading] = useState(false);

  // Use allImages prop directly (no API call needed)
  const hasMore = useMemo(
    () => visibleCount < allImages.length,
    [visibleCount, allImages.length]
  );

  const visibleImages = useMemo(
    () => allImages.slice(0, visibleCount),
    [allImages, visibleCount]
  );

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    // Use requestAnimationFrame for smoother UX
    requestAnimationFrame(() => {
      setVisibleCount((prev) =>
        Math.min(prev + imagesPerLoad, allImages.length)
      );
      setIsLoading(false);
    });
  }, [imagesPerLoad, allImages.length]);

  if (!hasMore && visibleCount === initialImages.length) {
    return <ImageGrid images={visibleImages} />;
  }

  return (
    <>
      <ImageGrid images={visibleImages} />
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            aria-label={`Load more ${category} images`}
          >
            {isLoading ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </>
  );
}
