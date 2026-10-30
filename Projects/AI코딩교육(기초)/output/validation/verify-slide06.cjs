const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
const output=path.resolve(__dirname,'..'),file=path.join(output,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'slide06-before.json'),'utf8'));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'}),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(file).href+'#/6');await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('.slide.is-active').getAttribute('data-index'),'5');
assert.equal(await page.locator('.foundations-bridge .bridge').evaluate(e=>e.outerHTML),before.bridge);
for(const [width,height] of [[1920,1080],[1440,900],[1024,768],[2560,1080],[720,1280]]){
await page.setViewportSize({width,height});await page.waitForTimeout(150);
const result=await page.evaluate(()=>{
const s=document.querySelector('.foundations-bridge'),q=x=>s.querySelector(x).getBoundingClientRect(),scene=q('.foundation-dialogues'),take=q('.foundation-takeaway'),bridge=q('.bridge'),heading=q('header');
const over=[...s.querySelectorAll('.foundation-dialogue p,.foundation-takeaway,header h1')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent);
const articles=[...s.querySelectorAll('.foundation-dialogue')].map(e=>e.getBoundingClientRect());
const im=s.querySelector('img');return {over,overlap:scene.bottom>bridge.top+1||take.bottom>bridge.top+1||heading.bottom>scene.top+1||take.right>scene.left+1||articles[0].bottom>articles[1].top+1||articles[1].bottom>scene.bottom+1,imageLoaded:im.complete&&im.naturalWidth>0};
});assert.deepEqual(result.over,[]);assert.equal(result.overlap,false);assert.equal(result.imageLoaded,true);results.push({width,height,...result});
if(width===1920)await page.screenshot({path:path.join(__dirname,'slide06-final.png')});
}
await page.setViewportSize({width:1440,height:810});
for(const term of ['서버','DB 인덱스','실행 계획']){
await page.locator('.foundations-bridge button').filter({hasText:term}).first().hover();
await page.waitForTimeout(100);assert.equal(await page.locator('#term-panel').isVisible(),true);assert.ok((await page.locator('#term-panel').innerText()).includes(term));await page.mouse.move(0,0);await page.waitForTimeout(260);
}
await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.slide.is-active').getAttribute('data-index'),'6');
await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.slide.is-active').getAttribute('data-index'),'5');
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'slide06-check.json'),JSON.stringify({bridgeUnchanged:true,results,tooltipTerms:['서버','DB 인덱스','실행 계획'],navigation:'6 -> 7 -> 6',errors},null,2));console.log(JSON.stringify({viewports:results.length,bridgeUnchanged:true,tooltips:'pass',navigation:'pass',errors}));
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
