/* Built on the original plan2.js collision/row-clear/placement approach.
   Seven-bag pieces, manual control, deterministic simulation and progressive visuals. */
(()=>{
'use strict';
const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
const rotate=a=>a[0].map((_,x)=>a.map(r=>r[x]).reverse());
const clone=a=>a.map(r=>r.slice());
class TetrisEngine {
 constructor(seed=37){this.seed=seed;this.reset();}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 bagPiece(){if(!this.bag.length){this.bag=[0,1,2,3,4,5,6];for(let i=6;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}return this.bag.pop();}
 reset(){this.board=Array.from({length:20},()=>Array(10).fill(0));this.bag=[];this.queue=[this.bagPiece(),this.bagPiece(),this.bagPiece()];this.score=0;this.lines=0;this.pieces=0;this.gameOver=false;this.paused=false;this.auto=true;this.lastClear=[];this.clearAt=0;this.spawn();}
 fits(a,x,y,board=this.board){return a.every((r,j)=>r.every((v,i)=>!v||(x+i>=0&&x+i<10&&y+j<20&&(y+j<0||!board[y+j][x+i]))));}
 merge(a,x,y,board,id){a.forEach((r,j)=>r.forEach((v,i)=>{if(v&&y+j>=0&&y+j<20)board[y+j][x+i]=id;}));}
 clearRows(board){const indices=[];board.forEach((r,i)=>{if(r.every(Boolean))indices.push(i);});const kept=board.filter(r=>!r.every(Boolean));while(kept.length<20)kept.unshift(Array(10).fill(0));return {board:kept,indices};}
 rating(board){let holes=0,total=0,bump=0;const heights=[];for(let x=0;x<10;x++){let found=false,h=0;for(let y=0;y<20;y++){if(board[y][x]){if(!found)h=20-y;found=true;}else if(found)holes++;}heights.push(h);total+=h;}for(let x=1;x<10;x++)bump+=Math.abs(heights[x]-heights[x-1]);return -total*.5-holes*7-bump*.5;}
 bestPlacement(id){
  const p=this.piece;if(!p)return null;
  const pending=[{a:clone(p.a),x:p.x,y:p.y,actions:[]}],seen=new Set();let best=null;
  for(let i=0;i<pending.length;i++){
   const state=pending[i],key=state.x+':'+state.y+':'+JSON.stringify(state.a);if(seen.has(key))continue;seen.add(key);
   if(!this.fits(state.a,state.x,state.y))continue;
   let y=state.y;while(this.fits(state.a,state.x,y+1))y++;
   const board=clone(this.board);this.merge(state.a,state.x,y,board,id+1);
   const cleared=this.clearRows(board),value=this.rating(cleared.board)+cleared.indices.length*10;
   if(!best||value>best.value)best={...state,y,value};
   if(state.actions.length>=8)continue;
   for(const dx of [-1,1])if(this.fits(state.a,state.x+dx,state.y)&&this.fits(state.a,state.x+dx,state.y+1))pending.push({a:state.a,x:state.x+dx,y:state.y+1,actions:[...state.actions,dx]});
   const turned=rotate(state.a);
   for(const kick of [0,-1,1,-2,2])if(this.fits(turned,state.x+kick,state.y)){if(this.fits(turned,state.x+kick,state.y+1))pending.push({a:turned,x:state.x+kick,y:state.y+1,actions:[...state.actions,'turn']});break;}
  }
  return best;
 }
 planAuto(){this.autoActions=this.auto?(this.bestPlacement(this.piece.id-1)?.actions||[]):[];}
 spawn(){const id=this.queue.shift();this.queue.push(this.bagPiece());this.piece={a:clone(SHAPES[id]),x:Math.floor((10-SHAPES[id][0].length)/2),y:0,id:id+1};if(!this.fits(this.piece.a,this.piece.x,0)){this.gameOver=true;this.piece=null;this.autoActions=[];}else this.planAuto();return !this.gameOver;}
 lock(){if(!this.piece||this.gameOver)return;const p=this.piece;this.merge(p.a,p.x,p.y,this.board,p.id);const c=this.clearRows(this.board);this.board=c.board;this.lastClear=c.indices;this.clearAt=c.indices.length?Date.now():0;this.lines+=c.indices.length;this.score+=[0,100,300,500,800][c.indices.length];this.pieces++;this.spawn();}
 step(){if(this.paused||this.gameOver||!this.piece)return;if(this.auto){if(this.autoActions.length){const action=this.autoActions.shift();const moved=action==='turn'?this.turn():this.move(action);if(!moved)this.planAuto();}}const p=this.piece;if(this.fits(p.a,p.x,p.y+1))p.y++;else this.lock();}
 move(dx){if(this.paused||this.gameOver||!this.piece)return false;const p=this.piece;if(!this.fits(p.a,p.x+dx,p.y))return false;p.x+=dx;return true;}
 turn(){if(this.paused||this.gameOver||!this.piece)return false;const p=this.piece,a=rotate(p.a);for(const kick of [0,-1,1,-2,2])if(this.fits(a,p.x+kick,p.y)){p.a=a;p.x+=kick;return true;}return false;}
 drop(){if(this.paused||this.gameOver||!this.piece)return;if(this.auto){const count=this.pieces;while(this.autoActions.length&&this.pieces===count&&!this.gameOver)this.step();if(this.pieces!==count||this.gameOver)return;}const p=this.piece;while(this.fits(p.a,p.x,p.y+1))p.y++;this.lock();}
 setAuto(value){this.auto=value;this.autoActions=[];if(this.piece)this.planAuto();}
 snapshot(){return {board:clone(this.board),piece:this.piece?{...this.piece,a:clone(this.piece.a)}:null,score:this.score,lines:this.lines,pieces:this.pieces,auto:this.auto,paused:this.paused,gameOver:this.gameOver,queue:this.queue.slice()};}
}
globalThis.TetrisEngine=TetrisEngine;
if(typeof document==='undefined')return;
const roots=[...document.querySelectorAll('[data-ide]')];if(!roots.length)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),engine=new TetrisEngine();
const base={color:false,hud:false,ghost:false,effects:false};let config={...base},built=false,filesReady=false,active=-1,raf=0,lastTime=0,acc=0,speed=1,dropMs=40,busy=null,timers=[];
const states=new Map(roots.map(root=>[root,{file:root.dataset.ide==='2'?'index':'game',mode:'code',lastDiff:[],fileDiffs:{},drafts:{},lastCaption:'Codex에 만들고 싶은 동작을 설명합니다.'}]));
const q=(root,s)=>root.querySelector(s);
function viewConfig(root){return root.dataset.ide==='2'?base:config;}
function tier(cfg){return Number(cfg.color)+Number(cfg.hud)+Number(cfg.ghost);}
const requests={build:'웹에서 실행하는 테트리스를 만들어줘. 일단 단순하게 만들고, 자동 플레이를 처음부터 빠르게 넣어줘.',color:'블록마다 색을 다르게 하고, 화면을 게임답게 꾸며줘.',hud:'점수를 크게 하고 다음 블록도 보여줘.',effects:'착지 위치랑 줄이 사라지는 효과도 넣어줘.'};
const initialViews=new Map(roots.map(root=>[root,{
 text:Object.fromEntries(['[data-ide-status]','[data-codex-hint]','[data-ide-terminal]','[data-change-count]'].map(selector=>[selector,q(root,selector).textContent])),
 input:q(root,'[data-codex-input]').value,
 sendLabel:q(root,'[data-codex-send]').getAttribute('aria-label')
}]));
function resetWorkshop(){
 cancel();stop();built=false;filesReady=false;config={...base};dropMs=40;speed=1;engine.reset();
 roots.forEach(root=>{
  const initial=initialViews.get(root);
  states.set(root,{file:root.dataset.ide==='2'?'index':'game',mode:'code',lastDiff:[],fileDiffs:{},drafts:{},lastCaption:'Codex에 만들고 싶은 동작을 설명합니다.'});
  q(root,'[data-codex-history]').replaceChildren();
  for(const [selector,text] of Object.entries(initial.text))q(root,selector).textContent=text;
  const input=q(root,'[data-codex-input]');input.value=initial.input;input.readOnly=false;
  const send=q(root,'[data-codex-send]');send.disabled=false;
  if(initial.sendLabel===null)send.removeAttribute('aria-label');else send.setAttribute('aria-label',initial.sendLabel);
  root.querySelectorAll('.codex-thread,[data-ide-code]').forEach(el=>el.scrollTop=0);
 });
}
const colors=['#4edcf3','#f5d969','#b490ff','#73e5ad','#ff7f9c','#64aaff','#ffa965'];
function codeFor(root,key,cfg=viewConfig(root),interval=dropMs){if(key==='index')return ['<!doctype html>','<html lang="ko">','  <title>Tetris</title>','  <link rel="stylesheet"','    href="style.css">','  <canvas id="board">','  </canvas>','  <div id="score">0</div>',...(cfg.hud?['  <canvas id="next">','  </canvas>']:[]),'  <script src="tetris.js">','  <'+'/script>','</html>'];
 if(key==='style')return ['/* 게임 화면 스타일 */',':root {',`  --background: ${cfg.color?'#101c2c':'#eeeeee'};`,`  --block-color: ${cfg.color?'var(--piece-color)':'#888888'};`,'}','.score {',`  font-size: ${cfg.hud?'40px':'16px'};`,`  color: ${cfg.hud?'#7fe7fa':'#333333'};`,'}','canvas {',`  border: ${cfg.color?'1px solid #4b6e8b':'1px solid #999'};`,'}'];
 return ['// 자동 플레이는 처음부터',`const AUTO_PLAY = true;`,`const DROP_MS = ${interval};`,'', '// 요청에 따라 바뀌는 설정','const options = {',`  color: ${cfg.color},`,`  nextPreview: ${cfg.hud},`,`  largeScore: ${cfg.hud},`,`  ghostPiece: ${cfg.ghost},`,`  clearEffect: ${cfg.effects}`,'};','', '// 게임 루프가 설정을 반영','updateGame(options);'];}
// Compare the same source shown by the editor; new files have no old lines.
function diffLines(before,after){
 const lengths=Array.from({length:before.length+1},()=>Array(after.length+1).fill(0));
 for(let i=before.length-1;i>=0;i--)for(let j=after.length-1;j>=0;j--)lengths[i][j]=before[i]===after[j]?1+lengths[i+1][j+1]:Math.max(lengths[i+1][j],lengths[i][j+1]);
 const rows=[];let i=0,j=0;
 while(i<before.length||j<after.length){
  if(i<before.length&&j<after.length&&before[i]===after[j]){rows.push('  '+after[j++]);i++;}
  else if(j<after.length&&(i===before.length||lengths[i][j+1]>lengths[i+1][j]))rows.push('+ '+after[j++]);
  else rows.push('- '+before[i++]);
 }
 return rows;
}
function renderCode(root){const s=states.get(root),area=q(root,'[data-ide-code]');const hasChanges=s.lastDiff.length>0;q(root,'[data-editor-mode="diff"]').hidden=!hasChanges;if(!hasChanges&&s.mode==='diff')s.mode='code';area.replaceChildren();area.classList.remove('editing');area.contentEditable='false';area.setAttribute('role','textbox');area.setAttribute('aria-label','코드 편집기');area.setAttribute('aria-multiline','true');area.spellcheck=false;const rows=!filesReady&&!built&&root.dataset.ide==='2'?['<!-- 여기에 작성하세요 -->']:(s.mode==='diff'&&s.lastDiff.length?(s.fileDiffs[s.file]||codeFor(root,s.file).map(line=>'  '+line)):codeFor(root,s.file));const draftKey=!filesReady&&!built&&root.dataset.ide==='2'?'initial':s.file;if(s.mode==='code'){
 const gutter=document.createElement('div'),input=document.createElement('textarea');
 gutter.className='ide-edit-gutter';gutter.setAttribute('aria-hidden','true');input.className='ide-edit-input';input.setAttribute('aria-label','코드 편집기');input.spellcheck=false;input.wrap='off';input.value=s.drafts[draftKey]??rows.join('\n');
 const update=()=>{gutter.textContent=Array.from({length:input.value.split('\n').length},(_,i)=>i+1).join('\n');gutter.scrollTop=input.scrollTop;};
 input.addEventListener('input',()=>{s.drafts[draftKey]=input.value;update();});input.addEventListener('scroll',()=>{gutter.scrollTop=input.scrollTop;});
 area.classList.add('editing');area.append(gutter,input);update();
 }else rows.forEach((line,i)=>{const el=document.createElement('div');el.className='ide-line'+(line.startsWith('+')?' added':line.startsWith('-')?' removed':line.trim().startsWith('//')||line.startsWith('/*')||line.startsWith('<!--')?' comment':'');const n=document.createElement('span'),text=document.createElement('span');n.className='line-number';n.contentEditable='false';n.textContent=String(i+1);text.className='line-text';text.textContent=line;el.append(n,text);area.append(el);});root.querySelectorAll('[data-open-file]').forEach(e=>e.textContent={index:'index.html',style:'style.css',game:'tetris.js'}[s.file]);root.querySelectorAll('[data-ide-file]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ideFile===s.file)));root.querySelectorAll('[data-editor-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.editorMode===s.mode)));const icon=q(root,'[data-editor-file-icon]');icon.textContent={index:'<>',style:'#',game:'JS'}[s.file];icon.className={index:'file-html',style:'file-css',game:'file-js'}[s.file];q(root,'[data-code-caption]').textContent=s.lastCaption;}
function cell(ctx,x,y,id,cfg,ghost=false){const S=24;if(ghost){ctx.strokeStyle=colors[id-1];ctx.lineWidth=2;ctx.strokeRect(x*S+3,y*S+3,S-6,S-6);ctx.fillStyle=colors[id-1]+'25';ctx.fillRect(x*S+3,y*S+3,S-6,S-6);return;}ctx.fillStyle=cfg.color?colors[id-1]:'#888';ctx.fillRect(x*S+1.5,y*S+1.5,S-3,S-3);if(cfg.color){ctx.fillStyle='#ffffff60';ctx.fillRect(x*S+3,y*S+3,S-6,4);ctx.fillStyle='#00000020';ctx.fillRect(x*S+3,y*S+18,S-6,3);}}
function render(root){const cfg=viewConfig(root),canvas=q(root,'.tetris-canvas'),ctx=canvas.getContext('2d'),app=q(root,'[data-game-app]');app.dataset.tier=tier(cfg);app.classList.toggle('has-hud',cfg.hud);app.classList.toggle('has-color',cfg.color);app.classList.toggle('has-effects',cfg.effects);q(root,'.tetris-score').classList.toggle('is-emphasis',cfg.hud);ctx.fillStyle=cfg.color?'#091625':'#f4f4f4';ctx.fillRect(0,0,240,480);ctx.strokeStyle=cfg.color?'#203148':'#dedede';ctx.lineWidth=.5;for(let x=0;x<=10;x++){ctx.beginPath();ctx.moveTo(x*24,0);ctx.lineTo(x*24,480);ctx.stroke();}for(let y=0;y<=20;y++){ctx.beginPath();ctx.moveTo(0,y*24);ctx.lineTo(240,y*24);ctx.stroke();}
 engine.board.forEach((r,y)=>r.forEach((v,x)=>{if(v)cell(ctx,x,y,v,cfg);}));const p=engine.piece;if(p&&built){if(cfg.ghost){let y=p.y;while(engine.fits(p.a,p.x,y+1))y++;p.a.forEach((row,j)=>row.forEach((v,i)=>{if(v)cell(ctx,p.x+i,y+j,p.id,cfg,true);}));}p.a.forEach((row,j)=>row.forEach((v,i)=>{if(v)cell(ctx,p.x+i,p.y+j,p.id,cfg);}));}
 const age=Date.now()-engine.clearAt;app.classList.toggle('line-clearing',cfg.effects&&!reduced.matches&&age<440);if(cfg.effects&&!reduced.matches&&age<440){const progress=age/440;ctx.fillStyle=`rgba(210,249,255,${.7*(1-progress)})`;engine.lastClear.forEach(y=>{ctx.fillRect(0,y*24,240,24);for(let i=0;i<12;i++){ctx.fillStyle=colors[i%7];ctx.fillRect(i*21+Math.sin(i)*progress*20,y*24-progress*(20+i*3),4,4);}});}
 if(cfg.effects&&age<650&&!reduced.matches){ctx.fillStyle='#10273ded';ctx.fillRect(15,195,210,57);ctx.fillStyle='#a8eeff';ctx.font='bold 23px Paperlogy, sans-serif';ctx.textAlign='center';ctx.fillText((['','SINGLE','DOUBLE','TRIPLE','TETRIS'][engine.lastClear.length]||'CLEAR')+' +'+[0,100,300,500,800][engine.lastClear.length],120,232);ctx.textAlign='start';}
 const scoreText=engine.score.toLocaleString();q(root,'[data-tetris-score]').textContent=scoreText;q(root,'[data-tetris-score]').style.setProperty('--score-chars',Math.max(4,scoreText.length));q(root,'[data-tetris-lines]').textContent=String(engine.lines);q(root,'[data-game-mode]').textContent=engine.auto?'AUTO · 빠른 자동 플레이':'직접 플레이';q(root,'[data-tetris-status]').textContent=engine.gameOver?'게임 종료':engine.paused?'일시정지':!built?'실행 대기':`${engine.pieces}개 배치`;
 const next=q(root,'.tetris-next').getContext('2d');next.clearRect(0,0,120,90);if(cfg.hud){const a=SHAPES[engine.queue[0]],id=engine.queue[0]+1,ox=(5-a[0].length)/2,oy=(3.75-a.length)/2;a.forEach((r,j)=>r.forEach((v,i)=>{if(v)cell(next,ox+i,oy+j,id,cfg);}));}
 q(root,'[data-tetris-speed]').value=String(speed);q(root,'[data-speed-value]').textContent=speed+'×';q(root,'[data-tetris-action="auto"]').setAttribute('aria-pressed',String(engine.auto));q(root,'[data-tetris-action="auto"]').textContent=engine.auto?'자동 ON':'자동 OFF';q(root,'[data-tetris-action="pause"]').textContent=engine.paused?'계속':'일시정지';
 const overlay=q(root,'[data-game-overlay]');overlay.hidden=built&&!engine.gameOver&&!engine.paused;if(!built){overlay.querySelector('strong').textContent='첫 실행을 기다립니다';overlay.querySelector('span').textContent='Codex에 제작을 요청해 보세요.';}else if(engine.gameOver){overlay.querySelector('strong').textContent='GAME OVER';overlay.querySelector('span').textContent='새 게임으로 다시 시작합니다.';}else if(engine.paused){overlay.querySelector('strong').textContent='일시정지';overlay.querySelector('span').textContent='계속 버튼으로 이어갑니다.';}
 root.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String({color:cfg.color,hud:cfg.hud,effects:cfg.effects}[b.dataset.preset])));
 root.querySelectorAll('[data-tetris-action], [data-tetris-speed]').forEach(b=>b.disabled=!built);
}
function sync(){roots.forEach(root=>{root.dataset.workspaceStage=root.dataset.ide!=='2'||built?'running':filesReady?'files':'empty';q(root,'.ide-explorer').classList.toggle('created',built);q(root,'[data-ide-tree]').textContent=built?'파일을 선택하면\n내용을 확인합니다.':'';renderCode(root);render(root);});}
function frame(now){raf=0;if(document.hidden||![1,2].includes(active))return;const dt=lastTime?Math.min(120,now-lastTime):0;lastTime=now;if(built&&!engine.paused&&!engine.gameOver){acc+=dt;const delay=engine.auto?dropMs/speed:600;let steps=0;while(acc>=delay&&steps<8){engine.step();acc-=delay;steps++;}}const root=roots[active-1];if(root)render(root);raf=requestAnimationFrame(frame);}
function start(){if(!raf&&[1,2].includes(active)&&!document.hidden){lastTime=0;raf=requestAnimationFrame(frame);}}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;acc=0;}
function log(root,kind,text){const e=document.createElement('div');e.className=kind+'-message';e.textContent=text;q(root,'[data-codex-history]').append(e);const thread=q(root,'.codex-thread');thread.scrollTop=thread.scrollHeight;}
function wait(fn,ms){timers.push(setTimeout(fn,reduced.matches?0:ms));}
function cancel(){timers.forEach(clearTimeout);timers=[];if(busy){q(busy.root,'[data-codex-send]').disabled=false;q(busy.root,'[data-codex-input]').readOnly=false;q(busy.root,'[data-ide-status]').textContent='재현 중단';q(busy.root,'[data-codex-hint]').textContent='장 이동으로 중단했습니다. 요청을 다시 보낼 수 있습니다.';busy=null;}}
function classify(text){const t=text.toLowerCase(),op={};if(/색|컬러|디자인|게임답|꾸며|테마/.test(t))op.color=true;if(/점수|다음.*블록/.test(t))op.hud=true;if(/착지|고스트|그림자|효과|사라지/.test(t)){op.ghost=true;op.effects=true;}if(/천천히|느리|속도.*낮|속도.*줄/.test(t))op.dropMs=100;else if(/빠르|빠르게|속도.*높/.test(t))op.dropMs=40;return op;}
function send(root){if(busy)return;const input=q(root,'[data-codex-input]'),text=input.value.trim();if(!text){q(root,'[data-codex-hint]').textContent='요청 내용을 입력해 주세요.';return;}q(root,'[data-codex-hint]').textContent='';const isBuild=root.dataset.ide==='2';const op=isBuild?{build:true}:classify(text);if((isBuild&&!/테트리스|tetris/i.test(text))||(!isBuild&&!Object.keys(op).length)){log(root,'error','이 체험은 테트리스 제작과 색·점수판·착지 효과·속도 수정을 재현합니다. 준비된 요청을 사용해 주세요.');return;}
 if(!isBuild){for(const k of Object.keys(op)){if(k==='dropMs'?dropMs===op[k]:config[k]===op[k])delete op[k];}if(!Object.keys(op).length){log(root,'assistant','요청한 내용은 이미 반영되어 있습니다. 다른 개선을 이어서 요청할 수 있습니다.');return;}}
 busy={root,op};q(root,'[data-codex-send]').disabled=true;input.readOnly=true;log(root,'user',text);log(root,'tool',isBuild?'작업 폴더 확인 중…':'현재 파일과 게임 설정을 확인하는 중…');q(root,'[data-ide-status]').textContent='Codex 작업 중';
 wait(()=>{q(root,'[data-ide-terminal]').textContent='PS C:\\work\\tetris-workshop> Get-ChildItem\n'+(isBuild?'새 프로젝트 · 파일 작성 준비':'index.html   style.css   tetris.js');log(root,'tool',isBuild?'index.html · style.css · tetris.js 작성':'요청한 부분의 변경을 준비했습니다.');},500);
 wait(()=>{const state=states.get(root);if(isBuild)filesReady=true;state.mode='diff';state.file=op.color?'style':'game';const nextConfig=isBuild?{...base}:{...config,...op},nextInterval=isBuild?40:(op.dropMs||dropMs);
 if(isBuild)state.fileDiffs={};
 for(const key of ['index','style','game']){
  const before=isBuild?[]:codeFor(root,key),after=codeFor(root,key,nextConfig,nextInterval);
  if(before.join('\n')!==after.join('\n'))state.fileDiffs[key]=diffLines(before,after);
 }
 state.lastDiff=Object.values(state.fileDiffs).flat();
 q(root,'[data-change-count]').textContent=Object.keys(state.fileDiffs).length+'개 파일';
 state.lastCaption=isBuild?'파일을 작성하고 브라우저에서 첫 결과를 확인합니다.':'파일을 선택하면 해당 파일의 최근 변경과 실행 결과를 확인합니다.';sync();q(root,'[data-ide-terminal]').textContent='PS C:\\work\\tetris-workshop> python -m http.server 5500\nServing HTTP on localhost:5500';log(root,'tool','변경 파일 확인 · 로컬 실행 과정 재현');},1050);
 wait(()=>{if(isBuild){built=true;config={...base};dropMs=40;speed=1;engine.reset();q(roots[1],'[data-codex-history]').replaceChildren();states.get(roots[1]).lastDiff=[];states.get(roots[1]).fileDiffs={};states.get(roots[1]).mode='code';q(roots[1],'[data-change-count]').textContent='0';q(roots[1],'[data-ide-status]').textContent='첫 버전 실행 중';log(root,'assistant','첫 버전을 만들었습니다. 자동으로 블록을 배치하고 줄을 지웁니다. 화면과 점수판은 기본 형태입니다.');q(root,'[data-codex-send]').setAttribute('aria-label','테트리스 제작 다시 요청');}else{for(const k of ['color','hud','ghost','effects'])if(k in op)config[k]=op[k];if(op.dropMs)dropMs=op.dropMs;built=true;log(root,'assistant','변경을 반영했습니다. '+(op.color?'블록 색과 화면이 달라졌습니다. ':'')+(op.hud?'점수판과 다음 블록을 추가했습니다. ':'')+(op.ghost?'착지 위치와 줄 삭제 효과를 추가했습니다. ':'')+(op.dropMs?'자동 플레이 속도를 조정했습니다.':'')+'게임은 이어서 실행됩니다.');}
 q(root,'[data-ide-status]').textContent=isBuild?'첫 버전 실행 중':`개선 ${tier(config)}/3 · 실행 중`;q(root,'[data-codex-hint]').textContent='';q(root,'[data-codex-send]').disabled=false;input.readOnly=false;busy=null;sync();start();},1650);
}
roots.forEach(root=>{
 const app=q(root,'[data-game-app]'),board=q(root,'.tetris-board-wrap'),controls=q(root,'.tetris-controls');
 const alignControls=()=>{const a=app.getBoundingClientRect(),b=board.getBoundingClientRect(),c=controls.getBoundingClientRect();if(a.width&&app.offsetWidth)controls.style.setProperty('--board-left',Math.max(0,(b.left-c.left)/(a.width/app.offsetWidth))+'px');};
 const alignmentObserver=new ResizeObserver(alignControls);[app,board,q(root,'.tetris-stats')].forEach(el=>alignmentObserver.observe(el));
 const editor=q(root,'[data-ide-code]');
 editor.addEventListener('keydown',e=>{const input=e.target;if(e.key==='Escape'){e.preventDefault();input.blur();}if(e.key==='Tab'&&input.matches('.ide-edit-input')){e.preventDefault();input.setRangeText('  ',input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input',{bubbles:true}));}e.stopPropagation();});
 q(root,'[data-codex-send]').addEventListener('click',()=>send(root));
 q(root,'[data-codex-input]').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send(root);}});
 root.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{q(root,'[data-codex-input]').value=requests[b.dataset.preset];}));
 root.querySelectorAll('[data-ide-file]').forEach(b=>b.addEventListener('click',()=>{states.get(root).file=b.dataset.ideFile;renderCode(root);}));
 root.querySelectorAll('[data-editor-mode]').forEach(b=>b.addEventListener('click',()=>{states.get(root).mode=b.dataset.editorMode;renderCode(root);}));
 q(root,'[data-tetris-speed]').addEventListener('input',e=>{speed=+e.target.value;sync();});
 root.querySelectorAll('[data-tetris-action]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.tetrisAction;if(action==='auto')engine.setAuto(!engine.auto);if(action==='pause')engine.paused=!engine.paused;if(action==='reset'){engine.reset();acc=0;}if(action==='rotate'){engine.setAuto(false);engine.turn();}if(action==='drop'){engine.setAuto(false);engine.drop();}render(root);if(action==='auto'&&!engine.auto||action==='rotate'||action==='drop')q(root,'.tetris-canvas').focus();}));
 q(root,'.tetris-canvas').addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey||!built)return;const actions={ArrowLeft:()=>engine.move(-1),ArrowRight:()=>engine.move(1),ArrowUp:()=>engine.turn(),ArrowDown:()=>engine.step(),' ':()=>engine.drop()};if(actions[e.key]){e.preventDefault();e.stopPropagation();engine.setAuto(false);actions[e.key]();render(root);}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();q(root,'.tetris-canvas').blur();}});
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
window.tetrisWorkshop={engine,get config(){return {...config,dropMs,speed};},get built(){return built;},get busy(){return !!busy;},get running(){return !!raf;},classify,
 navigate(index){cancel();stop();active=index;if(index===1)resetWorkshop();if(index===2&&!built){built=true;log(roots[1],'assistant','첫 테트리스를 준비했습니다. 이제 요청을 하나씩 보내 화면을 개선합니다.');}sync();start();if(index===1){const editor=q(roots[0],'[data-ide-code]');editor.focus({preventScroll:true});const selection=getSelection(),range=document.createRange();range.selectNodeContents(editor.lastElementChild?.querySelector('.line-text')||editor);range.collapse(false);selection.removeAllRanges();selection.addRange(range);}},
 preparePrint(){cancel();stop();built=true;engine.reset();for(let i=0;i<28;i++)engine.drop();config={color:true,hud:true,ghost:true,effects:true};roots.forEach(root=>{states.get(root).mode='code';q(root,'[data-ide-status]').textContent=root.dataset.ide==='2'?'첫 버전 · AUTO':'개선 완료 · AUTO';});sync();}
};
sync();
})();
