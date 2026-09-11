# PoetryKitaab Automation

This package adds the content-generation pipeline to the existing PoetryKitaab Astro repository.

## What it does

GitHub Actions can run daily or manually:

1. Select a configured topic/category.
2. Ask Gemini for original poetry/status metadata.
3. Reject weak/duplicate output.
4. Search Pexels for a portrait image.
5. Save provider/source/license metadata.
6. Render an optimized WebP poster.
7. Write the post as `content/posts/<slug>.json`.
8. Run `npm run build`.
9. Commit generated files to `main`.
10. Cloudflare Pages detects the GitHub push and builds the site.

This follows the static-site + Python + GitHub Actions architecture described in the supplied implementation guide.

## Copy into the existing repo

Merge these folders/files into the root of the existing PoetryKitaab repository:

- `automation/`
- `data/`
- `.github/workflows/generate.yml`
- `content/posts/.gitkeep`
- `public/generated/.gitkeep`

Do not replace your existing `src/`, `package.json`, Astro config, or website UI.

## GitHub Secrets

Required:

- `GEMINI_API_KEY`
- `PEXELS_API_KEY`

Optional:

- `GEMINI_MODEL` (defaults to `gemini-2.5-flash`)

The keys are never stored in the frontend or repository code.

## Local setup

```bash
python -m pip install -r automation/requirements.txt
python -m automation.main --dry-run --count 1
```

A normal local run requires the API environment variables:

```text
GEMINI_API_KEY=...
PEXELS_API_KEY=...
```

Then:

```bash
python -m automation.main --count 1
npm run build
```

## GitHub Actions

The workflow is both manually runnable and scheduled once per day. The manual run has a `posts` input, defaulting to 10.

The workflow does not deploy with Wrangler. It commits generated files to `main`; the existing Cloudflare Pages Git integration handles the website deployment.

## Safety notes

- AI output is treated as a draft and checked for duplication/quality.
- Image licensing terms can change. The generated JSON records the provider and source information, but you should verify current Pexels terms before commercial redistribution.
- The system fails the individual post instead of publishing incomplete image/content records.
- Start with a small daily volume and increase only after checking content quality and search performance.
