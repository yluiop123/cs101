/** 站点部署在子路径时，生成带 base 前缀的站内链接。 */
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
