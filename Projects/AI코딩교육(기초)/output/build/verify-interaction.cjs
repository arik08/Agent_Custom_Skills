const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..'),url=pathToFileURL(path.join(root,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/1';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[],shots=new Set(),turns=new Set();let samples=0,maxBubbles=0;try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.goto(url);const frame=await (await page.locator('#cover-diorama').elementHandle()).contentFrame();await frame.waitForFunction(()=>window.spriteInspect?.().ready);
 await frame.evaluate(()=>{document.querySelector('#speed').click();document.querySelector('#speed').click();});
 for(let i=0;i<700;i++){
  const state=await frame.evaluate(()=>{const s=window.spriteInspect();return {...s,bubbles:[...document.querySelectorAll('.bubble')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()}))};});
  samples++;maxBubbles=Math.max(maxBubbles,state.bubbles.length);assert(state.bubbles.length<=1);if(state.speech.speaker>=0){turns.add(state.beat);assert.equal(state.bubbles[0]?.text,state.speech.text);assert(state.workers.every(w=>!w.path.length));}
  assert(state.renderedSprites.every(s=>s.footY>=.099&&s.footY<=.12));assert(state.renderedSprites.every(s=>s.screenAspect>.9&&s.screenAspect<1.1));
  if(['request','implement','feedback','verdict'].includes(state.beat)&&!shots.has(state.beat)&&(state.speech.speaker>=0||state.beat==='implement')){await page.screenshot({path:path.join(root,'validation','interaction-'+state.beat+'.png')});shots.add(state.beat);}
  if(state.finished)break;await page.waitForTimeout(100);
 }
 assert.equal((await frame.evaluate(()=>window.spriteInspect())).finished,1);assert.equal(turns.size,12);
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);const paused=await frame.evaluate(()=>window.spriteInspect());assert(paused.paused);await page.waitForTimeout(250);assert.equal((await frame.evaluate(()=>window.spriteInspect())).time,paused.time);
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(150);assert(!(await frame.evaluate(()=>window.spriteInspect())).paused);
 await page.setViewportSize({width:1024,height:768});await page.screenshot({path:path.join(root,'validation/interaction-4x3.png')});
 const reduced=await browser.newPage({reducedMotion:'reduce',viewport:{width:1280,height:720}});await reduced.goto(url);const rf=await (await reduced.locator('#cover-diorama').elementHandle()).contentFrame();await rf.waitForFunction(()=>window.spriteInspect?.().ready);const r1=await rf.evaluate(()=>window.spriteInspect());await reduced.waitForTimeout(250);const r2=await rf.evaluate(()=>window.spriteInspect());assert.equal(r1.time,r2.time);assert.equal(r1.speech.speaker,0);assert(r1.reducedMotion);
 assert.equal(errors.length,0,errors.join('\n'));
 const result={passed:true,samples,maxBubbles,turns:[...turns],screenshots:[...shots],hiddenPaused:true,returnResumes:true,reducedMotionStatic:true,errors};fs.writeFileSync(path.join(root,'validation/interaction-check.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
