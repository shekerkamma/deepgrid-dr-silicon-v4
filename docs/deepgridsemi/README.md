# deepgridsemi.com asset inventory (2026-09-25)

User: "leverage deepgrid images from https://deepgridsemi.com/ ... extract all images from this website,
then leverage these images", and make the home menu entry "Deepgrid Semi (icon) very similar to
deepgridsemi.com".

## How it was extracted

- Research order: local first (`deepgrid-clone/` turned out to be a copy of this site, not of
  deepgridsemi.com), GBrain (DeepGrid research, no site imagery), then the site itself.
- deepgridsemi.com is a Vite/React single-page app: the HTML is a 1 KB shell, so plain fetches and
  Exa's crawl (web_fetch) return little or no content for most routes (Exa returned text for
  /about/story, nothing for /products/dg-a100). `robots.txt` allows all agents.
- Two passes: (1) every asset path in the JS bundle (`bundle-asset-paths.txt`, 29 paths) and every
  route in its router (25); (2) Playwright rendered all 22 concrete routes, scrolled each, and logged
  every image/video response plus DOM `img`/`srcset`/`video`/CSS `background-image`
  (`crawl-found.json`, 62 URLs).
- 11 bundle paths return the SPA shell, not an image, so they are broken on the live site too: all ten
  `/team/*.jpg` and `/dg-a100-product.png`.

## What is used here, and why

| Asset | Use |
|---|---|
| `dgridsemi.png` (official wordmark) | Top-bar brand, `public/brand/deepgrid-semi-wordmark.png` |
| `favicon.ico` (the D icon) | "Deepgrid Semi" home entry in the menu, and the favicon (`public/brand/deepgrid-d-*.png`) |
| `award1.jpeg`, `award2.jpeg` | Company, Recognition: Top 50 Startups in Telangana, TiE50 Hyderabad 2024 |
| `3dsemiconductor.png` | Products, "Where DG32 sits": multi-die package concept |

## What is not used, and why

- `architecture.jpg` ("DGRID Schematic"), `3dvision`, `adaptivelearning`, `naturallanguage`, `roboarm`,
  `sdk`, `videos-hero-bg`, `hero.mp4`: DeepGrid's ADAS / edge-AI product line, not DG32; placing them
  on DG32 pages would present another chip's architecture as this one's.
- `aravind.png`, `prashanth.png`: named people; the site publishes no individual names (Company,
  "What this page does not claim").
- Unsplash stock, Nvidia/AMD/Intel/Qualcomm logos, YouTube thumbnails, cookie-banner logo: third party.
- The Achievements page lists six further awards (WEF Technology Pioneer, Fast Company, CES, SIA,
  a "Top 10 AI semiconductor" report, a DG-T100 design award) with no image or named source; only
  the Telangana Top 50 has evidence (the two photos), so only it is stated.
