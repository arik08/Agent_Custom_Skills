const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:810}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../../260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/5');
  await page.locator('[data-handoff-mode="agent"]').click();
  const result=()=>page.getByRole('button',{name:'실행 확인 단계로 이동'}).click();
  await result();
  const img=page.locator('.has-result-art img');
  await img.evaluate(e=>e.decode());
  assert.match(await img.getAttribute('alt'),/어때요, 참 쉽죠\?/);
  const samples=await img.evaluate(e=>{
   const a=e.getAnimations()[0];a.pause();
   return [0,432,900].map(t=>{a.currentTime=t;const s=getComputedStyle(e);return {time:t,opacity:s.opacity,transform:s.transform};});
  });
  assert.equal(samples[0].opacity,'0');assert.equal(samples[2].opacity,'1');
  assert.equal(samples[2].transform,'matrix(1, 0, 0, 1, 0, 0)');
  await page.screenshot({path:path.resolve(__dirname,'../validation/bob-ross-final-1440.png')});
  await page.getByRole('button',{name:'수정·연결 단계로 이동'}).click();await result();
  assert(await img.evaluate(e=>e.getAnimations().some(a=>a.playState==='running')));
  await page.keyboard.press('ArrowRight');
  assert.equal(await img.evaluate(e=>e.getAnimations().length),0);
  await page.keyboard.press('ArrowLeft');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await img.evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await img.evaluate(e=>getComputedStyle(e).opacity),'1');
  await page.locator('[data-handoff-mode="human"]').click();await result();assert.equal(await img.count(),0);
  await page.locator('[data-handoff-mode="agent"]').click();
  for(let i=0;i<3;i++)await page.locator('[data-handoff="next"]').click();
  assert.equal(await img.count(),1);
  assert.deepEqual(errors,[]);
  const report={passed:true,samples,checks:['embedded image decoded','exact alt text','entrance frames','step re-entry restarts','slide exit stops animation','reduced motion static','human result unchanged','sequential next reaches illustration','no page errors']};
  fs.writeFileSync(path.resolve(__dirname,'../validation/bob-ross-check.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
