import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gmac Group",
    short_name: "Gmac Group",
    description:
      "Gmac Group — research and advisory firm building capability across Africa.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E1A2B",
    theme_color: "#0E1A2B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}