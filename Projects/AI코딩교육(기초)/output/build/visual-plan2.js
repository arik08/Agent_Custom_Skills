(()=>{
 const shelf=document.querySelector('#setup-equipment'),tpl=document.querySelector('#software-icons');
 function decorate(){if(!shelf||!tpl)return;const icons=[...tpl.content.children];[...shelf.children].forEach((slot,i)=>{if(!slot.querySelector('svg,img'))slot.prepend(icons[i].cloneNode(true));});}
 if(shelf){new MutationObserver(decorate).observe(shelf,{childList:true});decorate();}
 // SVG motion pauses when its slide is not being presented; reduced motion freezes it.
 function motion(){document.querySelectorAll('.scene-diagram').forEach(s=>{if(!s.pauseAnimations)return;const active=s.closest('.slide').classList.contains('is-active')&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.hidden;active?s.unpauseAnimations():s.pauseAnimations();});}
 new MutationObserver(motion).observe(document.querySelector('#stage'),{subtree:true,attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',motion);matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',motion);motion();
})();
