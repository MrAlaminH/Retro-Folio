"use client";

import { useState, useMemo, useCallback } from "react";
import { GalleryImage } from "@/data/gallery-data";
import ImageGrid from "./image-grid";

interface SeeMoreButtonProps {
  category: string;
  initialImages: GalleryImage[];
  allImages: GalleryImage[];
  imagesPerLoad?: number;
  hideSeeMoreButton?: boolean;
}

export default function SeeMoreButton({
  category,
  initialImages,
  allImages,
  imagesPerLoad = 6,
  hideSeeMoreButton = false,
}: SeeMoreButtonProps) {
  const [visibleCount, setVisibleCount] = useState(initialImages.length);
  // Index from which newly-appended images stagger in (Infinity = none;
  // initial render shows instantly so the first paint isn't delayed)
  const [animateFrom, setAnimateFrom] = useState<number>(Infinity);

  const hasMore = useMemo(
    () => visibleCount < allImages.length,
    [visibleCount, allImages.length],
  );

  const visibleImages = useMemo(
    () => allImages.slice(0, visibleCount),
    [allImages, visibleCount],
  );

  // Loads are instant (local slice) — no loading state needed
  const handleLoadMore = useCallback(() => {
    setAnimateFrom(visibleCount);
    setVisibleCount((prev) =>
      Math.min(prev + imagesPerLoad, allImages.length),
    );
  }, [visibleCount, imagesPerLoad, allImages.length]);

  if (!hasMore && visibleCount === initialImages.length) {
    return <ImageGrid images={visibleImages} animateFrom={animateFrom} />;
  }

  return (
    <>
      <ImageGrid images={visibleImages} animateFrom={animateFrom} />
      {hasMore && !hideSeeMoreButton && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-[background-color,color,transform] duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            aria-label={`Load more ${category} images`}
          >
            See More
          </button>
        </div>
      )}
    </>
  );
}
