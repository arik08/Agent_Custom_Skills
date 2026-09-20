(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const slides=$$('.slide'), stage=$('#stage'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let current=-1, wheelSum=0, lastWheel=0, pending=[], visited=new Set();
function later(fn,ms){const id=setTimeout(fn,reduced.matches?0:ms);pending.push(id);return id;}
function resize(){const scale=Math.min(innerWidth/1920,innerHeight/1080);document.documentElement.style.setProperty('--scale',scale);stage.style.transform=`translate(-50%,-50%) scale(${scale})`;closeTerm();}
function parseHash(){const m=/^#\/(\d+)$/.exec(location.hash);return m?Math.max(0,Math.min(slides.length-1,Number(m[1])-1)):0;}
function setHighlight(slide,index){
 const group=slide.querySelector('[data-step-highlight]');if(!group)return;
 const cards=[...group.children];
 const selected=Math.max(0,Math.min(cards.length-1,index));
 group.dataset.highlightIndex=String(selected);
 cards.forEach((card,i)=>{card.classList.toggle('is-current',i===selected);if(i===selected)card.setAttribute('aria-current','step');else card.removeAttribute('aria-current');});
}
function move(direction){
 const group=slides[current]?.querySelector('[data-step-highlight]');
 if(group){const next=Number(group.dataset.highlightIndex||0)+direction;if(next>=0&&next<group.children.length){setHighlight(slides[current],next);return;}}
 const previous=current;go(current+direction);
 if(current!==previous&&direction<0){const group=slides[current].querySelector('[data-step-highlight]');if(group)setHighlight(slides[current],group.children.length-1);}
}
function go(index){
 index=Math.max(0,Math.min(slides.length-1,index)); if(index===current)return;
 pending.forEach(clearTimeout);pending=[];closeTerm();
 if(current>=0&&slides[current].contains(document.activeElement))document.activeElement.blur();
 current=index;wheelSum=0;setHighlight(slides[index],0);
 slides.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.classList.remove('enter');s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));});
 if(!visited.has(index)&&!reduced.matches)slides[index].classList.add('enter');visited.add(index);
 $('#progress-fill').style.width=((index+1)/slides.length*100)+'%';
 $('#page-label').textContent=String(index+1).padStart(2,'0')+' / '+slides.length;
 $('#section-label').textContent=slides[index].dataset.section;
 history.replaceState(null,'','#/'+(index+1));
 $$('.lit').forEach(e=>e.classList.remove('lit'));
 window.tetrisWorkshop?.navigate(index);
 window.handoffDemo?.navigate(index);
}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen?.();}catch{}resize();}
addEventListener('resize',resize);document.addEventListener('fullscreenchange',resize);
addEventListener('hashchange',()=>go(parseHash()));
addEventListener('contextmenu',e=>{e.preventDefault();fullscreen();});
addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeTerm();return;}
 if(e.ctrlKey||e.altKey||e.metaKey||e.defaultPrevented)return;
 if(e.target.closest('input,textarea,select,[contenteditable=true]'))return;
 if(e.target.closest('button,a,summary')&&['Enter',' '].includes(e.key))return;
 if(e.target.closest('#term-panel'))return;
 if(['f','F'].includes(e.key)){e.preventDefault();fullscreen();return;}
 let dest;
 if(['ArrowRight','ArrowDown','PageDown','Enter'].includes(e.key)||(e.key===' '&&!e.shiftKey))dest=current+1;
 if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)||(e.key===' '&&e.shiftKey))dest=current-1;
 if(e.key==='Home'){visited.delete(0);dest=0;}if(e.key==='End')dest=slides.length-1;
 if(dest!==undefined){e.preventDefault();if(e.key==='Home'||e.key==='End')go(dest);else move(Math.sign(dest-current));}
});
addEventListener('wheel',e=>{
 if(e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,select,#term-panel'))return;
 // Reserve the wheel only for regions with actual vertical overflow.
 for(let node=e.target;node&&node!==stage;node=node.parentElement){
  const overflow=getComputedStyle(node).overflowY;
  if((overflow==='auto'||overflow==='scroll')&&node.scrollHeight>node.clientHeight+1){wheelSum=0;return;}
 }
 if(!e.deltaY)return;e.preventDefault();
 const d=e.deltaY*(e.deltaMode===1?20:e.deltaMode===2?innerHeight:1),now=performance.now();
 if(now-lastWheel>220||Math.sign(d)!==Math.sign(wheelSum))wheelSum=0;
 lastWheel=now;wheelSum+=d;if(Math.abs(wheelSum)>=55){const step=Math.sign(wheelSum);wheelSum=0;move(step);}
},{passive:false});
let touchStart=null;
stage.addEventListener('touchstart',e=>{if(e.target.closest('button,input,textarea,select'))return;touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
stage.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);},{passive:true});

