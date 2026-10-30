const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');
const name='260929_경영기획DX추진TF팀_AI_CODING_기초교육.html';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(root,name)).href+'#/20');
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('.closing img').evaluate(im=>im.decode());
 const result=await page.evaluate(()=>{
  const slide=document.querySelector('.closing'),im=slide.querySelector('img'),canvas=document.createElement('canvas');canvas.width=im.naturalWidth;canvas.height=im.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0,opaque=0,partial=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else if(data[i]>=250)opaque++;else partial++;}
  const r=im.getBoundingClientRect(),h=slide.querySelector('header').getBoundingClientRect(),f=document.querySelector('footer').getBoundingClientRect();
  return {current:deck.current,total:document.querySelectorAll('.slide').length,dimensions:[im.naturalWidth,im.naturalHeight],transparent,opaque,partial,clearHeader:r.top>=h.bottom-1,clearFooter:r.bottom<=f.top+1,alt:im.alt};
 });
 if(result.current!==19||result.total!==20||!result.transparent||!result.opaque||!result.clearHeader||!result.clearFooter)throw Error(JSON.stringify(result));
 await page.screenshot({path:path.join(root,'validation/qa-final-1920.png')});
 for(const [width,height] of [[1280,800],[1024,768],[2560,1080],[800,1200]]){await page.setViewportSize({width,height});const fits=await page.locator('#stage').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1});if(!fits)throw Error('Stage bounds '+width);}
 await page.setViewportSize({width:1920,height:1080});await page.keyboard.press('ArrowRight');if(await page.evaluate(()=>deck.current)!==19)throw Error('End boundary');await page.keyboard.press('ArrowLeft');if(await page.evaluate(()=>deck.current)!==18)throw Error('Previous');await page.keyboard.press('End');if(await page.evaluate(()=>deck.current)!==19)throw Error('End');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowRight');await page.waitForTimeout(6000);await page.screenshot({path:path.join(root,'validation/qa-final-animation.png')});

 fs.writeFileSync(path.join(root,'validation/qa-final-check.json'),JSON.stringify({...result,errors,viewports:5},null,2));
 console.log(JSON.stringify({...result,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
