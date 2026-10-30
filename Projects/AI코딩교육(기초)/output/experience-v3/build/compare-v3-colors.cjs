const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const pages=[];for(const name of ['AI코딩교육_체험과안목_v3.html','260929_경영기획DX추진TF팀_AI_CODING_기초교육.html']){
 const p=await b.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'});await p.goto(pathToFileURL(path.resolve(__dirname,'../..',name)).href+'#/4');pages.push(p);}
 const read=p=>p.evaluate(()=>{
 const colors={};function walk(rules){for(const r of rules){if(r.selectorText&&r.style){const props={};for(const name of Array.from(r.style)){if(/color|background|^--/.test(name)&&name!=='--scale')props[name]=r.style.getPropertyValue(name);}if(Object.keys(props).length)colors[r.selectorText]={...colors[r.selectorText],...props};}if(r.cssRules)walk(r.cssRules);}}for(const sheet of document.styleSheets)walk(sheet.cssRules);return colors;});
 const [old,now]=await Promise.all(pages.map(read));const differences=[];
 for(const selector of Object.keys(old)){if(!now[selector])continue;for(const prop of Object.keys(old[selector]))if(now[selector][prop]!==old[selector][prop])differences.push({selector,prop,old:old[selector][prop],now:now[selector][prop]});}
 console.log(JSON.stringify({differences,counts:await Promise.all(pages.map(p=>p.locator('.slide').count()))})); const total=Math.min(...await Promise.all(pages.map(p=>p.locator('.slide').count()))); const pageColors=[];for(let i=1;i<=total;i++){
  const values=[];for(const p of pages){await p.evaluate(i=>{document.querySelectorAll('.slide').forEach((s,j)=>s.classList.toggle('is-active',j===i-1));},i);values.push(await p.evaluate(()=>({background:getComputedStyle(document.querySelector('.slide.is-active')).backgroundColor,cards:[...document.querySelectorAll('.slide.is-active .roles>div')].map(e=>getComputedStyle(e).backgroundColor)})));}
  assert.deepEqual(values[0],values[1]);pageColors.push({page:i,...values[1]});
  if(i===4||i===5||i===9)await pages[1].screenshot({path:path.resolve(__dirname,`../validation/page${i}-v3-colors-restored.png`)});
 }
 fs.writeFileSync(path.resolve(__dirname,'../validation/v3-color-comparison.json'),JSON.stringify({differences,pageColors},null,2));console.log(JSON.stringify({differences,pagesMatched:pageColors.length}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
