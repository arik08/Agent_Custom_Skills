const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
const b=await chromium.launch({channel:'msedge',headless:true});
try{
const p=await b.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'}),errors=[],report=[];
p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(path.resolve(__dirname,'../../260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/4');
for(let i=1;i<=20;i++){
 await p.evaluate(i=>location.hash='#/'+i,i);
 await p.waitForFunction(i=>Array.from(document.querySelectorAll('.slide')).findIndex(s=>s.classList.contains('is-active'))===i-1,i);
 const row=await p.evaluate(()=>{
  const s=document.querySelector('.slide.is-active'),warm=[];
  for(const e of s.querySelectorAll('*')){
   const c=getComputedStyle(e),rect=e.getBoundingClientRect(),m=c.backgroundColor.match(/[\d.]+/g)?.map(Number);
   if(rect.width>20&&rect.height>20&&m&&m[0]>220&&m[1]>210&&m[0]-m[2]>12&&m[1]-m[2]>8&&(m.length<4||m[3]>.15))warm.push({tag:e.tagName,class:e.className,color:c.backgroundColor});
  }
  return {background:getComputedStyle(s).backgroundColor,body:getComputedStyle(document.body).backgroundColor,warm};
 });
 assert.equal(row.background,'rgb(255, 255, 255)');assert.equal(row.body,'rgb(255, 255, 255)');report.push({page:i,...row});
 if(i===4||i===5){await p.screenshot({path:path.resolve(__dirname,`../validation/page${i}-white-background.png`)});}
}
assert.deepEqual(errors,[]);
fs.writeFileSync(path.resolve(__dirname,'../validation/white-background-check.json'),JSON.stringify({report,errors},null,2));
console.log(JSON.stringify({pages:report.length,warm:report.filter(x=>x.warm.length),errors}));
}finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
