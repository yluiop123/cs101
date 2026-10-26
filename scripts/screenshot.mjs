/**
 * 生成 M2 视觉验收截图（首页 / 系列页 / 章节页 × 桌面/移动/暗色）。
 * 用法：先 pnpm build，再 pnpm preview --port 4322，然后 node scripts/screenshot.mjs
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322/cs101/';
const OUT = 'screenshots';

const shots = [
  { name: 'home-desktop', path: '', width: 1440, height: 900 },
  { name: 'series-desktop', path: 'tutorials/git/', width: 1440, height: 900 },
  { name: 'chapter-desktop', path: 'tutorials/git/01-introduction/', width: 1440, height: 900 },
  { name: 'home-dark', path: '', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'chapter-dark', path: 'tutorials/git/01-introduction/', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'home-mobile', path: '', width: 390, height: 844 },
  { name: 'chapter-mobile', path: 'tutorials/git/01-introduction/', width: 390, height: 844 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    colorScheme: shot.colorScheme ?? 'light',
    deviceScaleFactor: 1,
  });
  const response = await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' });
  if (!response || !response.ok()) {
    throw new Error(`${shot.name}: HTTP ${response?.status()} for ${BASE}${shot.path}`);
  }
  await page.screenshot({ path: `${OUT}/${shot.name}.png` });
  console.log(`saved ${OUT}/${shot.name}.png`);
  await page.close();
}

await browser.close();
