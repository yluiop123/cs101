#!/usr/bin/env node
/**
 * 生成 VERSIONS.md 版本台账。
 * 目的：项目所有依赖按“执行时最新稳定版”安装，但需要一份可审计的“实际跑的是什么版本”。
 * 用法：pnpm versions
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** 已批准的版本例外：出于工具链兼容性暂时锁定，需定期复查。 */
const EXCEPTIONS = [
  {
    name: 'typescript',
    pinned: '6.x',
    reason: 'astro check（@astrojs/check 最新版）尚不支持 TypeScript 7，官方要求 TS 6。',
    revisit: '当 @astrojs/check 支持 TS 7 或 @astrojs/ts-content-mapper 支持 TS 7.0 后升级。',
  },
];

function pnpmJson(args) {
  const raw = execSync(`pnpm ${args}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(raw);
}

const pnpmVersion = execSync('pnpm -v', { encoding: 'utf8' }).trim();
const nodeVersion = process.versions.node;
const project = pnpmJson('list --depth 0 --json')[0] ?? {};

const rows = [];
for (const [section, deps] of [
  ['dependencies', project.dependencies ?? {}],
  ['devDependencies', project.devDependencies ?? {}],
]) {
  for (const [name, info] of Object.entries(deps)) {
    rows.push({ section, name, version: info.version });
  }
}
rows.sort((a, b) => a.section.localeCompare(b.section) || a.name.localeCompare(b.name));

const exceptionNames = new Set(EXCEPTIONS.map((e) => e.name));
const now = new Date().toISOString().slice(0, 10);

const lines = [
  '# 版本台账（VERSIONS.md）',
  '',
  `> 自动生成，请勿手改；更新依赖后运行 \`pnpm versions\`。生成日期：${now}`,
  '',
  '## 运行环境',
  '',
  '| 项 | 版本 |',
  '| --- | --- |',
  `| Node.js | ${nodeVersion}（固定版本，见 \`.nvmrc\`；CI 同源读取） |`,
  `| pnpm | ${pnpmVersion} |`,
  '',
  '## 直接依赖',
  '',
  '| 类型 | 包 | 实际版本 |',
  '| --- | --- | --- |',
  ...rows.map((r) => `| ${r.section === 'dependencies' ? 'prod' : 'dev'} | \`${r.name}\` | ${r.version} |`),
  '',
  '## 已批准的版本例外',
  '',
  '以下依赖没有跟随“最新版”，原因是上游工具链不兼容；升级前需复查。',
  '',
  '| 包 | 锁定 | 原因 | 复查条件 |',
  '| --- | --- | --- | --- |',
  ...EXCEPTIONS.map((e) => `| \`${e.name}\` | ${e.pinned} | ${e.reason} | ${e.revisit} |`),
  '',
  '## 说明',
  '',
  '- 依赖声明为安装时的 caret 范围，精确版本由 `pnpm-lock.yaml` 锁定，CI 使用 `--frozen-lockfile`。',
  '- Node.js 版本以 `.nvmrc` 为准：本地用 `nvm use`，CI 由 `actions/setup-node` 读取同一文件。',
  '- 升级流程：`pnpm up --latest` → `pnpm check` → `pnpm build` → 更新本台账 → 冒烟测试。',
  `- 例外依赖（${[...exceptionNames].join(', ')}）每次升级前先复查是否已可移除。`,
  '',
];

writeFileSync(resolve(process.cwd(), 'VERSIONS.md'), lines.join('\n'), 'utf8');
console.log(`VERSIONS.md 已生成：${rows.length} 个直接依赖，${EXCEPTIONS.length} 个例外`);
