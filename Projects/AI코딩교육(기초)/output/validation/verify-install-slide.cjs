const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 const p=await b.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.join(root,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/18');
 await p.evaluate(()=>document.fonts.ready);
 const results=[];
 for(const [width,height] of [[1920,1080],[1280,800],[1024,768],[2560,1080],[800,1200]]){
  await p.setViewportSize({width,height});
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const result=await p.evaluate(()=>{
   const s=document.querySelector('.install-slide'),r=s.querySelector('.install-extras').getBoundingClientRect(),bridge=s.querySelector('.bridge').getBoundingClientRect(),stage=document.querySelector('#stage').getBoundingClientRect();
   return {page:deck.current,total:document.querySelectorAll('.slide').length,footer:document.querySelector('#page-label').textContent,clearBridge:r.bottom<bridge.top-4,stageFits:stage.left>=-1&&stage.top>=-1&&stage.right<=innerWidth+1&&stage.bottom<=innerHeight+1,images:[...s.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0),links:s.querySelectorAll('a[href^="https://"]').length,nestedButtons:s.querySelectorAll('a button').length,overflow:[...s.querySelectorAll('a,small,strong,p')].filter(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).display!=='inline').map(e=>e.textContent)};
  });
  if(!result.clearBridge||!result.stageFits||!result.images||result.links!==7||result.nestedButtons||result.total!==21||result.page!==17||result.overflow.length)throw Error(JSON.stringify(result));
  results.push({width,height,...result});
 }
 await p.setViewportSize({width:1920,height:1080});
 await p.screenshot({path:path.join(__dirname,'install-slide-1920.png')});
 // Verify actual link dispatch without downloading or installing software.
 await p.context().route('https://**/*',route=>route.fulfill({status:200,contentType:'text/html',body:'Official link navigation check'}));
 for(const link of await p.locator('.install-slide a').all()){
  const href=await link.getAttribute('href');const popup=p.waitForEvent('popup');await link.click();const tab=await popup;await tab.waitForLoadState();if(tab.url()!==href)throw Error('Wrong link');await tab.close();if(await p.evaluate(()=>deck.current)!==17)throw Error('Link changed slide');
 }
 await p.keyboard.press('ArrowRight');if(!(await p.locator('.package-slide').getAttribute('class')).includes('is-active'))throw Error('Original page 18 not now 19');
 await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowLeft');if(await p.evaluate(()=>deck.current)!==16)throw Error('Previous page');
 await p.keyboard.press('End');if(await p.evaluate(()=>deck.current)!==20)throw Error('End');
 await p.keyboard.press('Home');if(await p.evaluate(()=>deck.current)!==0)throw Error('Home');
 await p.evaluate(()=>location.hash='#/18');await p.waitForFunction(()=>deck.current===17);
 await p.emulateMedia({reducedMotion:'no-preference'});await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowRight');await p.waitForTimeout(800);
 await p.screenshot({path:path.join(__dirname,'install-slide-animated.png')});
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync(path.join(__dirname,'install-slide-check.json'),JSON.stringify({results,errors,linkDispatch:7,navigation:'17 → 18 → 19; Home; End; hash; normal and reduced motion',notChecked:['Actual software installation','Account login','Full-deck revalidation of unrelated interactive demonstrations']},null,2));
 console.log(JSON.stringify({viewports:results.length,links:7,images:7,errors,navigation:'passed'}));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