// Give the first occurrence of additional beginner vocabulary a detailed explanation.
for(const slide of slides){
 const keys=['Vibe Coding','브라우저','서버','Node.js','패키지','Markdown'];
 const seen=new Set([...slide.querySelectorAll('[data-term]')].map(e=>e.dataset.term));
 const walker=document.createTreeWalker(slide,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())if(!walker.currentNode.parentElement.closest('button,input,textarea,pre,script,.fine,.vscode-lab'))nodes.push(walker.currentNode);
 for(const node of nodes){const eligible=keys.filter(k=>!seen.has(k)&&node.textContent.includes(k));if(!eligible.length)continue;const re=new RegExp('('+eligible.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','g');const parts=node.textContent.split(re),frag=document.createDocumentFragment();for(const part of parts){if(eligible.includes(part)&&!seen.has(part)){const b=document.createElement('button');b.className='term';b.dataset.term=part;b.textContent=part;frag.append(b);seen.add(part);}else frag.append(document.createTextNode(part));}node.replaceWith(frag);}
}
// A viewport-positioned explanation surface works at every stage scale.
const panel=$('#term-panel');let termSource=null,termPinned=false,termCloseTimer;
function closeTerm(){clearTimeout(termCloseTimer);panel.hidden=true;termPinned=false;if(termSource){termSource.setAttribute('aria-expanded','false');termSource.removeAttribute('aria-describedby');}termSource=null;}
function openTerm(el,pin=false){
 clearTimeout(termCloseTimer);if(termSource!==el)closeTerm();termSource=el;termPinned=pin||termPinned;
 const entry=GLOSSARY[el.dataset.term];panel.replaceChildren();
 const label=document.createElement('div');label.className='tip-label';label.textContent='개념 자세히 보기';panel.append(label);
 const title=document.createElement('h2');title.textContent=el.dataset.term;panel.append(title);
 entry.forEach(text=>{const p=document.createElement('p');p.textContent=text;panel.append(p);});
 panel.hidden=false;el.setAttribute('aria-expanded','true');el.setAttribute('aria-describedby','term-panel');
 const r=el.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;
 const left=Math.max(12,Math.min(innerWidth-w-12,r.left));
 let top=r.bottom+10;if(top+h>innerHeight-12)top=r.top-h-10;
 top=Math.max(12,Math.min(innerHeight-h-12,top));panel.style.left=left+'px';panel.style.top=top+'px';
}
function delayClose(){clearTimeout(termCloseTimer);if(!termPinned)termCloseTimer=setTimeout(closeTerm,220);}
$$('.term').forEach(el=>{
 el.setAttribute('aria-expanded','false');
 el.addEventListener('mouseenter',()=>openTerm(el));el.addEventListener('mouseleave',delayClose);
 el.addEventListener('focus',()=>openTerm(el));el.addEventListener('blur',delayClose);
 el.addEventListener('click',e=>{e.stopPropagation();if(termSource===el&&termPinned)closeTerm();else openTerm(el,true);});
});
panel.addEventListener('mouseenter',()=>clearTimeout(termCloseTimer));panel.addEventListener('mouseleave',delayClose);
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.term,#term-panel'))closeTerm();});
function pressed(selector,target){$$(selector).forEach(b=>b.setAttribute('aria-pressed',String(b===target)));}

const files={html:['index.html · 화면 구조','<h1>테트리스</h1>\n<canvas id="board"></canvas>\n<p>점수 0</p>','화면에 제목, 게임판, 점수 표시가 있다는 구조를 표현합니다.'],css:['style.css · 화면 표현','button {\n  width: 116px;\n  color: #006295;\n}','크기와 색 같은 표현을 정합니다. 블록 충돌이나 줄 삭제 규칙을 바꾸는 코드는 아닙니다.'],js:['tetris.js · 화면 동작','가득 찬 줄이 생기면 {\n  해당 줄을 지운다;\n  점수를 계산하고 표시한다;\n}','동작을 쉽게 풀어쓴 설명입니다. 실제 JavaScript 문법을 외울 필요는 없습니다.'],agents:['AGENTS.md · 반복 작업 기준','# 작업 기준\n- 화면은 한국어로 작성\n- 수정 후 실제 입력으로 확인','지원하는 에이전트가 참고할 기준을 남기는 문서입니다.'],readme:['README.md · 실행 안내','# 실행 방법\n1. index.html을 브라우저로 엽니다.\n2. 자동 플레이와 점수 변화를 확인합니다.','나중에 다시 실행할 때 필요한 안내를 남깁니다.']};
function selectFile(b){pressed('[data-file]',b);const [label,code,desc]=files[b.dataset.file];$('#file-label').textContent=label;$('#file-code').textContent=code;$('#file-desc').textContent=desc;}
$$('[data-file]').forEach(b=>b.addEventListener('click',()=>selectFile(b)));selectFile($('[data-file="html"]'));
let runKind='html';
$$('[data-run]').forEach(b=>b.addEventListener('click',()=>{runKind=b.dataset.run;pressed('[data-run]',b);$('#run-label').textContent=runKind==='html'?'브라우저에서 열기':'PowerShell · 명령 예시';$('#run-command').textContent=runKind==='html'?'index.html':'python app.py';$('#run-output').textContent=runKind==='html'?'HTML 파일을 브라우저로 열면 화면을 볼 수 있습니다.':'Python이 app.py 파일에 적힌 코드를 실행합니다.';}));
$('#run-demo').addEventListener('click',()=>{$('#run-output').textContent=runKind==='html'?'파일 읽기 → 구조와 모양 적용 → 버튼에 반응하는 화면':'명령 해석 → Python 실행 → 파일의 처리 수행 → 결과 출력';});
$$('[data-layer]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-layer]',b);const k=b.dataset.layer;$('#layer-preview').classList.toggle('styled',k!=='html');$('#layer-action').disabled=k!=='js';$('#layer-state').textContent='확인 전';$('#layer-caption').textContent={html:'HTML로 내용과 구조만 표현한 상태입니다.',css:'CSS로 모양을 정리했습니다. 아직 상태 변경 동작은 없습니다.',js:'JavaScript가 버튼의 입력을 받아 상태를 바꿉니다.'}[k];}));
$('#layer-action').addEventListener('click',()=>{$('#layer-state').textContent=$('#layer-state').textContent==='확인 전'?'확인 완료':'확인 전';});
let routeMode='local';
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>{routeMode=b.dataset.route;pressed('[data-route]',b);$('#process-label').textContent=routeMode==='local'?'브라우저 계산':'API로 서버 처리';$('#route-desc').textContent=routeMode==='local'?'작은 순위 도구는 JavaScript로 브라우저 안에서 계산할 수 있습니다.':'브라우저가 API로 값을 보내면 서버가 기준을 적용하고 결과를 돌려줍니다.';}));
$('#route-play').addEventListener('click',()=>{const nodes=$$('[data-node]');nodes.forEach(n=>n.classList.remove('lit'));nodes.forEach((n,i)=>later(()=>{nodes.forEach(x=>x.classList.remove('lit'));n.classList.add('lit');},i*600));});
['order','spacing','action'].forEach((id,i)=>$('#gui-'+id).addEventListener('change',e=>{$('#gui-preview').classList.toggle(['ordered','spaced','clear-action'][i],e.target.checked);if(id==='action')$('#gui-button').textContent=e.target.checked?'검토 시작':'OK';}));
$('#gui-button').addEventListener('click',()=>$('#gui-feedback').textContent='후보 A부터 검토를 시작합니다.');
function ruleExpected(raw){if(!raw.trim())return '확인 필요';const n=Number(raw);if(!Number.isFinite(n)||n<0||n>100)return '입력 오류';return n>=80?'충족':'미달';}
function updateRule(){const raw=$('#rule-score').value,expected=ruleExpected(raw),fixed=$('#rule-fix').checked;const actual=fixed?expected:(Number(raw)>80?'충족':'미달');$('#rule-actual').textContent=actual;$('#rule-expected').textContent='기대 결과: '+expected;$('#rule-note').textContent=actual===expected?'이 입력에서는 맞습니다. 다른 조건도 함께 확인합니다.':'기준과 다릅니다. 화면은 정상이어도 처리 결과는 틀렸습니다.';$('#rule-result').classList.toggle('wrong',actual!==expected);}
$('#rule-score').addEventListener('input',updateRule);$('#rule-fix').addEventListener('change',updateRule);$$('[data-rule]').forEach(b=>b.addEventListener('click',()=>{$('#rule-score').value=b.dataset.rule;updateRule();}));
const lenses={gui:['화면을 더 예쁘게 해줘.','검토할 건수를 먼저 보여주고, 주요 버튼의 이름을 ‘검토 시작’으로 바꿔줘.','정보의 우선순위와 다음 행동을 볼 수 있으면, 화면 개선도 구체적으로 요청할 수 있습니다.'],logic:['계산이 이상해. 고쳐줘.','기준이 80점 이상이므로 80점도 충족이야. 입력이 비었을 때는 0점으로 판단하지 말고 확인을 요청해줘.','업무 기준과 경계 조건을 이해해야 그럴듯한 오답을 찾아낼 수 있습니다.'],system:['저장 기능도 넣어줘.','이 자료는 여러 사람이 함께 볼 거야. 브라우저에만 보관해도 되는지, 서버 저장이 필요한지 비교해서 설명해줘.','프론트엔드와 백엔드의 역할을 알면, 사용 범위에 맞는 구조를 질문할 수 있습니다.']};
$$('[data-lens]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-lens]',b);const [a,c,d]=lenses[b.dataset.lens];$('#vague-request').textContent=a;$('#precise-request').textContent=c;$('#lens-reason').textContent=d;}));
const versions=[['첫 화면','입력과 순위 결과가 보이는 상태입니다.'],['처리 수정','동점과 누락 입력을 정한 기준대로 처리했습니다.'],['화면 개선','주요 결과를 먼저 보여주고 버튼 이름을 정리했습니다.']];
$$('[data-version]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-version]',b);const [a,c]=versions[+b.dataset.version];$('#version-title').textContent=a;$('#version-body').textContent=c;}));
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const text=$('#'+b.dataset.copy).textContent;let ok=false;try{await navigator.clipboard.writeText(text);ok=true;}catch{const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.left='-10000px';document.body.append(t);t.select();ok=document.execCommand('copy');t.remove();b.focus();}b.parentElement.querySelector('.copy-status').textContent=ok?'복사했습니다.':'복사하지 못했습니다. 요청문을 선택해 복사하세요.';}));
let timerRunning=false,timerRemaining=600,timerDeadline=0;
function renderTimer(){if(timerRunning){timerRemaining=Math.max(0,Math.ceil((timerDeadline-Date.now())/1000));if(!timerRemaining)timerRunning=false;}$('#timer-value').textContent=String(Math.floor(timerRemaining/60)).padStart(2,'0')+':'+String(timerRemaining%60).padStart(2,'0');$('#timer-start').textContent=timerRunning?'일시정지':timerRemaining?'시작':'시간 종료';$('#timer-start').disabled=!timerRemaining;}
$('#timer-start').addEventListener('click',()=>{if(timerRunning){renderTimer();timerRunning=false;}else{timerRunning=true;timerDeadline=Date.now()+timerRemaining*1000;}renderTimer();});
$('#timer-reset').addEventListener('click',()=>{timerRunning=false;timerRemaining=600;renderTimer();});setInterval(()=>{if(timerRunning)renderTimer();},500);
function parseRows(text){const rows=[],errors=[];text.split(/\r?\n/).forEach((line,i)=>{if(!line.trim())return;const pieces=line.split(/[,，]/);if(pieces.length!==2||!pieces[0].trim()||!pieces[1].trim()){errors.push((i+1)+'행: 이름과 점수를 모두 입력하세요.');return;}const n=Number(pieces[1]);if(!Number.isFinite(n)||n<0||n>100){errors.push((i+1)+'행: 점수는 0~100 사이의 숫자여야 합니다.');return;}rows.push({name:pieces[0].trim(),score:n,index:i});});rows.sort((a,b)=>b.score-a.score||a.index-b.index);return {rows,errors};}
const samples={normal:'포석호, 85\n하늘, 92\n바다, 74',tie:'포석호, 90\n하늘, 90\n바다, 80',missing:'포석호,\n하늘, 92',range:'포석호, 101\n하늘, -1',empty:''};
function renderRank(){const {rows,errors}=parseRows($('#rank-input').value);$('#rank-count').textContent=rows.length+'명';$('#rank-errors').textContent=errors.join(' / ')||(!rows.length?'입력한 자료가 없습니다.':'');$('#rank-output').replaceChildren();rows.forEach((r,i)=>{const li=document.createElement('li');[String(i+1),r.name,String(r.score)].forEach((t,j)=>{const e=document.createElement(j===2?'strong':'span');e.textContent=t;li.append(e);});$('#rank-output').append(li);});}
$$('[data-rank-sample]').forEach(b=>b.addEventListener('click',()=>{$('#rank-input').value=samples[b.dataset.rankSample];renderRank();}));$('#rank-input').addEventListener('input',renderRank);renderRank();
function renderTest(kind){const target=$('#final-test'),{rows,errors}=parseRows(samples[kind]);target.replaceChildren();const title=document.createElement('h3');title.textContent={normal:'정상 · 높은 점수부터',tie:'동점 · 공동 순위 1, 1, 3',missing:'누락 · 해당 줄 확인 요청',range:'범위 · 잘못된 값 안내'}[kind];target.append(title);let rank=0;rows.forEach((r,i)=>{rank=i===0||r.score!==rows[i-1].score?i+1:rank;const line=document.createElement('div');line.className='test-row'+(r.score>=80?' pass':'');const a=document.createElement('span');a.textContent=rank+'위';const n=document.createElement('span');n.textContent=r.name;const val=document.createElement('b');val.textContent=r.score+'점';line.append(a,n,val);target.append(line);});errors.forEach(msg=>{const p=document.createElement('p');p.textContent=msg;p.style.color='var(--coral)';target.append(p);});}
$$('[data-test]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-test]',b);renderTest(b.dataset.test);}));renderTest('normal');
let apiMode='ok';$$('[data-api-mode]').forEach(b=>b.addEventListener('click',()=>{apiMode=b.dataset.apiMode;pressed('[data-api-mode]',b);}));
$('#api-send').addEventListener('click',()=>{const text=$('#api-text').value.trim();if(!text){$('#api-result').textContent='분류할 문장을 입력하세요.';return;}const mode=apiMode,nodes=[$('#api-screen'),$('#api-server'),$('#api-service')];nodes.forEach(n=>n.classList.remove('lit'));$('#api-result').textContent='응답 과정을 재현하는 중…';nodes.forEach((n,i)=>later(()=>{nodes.forEach(x=>x.classList.remove('lit'));n.classList.add('lit');if(i===2)$('#api-result').textContent=mode==='error'?'연결 실패 · 잠시 후 다시 시도하세요.':/접속|연결|끊/.test(text)?'접속 문제 · 규칙 기반 예시 응답':'기타 문의 · 규칙 기반 예시 응답';},i*650));});
const setups={html:[['작업 도구','코딩 에이전트'],['작업 공간','프로젝트 폴더'],['실행 환경','브라우저'],'오늘의 단일 HTML 예제는 별도의 Python·Node.js 설치 없이 브라우저에서 실행됩니다.'],python:[['작업 도구','코딩 에이전트'],['실행 환경','Python'],['추가 기능','필요한 패키지'],'Python 코드와 필요한 패키지를 준비하고 실행 명령을 확인합니다.'],api:[['화면과 처리','브라우저·백엔드'],['연결 정보','주소·요청 형식'],['인증','서버 측 설정'],'서비스 사용 권한과 연결 방식을 확인합니다. 비밀 API 키는 브라우저에 넣지 않습니다.']};
function renderSetup(b){pressed('[data-setup]',b);const data=setups[b.dataset.setup];$('#setup-path').replaceChildren();data.slice(0,3).forEach(([a,c])=>{const d=document.createElement('div'),s=document.createElement('span'),t=document.createElement('strong');s.textContent=a;t.textContent=c;d.append(s,t);$('#setup-path').append(d);});$('#setup-desc').textContent=data[3];}
$$('[data-setup]').forEach(b=>b.addEventListener('click',()=>renderSetup(b)));renderSetup($('[data-setup="html"]'));

// Expose navigation and pure parsing for reproducible local verification.
window.deck={get current(){return current;},get count(){return slides.length;},go(i){go(i);},parseRows,ruleExpected,preparePrint(){window.handoffDemo?.preparePrint();window.tetrisWorkshop?.preparePrint();$('#rule-fix').checked=true;$('#rule-score').value='80';updateRule();['order','spacing','action'].forEach(x=>{const e=$('#gui-'+x);e.checked=true;e.dispatchEvent(new Event('change'));});$$('.slide').forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');});closeTerm();}};
resize();go(parseHash());
})();
