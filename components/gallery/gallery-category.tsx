import { GalleryImage, getCategoryDisplayName } from "@/data/gallery-data";
import SeeMoreButton from "./see-more-button";
import DecodeText from "@/components/MatrixCursor/DecodeText";

interface GalleryCategoryProps {
  category: string;
  initialImages: GalleryImage[];
  allImages: GalleryImage[];
}

export default function GalleryCategory({
  category,
  initialImages,
  allImages,
}: GalleryCategoryProps) {
  const displayName = getCategoryDisplayName(category);

  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-green-600 dark:text-green-500">
        <DecodeText text={displayName} />
      </h2>
      <SeeMoreButton
        category={category}
        initialImages={initialImages}
        allImages={allImages}
        imagesPerLoad={6}
      />
    </section>
  );
}

