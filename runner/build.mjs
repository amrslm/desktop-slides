// Builds one post: downloads its photos, renders the slides, prints the public links.
// usage: node runner/build.mjs media/2026-11-02/dinners-takeout
// The folder must hold a spec.json (see writer/rulebook.md for the shape).
// Each slide's "photo" is the URL that Unsplash download_asset returned (or just its "photo-..." path).
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSpec } from '../design/render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_RAW = 'https://raw.githubusercontent.com/amrslm/desktop-slides/main/';

const dir = path.resolve(process.argv[2] || '');
const specFile = path.join(dir, 'spec.json');
if (!fs.existsSync(specFile)) { console.error('no spec.json in ' + dir); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));

function photoUrl(p) {
  const u = new URL(/^https?:/.test(p) ? p : 'https://images.unsplash.com/' + p.replace(/^\//, ''));
  // portrait crop at TikTok size
  for (const [k, v] of Object.entries({ fm: 'jpg', q: '85', w: '1080', h: '1920', fit: 'crop', crop: 'entropy', cs: 'srgb' })) u.searchParams.set(k, v);
  return u.href;
}

const photoDir = path.join(dir, '_photos'); // not committed
fs.mkdirSync(photoDir, { recursive: true });
const slides = [];
for (let i = 0; i < spec.slides.length; i++) {
  const s = { ...spec.slides[i] };
  if (s.photo) {
    const f = path.join(photoDir, `${i + 1}.jpg`);
    if (!fs.existsSync(f)) {
      // curl, not fetch: curl goes through the workspace's proxy
      try { execFileSync('curl', ['-sSfL', '--retry', '2', '-o', f, photoUrl(s.photo)]); }
      catch (e) { console.error(`photo for slide ${i + 1} failed: ${e.message}`); process.exit(1); }
    }
    s.photo = f;
  }
  slides.push(s);
}

// clear old renders, then render
for (const f of fs.readdirSync(dir)) if (/^\d\d\.jpg$/.test(f)) fs.unlinkSync(path.join(dir, f));
const files = await renderSpec({ ...spec, slides }, dir, dir);
const rel = path.relative(root, dir).split(path.sep).join('/');
console.log(JSON.stringify({ slides: files.length, urls: files.map((f) => REPO_RAW + rel + '/' + path.basename(f)) }, null, 1));
