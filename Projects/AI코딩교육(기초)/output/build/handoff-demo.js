(()=>{'use strict';
const root=document.querySelector('.handoff-demo');if(!root)return;const $=s=>root.querySelector(s);let phase='human',step=0;
const request='다음 블록 미리보기, 착지 가이드, 줄 삭제 효과를 넣어줘.';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const snippets=[['index.html · 보여줄 공간','<canvas id="next"></canvas>'],['style.css · 표시 방식','.ghost { opacity: .25; }'],['tetris.js · 게임 동작','drawGhost(piece); drawNext(queue[0]);']];
const chat=mode=>'<div class="hs-bar">챗봇 대화<span>코드는 답변으로 전달</span></div><div class="hs-chat"><div class="hs-user">'+request+'</div><p class="hs-answer">세 파일을 수정하고, 새 함수를 게임 실행 흐름에 연결하세요.</p><div class="hs-snippets">'+snippets.map(([name,code])=>'<div><span>'+name+'</span><code>'+escape(code)+'</code></div>').join('')+'</div></div>'+(mode===2?'<div class="hs-copy">코드 조각 3개 복사됨 ✓ · 파일은 아직 그대로</div>':'');
const codeLine=(text,added=false)=>'<div class="hs-line '+(added?'hs-insert':'')+'"><code>'+escape(text)+'</code></div>';
const insertion=lines=>'<div class="hs-insertion-point">│</div><div class="hs-insert-group">'+lines.map(t=>codeLine(t,true)).join('')+'</div>';
const logicEditor=()=>'<div class="hs-bar">Visual Studio Code<span>위치 확인 → 빈 줄 확보 → 붙여넣기</span></div><div class="hs-context-editor"><section><div class="hs-path">tetris.js · draw()</div>'+codeLine('function draw() {')+codeLine('  drawBoard();')+insertion(['  drawGhost(piece, landingY);'])+codeLine('  drawPiece(piece);')+insertion(['  drawNext(queue[0]);'])+codeLine('}')+'</section><section><div class="hs-path">tetris.js · 줄 삭제 처리</div>'+codeLine('const clearedRows = clearRows();')+insertion(['if (clearedRows.length) {','  playClearEffect(clearedRows);','}'])+codeLine('spawnNextPiece();')+'</section></div>';
const editor=mode=>{
 if(mode===2)return logicEditor();
 const blocks=[
 ['index.html',['<main class="game">','  <canvas id="board"></canvas>'],['  <canvas id="next"></canvas>'],['</main>']],
 ['style.css',['.game { display: flex; }'],['.next-panel { padding: 16px; }','.ghost { opacity: .25; }'],['.board { background: #102031; }']]

 ];
 return '<div class="hs-bar">Visual Studio Code<span>기존 코드 사이에 삽입 · 교육용 재현</span></div><div class="hs-context-editor">'+blocks.map(([name,before,insert,after])=>'<section><div class="hs-path">'+name+'</div>'+before.map(t=>codeLine(t)).join('')+'<div class="hs-insertion-point">│</div><div class="hs-insert-group">'+insert.map(t=>codeLine(t,true)).join('')+'</div>'+after.map(t=>codeLine(t)).join('')+'</section>').join('')+'</div>';
};
const game=enhanced=>'<div class="hs-bar">'+(enhanced?'업그레이드된 테트리스':'현재 테트리스')+'<span>AUTO · 실제 게임 동작</span></div><div class="hs-live-game '+(enhanced?'enhanced':'')+'"><div class="hs-board-wrap"><canvas width="260" height="520" data-hgame-board aria-label="자동 플레이 테트리스"></canvas><div data-hgame-flash></div></div><div class="hs-game-metrics"><span>SCORE</span><strong data-hgame-score>0</strong><span>LINES</span><b data-hgame-lines>0</b><div class="hs-next-preview"><span>NEXT</span><canvas width="130" height="104" data-hgame-next aria-label="다음 블록 미리보기"></canvas></div></div><div class="hs-features"><span>'+(enhanced?'이번 요청으로 생긴 변화':'지금은 기본 기능만')+'</span><div class="'+(enhanced?'ready':'')+'"><b>01</b><strong>다음 블록 미리보기</strong><p>'+(enhanced?'곧 나올 모양을 미리 확인합니다.':'어떤 블록이 나올지 알 수 없습니다.')+'</p></div><div class="'+(enhanced?'ready':'')+'"><b>02</b><strong>착지 위치 가이드</strong><p>'+(enhanced?'충돌 위치를 계산해 윤곽을 표시합니다.':'블록이 닿을 위치를 예상해야 합니다.')+'</p></div><div class="'+(enhanced?'ready':'')+'"><b>03</b><strong>줄 삭제 효과</strong><p>'+(enhanced?'줄이 사라질 때 빛과 점수가 터집니다.':'줄이 사라져도 변화가 밋밋합니다.')+'</p></div></div></div>';
const agentFiles=[
 {name:'index.html',icon:'<>',before:['<main class="game">','  <canvas id="board"></canvas>','</main>'],after:['<main class="game">','  <canvas id="board"></canvas>','+  <canvas id="next"></canvas>','</main>'],note:'미리보기를 넣을 화면 구조를 확인합니다.'},
 {name:'style.css',icon:'#',before:['.game { display: flex; }','.board { background: #102031; }'],after:['.game { display: flex; }','+.next-panel { padding: 16px; }','+.ghost { opacity: .25; }','.board { background: #102031; }'],note:'게임 영역과 스타일을 확인합니다.'},
 {name:'tetris.js',icon:'JS',before:['function draw() {','  drawBoard();','  drawPiece(piece);','}','const rows = clearRows();','spawnNextPiece();'],after:['function draw() {','  drawBoard();','+  drawGhost(piece, landingY);','  drawPiece(piece);','+  drawNext(queue[0]);','}','const rows = clearRows();','+if (rows.length) {','+  playClearEffect(rows);','+}','spawnNextPiece();'],note:'그리기와 줄 삭제 처리의 연결 위치를 찾습니다.'}
];
const agentView=mode=>'<div class="hs-bar">Visual Studio Code<span>tetris-workshop · 개발 과정 재현</span></div><div class="ha-workbench"><nav class="ha-explorer"><div>탐색기</div><strong>TETRIS-WORKSHOP</strong>'+agentFiles.map((f,i)=>'<div class="ha-file" data-agent-file="'+i+'"><b>'+escape(f.icon)+'</b>'+f.name+'<i></i></div>').join('')+'</nav><section class="ha-center"><div class="ha-tab" data-agent-tab></div><div class="ha-code" data-agent-code></div><div class="ha-terminal"><span>터미널　 PowerShell</span><pre data-agent-terminal>PS tetris-workshop&gt;</pre></div></section><aside class="ha-chat"><div class="ha-chat-title">✳ Codex <span>로컬 작업</span></div><div class="ha-user" data-agent-request></div><p class="ha-response" data-agent-response></p><div class="ha-tools" data-agent-tools></div><div class="ha-composer" data-agent-composer></div></aside></div>';
const human=[
 ['게임에 새 기능을 붙입니다','다음 블록을 미리 보고, 착지 위치도 알 수 있게 요청합니다. 줄이 사라지는 순간에는 시원한 효과도 넣습니다.','기존 게임 · 미리보기·가이드·효과 없음','챗봇에 기능 추가 요청하기 →','이번에는 화면, 게임 판정, 효과를 함께 바꿉니다.',()=>game(false)],
 ['답변이 세 파일로 나뉩니다','화면을 만드는 코드, 꾸미는 코드, 게임을 움직이는 코드가 각각 옵니다. 모두 적용해야 기능이 완성됩니다.','코드 답변 도착 · 실제 파일 그대로','세 코드 조각 복사하기 →','코드를 받는 것과, 내 게임에서 동작하게 하는 것은 다른 단계입니다.',()=>chat(1)],
 ['코드를 나눠 옮겨야 합니다','어떤 조각을 어떤 파일에 넣을지 구분합니다. 하나만 빠져도 빈 미리보기나 동작하지 않는 효과가 될 수 있습니다.','3개 조각 복사 · 파일별 적용 필요','화면 파일부터 적용하기 →','여러 파일의 역할을 알아야 답변을 올바른 곳에 옮길 수 있습니다.',()=>chat(2)],
 ['화면과 스타일을 붙입니다','다음 블록을 그릴 공간과 스타일을 추가합니다. 하지만 공간만 생겼을 뿐, 블록을 보여주는 동작은 아직 없습니다.','index.html · style.css 반영','게임 로직의 연결 위치 찾기 →','화면이 생겨도 게임 로직에 연결되지 않으면 기능은 작동하지 않습니다.',()=>editor(0)],
 ['위치를 찾고 바로 연결합니다','착지 계산과 다음 블록 표시를 그리기에 연결하고, 줄 삭제 효과는 실제로 줄이 없어지는 시점에 연결합니다.','3개 파일 수정 · 실행 확인 전','완성된 게임 실행하기 →','파일 찾기, 붙여넣기, 함수 연결을 사람이 하나씩 맞췄습니다.',()=>editor(2)],
 ['같은 게임이 달라졌습니다','다음 블록이 보이고 착지 윤곽이 따라갑니다. 줄 삭제 효과까지 실제 게임에서 확인합니다.','챗봇 시연 완료 · 사람이 연결한 결과','이어서 코딩 에이전트 보기 →','코드 조각을 사람이 연결한 결과입니다. 이제 같은 요청을 에이전트에 맡깁니다.',()=>game(true)]
];
const agent=[
 ['같은 기능을 요청합니다','작업 폴더가 연결된 에이전트에 같은 요청을 보냅니다. 원하는 동작을 설명하고 파일 작업을 맡깁니다.','같은 요청 · 작업 폴더 연결','에이전트의 파일 확인 보기 →','원하는 기능을 요청하면 연결된 작업 폴더에서 작업을 시작합니다.',()=>agentView(0)],
 ['파일과 흐름을 함께 읽습니다','에이전트가 표시 공간, 스타일, 게임 로직을 확인합니다. 어디를 고치고 어떤 함수와 연결할지 찾습니다.','3개 파일 · 관련 함수 확인','에이전트의 연결 작업 보기 →','사람이 코드 조각마다 파일과 적용 위치를 찾아다니는 일을 맡깁니다.',()=>agentView(1)],
 ['수정하고 연결합니다','세 파일을 바꾸고, 새 기능을 기존 게임 흐름에 연결합니다. 사람이 각 조각을 복사해 붙일 필요가 줄어듭니다.','3개 파일 수정 · 실행 확인 전','에이전트의 결과 실행하기 →','답변에 코드를 보여주는 데서 끝나지 않고 실제 파일을 수정합니다.',()=>agentView(2)],
 ['결과를 보며 판단합니다','추가된 기능이 실제 게임에서 움직입니다. 사람은 착지 위치가 맞는지, 효과가 과하지 않은지 판단합니다.','','처음부터 다시 보기 ↺','에이전트는 파일 작업과 연결을 맡고, 사람은 필요한 기능과 결과를 판단합니다.',()=>game(true)]
];
function render(){stopMotion();window.handoffGame.stop();const isAgent=phase==='agent',data=(isAgent?agent:human)[step],names=isAgent?['요청','파일 확인','수정·연결','실행 확인']:['요청','코드 답변','복사','화면 적용','로직 연결','실행 확인'];$('.handoff-sequence').classList.toggle('is-agent',isAgent);$('[data-demo-part]').textContent=isAgent?'이어서 · 2 / 2':'먼저 · 1 / 2';$('[data-demo-title]').textContent=isAgent?'코딩 에이전트가 세 파일을 연결하기':'챗봇의 코드 조각을 직접 연결하기';$('[data-demo-context]').textContent=isAgent?'작업 폴더와 실행 도구가 연결된 상황':'파일 연결 없이, 코드 답변만 받는 상황';$('[data-demo-owner]').textContent=isAgent?'에이전트의 작업 · 사람이 결과 판단':'사람이 직접 하는 작업';$('[data-demo-heading]').textContent=data[0];$('[data-demo-description]').textContent=data[1];const state=$('[data-demo-state]'),showArt=isAgent&&step===agent.length-1;state.classList.toggle('has-result-art',showArt);state.replaceChildren();if(showArt){const img=document.createElement('img');img.src='@@bob-ross-easy@@';img.alt='참, 쉽죠? 테트리스 블록을 그리는 밥 로스 패러디';img.width=1748;img.height=900;state.append(img);}else{state.textContent=data[2];}$('[data-handoff="next"]').textContent=data[3];$('[data-demo-note]').textContent=data[4];$('[data-demo-screen]').innerHTML=data[5]();$('[data-demo-progress]').replaceChildren();names.forEach((name,i)=>{if(i){const arrow=document.createElement('i');arrow.textContent='→';$('[data-demo-progress]').append(arrow);}const n=document.createElement('span');n.textContent=name;n.className=i===step?'current':i<step?'done':'';if(i===step)n.setAttribute('aria-current','step');$('[data-demo-progress]').append(n);});animateScene();if($('[data-hgame-board]'))window.handoffGame.mount($('[data-demo-screen]'),isAgent||step===human.length-1);}
let motionFrame=0,finishMotion=null;
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function stopMotion(){cancelAnimationFrame(motionFrame);motionFrame=0;if(finishMotion){finishMotion();finishMotion=null;}}
function animateScene(){
 if(phase==='agent'&&step<3){animateAgent(step);return;}
 if(phase!=='human'||![1,2,3,4].includes(step))return;
 const sceneStep=step;
 const screen=$('[data-demo-screen]'),duration=sceneStep===1?3200:sceneStep===2?4200:sceneStep===4?7800:5200;
 const codes=[...screen.querySelectorAll(sceneStep===1?'.hs-answer, .hs-snippets span, .hs-snippets code':'.hs-snippets code')],texts=codes.map(e=>e.textContent);
 const groups=[...screen.querySelectorAll('.hs-insert-group')];
 const heights=groups.map(group=>group.scrollHeight);
 const notice=screen.querySelector('.hs-copy');
 let pointer;
 if(sceneStep===2){pointer=document.createElement('i');pointer.className='hs-drag-pointer';pointer.textContent='↖';screen.append(pointer);}
 function paint(progress){
  if(sceneStep===1){const total=texts.reduce((n,t)=>n+t.length,0);let remaining=Math.floor(progress*total);codes.forEach((e,i)=>{const count=Math.max(0,Math.min(texts[i].length,remaining));e.textContent=texts[i].slice(0,count);e.classList.toggle('hs-streaming',remaining>=0&&count<texts[i].length);remaining-=texts[i].length;});}
  if(sceneStep===2){
   const position=progress*3,index=Math.min(2,Math.floor(position)),amount=Math.min(1,(position-index)/.75);
   codes.forEach((e,i)=>{const selected=i<index?1:i===index?amount:0;e.style.background='linear-gradient(90deg,#316598 '+selected*100+'%,transparent '+selected*100+'%)';});
   if(pointer){const box=codes[index].getBoundingClientRect(),parent=screen.getBoundingClientRect(),scale=parent.width/screen.offsetWidth;pointer.style.left=((box.left-parent.left+box.width*amount)/scale)+'px';pointer.style.top=((box.top-parent.top+box.height*.6)/scale)+'px';pointer.style.opacity=progress===1?'0':'1';}
   if(notice){notice.textContent=progress===1?'코드 조각 3개 복사됨 ✓ · 파일은 아직 그대로':Math.min(3,Math.floor(position))+' / 3 복사 · 드래그하여 코드 선택';}
  }
  screen.querySelectorAll('.hs-target-line').forEach(line=>line.classList.remove('hs-target-line'));
  groups.forEach((group,i)=>{
   const local=Math.max(0,Math.min(1,progress*groups.length-i));
   const count=group.children.length;
   // Enter creates whole blank lines first; paste reveals the entire snippet at once.
   const entered=local<.18?0:Math.min(count,1+Math.floor((local-.18)/.32*count));
   const pasted=local>=.72;
   const caret=group.previousElementSibling,section=group.parentElement;
   group.style.height=(pasted?heights[i]:heights[i]*entered/count)+'px';
   group.style.maxHeight='none';group.style.opacity='1';group.style.transform='none';
   [...group.children].forEach(line=>line.style.visibility=pasted?'visible':'hidden');
   const active=progress*groups.length>=i&&local<1;
   caret.style.display=active&&!pasted?'block':'none';
   caret.style.top=(entered?Math.max(0,(entered-1)*heights[i]/count): -heights[i]/count)+'px';
   caret.style.paddingLeft=entered?'7px':`calc(${caret.previousElementSibling.textContent.length}ch + 7px)`;
   group.dataset.editPhase=pasted?'pasted':entered?'blank':'cursor';
   if(active&&local<.18)caret.previousElementSibling.classList.add('hs-target-line');
   if(active)section.dataset.editAction=pasted?'Ctrl + V':entered?'Enter ↵':'연결 위치 확인';
   else if(progress===1)section.dataset.editAction='';
  });
  screen.dataset.animating=String(progress<1);
 }
 finishMotion=()=>{paint(1);screen.querySelectorAll('.hs-streaming').forEach(e=>e.classList.remove('hs-streaming'));};
 if(motionPreference.matches){finishMotion();finishMotion=null;return;}
 paint(0);const start=performance.now();function tick(now){const progress=Math.max(0,Math.min(1,(now-start)/duration));paint(progress);if(progress<1)motionFrame=requestAnimationFrame(tick);else{finishMotion();finishMotion=null;}}motionFrame=requestAnimationFrame(tick);
}
function animateAgent(mode){
 const screen=$('[data-demo-screen]'),duration=[3200,4800,6900][mode];
 const tab=$('[data-agent-tab]'),code=$('[data-agent-code]'),message=$('[data-agent-request]'),response=$('[data-agent-response]'),logs=$('[data-agent-tools]'),composer=$('[data-agent-composer]');
 let lastKey='';
 function paint(progress){
  const position=progress*3,index=mode===0?0:Math.min(2,Math.floor(position));
  const local=progress===1?1:position-index,file=agentFiles[index];
  const rows=mode===2?file.after:file.before;
  const streamed=mode===2?rows.join('\n').slice(0,Math.floor(Math.min(1,local/.88)*rows.join('\n').length)):rows.join('\n');
  const visibleRows=streamed?streamed.split('\n'):[];
  const key=index+':'+streamed;
  if(key!==lastKey){tab.textContent=file.icon+'  '+file.name+(mode===2?'  ·  변경 내용':'');code.innerHTML=visibleRows.map((line,i)=>'<div class="ha-code-line '+(line.startsWith('+')?'added':'')+'"><small>'+String(i+1).padStart(2,' ')+'</small><code>'+escape(line)+'</code></div>').join('');lastKey=key;}
  screen.querySelectorAll('[data-agent-file]').forEach((el,i)=>{el.classList.toggle('active',i===index);el.querySelector('i').textContent=mode===2&&(i<index||(i===index&&local===1))?'M':'';});
  if(mode===0){const sent=progress>=.65;composer.textContent=sent?'후속 요청을 입력하세요…':request.slice(0,Math.floor(progress/.65*request.length))+'│';message.textContent=sent?request:'';message.hidden=!sent;response.textContent=sent?'세 파일과 게임 실행 흐름을 확인하겠습니다.'.slice(0,Math.ceil((progress-.65)/.35*'세 파일과 게임 실행 흐름을 확인하겠습니다.'.length)):'';logs.textContent=sent?'작업 폴더 연결됨 · tetris-workshop':'';}
  else{message.hidden=false;message.textContent=request;composer.textContent='후속 요청을 입력하세요…';const explanation=mode===1?file.note:'기존 코드에 새 기능을 연결하고 있습니다.';response.textContent=explanation.slice(0,Math.floor(Math.min(1,(mode===1?local:progress*3)/.65)*explanation.length));logs.innerHTML=agentFiles.slice(0,index+1).map((f,i)=>'<div><span>'+((i<index||progress===1)?'✓':'●')+'</span> '+(mode===1?'읽기  ':'수정  ')+f.name+'</div>').join('');}
  if(mode===2&&progress>=.9){const completion='세 파일의 수정과 연결을 마쳤습니다. 게임을 실행해 동작을 확인하겠습니다.';response.textContent=completion.slice(0,progress===1?completion.length:Math.floor(Math.min(1,(progress-.9)/.1)*completion.length));}if(mode===2&&progress===1){$('[data-agent-terminal]').textContent='PS tetris-workshop>\n파일 저장 완료 · index.html / style.css / tetris.js';}
  screen.dataset.animating=String(progress<1);
 }
 finishMotion=()=>paint(1);
 if(motionPreference.matches){finishMotion();finishMotion=null;return;}
 paint(0);const start=performance.now();function tick(now){const progress=Math.max(0,Math.min(1,(now-start)/duration));paint(progress);if(progress<1)motionFrame=requestAnimationFrame(tick);else{finishMotion();finishMotion=null;}}motionFrame=requestAnimationFrame(tick);
}
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)stopMotion();});
function next(){if(phase==='human'&&step===human.length-1){phase='agent';step=0;}else if(phase==='agent'&&step===agent.length-1){phase='human';step=0;}else step++;render();}
$('[data-handoff="next"]').addEventListener('click',next);
window.handoffDemo={get state(){return{phase,step};},navigate(index){const isActive=Number(document.querySelector('.handoff-sequence').closest('.slide').dataset.index)===index;if(!isActive)stopMotion();window.handoffGame.navigate(isActive);},preparePrint(){stopMotion();window.handoffGame.stop();}};render();
})();
