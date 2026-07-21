import { defineConfig } from "astro/config";

export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  compressHTML: true
});
