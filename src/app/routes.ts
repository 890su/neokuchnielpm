import { site } from "@lib/site";

export const publicRoutes = site.pages.map((page) => ({
  ...page,
  legacyHtmlPath: page.url === "/" ? "/index.html" : `${page.url}.html`
}));
