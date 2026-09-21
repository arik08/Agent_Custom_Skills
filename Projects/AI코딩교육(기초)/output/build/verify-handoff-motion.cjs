const assert=require('node:assert/strict'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const p=await browser.newPage({viewport:{width:1440,height:810}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('Projects/AI코딩교육(기초)/output/AI코딩교육_체험과안목_v3.html')).href+'#/5');const next=()=>p.locator('[data-handoff=next]').click();
for(let round=0;round<3;round++){
 await next();await p.waitForTimeout(120);const initial=await p.locator('.hs-snippets').textContent();await p.waitForTimeout(180);assert((await p.locator('.hs-snippets').textContent()).length>initial.length,'stream moves immediately');
 await next();await p.waitForTimeout(100);const left=await p.locator('.hs-drag-pointer').evaluate(e=>e.style.left);await p.waitForTimeout(220);assert.notEqual(await p.locator('.hs-drag-pointer').evaluate(e=>e.style.left),left,'drag moves immediately');
 if(round===0){await p.waitForFunction(()=>document.querySelector('.hs-copy').textContent.includes('3개 복사됨'));}
 await next();await p.waitForTimeout(650);assert(await p.locator('.hs-insert-group').first().evaluate(e=>e.getBoundingClientRect().height>0),'insertion starts');
 await next();await next();await p.waitForTimeout(100);await p.evaluate(()=>deck.go(5));await p.evaluate(()=>deck.go(4));assert(await p.locator('.hs-insert-group').first().evaluate(e=>e.getBoundingClientRect().height>0));
 for(let i=0;i<6;i++)await next();
}
assert.deepEqual(errors,[]);console.log('PASS real-time: three cycles, immediate stream/drag/insertion, interrupted transitions, leave/return, no page errors');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
