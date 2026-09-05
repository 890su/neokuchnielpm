import { formBridgeScript } from "./formBridge";
import { site } from "./site";

const localRouteMap: Array<[RegExp, string]> = [
  [/(href=["'])https:\/\/neokuchnie\.pl\/about(["'])/g, "$1/about$2"],
  [/(href=["'])https:\/\/neokuchnie\.pl\/oferta(["'])/g, "$1/oferta$2"],
  [/(href=["'])https:\/\/neokuchnie\.pl\/faq(["'])/g, "$1/faq$2"],
  [/(href=["'])https:\/\/neokuchnie\.pl\/kontakty(["'])/g, "$1/kontakty$2"],
  [/(href=["'])\/about(["'])/g, "$1/about$2"],
  [/(href=["'])\/oferta(["'])/g, "$1/oferta$2"],
  [/(href=["'])\/faq(["'])/g, "$1/faq$2"],
  [/(href=["'])\/kontakty(["'])/g, "$1/kontakty$2"],
  [/(href=["'])about\.html(["'])/g, "$1/about$2"],
  [/(href=["'])oferta\.html(["'])/g, "$1/oferta$2"],
  [/(href=["'])faq\.html(["'])/g, "$1/faq$2"],
  [/(href=["'])kontakty\.html(["'])/g, "$1/kontakty$2"],
  [/(href=["'])index\.html(["'])/g, "$1/$2"]
];

export function renderRawPage(source: string, pathName: string): string {
  let html = source;
  const canonical = new URL(pathName, site.origin).toString().replace(/\/$/, pathName === "/" ? "/" : "");

  for (const [pattern, replacement] of localRouteMap) {
    html = html.replace(pattern, replacement);
  }

  html = normalizeDocumentShell(html);
  html = ensureMeta(html, "title", site.title);
  html = ensureMetaName(html, "description", site.description);
  html = ensureMetaName(html, "keywords", site.keywords);
  html = ensureMetaName(html, "robots", "index, follow");
  html = ensureCanonical(html, canonical);
  html = ensureMetaProperty(html, "og:title", site.title);
  html = ensureMetaProperty(html, "og:description", site.description);
  html = ensureMetaProperty(html, "og:image", site.ogImage);
  html = ensureMetaProperty(html, "og:url", canonical);
  html = ensureMetaProperty(html, "og:type", "website");
  html = ensureMetaName(html, "twitter:card", "summary_large_image");
  html = ensureMetaName(html, "twitter:title", site.title);
  html = ensureMetaName(html, "twitter:description", site.description);
  html = ensureMetaName(html, "twitter:image", site.ogImage);
  html = ensureJsonLd(html);
  html = normalizeH1(html, pathName);
  html = html.replace("</head>", `${responsiveSafetyStyle}\n</head>`);
  html = html.replace("</body>", `${accessibilityPatchScript}\n${formBridgeScript}\n</body>`);

  return html;
}

function normalizeDocumentShell(html: string): string {
  const normalized = html
    .replace(/<html(?![^>]*\slang=)([^>]*)>/i, '<html lang="pl"$1>')
    .replace(/(href|src)=["']\/\/([^"']+)["']/gi, '$1="https://$2"')
    .replace(/url\(["']\/\/([^"')]+)["']\)/gi, 'url("https://$1")')
    .replace(/<div id=["']site_wrapper1["'](?![^>]*\srole=)([^>]*)>/i, '<div id="site_wrapper1" role="main"$1>');

  const scriptIndex = normalized.search(/<script\b/i);
  if (scriptIndex === -1) {
    return addIframeTitles(normalized);
  }

  return addIframeTitles(normalized.slice(0, scriptIndex)) + normalized.slice(scriptIndex);
}

function addIframeTitles(html: string): string {
  return html.replace(/<iframe(?![^>]*\stitle=)([^>]*)>/gi, '<iframe title="Mapa Neo Kuchnie"$1>');
}

const responsiveSafetyStyle = `<style id="astro-responsive-safety">
.astro-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

[id^="m-wrapper-cookies-"] {
  left: 20px !important;
  right: auto !important;
  bottom: 20px !important;
  transform: none !important;
}

@media (max-width: 500px) {
  [id^="m-wrapper-cookies-"] {
    left: 10px !important;
    right: auto !important;
    bottom: 10px !important;
  }
}

@media (max-width: 1199px) {
  html,
  body,
  #site_wrapper1 {
    min-width: 0 !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  .blk_section_inner,
  .section__content-wrapper,
  .slide__content {
    max-width: 100vw !important;
  }
}

@media (min-width: 501px) and (max-width: 1199px) {
  .blk_section_inner,
  .section__content-wrapper,
  .slide__content {
    width: 100% !important;
  }
}

@media (max-width: 370px) {
  .blk_section_inner,
  .section__content-wrapper,
  .slide__content {
    width: 100% !important;
  }
}
</style>`;

const accessibilityPatchScript = `<script>
(function () {
  "use strict";

  function textOrLabel(node, fallback) {
    var text = (node.textContent || "").trim();
    return text || node.getAttribute("title") || fallback;
  }

  function patchInteractiveElements() {
    document.querySelectorAll("iframe:not([title])").forEach(function (frame) {
      frame.setAttribute("title", "Mapa Neo Kuchnie");
    });

    document.querySelectorAll("a:not([href])").forEach(function (link) {
      link.setAttribute("href", "#");
      link.setAttribute("data-astro-empty-href", "true");
    });

    document.querySelectorAll("a[role='button'], button, .m-slider__control").forEach(function (control) {
      if (control.getAttribute("aria-label")) return;
      var fallback = control.classList.contains("m-slider__control_left")
        ? "Poprzedni slajd"
        : control.classList.contains("m-slider__control_right")
          ? "Nastepny slajd"
          : "Przycisk";
      control.setAttribute("aria-label", textOrLabel(control, fallback));
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest ? event.target.closest("a[data-astro-empty-href='true']") : null;
    if (link) event.preventDefault();
  });

  patchInteractiveElements();
  document.addEventListener("DOMContentLoaded", patchInteractiveElements);
  window.addEventListener("load", patchInteractiveElements);
  setTimeout(patchInteractiveElements, 1500);

  if ("MutationObserver" in window) {
    new MutationObserver(patchInteractiveElements).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
</script>`;

function normalizeH1(html: string, pathName: string): string {
  const h1Matches = [...html.matchAll(/<\/?h1\b[^>]*>/gi)];
  if (h1Matches.length === 0) {
    const page = site.pages.find((item) => item.url === pathName || (pathName === "/" && item.url === "/"));
    const heading = page?.heading || site.title;
    return html.replace("<body", `<body`).replace(/(<body[^>]*>)/i, `$1<h1 class="astro-sr-only">${escapeHtml(heading)}</h1>`);
  }

  let openCount = 0;
  return html.replace(/<\/?h1\b([^>]*)>/gi, (tag, attrs: string) => {
    if (/^<h1/i.test(tag)) {
      openCount += 1;
      return openCount === 1 ? tag : `<h2${attrs}>`;
    }
    return openCount === 1 ? tag : "</h2>";
  });
}

export function htmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff"
    }
  });
}

function ensureMeta(html: string, tag: "title", value: string): string {
  if (new RegExp(`<${tag}[\\s\\S]*?</${tag}>`, "i").test(html)) {
    return html.replace(new RegExp(`<${tag}[\\s\\S]*?</${tag}>`, "i"), `<${tag}>${escapeHtml(value)}</${tag}>`);
  }
  return html.replace("</head>", `<${tag}>${escapeHtml(value)}</${tag}>\n</head>`);
}

function ensureMetaName(html: string, name: string, content: string): string {
  const pattern = new RegExp(`<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]*>`, "i");
  const tag = `<meta name="${name}" content="${escapeHtml(content)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function ensureMetaProperty(html: string, property: string, content: string): string {
  const pattern = new RegExp(`<meta[^>]+property=["']${escapeRegExp(property)}["'][^>]*>`, "i");
  const tag = `<meta property="${property}" content="${escapeHtml(content)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `${tag}\n</head>`);
}

function ensureCanonical(html: string, href: string): string {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}">`;
  return /<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, tag)
    : html.replace("</head>", `${tag}\n</head>`);
}

function ensureJsonLd(html: string): string {
  if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) return html;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Neo Kuchnie",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Adama Branickiego 11 / lok 197D",
      addressLocality: "Warszawa",
      postalCode: "02-972",
      addressCountry: "PL"
    },
    telephone: "+48662755566",
    url: site.origin,
    openingHours: ["Mo-Fr 10:00-18:00"]
  };

  return html.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`
  );
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
