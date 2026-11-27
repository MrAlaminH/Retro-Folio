import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { generateContentImageMeta } from "../scripts/generate-content-image-meta.mjs";

test("preserves existing valid dimensions and timestamp when offline or fetch fails", async () => {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "content-meta-"));
  try {
    const contentDir = path.join(tmpDir, "content");
    const outputPath = path.join(tmpDir, "content-image-meta.json");
    await mkdir(contentDir, { recursive: true });
    await writeFile(
      path.join(contentDir, "demo.md"),
      "![Demo](https://example.com/demo.png)\n"
    );

    const existing = {
      generatedAt: "2026-01-01T00:00:00.000Z",
      images: [
        { url: "https://example.com/demo.png", width: 960, height: 720 },
      ],
    };
    await writeFile(outputPath, JSON.stringify(existing, null, 2));

    await generateContentImageMeta({
      contentDir,
      outputPath,
      fetchImpl: async () => {
        throw new Error("ENOTFOUND");
      },
    });

    const after = JSON.parse(await readFile(outputPath, "utf8"));
    assert.deepEqual(after, existing);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
});

test("fetches dimensions for new images concurrently and updates metadata", async () => {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "content-meta-"));
  try {
    const contentDir = path.join(tmpDir, "content");
    const outputPath = path.join(tmpDir, "content-image-meta.json");
    await mkdir(contentDir, { recursive: true });
    await writeFile(
      path.join(contentDir, "demo.md"),
      [
        "![One](https://example.com/one.png)",
        "![Two](https://example.com/two.png)",
      ].join("\n")
    );

    const pngOne = await sharp({
      create: { width: 120, height: 80, channels: 3, background: "#000000" },
    })
      .png()
      .toBuffer();
    const pngTwo = await sharp({
      create: { width: 200, height: 100, channels: 3, background: "#ffffff" },
    })
      .png()
      .toBuffer();

    await generateContentImageMeta({
      contentDir,
      outputPath,
      fetchImpl: async (url) => {
        const body = url.endsWith("one.png") ? pngOne : pngTwo;
        return new Response(body, { status: 200 });
      },
    });

    const result = JSON.parse(await readFile(outputPath, "utf8"));
    assert.equal(typeof result.generatedAt, "string");
    assert.deepEqual(result.images, [
      { url: "https://example.com/one.png", width: 120, height: 80 },
      { url: "https://example.com/two.png", width: 200, height: 100 },
    ]);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
});
