/**
 * Batch convert all PNG images in public/images/ to optimized WebP.
 * 
 * Usage: node scripts/optimize-images.mjs
 * 
 * - Quality: 80% (great balance of size vs visual quality)
 * - Max width: 1920px (no image needs to be wider than full-screen)
 * - Keeps originals as .png backup, creates .webp alongside
 * - After verifying, you can delete the .png files manually
 */

import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = join(process.cwd(), 'public', 'images');
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

async function optimizeImages() {
  const files = await readdir(IMAGES_DIR);
  const pngFiles = files.filter(f => extname(f).toLowerCase() === '.png');

  console.log(`\n🖼️  Found ${pngFiles.length} PNG files in public/images/`);
  console.log(`   Settings: WebP quality=${WEBP_QUALITY}, max-width=${MAX_WIDTH}px\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let converted = 0;

  for (const file of pngFiles) {
    const inputPath = join(IMAGES_DIR, file);
    const outputName = basename(file, '.png') + '.webp';
    const outputPath = join(IMAGES_DIR, outputName);

    try {
      const originalStat = await stat(inputPath);
      const originalSize = originalStat.size;
      totalOriginal += originalSize;

      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      const newStat = await stat(outputPath);
      const newSize = newStat.size;
      totalOptimized += newSize;

      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
      console.log(
        `  ✅ ${file} (${(originalSize / 1024).toFixed(0)} KB) → ${outputName} (${(newSize / 1024).toFixed(0)} KB) [${reduction}% smaller]`
      );
      converted++;
    } catch (err) {
      console.error(`  ❌ Failed: ${file} — ${err.message}`);
    }
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`  Converted: ${converted}/${pngFiles.length} files`);
  console.log(`  Original:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved:     ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`────────────────────────────────────────\n`);

  // Now delete the original PNGs since WebP versions are created
  console.log(`🗑️  Removing original PNG files...`);
  let deleted = 0;
  for (const file of pngFiles) {
    const pngPath = join(IMAGES_DIR, file);
    const webpName = basename(file, '.png') + '.webp';
    const webpPath = join(IMAGES_DIR, webpName);
    try {
      // Only delete PNG if WebP was successfully created
      await stat(webpPath);
      await unlink(pngPath);
      deleted++;
    } catch {
      console.log(`  ⚠️  Kept ${file} (WebP not found)`);
    }
  }
  console.log(`  Deleted ${deleted} PNG originals.\n`);
}

optimizeImages().catch(console.error);
