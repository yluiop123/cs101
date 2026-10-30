/**
 * M5 冒烟：⌘K 搜索、进度标记、代码块「运行实例」（CodePen 外链）。Monaco 站内演练场已移除。
 * 前提：pnpm build && pnpm preview --port 4322
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322/cs101/';
const results = [];
const check = (name, ok, extra = '') => {
  results.push({ name, ok, extra });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` — ${extra}` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. 首页 ⌘K 搜索
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('.cs-search-trigger');
await page.waitForSelector('.cs-search-field input');
await page.fill('.cs-search-field input', '分支');
await page.waitForSelector('.cs-search-results li button', { timeout: 15000 });
const hitCount = await page.locator('.cs-search-results li button').count();
const firstHit = await page.locator('.cs-search-results li button').first().innerText();
check('⌘K 中文搜索', hitCount > 0, `${hitCount} 条，首条：${firstHit.split('\n')[0]}`);
await page.screenshot({ path: 'screenshots/search-desktop.png' });
await page.keyboard.press('Escape');

// 2. 章节完成标记
await page.goto(`${BASE}tutorials/git/02-basic/`, { waitUntil: 'networkidle' });
const completeButton = page.locator('button:has-text("标记本章完成")');
await completeButton.waitFor({ timeout: 10000 });
await completeButton.scrollIntoViewIfNeeded();
await page.waitForTimeout(800); // 等 client:visible 岛完成水合
await completeButton.click();
await page.waitForSelector('button:has-text("已完成本章")', { timeout: 10000 });
const doneText = await page.locator('button:has-text("已完成本章")').innerText();
check('章节完成标记', doneText.includes('已完成'), doneText);
const stored = await page.evaluate(() => localStorage.getItem('cs101:progress:v1'));
check('进度写入 localStorage', Boolean(stored && stored.includes('tutorials/git/02-basic')));

// 3. 系列页进度联动
await page.goto(`${BASE}tutorials/git/`, { waitUntil: 'networkidle' });
await page.waitForSelector('[data-series-progress]');
const progressText = await page.locator('[data-series-progress]').innerText();
check('系列页进度统计', progressText.includes('已完成 1/7'), progressText);

// 4. 代码块「运行实例」→ 新标签页打开 CodePen（不再跳转站内演练场）
await page.goto(`${BASE}tutorials/html/01-overview/`, { waitUntil: 'networkidle' });
const runButton = page.locator('.cs-code-run').first();
await runButton.waitFor({ timeout: 10000 });
const [popup] = await Promise.all([
  page.waitForEvent('popup', { timeout: 15000 }),
  runButton.click(),
]);
const popupUrl = popup ? popup.url() : '';
check('运行实例打开 CodePen', popupUrl.startsWith('https://codepen.io/'), popupUrl.slice(0, 60));
if (popup) await popup.close();
await page.screenshot({ path: 'screenshots/code-run-desktop.png' });

await browser.close();
const failed = results.filter((item) => !item.ok);
console.log(`\n${results.length - failed.length}/${results.length} 通过`);
if (failed.length > 0) process.exitCode = 1;
