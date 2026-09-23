const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
const url = 'https://ai-coding-workshop-v3.vercel.app';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
(async () => {
  const local = fs.readFileSync(path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html'));
  const response = await fetch(url);
  assert.equal(response.status, 200);
  const remote = Buffer.from(await response.arrayBuffer());
  assert.equal(digest(remote), digest(local), 'Production HTML must equal the latest local file');
  console.log('PASS: production HTTP 200 and exact SHA-256 equality');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url + '/#/2');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => deck.count), 23);
    assert.equal(await page.locator('.why-reason').count(), 4);
    await page.locator('.why-scene img').evaluate(image => image.decode());
    assert(await page.locator('.why-reason-ai').innerText().then(t => t.includes('더 똑똑해지는 AI')));
    await page.screenshot({ path: path.join(root, 'validation/vercel-live-page2.png') });
    await page.evaluate(() => deck.go(8));
    await page.locator('[data-file="html"]').click();
    const htmlLines = await page.locator('.file-code-source').allTextContents();
    assert.equal(htmlLines.length, 11);
    assert(htmlLines.includes('    <h1>테트리스</h1>'));
    assert(htmlLines.includes('        <button id="start">시작</button>'));
    assert.equal(await page.locator('.file-code-note').count(), 11);
    await page.locator('[data-file="js"]').click();
    assert.equal(await page.locator('#file-label').innerText(), 'game.js · 화면 동작');
    await page.screenshot({ path: path.join(root, 'validation/vercel-live-page9.png') });
    await page.evaluate(() => deck.go(21));
    assert.equal(await page.locator('.recap-closing').innerText(), '오늘 익힌 기초를 바탕으로,\nAI와 함께 작은 것부터 시도해 보세요.');
    await page.screenshot({ path: path.join(root, 'validation/vercel-live-page22.png') });
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.evaluate(() => deck.current), 22);
    await page.keyboard.press('Home');
    assert.equal(await page.evaluate(() => deck.current), 0);
    const cover = await (await page.locator('#cover-diorama').elementHandle()).contentFrame();
    await cover.waitForFunction(() => window.spriteInspect?.().loaded);
    assert.deepEqual(errors, []);
    const result = {
      checkedAt: new Date().toISOString(), url, status: response.status,
      sha256: digest(remote), bytes: remote.length, matchesLocal: true, slides: 23,
      motivationSlide: true, annotatedExamples: true, fourSpaceIndentation: true,
      softenedClosing: true, navigation: true, coverLoaded: true, errors,
      deploymentId: 'dpl_AMdQzj3Xu1sjifsL5BeLF1aWsszS',
      deploymentUrl: 'https://ai-coding-workshop-v3-ecla928dv-arik1988-1398s-projects.vercel.app',
      previousDeploymentId: 'dpl_BQruHwPEhe81t73C4FjYBg47Brj5'
    };
    fs.writeFileSync(path.join(root, 'validation/vercel-deployment-check.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
