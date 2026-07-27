export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

/**
 * Get all unique categories from an array of images
 */
export function getAllCategories(images: GalleryImage[]): string[] {
  const categories = new Set(images.map((img) => img.category));
  return Array.from(categories);
}

export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    nature: "Nature",
    "my-setup": "My Setup",
    "random-clicks": "Random Clicks",
  };
  return displayNames[category] || category;
}

