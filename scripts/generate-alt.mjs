// Generates alt text for uploads that have no entry in
// content/image-alt.json, using the GitHub Models inference API
// (free tier, GPT-4o mini vision). Runs in the sync-media workflow.
//
// Requires env GH_MODELS_TOKEN — a GitHub PAT (classic tokens need no
// scopes; fine-grained tokens need the "Models" permission).
// If unset, the script skips silently so the rest of sync still runs.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { extname, join, basename } from 'node:path';

const UPLOADS = 'public/images/uploads';
const ALT_FILE = 'content/image-alt.json';
const ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const MODEL = 'openai/gpt-4o-mini';
const GENERATED = /-\d{3,4}\.(webp|avif)$/i;
const RASTER = /\.(jpe?g|png|webp|avif|gif)$/i;

const token = process.env.GH_MODELS_TOKEN;
if (!token) {
  console.log(
    'GH_MODELS_TOKEN not set — skipping alt generation. ' +
      'Add a GitHub PAT as repo secret GH_MODELS_TOKEN to enable it.'
  );
  process.exit(0);
}

const alts = JSON.parse(await readFile(ALT_FILE, 'utf8')).alts;
const missing = readdirSync(UPLOADS)
  .filter((f) => RASTER.test(f) && !GENERATED.test(f))
  .map((f) => `uploads/${basename(f, extname(f))}`)
  .filter((key) => !alts[key]);

if (!missing.length) {
  console.log('Alt text: all uploads already described.');
  process.exit(0);
}
console.log(`Alt text: generating descriptions for ${missing.length} image(s).`);

const prompt =
  'Write one concise alt-text sentence (5–15 words) describing this photograph: ' +
  'subject, setting, mood. No "image of" / "photo of" prefix. ' +
  'It belongs to a fine-art photography portfolio (travel, street, portrait, landscape).';

let wrote = 0;
for (const key of missing) {
  const file = join(UPLOADS, key.replace('uploads/', '') + '.webp');
  const src = existsSync(file)
    ? file
    : join(UPLOADS, readdirSync(UPLOADS).find((f) => f.startsWith(key.replace('uploads/', '') + '.')) || '');
  if (!existsSync(src)) continue;
  const dataUrl = `data:image/webp;base64,${(await readFile(src)).toString('base64')}`;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: prompt },
          {
            role: 'user',
            content: [{ type: 'image_url', image_url: { url: dataUrl } }],
          },
        ],
        max_tokens: 60,
      }),
    });
    if (res.status === 429) {
      console.log(`  rate limited at ${key} — stopping, partial results saved`);
      break;
    }
    if (!res.ok) {
      console.log(`  ${key}: HTTP ${res.status} — skipped`);
      continue;
    }
    const alt = (await res.json()).choices?.[0]?.message?.content?.trim();
    if (alt) {
      alts[key] = alt.replace(/^["']|["']$/g, '');
      wrote++;
      console.log(`  ${key}: ${alts[key]}`);
    }
  } catch (e) {
    console.log(`  ${key}: ${e.message} — skipped`);
  }
  await new Promise((r) => setTimeout(r, 1500)); // stay under rate limits
}

if (wrote) {
  await writeFile(ALT_FILE, JSON.stringify({ alts }, null, 2) + '\n');
}
console.log(`Alt text: wrote ${wrote} new description(s).`);
