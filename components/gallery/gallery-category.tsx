import { GalleryImage, getCategoryDisplayName } from "@/data/gallery-data";
import SeeMoreButton from "./see-more-button";
import DecodeText from "@/components/MatrixCursor/DecodeText";

interface GalleryCategoryProps {
  category: string;
  allImages: GalleryImage[];
  showPagination?: boolean;
  imagesPerLoad?: number;
  /** Eager-load + preload the first row of images (above-the-fold category). */
  priority?: boolean;
}

export default function GalleryCategory({
  category,
  allImages,
  showPagination = false,
  imagesPerLoad = 6,
  priority = false,
}: GalleryCategoryProps) {
  const displayName = getCategoryDisplayName(category);

  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-green-600 dark:text-green-500">
        <DecodeText text={displayName} />
      </h2>
      {showPagination ? (
        <SeeMoreButton
          category={category}
          allImages={allImages}
          imagesPerLoad={imagesPerLoad}
          priority={priority}
        />
      ) : (
        <SeeMoreButton
          category={category}
          allImages={allImages}
          imagesPerLoad={imagesPerLoad}
          priority={priority}
          hideSeeMoreButton
        />
      )}
    </section>
  );
}
