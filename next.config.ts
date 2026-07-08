import type { NextConfig } from "next";

// --- AWS / Node server config (in use before the GitHub Pages static export) ---
// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "images.unsplash.com" },
//       { protocol: "https", hostname: "i.pravatar.cc" },
//     ],
//   },
// };

// --- GitHub Pages static export config ---
// To revert to the Node server (AWS): delete this block and uncomment the
// block above. Also see the commented server logic in
// src/app/products/page.tsx and src/app/contact/page.tsx.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
