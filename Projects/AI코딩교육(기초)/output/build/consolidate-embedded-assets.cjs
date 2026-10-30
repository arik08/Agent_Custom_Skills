// Reorganize the finished deck without rebuilding (and losing its later edits).
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const original = fs.readFileSync(target, 'utf8');
const marker = '<!-- EMBEDDED ASSETS: all large data lives below this line. -->';
if (original.includes(marker)) {
  console.log('Already consolidated; no changes.');
  process.exit(0);
}
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileNames = new Map();
function indexAssets(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) indexAssets(file);
    else if (/\.(png|webp|svg|woff2)$/i.test(file)) {
      const digest = hash(fs.readFileSync(file));
      if (!fileNames.has(digest)) fileNames.set(digest, path.relative(root, file).replaceAll('\\', '/'));
    }
  }
}
indexAssets(path.join(root, 'assets'));
const assets = {};
function register(uri) {
  const bytes = Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
  const digest = hash(bytes);
  const extension = uri.match(/^data:image\/(\w+)/)[1];
  const name = fileNames.get(digest) || `assets/image-${digest.slice(0, 12)}.${extension}`;
  assert(!assets[name] || assets[name] === uri, `Conflicting asset: ${name}`);
  assets[name] = uri;
  return name;
}
let html = original;
// The runtime already loads the canonical cover-diorama-data block. A serialized
// srcdoc is a second, unused copy of the same application and embedded pictures.
html = html.replace(/(<iframe\b[^>]*id="cover-diorama"[^>]*?)\s+srcdoc="[^"]*"/, '$1');
html = html.replace(/(<iframe\b[^>]*id="cover-diorama"[^>]*?)>/, (_, tag) =>
  tag.replace(/\s+data-(?:ready|loaded|paused|time)="[^"]*"/g, '') + '>');
const fontRules = [];
html = html.replace(/@font-face\{[^}]*data:font\/woff2;base64,[^}]*\}/g, rule => {
  fontRules.push(rule);
  return '';
});
assert.equal(fontRules.length, 3, 'Expected three embedded font weights');
let coverData;
html = html.replace(/<script id="cover-diorama-data"[^>]*>[\s\S]*?<\/script>/, block => {
  coverData = block;
  return '<!-- Cover application: see #cover-diorama-data at the end of this file. -->';
});
assert(coverData, 'Missing canonical cover application');
let imageReferences = 0;
html = html.replace(/<img\b[^>]*>/g, tag => tag.replace(/\bsrc="(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)"/, (_, uri) => {
  imageReferences++;
  return `data-asset-src="${register(uri)}"`;
}));
let styleReferences = 0;
html = html.replace(/style="(--[\w-]+):url\((data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)\)"/g, (_, property, uri) => {
  styleReferences++;
  return `data-asset-property="${property}" data-asset-style="${register(uri)}"`;
});
let dynamicReferences = 0;
html = html.replace(/img\.src='(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)'/g, (_, uri) => {
  dynamicReferences++;
  const name = JSON.stringify(register(uri));
  return `img.dataset.assetSrc=${name};img.src=getEmbeddedAsset(${name})`;
});
assert.equal(styleReferences, 1);
assert.equal(dynamicReferences, 1);
assert(!/data:[^\s"'<>]+;base64,/.test(html), 'Unconverted base64 outside asset footer');
assert(html.includes("page.querySelector('.file-download')?.remove();"));
html = html.replace("page.querySelector('.file-download')?.remove();",
  "page.querySelector('.file-download')?.remove();prepareEmbeddedAssetDownload(page);");

// Keep script order and the global glossary; defer DOM-dependent scripts until
// the data block at the bottom has been parsed. The head restoration script stays.
const bodyStart = html.indexOf('<body');
let deferredScripts = 0;
html = html.slice(0, bodyStart) + html.slice(bodyStart).replace(/<script>([\s\S]*?)<\/script>/g, (block, code) => {
  if (code.startsWith('const GLOSSARY=')) return block;
  deferredScripts++;
  return `<script>\naddEventListener('DOMContentLoaded', () => {\n${code}\n}, { once: true });\n</script>`;
});
assert.equal(deferredScripts, 2);
const runtime = fs.readFileSync(path.join(__dirname, 'embedded-assets.js'), 'utf8');
html = html.replace('<script>const GLOSSARY=', `<script id="embedded-asset-loader">\n${runtime}\n</script>\n<script>const GLOSSARY=`);
const footer = `\n${marker}
<!-- Names in data-asset-src / data-asset-style refer to keys below, not external files.
     Keep this block inside the HTML so the deck works offline as a single file. -->
<style id="embedded-fonts">\n${fontRules.join('\n')}\n</style>
<script id="embedded-assets" type="application/json">\n${JSON.stringify(assets, null, 2)}\n</script>
${coverData}\n`;
html = html.replace('</body>', footer + '</body>');
const validation = path.join(root, 'validation');
fs.mkdirSync(validation, { recursive: true });
const backup = path.join(validation, 'asset-layout-before.html');
assert(!fs.existsSync(backup), 'Refusing to replace the pre-change backup');
fs.writeFileSync(backup, original);
fs.writeFileSync(target, html);
const report = {
  originalBytes: Buffer.byteLength(original), finalBytes: Buffer.byteLength(html),
  imageReferences, styleReferences, dynamicReferences, uniqueImages: Object.keys(assets).length,
  fonts: fontRules.length, deferredScripts, sourceBytesBeforeAssetFooter: Buffer.byteLength(html.split(marker)[0]),
  assets: Object.fromEntries(Object.entries(assets).map(([name, uri]) =>
    [name, { sha256: hash(Buffer.from(uri.split(',')[1], 'base64')), dataUriBytes: uri.length }]))
};
fs.writeFileSync(path.join(validation, 'asset-layout-migration.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
