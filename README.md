# Neo Kuchnie Pixel Clone

Astro + TypeScript project for a pixel-faithful clone of `neokuchnie.pl`.

The public pages intentionally render preserved raw HTML from the original site (`src/lib/original/*.html`) and process it at request time for local routing, SEO meta completion, and Telegram form delivery. This keeps the layout, generated CSS, fonts, images, animations, sliders, and LP-constructor behavior as close to the original as possible while adding a deployable modern project shell.

## Site Map

Discovered and preserved pages:

- `/` and `/index.html` -> `src/lib/original/index.html`
- `/about` and `/about.html` -> `src/lib/original/about.html`
- `/oferta` and `/oferta.html` -> `src/lib/original/oferta.html`
- `/faq` and `/faq.html` -> `src/lib/original/faq.html`
- `/kontakty` and `/kontakty.html` -> `src/lib/original/kontakty.html`
- `/admin` -> GrapesJS WYSIWYG helper, password `admin123`

Original system resources checked:

- `https://neokuchnie.pl/robots.txt`
- `https://neokuchnie.pl/sitemap.xml`

Local project resources:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/_headers`
- `public/_redirects`

## Dependencies

Major external runtime dependencies preserved from the original page:

- `cdn21.lpmtr.net` for LP-constructor CSS/JS, fonts, icons, images
- `m-files.cdn1.cc` and `m-files.cdnvideo.ru` for media assets
- Google Maps embed
- YouTube/VK video scripts when referenced by original generated pages

Project dependencies:

- Astro
- TypeScript
- `@astrojs/cloudflare`
- `@astrojs/check`

## Environment

Copy `.env.example` to `.env` for local development:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Cloudflare Pages should define the same variables in project settings.

## Forms

All submitted forms are intercepted in the browser and posted to `/api/telegram`.

Telegram messages include:

- URL page
- date and time
- IP when available from Cloudflare/request headers
- User-Agent
- Referrer
- all submitted field values

No third-party form service is used.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Cloudflare Pages

Recommended settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`
- Environment variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

The project uses `@astrojs/cloudflare` with server output so the Telegram API route works on Cloudflare Pages Functions.

## Pixel-Perfect Policy

The raw generated source is treated as the visual source of truth. Do not manually simplify LP-constructor classes, inline styles, generated IDs, or external CDN paths unless replacing them with verified pixel-equivalent Astro components after visual regression testing.

Recommended visual QA viewports:

- 320px
- 375px
- 480px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px
