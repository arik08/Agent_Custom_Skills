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
 cards.forEach((card,i)=>{card.classList.toggle('is-current',i===selected);card.setAttribute('aria-pressed',String(i===selected));if(i===selected)card.setAttribute('aria-current','step');else card.removeAttribute('aria-current');});
}
function move(direction){go(current+direction);}
for(const group of $$('[data-step-highlight]')){
 const slide=group.closest('.slide');
 [...group.children].forEach((card,index)=>{
  card.setAttribute('role','button');card.tabIndex=0;
  card.addEventListener('click',()=>setHighlight(slide,index));
  card.addEventListener('keydown',e=>{
   if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setHighlight(slide,index);}
  });
 });
}
// Closing: reserve the complete sentence width so streaming never shifts the title.
function playClosing(slide){
 if(!slide.matches('.closing'))return;
 const heading=slide.querySelector('h1');
 if(!heading.querySelector('.qa-stream')){
  const text=heading.textContent;
  heading.setAttribute('aria-label',text);
  const stream=document.createElement('span');stream.className='qa-stream';stream.setAttribute('aria-hidden','true');
  [...text].forEach((char,i)=>{const span=document.createElement('span');span.className='qa-letter';span.textContent=char;span.style.setProperty('--letter-delay',`${700+i*65}ms`);stream.append(span);});
  const cursor=document.createElement('i');cursor.className='qa-cursor';stream.append(cursor);heading.replaceChildren(stream);
 }
 const stream=heading.querySelector('.qa-stream'),cursor=stream.querySelector('.qa-cursor'),letters=[...stream.querySelectorAll('.qa-letter')];
 slide.style.setProperty('--qa-image-delay',`${700+(letters.length-1)*65+600}ms`);
 cursor.style.left='0px';stream.classList.remove('is-complete');
 letters.forEach(letter=>letter.style.setProperty('--qa-letter-opacity','0'));
 if(!slide.classList.contains('enter'))return;
 letters.forEach((letter,i)=>later(()=>{letter.style.setProperty('--qa-letter-opacity','1');cursor.style.left=`${letter.offsetLeft+letter.offsetWidth}px`;},700+i*65));
 later(()=>stream.classList.add('is-complete'),700+letters.length*65+950);
}
reduced.addEventListener('change',()=>{if(reduced.matches){pending.forEach(clearTimeout);pending=[];slides.forEach(s=>s.classList.remove('enter'));}});
function go(index){
 index=Math.max(0,Math.min(slides.length-1,index)); if(index===current)return;
 pending.forEach(clearTimeout);pending=[];closeTerm();clearLayerCelebration();
 if(current>=0&&slides[current].contains(document.activeElement))document.activeElement.blur();
 current=index;wheelSum=0;setHighlight(slides[index],0);
 slides.forEach((s,i)=>{s.classList.toggle('is-active',i===index);s.classList.remove('enter');s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));});
 if(!visited.has(index)&&!reduced.matches)slides[index].classList.add('enter');visited.add(index);
 playClosing(slides[index]);
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
function highlightFileCode(target,code,language){
 const rules={
  python: /(?<comment>#[^\n]*)|(?<string>(?:[fFrRbBuU]{1,2})?"(?:\\.|[^"\\])*"|(?:[fFrRbBuU]{1,2})?'(?:\\.|[^'\\])*')|(?<keyword>\b(?:import|from|as|def|return|if|else|elif|for|in|while|try|except|raise|with|class|True|False|None)\b)|(?<function>\b[a-zA-Z_]\w*(?=\())|(?<number>\b\d+(?:\.\d+)?\b)|(?<punctuation>[{}\[\]():,=])/g,
  html: /(?<comment><!--[\s\S]*?-->)|(?<tag><\/?[\w-]+)|(?<attribute>[\w:-]+(?=\s*=))|(?<string>"[^"\n]*"|'[^'\n]*')|(?<punctuation>\/?\s*>|=)/g,
  css: /(?<comment>\/\*[\s\S]*?\*\/)|(?<string>"[^"\n]*"|'[^'\n]*')|(?<property>[\w-]+(?=\s*:))|(?<number>#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|s)?\b)|(?<selector>[.#]?[a-zA-Z][\w-]*(?=\s*\{))|(?<punctuation>[{}:;])/g,
  js: /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>"[^"\n]*"|'[^'\n]*'|`[^`]*`)|(?<keyword>\b(?:const|let|var|if|else|return|function|for|while|true|false|null|new)\b)|(?<number>\b\d+(?:\.\d+)?\b)|(?<punctuation>[{}();=+])/g,
  md: /(?<heading>^#{1,6}[^\n]*)|(?<marker>^\s*(?:[-*+] |\d+\. ))|(?<string>`[^`\n]+`)|(?<keyword>\*\*[^*\n]+\*\*)/gm
 };
 const rule=rules[language];target.replaceChildren();
 if(!rule){target.textContent=code;return;}
 let cursor=0;
 for(const match of code.matchAll(rule)){
  target.append(document.createTextNode(code.slice(cursor,match.index)));
  const token=document.createElement('span');
  token.className='syntax-'+Object.keys(match.groups).find(key=>match.groups[key]!==undefined);
  token.textContent=match[0];target.append(token);cursor=match.index+match[0].length;
 }
 target.append(document.createTextNode(code.slice(cursor)));
}
$$('code[data-language]').forEach(el=>highlightFileCode(el,el.textContent,el.dataset.language));
function selectFile(b){pressed('[data-file]',b);const [label,code,desc]=files[b.dataset.file];$('#file-label').textContent=label;highlightFileCode($('#file-code'),code,{agents:'md',readme:'md'}[b.dataset.file]||b.dataset.file);$('#file-desc').textContent=desc;}
$$('[data-file]').forEach(b=>b.addEventListener('click',()=>selectFile(b)));selectFile($('[data-file="html"]'));
let runKind='html';
$$('[data-run]').forEach(b=>b.addEventListener('click',()=>{
 runKind=b.dataset.run;pressed('[data-run]',b);
 const python=runKind!=='html';
 $('#run-hybrid').hidden=runKind!=='hybrid';
 $('#run-browser').hidden=true;
 $('.run-window').dataset.runMode=runKind;
 $('#run-window-title').textContent=python?'Windows PowerShell':'브라우저';
 $('#run-label').textContent=python?'Windows PowerShell':'주소';
 $('#run-prefix').textContent=python?'PS C:\\tetris-workshop>':'↻';
 $('#run-command').textContent=python?'python app.py':'file:///C:/tetris-workshop/index.html';
 $('#run-output').textContent=runKind==='hybrid'?'Python 웹 서버가 실행되며 접속 주소가 표시됩니다. (시연)':python?'Python이 app.py 파일에 적힌 코드를 실행합니다.':'HTML 파일을 브라우저로 열면 화면을 볼 수 있습니다.';
}));
$$('.run-link').forEach(b=>b.addEventListener('click',()=>{ $('#run-browser').hidden=false; $('#run-browser .hybrid-address').textContent='브라우저 · http://'+b.dataset.address+':5000'; }));
$$('[data-layer]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-layer]',b);const k=b.dataset.layer;clearLayerCelebration();$('#layer-preview').classList.remove('layer-done');$('#layer-action').textContent='확인 완료';$('#layer-preview').classList.toggle('styled',k!=='html');$('#layer-action').disabled=k!=='js';$('#layer-state').textContent='확인 전';$('#layer-caption').textContent={html:'HTML로 내용과 구조만 표현한 상태입니다.',css:'CSS로 모양을 정리했습니다. 아직 상태 변경 동작은 없습니다.',js:'JavaScript가 버튼의 입력을 받아 상태를 바꿉니다.'}[k];}));
function clearLayerCelebration(){
 const preview=$('#layer-preview');
 preview?.getAnimations({subtree:true}).forEach(a=>a.cancel());
 preview?.querySelectorAll('.layer-celebration').forEach(e=>e.remove());
}
$('#layer-state').setAttribute('aria-live','polite');
$('#layer-action').addEventListener('click',()=>{
 const preview=$('#layer-preview');
 if($('#layer-action').disabled)return;
 clearLayerCelebration();preview.classList.add('layer-done');
 $('#layer-state').textContent='확인 완료!';$('#layer-action').textContent='한 번 더 ✨';
 if(reduced.matches)return;
 const fx=document.createElement('div');fx.className='layer-celebration';fx.setAttribute('aria-hidden','true');
 fx.innerHTML='<div class="layer-wave"></div><div class="layer-success"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><path d="m28 50 15 16 30-33"/></svg><b>성공!</b></div>';
 preview.append(fx);
 fx.querySelector('.layer-wave').animate([{transform:'scale(0)',opacity:.7},{transform:'scale(3)',opacity:0}],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
 const badge=fx.querySelector('.layer-success');
 badge.animate([{transform:'scale(.3)',opacity:0},{transform:'scale(1.12)',opacity:1,offset:.25},{transform:'scale(1)',opacity:1,offset:.75},{transform:'scale(.95)',opacity:0}],{duration:1800,fill:'forwards'});
 const check=fx.querySelector('path');check.animate([{strokeDashoffset:90},{strokeDashoffset:0}],{duration:550,delay:150,fill:'both'});
 for(let i=0;i<32;i++){
  const bit=document.createElement('i');bit.className='layer-confetti';bit.style.background=['#f7cc42','#0f94b3','#f07b56','#58bb98'][i%4];fx.append(bit);
  const angle=Math.PI*2*i/32, distance=100+Math.random()*140;
  bit.animate([{transform:'translate(0,0) rotate(0deg) scale(0)',opacity:0},{opacity:1,offset:.12},{transform:`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px) rotate(${360+i*29}deg) scale(.6)`,opacity:0}],{duration:1200+Math.random()*500,easing:'cubic-bezier(.12,.65,.3,1)',fill:'forwards'});
 }
 Promise.allSettled(fx.getAnimations({subtree:true}).map(a=>a.finished)).then(()=>fx.remove());
});

['order','spacing','action','radius'].forEach((id,i)=>$('#gui-'+id).addEventListener('change',e=>{$('#gui-preview').classList.toggle(['ordered','spaced','clear-action','restrained-radius'][i],e.target.checked);if(id==='action')$('#gui-button').textContent=e.target.checked?'검토 시작':'OK';}));
$('#gui-button').addEventListener('click',()=>$('#gui-feedback').textContent='후보 A부터 검토를 시작합니다.');
const versions=[['첫 화면','입력과 순위 결과가 보이는 상태입니다.'],['처리 수정','동점과 누락 입력을 정한 기준대로 처리했습니다.'],['화면 개선','주요 결과를 먼저 보여주고 버튼 이름을 정리했습니다.']];
$$('[data-version]').forEach(b=>b.addEventListener('click',()=>{pressed('[data-version]',b);const [a,c]=versions[+b.dataset.version];$('#version-title').textContent=a;$('#version-body').textContent=c;}));
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
 const target=document.getElementById(b.dataset.copy),status=b.parentElement.querySelector('.copy-status');
 if(!target||!status)return;
 const text=target.textContent;let ok=false;b.disabled=true;status.textContent='';
 try{await navigator.clipboard.writeText(text);ok=true;}catch{
  const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.left='-10000px';document.body.append(t);t.select();
  try{ok=document.execCommand('copy');}catch{ok=false;}finally{t.remove();}
 }
 b.disabled=false;b.focus({preventScroll:true});
 status.textContent=ok?'복사했습니다.':'복사하지 못했습니다. 내용을 선택해 복사하세요.';
}));
function parseRows(text){const rows=[],errors=[];text.split(/\r?\n/).forEach((line,i)=>{if(!line.trim())return;const pieces=line.split(/[,，]/);if(pieces.length!==2||!pieces[0].trim()||!pieces[1].trim()){errors.push((i+1)+'행: 이름과 점수를 모두 입력하세요.');return;}const n=Number(pieces[1]);if(!Number.isFinite(n)||n<0||n>100){errors.push((i+1)+'행: 점수는 0~100 사이의 숫자여야 합니다.');return;}rows.push({name:pieces[0].trim(),score:n,index:i});});rows.sort((a,b)=>b.score-a.score||a.index-b.index);return {rows,errors};}
const setups={html:[['작업 도구','코딩 에이전트'],['작업 공간','프로젝트 폴더'],['실행 환경','브라우저'],'오늘의 단일 HTML 예제는 별도의 Python·Node.js 설치 없이 브라우저에서 실행됩니다.'],python:[['작업 도구','코딩 에이전트'],['실행 환경','Python'],['추가 기능','필요한 패키지'],'Python 코드와 필요한 패키지를 준비하고 실행 명령을 확인합니다.'],api:[['화면과 처리','브라우저·백엔드'],['연결 정보','주소·요청 형식'],['인증','서버 측 설정'],'서비스 사용 권한과 연결 방식을 확인합니다. 비밀 API 키는 브라우저에 넣지 않습니다.']};
function renderSetup(b){pressed('[data-setup]',b);const data=setups[b.dataset.setup];$('#setup-path').replaceChildren();data.slice(0,3).forEach(([a,c])=>{const d=document.createElement('div'),s=document.createElement('span'),t=document.createElement('strong');s.textContent=a;t.textContent=c;d.append(s,t);$('#setup-path').append(d);});$('#setup-desc').textContent=data[3];}
$$('[data-setup]').forEach(b=>b.addEventListener('click',()=>renderSetup(b)));if($('[data-setup="html"]'))renderSetup($('[data-setup="html"]'));

// Expose navigation and pure parsing for reproducible local verification.
window.deck={get current(){return current;},get count(){return slides.length;},go(i){go(i);},parseRows,preparePrint(){window.handoffDemo?.preparePrint();window.tetrisWorkshop?.preparePrint();['order','spacing','action','radius'].forEach(x=>{const e=$('#gui-'+x);e.checked=true;e.dispatchEvent(new Event('change'));});$$('.slide').forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden');});closeTerm();}};
resize();go(parseHash());
})();
