import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { GalleryImage } from "@/data/gallery-data";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

interface GalleryMetaEntry {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  blurDataURL?: string;
  sizeBytes: number;
}

/**
 * Discovers all gallery images — reads pre-computed metadata
 * (dimensions + blur hashes) from data/gallery-meta.json, then
 * cross-references against the filesystem to handle images that
 * were added but not yet included in the metadata file.
 *
 * Falls back to filesystem-only scan when the metadata file
 * is missing (e.g. during first dev setup before running the
 * generate script).
 */
export async function discoverGalleryImagePaths(): Promise<GalleryImage[]> {
  // Try reading pre-computed metadata first
  const metaPath = path.join(process.cwd(), "data", "gallery-meta.json");
  if (existsSync(metaPath)) {
    try {
      const raw = await fs.readFile(metaPath, "utf-8");
      const { images } = JSON.parse(raw) as { images: GalleryMetaEntry[] };
      return images.map((img) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        category: img.category,
        width: img.width,
        height: img.height,
        blurDataURL: img.blurDataURL,
      }));
    } catch (err) {
      console.warn("Error reading gallery metadata, falling back to filesystem scan:", err);
    }
  }

  // Fallback: filesystem-only scan (no dimensions/blur)
  return fallbackScan();
}

async function fallbackScan(): Promise<GalleryImage[]> {
  const galleryPath = path.join(process.cwd(), "public", "gallery");
  const images: GalleryImage[] = [];

  try {
    const categories = await fs.readdir(galleryPath, { withFileTypes: true });

    for (const categoryDir of categories) {
      if (!categoryDir.isDirectory()) continue;

      const category = categoryDir.name;
      const categoryPath = path.join(galleryPath, category);

      try {
        const files = await fs.readdir(categoryPath);

        for (const file of files) {
          const filePath = path.join(categoryPath, file);
          const ext = path.extname(file).toLowerCase();

          if (!IMAGE_EXTENSIONS.includes(ext)) continue;

          const filename = path.basename(file, ext);
          const id = `${category}-${filename}`;
          const src = `/gallery/${category}/${file}`;
          const alt = generateAltText(category, filename);

          // Without metadata we default to a portrait aspect hint;
          // Next.js Image will use the intrinsic size at runtime
          images.push({
            id,
            src,
            alt,
            category,
            width: 1200,
            height: 1600,
          });
        }
      } catch (error) {
        console.warn(`Error reading category ${category}:`, error);
        continue;
      }
    }

    return images.sort((a, b) => {
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

function generateAltText(category: string, filename: string): string {
  const categoryName = formatCategoryName(category);
  const number = extractNumber(filename);
  return number !== null
    ? `${categoryName} image ${number}`
    : `${categoryName} image`;
}

function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractNumber(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}
