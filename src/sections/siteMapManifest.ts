import { publicRoutes } from "../app/routes";

export const siteMapManifest = {
  discoveredPages: publicRoutes,
  preservedSource: "src/lib/original/*.html",
  criticalExternalDependencies: [
    "https://cdn21.lpmtr.net/web/build/pages/public.bundle.css",
    "https://cdn21.lpmtr.net/web/build/pages/public.bundle.js",
    "https://cdn21.lpmtr.net/web/user/fonts/",
    "https://m-files.cdn1.cc/lpfile/",
    "https://m-files.cdnvideo.ru/lpfile/",
    "https://www.google.com/maps/embed",
    "https://www.youtube.com/iframe_api",
    "https://vk.com/js/api/videoplayer.js"
  ],
  formTransport: "/api/telegram"
} as const;
