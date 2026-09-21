const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(path.resolve(__dirname,'../AI코딩교육_체험과안목_v3.html')).href+'#/2');
for(const [slide,preset] of [[2,'build'],[3,'color'],[3,'hud'],[3,'effects']]){
 await p.evaluate(i=>deck.go(i-1),slide);
 const root=p.locator(`[data-ide="${slide}"]`);
 await root.locator(`[data-preset="${preset}"]`).click();await root.locator('[data-codex-send]').click();
 await p.waitForFunction(()=>!!document.querySelector('.slide.is-active .is-streaming'));
 const text1=await root.locator('.is-streaming').textContent();await p.waitForTimeout(180);
 const text2=await root.locator('.is-streaming').textContent();assert(text2.length>text1.length);
 assert(await root.locator('[data-codex-send]').isDisabled());
 await p.waitForFunction(()=>document.querySelector('.slide.is-active [data-ide-code][aria-busy=true]')&&document.querySelectorAll('.slide.is-active .ide-line').length>1);
 const lines1=await root.locator('.ide-line').count();await p.waitForTimeout(190);const lines2=await root.locator('.ide-line').count();assert(lines2>lines1);
 if(preset==='build')await p.screenshot({path:path.resolve(__dirname,'../validation/streaming-code.png')});
 await p.waitForFunction(()=>!tetrisWorkshop.busy,{},{timeout:20000});
 if(preset==='build')assert(await p.evaluate(()=>tetrisWorkshop.built));else assert(await p.evaluate(k=>tetrisWorkshop.config[k],preset));
}
await p.evaluate(()=>deck.go(1));await p.locator('[data-ide="2"] [data-codex-send]').click();await p.waitForTimeout(220);await p.locator('[data-ide="2"] [data-codex-send]').blur();await p.keyboard.press('PageDown');
assert.equal(await p.evaluate(()=>deck.current),2);const text=await p.locator('[data-codex-history]').allTextContents();await p.waitForTimeout(700);assert.deepEqual(await p.locator('[data-codex-history]').allTextContents(),text);assert.equal(await p.locator('.is-streaming').count(),0);
assert.deepEqual(errors,[]);console.log('PASS: incremental text and code for build/color/hud/effects, disabled duplicate send, final game updates, immediate navigation and no stale output');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
