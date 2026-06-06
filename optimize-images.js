const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const coversDir = path.join(__dirname, 'assets', 'covers');

const images = [
  'AIGC助力运营.png',
  'AI斩书.png',
  '未来慧学.png',
  '足球赛事.png'
];

async function optimizeImage(filename) {
  const inputPath = path.join(coversDir, filename);
  const name = path.parse(filename).name;

  // 获取原始文件大小
  const originalSize = fs.statSync(inputPath).size;

  try {
    // 获取图片信息
    const metadata = await sharp(inputPath).metadata();
    console.log(`\n处理: ${filename}`);
    console.log(`  原始尺寸: ${metadata.width}x${metadata.height}`);
    console.log(`  原始大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    // 计算目标宽度（保持比例，最大宽度800px）
    const targetWidth = Math.min(800, metadata.width);

    // 生成WebP格式
    const webpPath = path.join(coversDir, `${name}.webp`);
    await sharp(inputPath)
      .resize(targetWidth, null, { fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;
    console.log(`  WebP大小: ${(webpSize / 1024).toFixed(2)} KB`);
    console.log(`  压缩率: ${((1 - webpSize / originalSize) * 100).toFixed(1)}%`);

    // 生成优化后的PNG（备用）
    const optimizedPngPath = path.join(coversDir, `${name}-optimized.png`);
    await sharp(inputPath)
      .resize(targetWidth, null, { fit: 'inside' })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(optimizedPngPath);

    const optimizedSize = fs.statSync(optimizedPngPath).size;
    console.log(`  优化PNG大小: ${(optimizedSize / 1024).toFixed(2)} KB`);

    return {
      original: originalSize,
      webp: webpSize,
      optimizedPng: optimizedSize
    };
  } catch (error) {
    console.error(`  错误: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('=== 图片优化分析报告 ===\n');

  const results = [];

  for (const img of images) {
    const result = await optimizeImage(img);
    if (result) {
      results.push({ filename: img, ...result });
    }
  }

  console.log('\n=== 优化汇总 ===\n');
  console.log('文件名 | 原始大小 | WebP大小 | 压缩率');
  console.log('-------|----------|----------|-------');

  for (const r of results) {
    const compression = ((1 - r.webp / r.original) * 100).toFixed(1);
    console.log(`${r.filename} | ${(r.original / 1024 / 1024).toFixed(2)} MB | ${(r.webp / 1024).toFixed(2)} KB | ${compression}%`);
  }
}

main().catch(console.error);
