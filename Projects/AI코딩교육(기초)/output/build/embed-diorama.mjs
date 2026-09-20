import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve(dir,'../AI코딩교육_기획안2.html');
const source=path.resolve(dir,'../../../hq-ax-diorama/output/hq-ax-diorama.html');
let deck=await readFile(target,'utf8');
let scene=await readFile(source,'utf8');
scene=scene.replace('</head>',`<style>
html,body,:root{margin:0;width:100%;height:100%;overflow:hidden;background:transparent!important}
body>header,.side,.stage-note,.live,.film,.case-panel,footer{display:none!important}
main,.layout,.theater{width:100%;height:100%;min-height:0;max-width:none;margin:0;padding:0;display:block;border:0;border-radius:0;background:transparent!important;overflow:visible}
#stage{width:100%;height:calc(100vh - 80px)!important;top:40px;transform:scale(1.3);transform-origin:50% 50%}.bubble{font-size:14px;background:#fcfdfeed;border-color:#bdd0db;color:#14384b}
</style></head>`);
scene=scene.replace('</body>',`<script>
let coverActive=true;function syncCover(){if(!window.spriteInspect)return;const paused=window.spriteInspect().paused;if(paused===coverActive)document.getElementById('pause').click();const state=window.spriteInspect();parent.postMessage({type:'cover-state',ready:state.ready,loaded:state.loaded,paused:state.paused,time:state.time},'*');}
addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='cover-visibility')return;coverActive=e.data.active;syncCover();});
const start=setInterval(()=>{if(window.spriteInspect){syncCover();clearInterval(start);}},100);
</script></body>`);
const frame='<iframe id="cover-diorama" title="사람과 AI 캐릭터가 함께 일하는 움직이는 사무실" tabindex="-1" sandbox="allow-scripts" aria-label="사람과 AI가 함께 일하는 디오라마"></iframe>';
if(!deck.includes('id="cover-diorama"')){
 const first=deck.match(/<section\b[\s\S]*?<\/section>/)[0];
 const updated=first.replace(/<img\b[^>]*class="visual-img [^"]*"[^>]*>/,frame);
 if(first===updated)throw Error('Cover illustration not found');deck=deck.replace(first,()=>updated);
}
deck=deck.replace(/<style id="cover-diorama-style">[\s\S]*?<\/style>/,'').replace(/<script id="cover-diorama-data"[\s\S]*?<\/script>/,'').replace(/<script id="cover-diorama-init">[\s\S]*?<\/script>/,'');
deck=deck.replace('</head>',`<style id="cover-diorama-style">
.visual-cover .hero-visual{width:1090px;height:800px;right:-40px;top:-185px}
#cover-diorama{display:block;width:100%;height:100%;border:0;background:transparent;pointer-events:none}
.visual-cover .hero-label{top:auto;bottom:52px;font-size:23px}.visual-cover .human-label{left:190px}.visual-cover .robot-label{left:auto;right:95px}
</style></head>`);
const encoded=Buffer.from(scene).toString('base64');
deck=deck.replace('</body>',()=>`<script id="cover-diorama-data" type="application/octet-stream">${encoded}</script><script id="cover-diorama-init">
(()=>{const frame=document.getElementById('cover-diorama'),cover=frame.closest('.slide');
const sync=()=>frame.contentWindow?.postMessage({type:'cover-visibility',active:cover.classList.contains('is-active')&&!document.hidden&&!matchMedia('(prefers-reduced-motion:reduce)').matches},'*');
addEventListener('message',e=>{if(e.source!==frame.contentWindow||e.data?.type!=='cover-state')return;for(const key of ['ready','loaded','paused','time'])frame.dataset[key]=String(e.data[key]);});frame.addEventListener('load',sync);new MutationObserver(sync).observe(cover,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',sync);
frame.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(document.getElementById('cover-diorama-data').textContent.trim()),c=>c.charCodeAt(0)));
})();</script></body>`);
await writeFile(target,deck);console.log('Embedded animated cover scene; all assets contained in presentation HTML.');
