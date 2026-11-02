// Renders one slideshow spec to 1080x1920 JPGs.
// usage: node render.mjs spec.json outDir
// spec: { slides: [ {kind:'cover', text, photo}, {kind:'item', n, title, detail, photo}, {kind:'end', text, sub, photo} ] }
// photo = local file path (already cropped or any size; it is cover-fitted)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); // pre-installed globally in the cloud sessions
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const font = (f) => pathToFileURL(path.join(here, 'node_modules/@fontsource', f)).href;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// keep the app name on one line
const keepName = (s) => esc(s).replace(/Desktop: Save for Later/g, '<span class="nb">Desktop: Save for Later</span>');

const CSS = `
@font-face { font-family: TT; font-weight: 700; src: url(${font('tiktok-sans/files/tiktok-sans-latin-700-normal.woff2')}) format('woff2'); }
@font-face { font-family: TT; font-weight: 800; src: url(${font('tiktok-sans/files/tiktok-sans-latin-800-normal.woff2')}) format('woff2'); }
@font-face { font-family: TT; font-weight: 900; src: url(${font('tiktok-sans/files/tiktok-sans-latin-900-normal.woff2')}) format('woff2'); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; overflow: hidden; background: #111; }
.s { position: relative; width: 1080px; height: 1920px; overflow: hidden; font-family: TT, sans-serif; color: #fff; }
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shade { position: absolute; inset: 0; }
.nb { white-space: nowrap; }
/* TikTok covers the top ~190px, the bottom ~360px and a strip on the right from the middle down */
.cover .shade { background: linear-gradient(180deg, rgba(0,0,0,.10) 0%, rgba(0,0,0,.42) 32%, rgba(0,0,0,.42) 58%, rgba(0,0,0,.10) 100%); }
.cover .t { position: absolute; left: 90px; right: 90px; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; text-align: center; padding-bottom: 180px; }
.cover h1 { font-weight: 900; font-size: 112px; line-height: 1.04; letter-spacing: -0.02em; text-wrap: balance; text-shadow: 0 4px 28px rgba(0,0,0,.45); }
.cover .kick { display: inline-block; margin-bottom: 34px; font-weight: 800; font-size: 40px; letter-spacing: .02em; padding: 12px 26px; border-radius: 999px; background: #fff; color: #111; }
.item .shade { background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.12) 30%, rgba(0,0,0,0) 45%); }
.item .t { position: absolute; left: 80px; right: 150px; top: 220px; }
.item .n { display: inline-block; font-weight: 900; font-size: 50px; line-height: 1; padding: 14px 22px; border-radius: 16px; background: #111; color: #fff; margin-bottom: 18px; }
/* TikTok-style text boxes stay readable on any photo */
.item h2 { font-weight: 900; font-size: 84px; line-height: 1.3; letter-spacing: -0.015em; text-wrap: balance; }
.item h2 span { background: #fff; color: #111; padding: 2px 22px 6px; border-radius: 18px; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.item p { margin-top: 22px; font-weight: 700; font-size: 44px; line-height: 1.52; text-wrap: pretty; max-width: 860px; }
.item p span { background: rgba(10,10,12,.72); color: #fff; padding: 6px 18px; border-radius: 14px; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.end .shade { background: rgba(0,0,0,.55); }
.end .t { position: absolute; left: 90px; right: 90px; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding-bottom: 200px; gap: 40px; }
.end h2 { font-weight: 900; font-size: 104px; line-height: 1.04; letter-spacing: -0.02em; text-wrap: balance; }
.end p { font-weight: 700; font-size: 48px; line-height: 1.25; text-wrap: balance; opacity: .95; max-width: 860px; }
`;

function slideHTML(s) {
  const img = s.photo ? `<img class="bg" src="${pathToFileURL(path.resolve(s.photo)).href}">` : '';
  let body = '';
  if (s.kind === 'cover') body = `<div class="t"><div>${s.kicker ? `<div class="kick">${esc(s.kicker)}</div>` : ''}<h1>${keepName(s.text)}</h1></div></div>`;
  else if (s.kind === 'item') body = `<div class="t">${s.n != null ? `<div class="n">${esc(s.n)}</div>` : ''}<h2><span>${keepName(s.title)}</span></h2>${s.detail ? `<p><span>${keepName(s.detail)}</span></p>` : ''}</div>`;
  else body = `<div class="t"><h2>${keepName(s.text)}</h2>${s.sub ? `<p>${keepName(s.sub)}</p>` : ''}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="s ${s.kind}">${img}<div class="shade"></div>${body}</div></body></html>`;
}

export async function renderSpec(spec, outDir, baseDir = '.') {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const files = [];
  for (let i = 0; i < spec.slides.length; i++) {
    const sl = { ...spec.slides[i] };
    if (sl.photo && !path.isAbsolute(sl.photo)) sl.photo = path.resolve(baseDir, sl.photo);
    // load from a file:// page so the local photo and font files are allowed
    const htmlFile = path.join(outDir, `_slide${i + 1}.html`);
    fs.writeFileSync(htmlFile, slideHTML(sl));
    await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const f = path.join(outDir, String(i + 1).padStart(2, '0') + '.jpg');
    await page.screenshot({ path: f, type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    files.push(f);
    fs.unlinkSync(htmlFile);
  }
  await browser.close();
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [specPath, outDir] = process.argv.slice(2);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  renderSpec(spec, outDir, path.dirname(path.resolve(specPath))).then((f) => console.log(f.join('\n')));
}
