/**
 * Build-time script: downscales gallery images to a max dimension
 * (1920px on the longest edge) IN-PLACE, preserving filenames.
 *
 * Run manually once, or integrate into the build pipeline.
 * After running, regenerate gallery-meta.json via the existing script.
 *
 * Usage: node scripts/optimize-gallery-images.mjs [--max=1920]
 */
import { statSync } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// Parse max dimension from CLI args, default 1920
const maxArg = process.argv.find((a) => a.startsWith("--max="));
const MAX_DIMENSION = maxArg ? parseInt(maxArg.split("=")[1], 10) : 1920;

async function main() {
  const categories = await readdir(GALLERY_DIR, { withFileTypes: true });
  let processed = 0;
  let skipped = 0;

  for (const catDir of categories) {
    if (!catDir.isDirectory() || catDir.name.startsWith(".")) continue;
    const catPath = path.join(GALLERY_DIR, catDir.name);
    const files = await readdir(catPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      const filePath = path.join(catPath, file);

      const metadata = await sharp(filePath).metadata();
      if (!metadata.width || !metadata.height) {
        console.warn(`  ⚠ Could not read ${filePath}, skipping`);
        skipped++;
        continue;
      }

      const longestEdge = Math.max(metadata.width, metadata.height);
      if (longestEdge <= MAX_DIMENSION) {
        console.log(`  ✓ ${file} already ≤${MAX_DIMENSION}px (${longestEdge}px), skipping`);
        skipped++;
        continue;
      }

      // Read original to compare size
      const originalSize = statSync(filePath).size;

      // Resize: constrain longest edge to MAX_DIMENSION, preserve aspect ratio
      const buffer = await sharp(filePath)
        .resize({
          width: metadata.width >= metadata.height ? MAX_DIMENSION : undefined,
          height: metadata.height > metadata.width ? MAX_DIMENSION : undefined,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 6 })
        .toBuffer();

      await writeFile(filePath, buffer);
      const newSize = buffer.length;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(
        `  ✓ ${file} ${longestEdge}px → ${metadata.width >= metadata.height ? MAX_DIMENSION : "auto"}×${metadata.height > metadata.width ? MAX_DIMENSION : "auto"}px, ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% saved)`
      );
      processed++;
    }
  }

  console.log(`\nDone: ${processed} processed, ${skipped} skipped`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
