const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../AI코딩교육_체험과안목_v3.html')).href+'#/2');
 for(const key of ['ArrowRight','PageDown','Space','Enter']){
  for(const index of [1,2]){
   await page.evaluate(i=>deck.go(i),index);
   const before=await page.locator('[data-codex-input]').evaluateAll(es=>es.map(e=>e.value));
   await page.keyboard.press(key);
   assert.equal(await page.evaluate(()=>deck.current),index+1);
   assert.deepEqual(await page.locator('[data-codex-input]').evaluateAll(es=>es.map(e=>e.value)),before);
   assert.equal(await page.evaluate(()=>tetrisWorkshop.busy),false);
  }
 }
 await page.evaluate(()=>deck.go(1));await page.mouse.move(5,5);await page.mouse.wheel(0,100);
 await page.waitForFunction(()=>deck.current===2);
 await page.mouse.wheel(0,100);await page.waitForFunction(()=>deck.current===3);
 await page.evaluate(()=>deck.go(1));
 await page.locator('[data-ide="2"] [data-preset="build"]').click();
 await page.locator('[data-ide="2"] [data-codex-send]').click();
 await page.waitForFunction(()=>tetrisWorkshop.built&&!tetrisWorkshop.busy);
 await page.evaluate(()=>deck.go(2));
 for(const preset of ['color','hud','effects']){
  await page.locator(`[data-ide="3"] [data-preset="${preset}"]`).click();
  await page.locator('[data-ide="3"] [data-codex-send]').click();
  await page.waitForFunction(key=>tetrisWorkshop.config[key]&&!tetrisWorkshop.busy,preset);
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>deck.go(1));
 await page.locator('[data-ide="2"] [data-preset="build"]').click();
 await page.locator('[data-ide="2"] [data-codex-send]').click();
 await page.locator('[data-ide="2"] [data-codex-send]').blur();
 await page.keyboard.press('PageDown');assert.equal(await page.evaluate(()=>deck.current),2);
 assert.equal(await page.evaluate(()=>tetrisWorkshop.busy),false);
 assert.deepEqual(errors,[]);
 console.log('PASS: immediate keyboard/wheel navigation, unchanged inputs, direct build and all upgrade buttons, navigation during execution, no JS errors');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
