import { defineConfig, sessionDrivers } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile"
  }),
  session: {
    driver: sessionDrivers.lruCache({
      max: 500
    })
  },
  prefetch: {
    prefetchAll: true
  },
  compressHTML: true
});
