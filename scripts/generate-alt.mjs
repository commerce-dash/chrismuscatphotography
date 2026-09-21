// Generates alt text for uploads that have no entry in
// content/image-alt.json using any OpenAI-compatible vision API.
// Runs in the sync-media workflow.
//
// Env:
//   ALT_API_KEY  — required; provider API key (repo secret)
//   ALT_API_BASE — optional; defaults to OpenAI. Works with OpenRouter,
//                  Azure OpenAI, or any /chat/completions-compatible API.
//   ALT_MODEL    — optional; defaults to gpt-4o-mini.
// If ALT_API_KEY is unset the script skips silently so sync still runs.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { extname, join, basename } from 'node:path';

const UPLOADS = 'public/images/uploads';
const ALT_FILE = 'content/image-alt.json';
const ENDPOINT =
  process.env.ALT_API_BASE || 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.ALT_MODEL || 'gpt-4o-mini';
const GENERATED = /-\d{3,4}\.(webp|avif)$/i;
const RASTER = /\.(jpe?g|png|webp|avif|gif)$/i;

const token = process.env.ALT_API_KEY;
if (!token) {
  console.log(
    'ALT_API_KEY not set — skipping alt generation. ' +
      'Add a vision-capable API key as repo secret ALT_API_KEY to enable it.'
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
