const path=require('path'),fs=require('fs'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:810},reducedMotion:'reduce'}),errors=[],results=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(path.resolve(__dirname,'../../260929_경영기획DX추진TF팀_AI_CODING_기초교육.html')).href+'#/10');
const index=await p.locator('[data-run="html"]').evaluate(e=>[...document.querySelectorAll('.slide')].indexOf(e.closest('.slide'))+1);await p.evaluate(i=>location.hash='#/'+i,index);
for(const mode of ['html','python','hybrid','localhost','192.168.0.10','html']){
 await p.locator(mode.includes('.')||mode==='localhost'?`[data-address="${mode}"]`:`[data-run="${mode}"]`).click();
 const box=await p.locator('.run-window').boundingBox();
 const fits=await p.locator('.run-window').evaluate(e=>e.scrollHeight<=e.clientHeight+1);
 assert(fits,`Overflow in ${mode}`);if(results.length)assert.deepEqual(box,results[0].box);results.push({mode,box,fits});
 if(mode==='192.168.0.10')await p.screenshot({path:path.resolve(__dirname,'../validation/run-window-stable.png')});
}
assert.deepEqual(errors,[]);fs.writeFileSync(path.resolve(__dirname,'../validation/run-window-check.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({passed:true,modes:results.length,box:results[0].box,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
