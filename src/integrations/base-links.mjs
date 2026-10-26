import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro 不会给 Markdown 里手写的根路径链接自动加 `base`。
 * 这个集成在构建完成后统一给 HTML 里的根路径 `href` / `src` 补上站点 base，
 * 让内容作者始终写 `/tech-stack/` 这类站点根路径，而不必关心部署子路径。
 */
export default function baseLinks(base = '/') {
  const prefix = base.replace(/\/+$/, '');
  if (!prefix) {
    return { name: 'cs101:base-links', hooks: {} };
  }

  const shouldSkip = (rest) =>
    rest.startsWith('//') || rest === prefix.slice(1) + '/' || rest.startsWith(prefix.slice(1) + '/');

  return {
    name: 'cs101:base-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let files = 0;
        let rewrites = 0;
        const pattern = /(href|src)="\/(?!\/)((?:[^"]*))"/g;

        async function walk(directory) {
          const entries = await readdir(directory, { withFileTypes: true });
          for (const entry of entries) {
            const full = join(directory, entry.name);
            if (entry.isDirectory()) {
              await walk(full);
              continue;
            }
            if (extname(full) !== '.html') continue;
            files += 1;
            const source = await readFile(full, 'utf8');
            const output = source.replace(pattern, (match, attr, rest) => {
              if (shouldSkip(rest)) return match;
              rewrites += 1;
              return `${attr}="${prefix}/${rest}"`;
            });
            if (output !== source) await writeFile(full, output, 'utf8');
          }
        }

        await walk(root);
        logger.info(`base-links: ${files} 个 HTML，补全 ${rewrites} 个根路径链接（base: ${prefix}）`);
      },
    },
  };
}
