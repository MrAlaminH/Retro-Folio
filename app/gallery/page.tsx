import { discoverGalleryImagePaths } from "@/lib/gallery-discovery";
import { getAllCategories } from "@/data/gallery-data";
import GalleryCategory from "@/components/gallery/gallery-category";
import DecodeText from "@/components/MatrixCursor/DecodeText";
import { GalleryImage } from "@/data/gallery-data";

export const metadata = {
  title: "Gallery | My Memories",
  description: "A collection of my favorite memories organized by category",
};

export default async function GalleryPage() {
  // Discover all image paths (fast - just directory scan)
  const allImages = await discoverGalleryImagePaths();
  const initialImagesPerCategory = 6;

  // Get unique categories from discovered images
  const categories = getAllCategories(allImages);

  // Group images by category
  const imagesByCategory = categories.reduce((acc, category) => {
    acc[category] = allImages.filter((img) => img.category === category);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  return (
    <main className="bg-transparent text-black dark:text-gray-100 min-h-screen p-4 flex justify-center text-sm">
      <div className="w-full max-w-3xl">
        {/* <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-green-600 dark:text-green-500">
          <DecodeText text="My Feed 👀" />
        </h1> */}

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
              const initialImages = categoryImages.slice(
                0,
                initialImagesPerCategory
              );

              return (
                <GalleryCategory
                  key={category}
                  category={category}
                  initialImages={initialImages}
                  allImages={categoryImages}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
