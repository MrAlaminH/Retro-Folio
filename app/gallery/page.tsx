import GalleryCategory from "@/components/gallery/gallery-category";
import GalleryNav from "@/components/gallery/gallery-nav";
import DecodeText from "@/components/MatrixCursor/DecodeText";
import GalleryScrollHandler from "@/components/gallery/gallery-scroll-handler";
import { GalleryImage } from "@/data/gallery-data";
import { discoverGalleryImagePaths } from "@/lib/gallery-discovery";
import { getAllCategories } from "@/data/gallery-data";
import { Suspense } from "react";

interface GalleryPageProps {}

export default async function GalleryPage({}: GalleryPageProps) {
  // Discover all image paths (fast - just directory scan)
  const allImages = await discoverGalleryImagePaths();
  const IMAGES_PER_LOAD = 6;
  const PAGINATION_THRESHOLD = 20; // Only show "See More" if category has 20+ images

  // Get unique categories from discovered images
  const categories = getAllCategories(allImages);

  // Group images by category
  const imagesByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = allImages.filter((img) => img.category === category);
      return acc;
    },
    {} as Record<string, GalleryImage[]>,
  );

  return (
    <>
      <Suspense fallback={null}>
        <GalleryScrollHandler />
      </Suspense>
      <main className="bg-transparent text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm">
        <div className="w-full max-w-3xl">
          <Suspense fallback={null}>
            <GalleryNav categories={categories} />
          </Suspense>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No images available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const categoryImages = imagesByCategory[category] || [];
                const shouldPaginate =
                  categoryImages.length >= PAGINATION_THRESHOLD;
                const initialImages = shouldPaginate
                  ? categoryImages.slice(0, IMAGES_PER_LOAD)
                  : categoryImages;

                return (
                  <div key={category} id={`category-${category}`}>
                    <GalleryCategory
                      category={category}
                      initialImages={initialImages}
                      allImages={categoryImages}
                      showPagination={shouldPaginate}
                      imagesPerLoad={IMAGES_PER_LOAD}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
