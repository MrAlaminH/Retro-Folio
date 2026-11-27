/**
 * Build-time script: generates real dimensions for remote images embedded in
 * project-detail markdown (public/content/*.md).
 *
 * Scans the markdown files for image URLs, reuses previously cached valid
 * dimensions from data/content-image-meta.json, fetches only missing entries
 * concurrently via sharp, and skips writing when dimensions haven't changed.
 *
 * The script never fails the build: any per-image error records null dims (while
 * preserving any previously cached valid dims) and continues, and a fatal error
 * still preserves/writes a valid file.
 *
 * Run: node scripts/generate-content-image-meta.mjs
 * (Called automatically before `next build` via the "prebuild" script.)
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_CONTENT_DIR = path.join(ROOT, "public", "content");
const DEFAULT_OUTPUT = path.join(ROOT, "data", "content-image-meta.json");

const IMAGE_URL_RE = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)/g;
const FETCH_TIMEOUT_MS = 10_000;

async function collectImageUrls(contentDir) {
  if (!existsSync(contentDir)) {
    console.warn("⚠ Content directory not found — skipping metadata generation.");
    return [];
  }

  const files = (await readdir(contentDir)).sort();
  const urls = new Set();

  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".md") continue;
    const markdown = await readFile(path.join(contentDir, file), "utf8");
    for (const match of markdown.matchAll(IMAGE_URL_RE)) {
      urls.add(match[1]);
    }
  }

  return [...urls];
}

async function readExistingMetadata(outputPath) {
  if (!existsSync(outputPath)) {
    return null;
  }
  try {
    const raw = await readFile(outputPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.images) ? parsed.images : null;
  } catch {
    return null;
  }
}

async function readDimensions(url, fetchImpl) {
  try {
    const res = await fetchImpl(url, {
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

async function writeMetadata(outputPath, images) {
  await writeFile(
    outputPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), images }, null, 2)
  );
  console.log(`✓ Content image metadata written to ${outputPath}`);
  console.log(`  ${images.length} images processed`);
}

function hasValidDimensions(entry) {
  return (
    typeof entry?.width === "number" &&
    entry.width > 0 &&
    typeof entry?.height === "number" &&
    entry.height > 0
  );
}

/**
 * Generates or updates content image metadata from markdown files.
 * Preserves existing valid dimensions when offline or when a fetch fails,
 * and avoids rewriting the output file when nothing changed.
 */
export async function generateContentImageMeta({
  contentDir = DEFAULT_CONTENT_DIR,
  outputPath = DEFAULT_OUTPUT,
  fetchImpl = globalThis.fetch,
} = {}) {
  const existingImages = await readExistingMetadata(outputPath);
  const existingMap = new Map(
    (existingImages ?? []).map((img) => [img.url, img])
  );

  const urls = await collectImageUrls(contentDir);
  const images = await Promise.all(
    urls.map(async (url) => {
      const cached = existingMap.get(url);
      if (hasValidDimensions(cached)) {
        return { url, width: cached.width, height: cached.height };
      }
      return readDimensions(url, fetchImpl);
    })
  );

  if (
    existingImages !== null &&
    JSON.stringify(existingImages) === JSON.stringify(images)
  ) {
    console.log(
      `✓ Content image metadata up to date (${images.length} images)`
    );
    return images;
  }

  await writeMetadata(outputPath, images);
  return images;
}

const isMainModule =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === __filename;

if (isMainModule) {
  generateContentImageMeta().catch(async (err) => {
    // Build robustness: log, ensure a valid file exists, and exit 0.
    console.error("Failed to generate content image metadata:", err);
    try {
      const existing = await readExistingMetadata(DEFAULT_OUTPUT);
      if (existing === null) {
        await writeMetadata(DEFAULT_OUTPUT, []);
      }
    } catch {
      /* ignore — nothing more we can do */
    }
  });
}
