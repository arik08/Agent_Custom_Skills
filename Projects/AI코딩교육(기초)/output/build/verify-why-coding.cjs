const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
const validation = path.join(root, 'validation');
const file = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const beforeFile = path.join(validation, 'why-coding-before.html');
const source = fs.readFileSync(file, 'utf8');
const marker = '<!-- EMBEDDED ASSETS: all large data lives below this line. -->';
assert(!source.split(marker)[0].includes(';base64,'));
const manifest = JSON.parse(source.match(/<script id="embedded-assets"[^>]*>([\s\S]*?)<\/script>/)[1]);
assert(manifest['assets/why-coding-collaboration.png']);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [], network = [], report = { viewports: [], preservedSlides: [], checks: [] };
  try {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce', acceptDownloads: true });
    await context.route(/^https?:/, route => { network.push(route.request().url()); return route.abort(); });
    context.on('page', p => p.on('pageerror', error => errors.push(error.message)));
    const page = await context.newPage();
    await page.goto(pathToFileURL(file).href + '#/2');
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    assert.equal(await page.evaluate(() => deck.count), 23);
    assert.deepEqual(await page.locator('#stage > .slide').evaluateAll(slides => slides.map(s => Number(s.dataset.index))), Array.from({ length: 23 }, (_, i) => i));
    assert.equal(await page.locator('.why-reason').count(), 4);
    assert.equal(await page.locator('#page-label').innerText(), '02 / 23');
    assert(await page.locator('.why-scene img').evaluate(i => i.naturalWidth > 0 && i.src.startsWith('data:')));
    report.checks.push('23 contiguous slide indices, four reasons, embedded generated image and current/total label');

    const before = await context.newPage();
    await before.goto(pathToFileURL(beforeFile).href);
    await before.evaluate(() => document.fonts.ready);
    for (let i = 0; i < 22; i++) {
      const old = await before.evaluate(i => { deck.go(i); const s = document.querySelector('.slide.is-active'); return { text: s.innerText, title: s.querySelector('h1').innerText }; }, i);
      const current = await page.evaluate(i => { deck.go(i); const s = document.querySelector('.slide.is-active'); return { text: s.innerText, title: s.querySelector('h1').innerText }; }, i === 0 ? 0 : i + 1);
      assert.deepEqual(current, old, `Preserve slide ${i + 1}`);
      report.preservedSlides.push({ oldPage: i + 1, newPage: i === 0 ? 1 : i + 2, title: old.title });
    }
    await before.close();
    console.log('PASS: existing 22 slides keep their text and order');

    await page.evaluate(() => deck.go(1));
    for (const [width, height] of [[1920,1080],[1440,900],[1280,960],[2560,1080],[900,1200]]) {
      await page.setViewportSize({ width, height });
      await page.waitForFunction(() => Math.abs(document.querySelector('#stage').getBoundingClientRect().width / 1920 - Math.min(innerWidth / 1920, innerHeight / 1080)) < 0.001);
      const layout = await page.evaluate(() => {
        const s = document.querySelector('.why-coding-slide'), b = s.getBoundingClientRect(), scale = b.width / 1920;
        const bridge = s.querySelector('.bridge').getBoundingClientRect();
        const leaves = [...s.querySelectorAll('h1,h2,.why-number,.why-reason p,.why-scene img,.bridge')];
        const overflow = leaves.filter(e => { const r = e.getBoundingClientRect(); return r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1; }).map(e => e.tagName + '.' + e.className);
        const contentBottom = Math.max(...[...s.querySelectorAll('.why-reason,.why-scene')].map(e => e.getBoundingClientRect().bottom));
        return { overflow, bridgeGap: (bridge.top - contentBottom) / scale, scale };
      });
      assert.deepEqual(layout.overflow, []);
      assert(layout.bridgeGap >= 18, JSON.stringify(layout));
      report.viewports.push({ width, height, ...layout });
      if (width === 1920 || width === 1280) await page.screenshot({ path: path.join(validation, `why-coding-${width}.png`) });
    }
    await page.setViewportSize({ width: 1920, height: 1080 });
    for (const [key, expected] of [['ArrowRight',2],['ArrowLeft',1],['PageDown',2],['PageUp',1],['Space',2],['Shift+Space',1],['Enter',2],['Backspace',1],['Home',0],['ArrowLeft',0],['End',22],['ArrowRight',22],['Home',0]]) {
      await page.keyboard.press(key);
      assert.equal(await page.evaluate(() => deck.current), expected, key);
    }
    await page.mouse.move(10,10);
    await page.mouse.wheel(0, 3000);
    await page.waitForFunction(() => deck.current === 1);
    await page.mouse.wheel(0, -3000);
    await page.waitForFunction(() => deck.current === 0);
    await page.evaluate(() => deck.go(1));
    await page.keyboard.press('f');
    await page.waitForFunction(() => !!document.fullscreenElement);
    assert.equal(await page.evaluate(() => deck.current), 1);
    await page.mouse.click(20,20,{ button:'right' });
    await page.waitForFunction(() => !document.fullscreenElement);
    report.checks.push('Five aspect ratios without clipping or footer overlap; keyboard, wheel, fullscreen and boundaries');

    // Exercise the shifted demos, including direct entry and stopping on exit.
    await page.evaluate(() => deck.go(3));
    assert.equal(await page.evaluate(() => tetrisWorkshop.built), true);
    await page.evaluate(() => deck.go(1));
    assert.equal(await page.evaluate(() => tetrisWorkshop.running), false);
    await page.evaluate(() => deck.go(2));
    assert.equal(await page.evaluate(() => tetrisWorkshop.built), false);
    await page.locator('[data-ide="2"] [data-preset="build"]').click();
    await page.locator('[data-ide="2"] [data-codex-send]').click();
    await page.waitForFunction(() => tetrisWorkshop.built && !tetrisWorkshop.busy, null, { timeout: 40000 });
    await page.evaluate(() => deck.go(3));
    await page.locator('[data-ide="3"] [data-preset="color"]').click();
    await page.locator('[data-ide="3"] [data-codex-send]').click();
    await page.waitForFunction(() => tetrisWorkshop.config.color && !tetrisWorkshop.busy);
    await page.evaluate(() => deck.go(5));
    await page.locator('[data-handoff-mode="agent"]').click();
    await page.locator('[data-demo-progress]').getByRole('button', { name: '실행 확인 단계로 이동', exact: true }).click();
    await page.locator('[data-asset-src="assets/bob-ross-easy-v2.png"]').evaluate(i => i.decode());
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => { deck.go(1); deck.go(5); });
    await page.waitForFunction(() => handoffGame.state.running);
    await page.evaluate(() => deck.go(1));
    assert.equal(await page.evaluate(() => handoffGame.state.running), false);
    await page.waitForTimeout(950);
    assert.equal(await page.locator('.why-coding-slide').evaluate(s => s.getAnimations({subtree:true}).filter(a=>a.playState==='running').length), 0);
    report.checks.push('Tetris direct entry, build, feature change, handoff execution and inactive-demo pause; short entrance animation');
    console.log('PASS: shifted demo workflows');

    await page.evaluate(() => deck.go(0));
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: '이 HTML 파일 다운로드' }).click();
    const downloaded = path.join(validation, 'why-coding-downloaded.html');
    await (await downloadEvent).saveAs(downloaded);
    assert(!fs.readFileSync(downloaded, 'utf8').split(marker)[0].includes(';base64,'));
    const reopened = await context.newPage();
    await reopened.goto(pathToFileURL(downloaded).href + '#/2');
    await reopened.locator('.why-scene img').evaluate(i => i.decode());
    assert.equal(await reopened.evaluate(() => deck.count), 23);
    assert.equal(await reopened.evaluate(() => deck.current), 1);
    assert.equal(await reopened.locator('.why-reason').count(), 4);
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    report.checks.push('Downloaded single HTML reopens offline with new slide and image; zero page errors or external requests');
    report.passed = true;
    report.errors = errors;
    report.network = network;
    fs.writeFileSync(path.join(validation, 'why-coding-check.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({passed:true, slides:23, preserved:report.preservedSlides.length, viewports:report.viewports, checks:report.checks},null,2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
