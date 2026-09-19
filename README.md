# Chris Muscat — Photography Portfolio

A high-end, editorial photography portfolio built as a fast static site:
React + TypeScript + Vite, deployed to GitHub Pages via GitHub Actions.

Dark, minimal, image-first. No backend, no CMS — content lives in typed
data files, photography is served from `public/images/` (or a CDN).

## Quick start

```bash
npm install
npm run images    # fetch + process placeholder photography (idempotent)
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run lint      # eslint + typecheck
npm run build     # sitemap + vite build -> dist/
npm run preview
```

## Deployment (GitHub Pages)

1. Push this repository to GitHub (default branch: `main`).
2. In repo settings: **Settings → Pages → Source: GitHub Actions**.
3. Done — `.github/workflows/deploy.yml` builds and deploys on every push
   to `main`, setting `VITE_BASE_PATH=/<repo-name>/` and `VITE_SITE_URL`
   automatically.

The site is served under `https://<user>.github.io/<repo-name>/` and handles
deep links / refreshes through `public/404.html` + a restore script in
`index.html`. For a **user/org site or custom domain** (served from `/`),
set `PATH_SEGMENTS_TO_KEEP = 0` in `public/404.html`.

> Windows/Git Bash note: when testing a subpath build locally, prefix env
> vars with `MSYS_NO_PATHCONV=1` so `/repo-name/` is not rewritten to a
> filesystem path:
> `MSYS_NO_PATHCONV=1 VITE_BASE_PATH=/repo-name/ npm run build`

## Content

All content is data — components render it, nothing is hard-coded:

| File | Content |
| --- | --- |
| `src/data/projects.ts` | Projects: title, category, year, location, description, cover, gallery blocks, featured flag |
| `src/data/journal.ts` | Journal articles: hero, intro, body blocks, related projects |
| `src/data/image-meta.json` | Generated: intrinsic dimensions + available widths per image |
| `src/lib/site.ts` | Photographer name, email, socials, site URL |
| `scripts/image-manifest.mjs` | Which images exist and their aspect ratios |

**Adding a project:** add images to `scripts/image-manifest.mjs`, run
`npm run images`, then add a `projects` entry. The sitemap, routes, Work
page and next-project navigation update automatically.

Gallery blocks (`full | feature | pair | offset`) compose each project page
like an exhibition layout — vary them per project.

## Images

`OptimizedImage` (`src/components/OptimizedImage.tsx`) is the only place
that resolves image URLs. It provides responsive `srcset`, `sizes`, lazy
loading, blur-up placeholders, explicit dimensions (no CLS) and error
states.

Convention: `public/images/<name>-<width>.webp` at 800/1200/1600/2400px.

**Using a CDN later:** set `CDN_BASE` in `src/lib/images.ts` — every image
on the site switches over without other code changes.

**Using real photography:** drop files into `public/images/` following the
same naming convention (or re-run `npm run images` after updating the
manifest to point at your own pipeline). The bundled files are placeholder
photography from picsum.photos.

## Accessibility & performance

- Semantic landmarks, skip-free keyboard navigation, visible focus states
- Lightbox: Esc/arrows, focus trap, focus restore, swipe on touch
- `prefers-reduced-motion` disables all decorative animation
- ~69 KB gzip JS, ~5 KB gzip CSS, zero runtime dependencies beyond React
- Per-page title/description/canonical/OG, JSON-LD, sitemap.xml, robots.txt

## Structure

```
src/
  components/   Navigation, Hero, WorkItem, OptimizedImage, Reveal,
                Lightbox, FilterBar, Cursor, Footer
  pages/        Home, Work, Project, About, Journal, Article, Contact, NotFound
  data/         projects.ts, journal.ts, generated image-meta/placeholders
  lib/          router, images, site config, usePageMeta
  styles/       global.css, typography.css, animations.css
public/
  images/       responsive WebP files
  404.html      GitHub Pages SPA fallback
scripts/
  image-manifest.mjs   image inventory
  build-images.mjs     download + responsive WebP + placeholders
  generate-sitemap.mjs sitemap.xml + robots.txt
.github/workflows/deploy.yml
```
