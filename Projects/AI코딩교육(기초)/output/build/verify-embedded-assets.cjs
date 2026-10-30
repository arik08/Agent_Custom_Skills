const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { chromium } = require(path.join(process.env.USERPROFILE,
  '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
const validation = path.join(root, 'validation');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const marker = '<!-- EMBEDDED ASSETS: all large data lives below this line. -->';
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function checkSource(file) {
  const html = fs.readFileSync(file, 'utf8');
  assert.equal(html.split(marker).length, 2);
  const body = html.split(marker)[0];
  assert(!/;base64,/.test(body), 'Base64 must stay below the footer marker');
  assert(!/<iframe[^>]+\ssrcdoc=/.test(body), 'No expanded cover copy in the body');
  const manifest = JSON.parse(html.match(/<script id="embedded-assets"[^>]*>([\s\S]*?)<\/script>/)[1]);
  for (const match of body.matchAll(/data-asset-(?:src|style)="([^"]+)"/g)) assert(manifest[match[1]]);
  return { bytes: Buffer.byteLength(html), images: Object.keys(manifest).length, bodyBytes: Buffer.byteLength(body) };
}
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [], network = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 810 }, reducedMotion: 'reduce' });
    await context.route(/^https?:/, route => { network.push(route.request().url()); return route.abort(); });
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    async function ready(page, file, slide = 1) {
      await page.goto(pathToFileURL(file).href + `#/${slide}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => image.decode()));
      });
      await page.waitForFunction(() => window.deck?.count === 22);
    }
    const before = await context.newPage(), after = await context.newPage();
    await ready(before, process.argv[2] || path.join(validation, 'asset-layout-before.html'));
    await ready(after, target);
    async function snapshot(page, index) {
      return page.evaluate(index => {
        deck.go(index);
        const slide = document.querySelector('.slide.is-active');
        const rect = element => {
          const box = element.getBoundingClientRect();
          return ['x', 'y', 'width', 'height'].map(key => Math.round(box[key] * 100) / 100);
        };
        return { text: slide.innerText, images: [...slide.querySelectorAll('img')].map(image => ({
          alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, box: rect(image),
          src: image.getAttribute('src')
        })), title: rect(slide.querySelector('h1')) };
      }, index);
    }
    const slides = [];
    for (let index = 0; index < 22; index++) {
      const baseline = await snapshot(before, index), current = await snapshot(after, index);
      assert.deepEqual(current, baseline, `Slide ${index + 1}: text, image bytes, dimensions and placement`);
      slides.push({ slide: index + 1, identical: true, images: current.images.length });
    }
    const architecture = page => page.locator('.architecture-art').evaluate(element =>
      getComputedStyle(element).getPropertyValue('--architecture').replaceAll('"', '').trim());
    assert.equal(digest(await architecture(after)), digest(await architecture(before)));
    for (const index of [5, 8, 17, 21]) {
      await after.evaluate(index => deck.go(index), index);
      await after.screenshot({ path: path.join(validation, `asset-layout-slide-${index + 1}.png`) });
    }
    await after.evaluate(() => deck.go(4));
    await after.locator('[data-handoff-mode="agent"]').click();
    await after.locator('[data-demo-progress]').getByRole('button', { name: '실행 확인 단계로 이동', exact: true }).click();
    const dynamic = after.locator('[data-asset-src="assets/bob-ross-easy-v2.png"]');
    await dynamic.evaluate(image => image.decode());
    assert(await dynamic.evaluate(image => image.naturalWidth > 0));
    console.log('PASS: 22 slide comparisons, CSS image and dynamic result image');

    await after.evaluate(() => deck.go(0));
    for (const [key, expected] of [['ArrowRight', 1], ['PageDown', 2], ['ArrowLeft', 1], ['End', 21], ['Home', 0]]) {
      await after.keyboard.press(key);
      assert.equal(await after.evaluate(() => deck.current), expected);
    }
    const downloadEvent = after.waitForEvent('download');
    await after.getByRole('button', { name: '이 HTML 파일 다운로드' }).click();
    const download = await downloadEvent;
    const downloaded = path.join(validation, 'asset-layout-downloaded.html');
    await download.saveAs(downloaded);
    const downloadedSource = checkSource(downloaded);
    console.log('PASS: navigation and downloaded source layout');
    const reopened = await context.newPage();
    await ready(reopened, downloaded, 6);
    assert.equal(await reopened.evaluate(() => deck.current), 5);
    await reopened.evaluate(() => deck.go(0));
    const cover = await (await reopened.locator('#cover-diorama').elementHandle()).contentFrame();
    await cover.waitForFunction(() => window.spriteInspect?.().loaded);
    await reopened.emulateMedia({ reducedMotion: 'no-preference' });
    await cover.waitForFunction(() => window.spriteInspect().time > 0.1);
    const coverState = await cover.evaluate(() => {
      const state = spriteInspect();
      return { ready: state.ready, loaded: state.loaded, time: state.time };
    });
    await reopened.keyboard.press('ArrowRight');
    await reopened.waitForFunction(() => document.querySelector('#cover-diorama').dataset.paused === 'true');
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    const result = { passed: true, source: checkSource(target), downloadedSource, slides,
      dynamicImage: true, cssImage: true, navigation: true, offline: true, coverState, errors, network };
    fs.writeFileSync(path.join(validation, 'asset-layout-check.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
