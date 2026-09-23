const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {chromium} = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
const examples = require('./file-examples.json');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
(async()=>{
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const errors=[], report={tabs:[],viewports:[],exampleBehavior:{}};
  try {
    const context=await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
    context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
    const page=await context.newPage();
    await page.goto(pathToFileURL(target).href+'#/9');
    await page.evaluate(()=>document.fonts.ready);
    const measure=()=>page.evaluate(()=>{
      const scale=document.querySelector('#stage').getBoundingClientRect().width/1920;
      const panel=document.querySelector('.workspace').getBoundingClientRect();
      const rows=[...document.querySelectorAll('#file-code .file-code-line')];
      const issues=[];
      for(const row of rows){
        const a=row.querySelector('.file-code-source'),b=row.querySelector('.file-code-note');
        const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
        const range=document.createRange();range.selectNodeContents(a);const text=range.getBoundingClientRect();
        const noteRange=document.createRange();noteRange.selectNodeContents(b);const note=noteRange.getBoundingClientRect();
        if(text.right>br.left-10*scale)issues.push('code touches comment: '+a.textContent);
        if(b.textContent&&note.right>panel.right-15*scale)issues.push('comment outside panel: '+b.textContent);
        if(ar.bottom>panel.bottom-15*scale||br.bottom>panel.bottom-15*scale)issues.push('row below panel');
      }
      const desc=document.querySelector('#file-desc').getBoundingClientRect();
      if(desc.bottom>panel.bottom-12*scale)issues.push('description below panel');
      return {width:panel.width/scale,height:panel.height/scale,rows:rows.length,notes:rows.filter(r=>r.querySelector('.file-code-note').textContent).length,issues,noteLeft:[...new Set(rows.map(r=>Math.round(r.querySelector('.file-code-note').getBoundingClientRect().left/scale)))]};
    });
    for(const key of Object.keys(examples)){
      await page.locator(`[data-file="${key}"]`).click();
      assert.equal(await page.evaluate(()=>deck.current),8);
      assert.equal(await page.locator('#file-label').textContent(),examples[key][0]);
      assert.equal(await page.locator('.file-code-source').evaluateAll(es=>es.map(e=>e.textContent).join('\n')),examples[key][1]);
      const layout=await measure();
      assert.deepEqual(layout.issues,[],key);
      assert.equal(layout.height,481);
      assert.equal(layout.noteLeft.length,1);
      report.tabs.push({key,...layout});
      await page.screenshot({path:path.join(root,`validation/file-example-${key}-1920.png`)});
    }
    for(const [width,height] of [[1440,810],[1280,960],[900,1200]]){
      await page.setViewportSize({width,height});
      await page.waitForFunction(()=>Math.abs(document.querySelector('#stage').getBoundingClientRect().width/1920-Math.min(innerWidth/1920,innerHeight/1080))<0.001);
      for(const key of Object.keys(examples)){
        await page.locator(`[data-file="${key}"]`).click();
        assert.deepEqual((await measure()).issues,[],`${key} at ${width}x${height}`);
      }
      report.viewports.push({width,height,allTabsFit:true});
    }
    await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>deck.current),9);
    await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>deck.current),8);
    assert.equal(await page.locator('.file-code-line').count(),11);

    // Execute the connected HTML/CSS/JS excerpts to check the teaching example.
    const demo=await context.newPage();
    const html=examples.html[1].replace(/<link[^>]*>/g,'').replace(/<script[^>]*>[\s\S]*?<\/script>/g,'');
    await demo.setContent(html);
    await demo.addStyleTag({content:examples.css[1]});
    await demo.addScriptTag({content:examples.js[1]});
    await demo.evaluate(()=>addScore(2));
    assert.equal(await demo.locator('#score').textContent(),'200');
    await demo.locator('#pause').click();
    assert.equal(await demo.locator('#pause').textContent(),'계속하기');
    await demo.locator('#pause').click();
    assert.equal(await demo.locator('#pause').textContent(),'일시정지');
    assert.equal(await demo.locator('.game').evaluate(e=>getComputedStyle(e).width),'360px');
    report.exampleBehavior={scoreUpdate:true,pauseStateToggle:true,cssSelectorMatches:true};
    assert.deepEqual(errors,[]);
    report.passed=true;report.errors=errors;
    fs.writeFileSync(path.join(root,'validation/file-examples-check.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
