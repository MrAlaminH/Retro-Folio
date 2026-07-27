/**
 * Build-time script: generates gallery image metadata (dimensions + blur hashes).
 *
 * Scans public/gallery/ for images, extracts dimensions via sharp,
 * creates tiny blur placeholder data URIs, and writes the result to
 * data/gallery-meta.json so the server component can serve it without
 * processing images at request time.
 *
 * Run: node scripts/generate-gallery-meta.mjs
 * (Called automatically before `next build` via the "prebuild" script.)
 */

import { readdir, writeFile } from "fs/promises";
import { existsSync, statSync } from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "gallery");
const OUTPUT = path.join(ROOT, "data", "gallery-meta.json");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Generate a tiny blurred placeholder data URI from an image buffer.
 * Resizes to ~10px wide and encodes as low-quality JPEG base64.
 * Returns an empty string on any failure (graceful fallback).
 */
async function generateBlurDataURI(filePath) {
  try {
    const buf = await sharp(filePath)
      .resize(10, undefined, { fit: "cover" })
      .jpeg({ quality: 30 })
      .toBuffer();
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

async function main() {
  if (!existsSync(GALLERY_DIR)) {
    console.warn("⚠ Gallery directory not found — skipping metadata generation.");
    await writeFile(OUTPUT, JSON.stringify({ images: [] }, null, 2));
    return;
  }

  const categories = await readdir(GALLERY_DIR, { withFileTypes: true });
  const entries = [];

  for (const catDir of categories) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(GALLERY_DIR, catDir.name);

    // Skip hidden directories (e.g. .DS_Store)
    if (catDir.name.startsWith(".")) continue;

    const files = await readdir(catPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;

      const filePath = path.join(catPath, file);
      const filename = path.basename(file, ext);

      const stats = statSync(filePath);

      try {
        const metadata = await sharp(filePath).metadata();

        if (!metadata.width || !metadata.height) {
          console.warn(`⚠ Could not read dimensions for ${filePath}`);
          continue;
        }

        const blurDataURI = await generateBlurDataURI(filePath);

        entries.push({
          id: `${catDir.name}-${filename}`,
          src: `/gallery/${catDir.name}/${file}`,
          alt: `${catDir.name} image ${filename.replace(/^[^0-9]*/, "") || ""}`.trim(),
          category: catDir.name,
          width: metadata.width,
          height: metadata.height,
          blurDataURL: blurDataURI,
          sizeBytes: stats.size,
        });
      } catch (err) {
        console.warn(`⚠ Error processing ${filePath}: ${err.message}`);
      }
    }
  }

  // Sort by numeric part of filename for consistent ordering
  entries.sort((a, b) => {
    const aNum = parseInt(a.id.match(/\d+/)?.[0] ?? "0", 10);
    const bNum = parseInt(b.id.match(/\d+/)?.[0] ?? "0", 10);
    if (aNum !== 0 && bNum !== 0) return aNum - bNum;
    return a.id.localeCompare(b.id);
  });

  await writeFile(OUTPUT, JSON.stringify({ images: entries }, null, 2));
  console.log(`✓ Gallery metadata written to ${OUTPUT}`);
  console.log(`  ${entries.length} images processed`);
}

main().catch((err) => {
  console.error("Failed to generate gallery metadata:", err);
  process.exit(1);
});
