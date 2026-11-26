/**
 * Build-time script: generates real dimensions for remote images embedded in
 * project-detail markdown (public/content/*.md).
 *
 * Scans the markdown files for image URLs, fetches each one, reads its
 * dimensions via sharp, and writes data/content-image-meta.json so the slug
 * page can reserve the correct aspect ratio (no layout shift on load).
 *
 * The script never fails the build: any per-image error records null dims and
 * continues, and a fatal error still writes a valid (possibly empty) file.
 *
 * Run: node scripts/generate-content-image-meta.mjs
 * (Called automatically before `next build` via the "prebuild" script.)
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "public", "content");
const OUTPUT = path.join(ROOT, "data", "content-image-meta.json");

const IMAGE_URL_RE = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)/g;
const FETCH_TIMEOUT_MS = 10_000;

async function collectImageUrls() {
  if (!existsSync(CONTENT_DIR)) {
    console.warn("⚠ Content directory not found — skipping metadata generation.");
    return [];
  }

  const files = await readdir(CONTENT_DIR);
  const urls = new Set();

  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".md") continue;
    const markdown = await readFile(path.join(CONTENT_DIR, file), "utf8");
    for (const match of markdown.matchAll(IMAGE_URL_RE)) {
      urls.add(match[1]);
    }
  }

  return [...urls];
}

async function readDimensions(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`⚠ ${url} returned HTTP ${res.status}`);
      return { url, width: null, height: null };
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      console.warn(`⚠ Could not read dimensions for ${url}`);
      return { url, width: null, height: null };
    }
    return { url, width: metadata.width, height: metadata.height };
  } catch (err) {
    console.warn(`⚠ Error reading ${url}: ${err.message}`);
    return { url, width: null, height: null };
  }
}

async function writeMetadata(images) {
  await writeFile(
    OUTPUT,
    JSON.stringify({ generatedAt: new Date().toISOString(), images }, null, 2)
  );
  console.log(`✓ Content image metadata written to ${OUTPUT}`);
  console.log(`  ${images.length} images processed`);
}

async function main() {
  const urls = await collectImageUrls();
  const images = [];
  for (const url of urls) {
    images.push(await readDimensions(url));
  }
  await writeMetadata(images);
}

main().catch(async (err) => {
  // Build robustness: log, write a valid file, and exit 0.
  console.error("Failed to generate content image metadata:", err);
  try {
    await writeMetadata([]);
  } catch {
    /* ignore — nothing more we can do */
  }
});
