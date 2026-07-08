import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site-config";
import { withBasePath } from "@/lib/asset-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Arborn",
    description: "Premium nightwear for everyday comfort.",
    start_url: ".",
    display: "standalone",
    background_color: "#fdf7f4",
    theme_color: "#bd6e80",
    icons: [
      {
        src: withBasePath("/icon.png"),
        sizes: "606x607",
        type: "image/png",
      },
    ],
  };
}
