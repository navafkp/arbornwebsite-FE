// next/image with `images.unoptimized: true` does NOT auto-prefix local image
// paths with `basePath` (unlike next/link, which does this for you). On
// GitHub Pages the site is served under /<repo-name>/, so local asset paths
// need this prefix manually. NEXT_PUBLIC_* env vars are inlined at build
// time, so this works in client components too.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string) {
  return `${BASE_PATH}${path}`;
}
