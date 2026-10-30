const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const root=path.resolve(__dirname,'..'),browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'}),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(root,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/10');
 await page.evaluate(()=>document.fonts.ready);
 for(const mode of ['html','python','hybrid']){
  await page.locator('[data-run="'+mode+'"]').click();
  checks.push(await page.locator('.run-window').evaluate(el=>{const r=el.getBoundingClientRect();return {mode:el.dataset.runMode,height:r.height,overflow:el.scrollHeight>el.clientHeight+2,bodyOverflow:el.querySelector('.run-window-body').getBoundingClientRect().bottom>r.bottom+1,exampleBottom:el.querySelector('.run-example').getBoundingClientRect().bottom,windowBottom:r.bottom}}));
  await page.screenshot({path:path.join(root,'validation/slide10-'+mode+'-filled.png')});
 }
 await page.locator('[data-address="localhost"]').click();
 checks.push(await page.locator('.run-window').evaluate(el=>({mode:'hybrid-open',overflow:el.scrollHeight>el.clientHeight+2,browserVisible:!document.querySelector('#run-browser').hidden})));
 await page.screenshot({path:path.join(root,'validation/slide10-hybrid-open.png')});
 for(const size of [{width:1280,height:800},{width:1024,height:768}]){await page.setViewportSize(size);for(const mode of ['html','python','hybrid']){await page.locator('[data-run="'+mode+'"]').click();checks.push(await page.locator('.run-window').evaluate(el=>({mode:el.dataset.runMode,width:innerWidth,overflow:el.scrollHeight>el.clientHeight+2})));}}
 fs.writeFileSync(path.join(root,'validation/slide10-filled-check.json'),JSON.stringify({errors,checks},null,2));
 console.log(JSON.stringify({errors,checks}));await browser.close();
 if(errors.length||checks.some(c=>c.overflow||c.bodyOverflow))process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
