# Chris Muscat — Photography Portfolio

A high-end, editorial photography portfolio built as a fast static site:
React + TypeScript + Vite, deployed to GitHub Pages via GitHub Actions,
with a built-in content manager (Sveltia CMS) at `/admin`.

Dark, minimal, image-first. Content lives in `content/*.json` and is
editable through the CMS — no database, no server.

## Quick start

```bash
npm install
npm run images    # fetch + process placeholder photography (idempotent)
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run lint      # eslint + typecheck
npm run build     # sitemap + image pipeline + vite build -> dist/
npm run preview
```

## Content manager (`/admin`)

The site includes a git-based CMS (Sveltia) at
`https://chrismuscatphotography.com/admin`. Edits commit straight to
`main`, which triggers the deploy workflow — changes are live in ~1 min.

**Sign in (first time):**

1. Create a fine-grained GitHub token: GitHub → *Settings → Developer
   settings → Personal access tokens → Fine-grained tokens → New*.
2. Repository access: only `commerce-dash/chrismuscatphotography`.
3. Permission: **Contents → Read and write**.
4. Open `/admin`, choose **Sign in with token**, paste the token.
   (The token is stored in your browser only.)

**Editable:** projects (title, category, year, cover, gallery blocks,
order, featured), journal articles, site identity, navigation menu,
homepage statement, about page (portrait, bio, clients/publications/
awards/exhibitions), and media uploads.

**Images:** drag-and-drop uploads land in `public/images/uploads/`.
At build, `npm run images` converts each original into responsive WebP
(`{name}-{800,1200,1600,2400}.webp`) + a blur placeholder, and they flow
into `OptimizedImage`'s srcset automatically.

**Optional OAuth upgrade:** for a one-click "Sign in with GitHub" button
instead of pasting a token, deploy `sveltia/sveltia-cms-auth` (free
Cloudflare Worker) and set `base_url` in `public/admin/config.yml`.



## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(also triggered by CMS commits). `VITE_BASE_PATH` is `/` for the custom
domain; to serve under `/<repo>/` instead, set it in the workflow and
`PATH_SEGMENTS_TO_KEEP = 1` in `public/404.html`.

Deep links and refreshes are handled by `public/404.html` +
a restore script in `index.html`.

> Windows/Git Bash note: when testing a subpath build locally, prefix env
> vars with `MSYS_NO_PATHCONV=1`.

## Content

All content is data — components render it, nothing is hard-coded:

| Path | Content |
| --- | --- |
| `content/projects/*.json` | One file per project: title, category, year, location, description, cover, gallery blocks, order, featured |
| `content/journal/*.json` | Journal articles: hero, intro, typed body blocks, related projects |
| `content/site.json` | Name, email, socials, homepage statement, navigation menu |
| `content/about.json` | Portrait, bio, clients/publications/awards/exhibitions |
| `src/data/*.ts` | Typed loaders — pages import from here, not from JSON directly |
| `src/data/image-meta.json` | Generated: intrinsic dimensions + available widths per image |
| `scripts/image-manifest.mjs` | Placeholder photo inventory (regenerate/fetch via `npm run images`) |

Gallery blocks (`full | feature | pair | offset`) compose each project
page like an exhibition layout — vary them per project.

## Images

`OptimizedImage` (`src/components/OptimizedImage.tsx`) is the only place
that resolves image URLs: responsive `srcset`, `sizes`, lazy loading,
blur-up placeholders, explicit dimensions (no CLS), error states.

Convention: `public/images/<name>-<width>.webp`. Managed names
(`projects/x/01`) and public paths (`/images/uploads/photo.jpg`) are both
accepted — `src/lib/images.ts` normalizes them.

**Using a CDN later:** set `CDN_BASE` in `src/lib/images.ts`.

## Accessibility & performance

- Semantic landmarks, keyboard navigation, visible focus states
- Lightbox: Esc/arrows, focus trap, focus restore, swipe on touch
- `prefers-reduced-motion` disables all decorative animation
- ~70 KB gzip JS, ~5 KB gzip CSS
- Per-page title/description/canonical/OG, JSON-LD, sitemap.xml, robots.txt

## Structure

```
content/        CMS-editable JSON (projects/, journal/, site.json, about.json)
src/
  components/   Navigation, Hero, WorkItem, OptimizedImage, Reveal,
                Lightbox, FilterBar, Cursor, Footer
  pages/        Home, Work, Project, About, Journal, Article, Contact, NotFound
  data/         JSON loaders + generated image-meta/placeholders
  lib/          router, images, site config, usePageMeta
  styles/       global.css, typography.css, animations.css
public/
  admin/        Sveltia CMS (index.html + config.yml)
  images/       responsive WebP files (+ uploads/ for CMS media)
  CNAME         custom domain
  404.html      SPA fallback
scripts/
  image-manifest.mjs   placeholder inventory
  build-images.mjs     fetch/process placeholders + optimize uploads
  generate-sitemap.mjs sitemap.xml + robots.txt
.github/workflows/deploy.yml
```
