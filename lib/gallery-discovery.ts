import fs from "fs/promises";
import path from "path";
import { GalleryImage } from "@/data/gallery-data";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

/**
 * Discovers all gallery images from the filesystem
 * Returns only image metadata (paths), not actual image data
 * Fast operation - just reads directory structure
 */
export async function discoverGalleryImagePaths(): Promise<GalleryImage[]> {
  const galleryPath = path.join(process.cwd(), "public", "gallery");
  const images: GalleryImage[] = [];

  try {
    // Read the gallery directory
    const categories = await fs.readdir(galleryPath, { withFileTypes: true });

    for (const categoryDir of categories) {
      // Only process directories
      if (!categoryDir.isDirectory()) continue;

      const category = categoryDir.name;
      const categoryPath = path.join(galleryPath, category);

      try {
        // Read files in category directory
        const files = await fs.readdir(categoryPath);

        // Filter and process image files
        for (const file of files) {
          const filePath = path.join(categoryPath, file);
          const ext = path.extname(file).toLowerCase();

          // Check if it's an image file
          if (!IMAGE_EXTENSIONS.includes(ext)) continue;

          // Generate image metadata
          const filename = path.basename(file, ext);
          const id = `${category}-${filename}`;
          const src = `/gallery/${category}/${file}`;
          const alt = generateAltText(category, filename);

          images.push({
            id,
            src,
            alt,
            category,
          });
        }
      } catch (error) {
        // Skip category if there's an error reading it
        console.warn(`Error reading category ${category}:`, error);
        continue;
      }
    }

    // Sort images by filename for consistent ordering
    return images.sort((a, b) => {
      // Extract numeric part from filename for natural sorting
      const aNum = extractNumber(a.id);
      const bNum = extractNumber(b.id);
      if (aNum !== null && bNum !== null) {
        return aNum - bNum;
      }
      return a.id.localeCompare(b.id);
    });
  } catch (error) {
    console.error("Error discovering gallery images:", error);
    return [];
  }
}

/**
 * Generates alt text from category and filename
 * Example: "nature" + "nature-1" → "Nature image 1"
 */
function generateAltText(category: string, filename: string): string {
  const categoryName = formatCategoryName(category);
  const number = extractNumber(filename);
  return number !== null
    ? `${categoryName} image ${number}`
    : `${categoryName} image`;
}

/**
 * Formats category name for display
 * Example: "my-setup" → "My Setup"
 */
function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extracts number from string for natural sorting
 * Example: "nature-10" → 10, "setup-1" → 1
 */
function extractNumber(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

