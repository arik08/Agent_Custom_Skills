const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const {pathToFileURL}=require('url');
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),box={};vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(__dirname,'tetris-workshop.js'),'utf8'),box);
const results=[];let left=0,right=0,turns=0;
for(const seed of [1,12,37,98,2026]){
 const e=new box.TetrisEngine(seed);
 for(let n=0;n<150&&!e.gameOver;n++){
  assert(!e.gameOver);assert.equal(e.piece.y,0);assert.equal(e.piece.x,Math.floor((10-e.piece.a[0].length)/2));
  const count=e.pieces;let ticks=0;
  while(e.pieces===count&&ticks++<150){const prev=JSON.parse(JSON.stringify(e.piece));e.step();if(e.pieces===count){assert(e.fits(e.piece.a,e.piece.x,e.piece.y));assert.equal(e.piece.y,prev.y+1);if(e.piece.x<prev.x)left++;if(e.piece.x>prev.x)right++;if(JSON.stringify(e.piece.a)!==JSON.stringify(prev.a))turns++;}}
  assert.equal(e.pieces,count+1);
 }
 assert(e.lines>0);results.push({seed,pieces:e.pieces,lines:e.lines,gameOver:e.gameOver});
}
assert(left&&right&&turns);
const e=new box.TetrisEngine();e.setAuto(false);e.move(-1);e.step();const before=JSON.stringify(e.piece);e.setAuto(true);assert.equal(JSON.stringify(e.piece),before);e.paused=true;const frozen=JSON.stringify(e.snapshot());for(let i=0;i<20;i++)e.step();assert.equal(JSON.stringify(e.snapshot()),frozen);
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:810}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.join(root,'AI코딩교육_체험과안목_v3.html')).href+'#/2');await page.locator('[data-ide="2"] [data-codex-input]').fill('테트리스를 만들어줘.');await page.locator('[data-ide="2"] [data-codex-send]').click();await page.waitForFunction(()=>tetrisWorkshop.built&&!tetrisWorkshop.busy);
const pages=[];
for(const index of [1,2]){
 if(index===2)await page.evaluate(()=>deck.go(2));
 await page.locator(`[data-ide="${index+1}"] [data-tetris-action="reset"]`).click();
 const samples=await page.evaluate(async()=>{const a=[];for(let i=0;i<45;i++){const e=tetrisWorkshop.engine;a.push({x:e.piece?.x,y:e.piece?.y,pieces:e.pieces});await new Promise(r=>setTimeout(r,40));}return a;});
 assert(samples.some((s,i)=>i&&s.pieces===samples[i-1].pieces&&s.x!==samples[i-1].x));assert(samples.some(s=>s.y>0));pages.push({page:index+1,samples});
 await page.screenshot({path:path.join(root,`validation/steering-page-${index+1}.png`)});
}
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'validation/steering.json'),JSON.stringify({results,left,right,turns,pages,errors},null,2));console.log(JSON.stringify({results,left,right,turns,pages:pages.map(p=>p.page),errors}));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
