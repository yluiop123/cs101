/**
 * 视觉验收截图（全站关键页面 × 桌面/移动/暗色）。
 * 用法：先 pnpm build，再 pnpm preview --port 4322，然后 node scripts/screenshot.mjs
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322/cs101/';
const OUT = 'screenshots';

const shots = [
  { name: 'home-desktop', path: '', width: 1440, height: 900 },
  { name: 'tech-stack-desktop', path: 'tech-stack/', width: 1440, height: 900 },
  { name: 'domain-desktop', path: 'domain/', width: 1440, height: 1000 },
  { name: 'domain-mobile', path: 'domain/', width: 390, height: 844 },
  { name: 'domain-dark', path: 'domain/', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'series-desktop', path: 'tutorials/java/', width: 1440, height: 900 },
  { name: 'chapter-desktop', path: 'tutorials/java/01-intro/', width: 1440, height: 900 },
  { name: 'route-desktop', path: 'tech-stack/java/', width: 1440, height: 900 },
  { name: 'cs-desktop', path: 'computer-science/zh/', width: 1440, height: 1000 },
  { name: 'cs-en-desktop', path: 'computer-science/en/', width: 1440, height: 1000 },
  { name: 'cs-mobile', path: 'computer-science/zh/', width: 390, height: 844 },
  { name: 'cs-dark', path: 'computer-science/zh/', width: 1440, height: 1000, colorScheme: 'dark' },
  { name: 'home-dark', path: '', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'chapter-dark', path: 'tutorials/java/01-intro/', width: 1440, height: 900, colorScheme: 'dark' },
  { name: 'home-mobile', path: '', width: 390, height: 844 },
  { name: 'chapter-mobile', path: 'tutorials/java/01-intro/', width: 390, height: 844 },
  { name: 'route-mobile', path: 'tech-stack/java/', width: 390, height: 844 },
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
