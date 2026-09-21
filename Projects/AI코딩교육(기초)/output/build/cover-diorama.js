
(()=>{const frame=document.getElementById('cover-diorama'),cover=frame.closest('.slide');
const sync=()=>frame.contentWindow?.postMessage({type:'cover-visibility',active:cover.classList.contains('is-active')&&!document.hidden&&!matchMedia('(prefers-reduced-motion:reduce)').matches},'*');
addEventListener('message',e=>{if(e.source!==frame.contentWindow||e.data?.type!=='cover-state')return;for(const key of ['ready','loaded','paused','time'])frame.dataset[key]=String(e.data[key]);});frame.addEventListener('load',sync);new MutationObserver(sync).observe(cover,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',sync);
frame.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(document.getElementById('cover-diorama-data').textContent.trim()),c=>c.charCodeAt(0)));
})();