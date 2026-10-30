# 版本台账（VERSIONS.md）

> 自动生成，请勿手改；更新依赖后运行 `pnpm versions`。生成日期：2026-10-30

## 运行环境

| 项 | 版本 |
| --- | --- |
| Node.js | 24.22.1（项目目标：最新 LTS，见 `.nvmrc`） |
| pnpm | 12.15.0 |

## 直接依赖

| 类型 | 包 | 实际版本 |
| --- | --- | --- |
| prod | `@astrojs/react` | 7.1.1 |
| prod | `@astrojs/sitemap` | 3.7.4 |
| prod | `@astrojs/starlight` | 0.42.7 |
| prod | `@astrojs/starlight-tailwind` | 5.0.0 |
| prod | `@tailwindcss/vite` | 4.3.3 |
| prod | `astro` | 7.4.2 |
| prod | `clsx` | 2.1.1 |
| prod | `minisearch` | 7.2.0 |
| prod | `react` | 19.3.1 |
| prod | `react-dom` | 19.3.1 |
| prod | `tailwind-merge` | 3.7.0 |
| prod | `tailwindcss` | 4.3.3 |
| dev | `@astrojs/check` | 0.9.12 |
| dev | `@playwright/test` | 1.64.1 |
| dev | `@types/react` | 19.3.0 |
| dev | `@types/react-dom` | 19.3.0 |
| dev | `github-slugger` | 2.0.0 |
| dev | `typescript` | 6.0.3 |

## 已批准的版本例外

以下依赖没有跟随“最新版”，原因是上游工具链不兼容；升级前需复查。

| 包 | 锁定 | 原因 | 复查条件 |
| --- | --- | --- | --- |
| `typescript` | 6.x | astro check（@astrojs/check 最新版）尚不支持 TypeScript 7，官方要求 TS 6。 | 当 @astrojs/check 支持 TS 7 或 @astrojs/ts-content-mapper 支持 TS 7.0 后升级。 |

## 说明

- 依赖声明为安装时的 caret 范围，精确版本由 `pnpm-lock.yaml` 锁定，CI 使用 `--frozen-lockfile`。
- 升级流程：`pnpm up --latest` → `pnpm check` → `pnpm build` → 更新本台账 → 冒烟测试。
- 例外依赖（typescript）每次升级前先复查是否已可移除。
