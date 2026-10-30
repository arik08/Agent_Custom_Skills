const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {chromium} = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
(async () => {
  const {phases} = await import(pathToFileURL(path.join(__dirname, 'coding-flow.mjs')));
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  const results = [];
  try {
    for (const [width, height, dpr] of [[1280,720,1],[1920,1080,1],[1440,810,2]]) {
      const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr});
      await context.addInitScript(() => {
        const draw = CanvasRenderingContext2D.prototype.fillText;
        window.boardDraws = [];
        CanvasRenderingContext2D.prototype.fillText = function(text, ...args) {
          if (this.canvas.width === 2048 && this.canvas.height === 800) {
            window.boardDraws.push({text,font:this.font,width:this.canvas.width,height:this.canvas.height});
          }
          return draw.call(this,text,...args);
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(pathToFileURL(path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href + '#/1');
      const handle = await page.locator('#cover-diorama').elementHandle();
      const frame = await handle.contentFrame();
      await frame.waitForFunction(() => window.spriteInspect?.().ready && window.boardDraws.length > 0);
      const metrics = await frame.evaluate(phases => {
        const canvas = document.querySelector('#stage canvas');
        const ctx = document.createElement('canvas').getContext('2d');
        const fit = phases.map((phase,index) => {
          ctx.font = 'bold 38px sans-serif';
          const heading = ctx.measureText('CODING AGENT  /  '+phase.label).width;
          ctx.font = 'bold 44px monospace';
          const longest = Math.max(...phase.lines.map(line=>ctx.measureText(line).width));
          return {index,heading,longest,limit:index===3||index===5?740:994};
        });
        return {ready:window.spriteInspect().ready,buffer:[canvas.width,canvas.height],css:[canvas.clientWidth,canvas.clientHeight],draws:window.boardDraws,fit};
      }, phases);
      assert(metrics.buffer[0] >= metrics.css[0]*2-1);
      assert(metrics.draws.some(draw=>draw.font==='bold 44px monospace'));
      assert(metrics.fit.every(row=>row.heading<=994 && row.longest<=row.limit));
      await page.screenshot({path:path.join(root,`validation/cover-sharpness-${width}-dpr${dpr}.png`)});
      // Verify hidden/visible resizing and moving back to the cover.
      await page.keyboard.press('ArrowRight');
      await page.setViewportSize({width:width-80,height:height-45});
      await page.keyboard.press('ArrowLeft');
      await frame.waitForFunction(()=>document.querySelector('#stage canvas').width>0);
      assert.equal(errors.length,0,errors.join('\n'));
      results.push({viewport:[width,height],dpr,...metrics,errors});
      await context.close();
    }
    fs.writeFileSync(path.join(root,'validation/cover-sharpness.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify({passed:true,viewports:results.length,allPhaseTextFits:6,runtimeErrors:0}));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
