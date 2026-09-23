import {BlockPreview} from './coding-preview.mjs';
import {posture} from './coding-motion.mjs';
import {SpeechRelay} from './coding-speech.mjs';
import * as THREE from './coding-runtime/node_modules/three/build/three.module.js';
import {isGait,spriteFrame} from './coding-gait.mjs';
import {Office,stageLabels,phases} from './coding-flow.mjs';
async function main(){
const names=['대기','걷기','자료 운반','분석','보고','완료'],english=['IDLE','WALK','CARRY','ANALYZE','REPORT','CELEBRATE'];
const keys=['employee-a','employee-b','ai'];
const $=id=>document.getElementById(id);const office=new Office();const preview=new BlockPreview();const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');if(reducedMotion.matches){while(office.beat.id!=='request')office.update(.1);office.update(.5);}let paused=false,speed=1,time=0,last=performance.now(),hudTime=0;
$('cards').innerHTML=names.map((name,i)=>`<article class="card"><canvas width="256" height="256" aria-label="${name} 애니메이션"></canvas><strong>${name}</strong><small>${english[i]} · ${spriteFrame('employee-a',i,0,0).frames} FRAMES</small></article>`).join('');
const canvases=[...document.querySelectorAll('.card canvas')],contexts=canvases.map(c=>c.getContext('2d'));
function sync(){$('story').textContent=phases[office.phase].label;}
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'계속 재생':'일시정지';sync();};
$('request').onclick=()=>{office.enqueue();sync();};$('speed').onclick=()=>{speed=speed===1?2:speed===2?4:1;$('speed').textContent=`속도 ×${speed}`;};
const images=Object.fromEntries(awaitImages()); await Promise.all(Object.values(images).map(img=>img.decode()));
function awaitImages(){return Object.keys(window.SPRITE_ASSETS).map(key=>{const img=new Image();img.src=window.SPRITE_ASSETS[key];return[key,img];});}
let renderer,scene,camera,actors=[],codeDisplay;let ready=false;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;$('stage').appendChild(renderer.domElement);
scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-9,9,6.5,-6.5,.1,100);camera.position.set(13,13,18);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xfff7e6,0x647669,3));const sun=new THREE.DirectionalLight(0xffedca,3);sun.position.set(-7,14,9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});sun.shadow.bias=-.001;scene.add(sun);
const palette={floor:0xd7b999,edge:0x9c886c,wall:0xe3e9d5,wood:0xbe8660,cream:0xf6efd9,teal:0x397a73,dark:0x32463f};
const materials=new Map();function mat(color){if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.85}));return materials.get(color);}
function box(w,h,d,color,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
function cylinder(r,h,color,x,y,z){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
box(12,.5,9,palette.edge,0,-.3,0);box(12,.12,9,palette.floor,0,.01,0);
for(let x=-5.8;x<6;x+=.65)box(.012,.01,9,0xc5a98d,x,.078,0);
box(12,2.8,.18,palette.wall,0,1.4,-4.5);box(.18,2.8,9,palette.wall,-6,1.4,0);
box(5.6,1.55,.12,0xb6d4d1,1.7,1.65,-4.37);for(let x=-1;x<5;x+=1.4)box(.07,1.6,.18,palette.cream,x,1.65,-4.3);box(5.8,.1,.25,palette.cream,1.7,.83,-4.25);
// Slatted acoustic wall, noticeboard, bookshelf.
for(let x=-5.6;x<-2;x+=.3)box(.09,2,.15,0xbca17e,x,1.6,-4.28);
box(.14,1.1,2.2,palette.teal,-5.84,1.75,-1.7);for(let i=0;i<4;i++)box(.16,.32,.34,palette.cream,-5.74,1.6+(i%2)*.42,-2.25+Math.floor(i/2)*.85);
box(1.6,1.8,.65,palette.wood,-4.5,.96,-3.8);for(let y=.3;y<1.7;y+=.55){box(1.5,.05,.66,palette.cream,-4.5,y,-3.79);for(let j=0;j<6;j++)box(.13,.36,.38,[0x638b79,0xcbaa75,0xc8795f][j%3],-5.1+j*.22,y+.22,-3.76);}
function desk(x,z){box(2.8,.14,1.3,palette.wood,x,1.05,z);for(const dx of [-1.15,1.15])for(const dz of [-.45,.45])box(.09,1,.09,palette.dark,x+dx,.5,z+dz);box(1,.65,.08,palette.dark,x,1.5,z-.2);box(.88,.52,.09,0x83b9b0,x,1.51,z-.14);box(.09,.3,.08,palette.dark,x,1.17,z-.2);box(.55,.045,.35,palette.cream,x,1.15,z+.33);cylinder(.10,.18,palette.teal,x+1,1.22,z+.3);box(.4,.12,.45,palette.cream,x-.95,1.18,z+.1);}
desk(-2,-2);desk(2,-2);
// Shared development display: actual phase-specific code, terminal and preview.
const screen=document.createElement('canvas');screen.width=2048;screen.height=800;const ctx=screen.getContext('2d');ctx.scale(2,2);
const screenTexture=new THREE.CanvasTexture(screen);screenTexture.colorSpace=THREE.SRGBColorSpace;
// Average the high-resolution lettering across mip levels before projecting it
// onto the small, oblique board; a single linear sample aliases the thin strokes.
screenTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();screenTexture.minFilter=THREE.LinearMipmapLinearFilter;screenTexture.magFilter=THREE.LinearFilter;screenTexture.generateMipmaps=true;
const display=new THREE.Mesh(new THREE.PlaneGeometry(5.8,2.25),new THREE.MeshBasicMaterial({map:screenTexture}));display.position.set(.4,2.35,-4.12);scene.add(display);
let shown=-1,displayTime=office.time,previewJob=-1,drawnRevision=-1;
codeDisplay=()=>{
 const dt=office.time-displayTime;displayTime=office.time;
 const playing=office.phase===3||office.phase===5;
 if(playing){if(previewJob!==office.task.id){preview.reset();previewJob=office.task.id;}if(shown===office.phase)preview.update(dt,office.task.dropMs);}
 if(shown===office.phase&&(!playing||drawnRevision===preview.revision))return;
 shown=office.phase;drawnRevision=preview.revision;const phase=phases[shown];
 ctx.fillStyle='#142d40';ctx.fillRect(0,0,1024,400);ctx.fillStyle='#76d7ef';ctx.font='bold 38px sans-serif';ctx.fillText('CODING AGENT  /  '+phase.label,30,52);ctx.font='bold 44px monospace';
 const lines=playing?[phase.lines[0],'SCORE  '+preview.score,'←  ↓  →   ROTATE']:phase.lines;
 lines.forEach((line,i)=>{ctx.fillStyle=line.startsWith('-')?'#ffad9c':line.startsWith('+')?'#8fe3ae':'#e5f4ff';ctx.fillText(line,30,115+i*65);});
 if(playing)preview.draw(ctx);screenTexture.needsUpdate=true;
};codeDisplay();

// Meeting corner with stools and a tiny AI knowledge station.
cylinder(1.1,.14,palette.cream,3.7,1.05,1.8);cylinder(.16,1,palette.teal,3.7,.5,1.8);for(const [x,z]of[[3,3],[4.8,2.4],[3.8,.3]]){cylinder(.32,.12,palette.teal,x,.6,z);cylinder(.07,.55,palette.wood,x,.28,z);}
box(1.2,1.35,.8,palette.cream,-4.7,.75,2.8);box(1,.6,.03,palette.teal,-4.7,1,3.22);for(let i=0;i<3;i++)box(.7,.04,.04,0x8bdcd0,-4.7,.84+i*.16,3.25);
function plant(x,z){cylinder(.3,.5,palette.cream,x,.3,z);cylinder(.04,.75,palette.wood,x,.9,z);for(let i=0;i<5;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),mat(i%2?0x518872:0x739577));leaf.scale.set(.6,1.2,.45);leaf.position.set(x+Math.sin(i*2)*.25,1.18+(i%2)*.25,z+Math.cos(i*2)*.25);leaf.rotation.z=Math.sin(i)*.7;scene.add(leaf);}}plant(-5,4);plant(5.2,-3.7);
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=64;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,32,0,64,32,50);gradient.addColorStop(0,'rgba(46,60,38,.27)');gradient.addColorStop(1,'rgba(46,60,38,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,64);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
actors=keys.map((key,i)=>{const texture=new THREE.Texture(images[key]);texture.colorSpace=THREE.SRGBColorSpace;texture.minFilter=THREE.LinearFilter;texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.repeat.set(.25,1/6);images[key].decode().then(()=>texture.needsUpdate=true);const gaitTexture=new THREE.Texture(images[key+'-gait']);gaitTexture.colorSpace=THREE.SRGBColorSpace;gaitTexture.minFilter=THREE.LinearFilter;gaitTexture.magFilter=THREE.LinearFilter;gaitTexture.generateMipmaps=false;gaitTexture.repeat.set(.25,.25);images[key+'-gait'].decode().then(()=>gaitTexture.needsUpdate=true);let walkTexture=null;if(images[key+'-walk']){walkTexture=new THREE.Texture(images[key+'-walk']);walkTexture.colorSpace=THREE.SRGBColorSpace;walkTexture.minFilter=THREE.LinearFilter;walkTexture.magFilter=THREE.LinearFilter;walkTexture.generateMipmaps=false;walkTexture.repeat.set(.25,.5);walkTexture.needsUpdate=true;}const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.08,depthWrite:true,side:THREE.DoubleSide});const body=new THREE.Mesh(new THREE.PlaneGeometry(3,3),material);body.rotation.y=Math.atan2(camera.position.x,camera.position.z);scene.add(body);const shade=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.85),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shade.rotation.x=-Math.PI/2;scene.add(shade);return {key,body,shade,texture,gaitTexture,walkTexture,base:[[-2,.8],[.6,1.4],[-.3,3.3]][i]};});
function resize(){const w=$('stage').clientWidth,h=$('stage').clientHeight;if(!w||!h)return;const visualScale=$('stage').getBoundingClientRect().width/w;renderer.setPixelRatio(Math.min(3,Math.max(2,devicePixelRatio*visualScale*1.5)));renderer.setSize(w,h);const aspect=w/h,span=aspect<1?9.5/aspect:7.2;camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe($('stage'));addEventListener('resize',resize);resize();ready=true;
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;$('story').textContent='그래픽 연결이 중단되었습니다. 새로고침해 주세요.';});
}catch(e){$('stage').innerHTML='<div class="error">3D를 표시하지 못했습니다. 브라우저의 하드웨어 가속을 확인해 주세요. 아래 캐릭터 동작은 계속 확인하실 수 있습니다.</div>';}
const bubbles=keys.map((_,i)=>{const el=document.createElement('div');el.className='bubble';$('stage').appendChild(el);return el;});
const speechRelay=new SpeechRelay();let speaker=-1;
function updateSpeech(){
 const speech=speechRelay.update(office);speaker=speech.speaker;
 bubbles.forEach((el,i)=>{el.style.display=i===speaker?'block':'none';if(i===speaker&&el.textContent!==speech.text)el.textContent=speech.text;});
}
function animate(now){requestAnimationFrame(animate);const dt=Math.min(.1,(now-last)/1000);last=now;if(!paused&&!reducedMotion.matches){time+=dt*speed;office.update(dt*speed);}hudTime+=dt;if(hudTime>.2){sync();hudTime=0;}
if(ready){codeDisplay?.();updateSpeech();actors.forEach((actor,i)=>{const w=office.workers[i],cell=spriteFrame(actor.key,w.motion,w.age,w.gaitDistance);const pose=posture(w,i===speaker,speaker>=0&&i!==speaker,reducedMotion.matches);const blend=1-Math.exp(-12*(paused?0:dt));actor.facing??=w.face;actor.facing+=(w.face-actor.facing)*blend;actor.body.scale.x=(actor.facing<0?-1:1)*(.98+.02*Math.abs(actor.facing));actor.body.rotation.z=pose.lean;const viewDirection=camera.getWorldDirection(new THREE.Vector3());actor.body.scale.y=pose.breath/Math.max(.1,Math.hypot(viewDirection.x,viewDirection.z));if(cell.walk){actor.walkTexture.offset.set(cell.col*.25,1-(cell.row+1)*.5);actor.body.material.map=actor.walkTexture;}else if(cell.gait){actor.gaitTexture.offset.set(cell.col*.25,1-(cell.row+1)*.25);actor.body.material.map=actor.gaitTexture;}else{actor.texture.offset.set(cell.col*.25,1-(cell.row+1)/6);actor.body.material.map=actor.texture;}const footOffset=new THREE.Vector3(0,3*(244/256-.5)*actor.body.scale.y,0).applyQuaternion(actor.body.quaternion);actor.body.position.set(w.x,.10+pose.bob,w.z).add(footOffset);actor.shade.position.set(w.x,.092,w.z);const point=actor.body.position.clone().add(new THREE.Vector3(0,.78*actor.body.scale.y,0)).project(camera);const el=bubbles[i];el.dataset.speaker=w.key;el.style.left=`${(point.x+1)*.5*$('stage').clientWidth}px`;el.style.top=`${(1-point.y)*.5*$('stage').clientHeight-7}px`; });
if(speaker>=0){const el=bubbles[speaker],rect=el.getBoundingClientRect(),stageRect=$('stage').getBoundingClientRect(),scale=stageRect.width/$('stage').clientWidth;let lift=0;
 actors.forEach((a,j)=>{if(j===speaker)return;const head=a.body.position.clone().add(new THREE.Vector3(0,.7*a.body.scale.y,0)).project(camera);const x=stageRect.left+(head.x+1)*.5*stageRect.width,y=stageRect.top+(1-head.y)*.5*stageRect.height;if(x>rect.left-22*scale&&x<rect.right+22*scale&&y>rect.top-12*scale&&y<rect.bottom+20*scale)lift=Math.max(lift,(rect.bottom-y)/scale+22);});
 if(lift>0)el.style.top=(parseFloat(el.style.top)-Math.min(lift,35))+'px';}
renderer.render(scene,camera);}

contexts.forEach((ctx,row)=>{const key=$('character').value,cell=spriteFrame(key,row,time,time*.85),img=images[key+(cell.walk?'-walk':cell.gait?'-gait':'')];if(!img.complete||!img.naturalWidth)return;ctx.clearRect(0,0,256,256);ctx.drawImage(img,cell.col*256,cell.row*256,256,256,0,0,256,256);canvases[row].parentElement.querySelector('small').textContent=english[row]+' · '+cell.frames+' FRAMES';});}
requestAnimationFrame(animate);sync();
window.spriteInspect=()=>({renderedSprites:actors.map(a=>{const project=(x,y)=>a.body.localToWorld(new THREE.Vector3(x,y,0)).project(camera);const l=project(-1.5,0),r=project(1.5,0),b=project(0,-1.5),t=project(0,1.5);return {key:a.key,activeAtlas:a.body.material.map===a.texture?'base':a.body.material.map===a.walkTexture?'walk':'gait',activeTile:{x:a.body.material.map.offset.x,y:a.body.material.map.offset.y},gaitTile:{x:a.gaitTexture.offset.x,y:a.gaitTexture.offset.y},screenAspect:Math.abs((r.x-l.x)*$('stage').clientWidth/((t.y-b.y)*$('stage').clientHeight)),footY:a.body.localToWorld(new THREE.Vector3(0,3*(.5-244/256),0)).y};}),ready,characters:keys.length,frames:96,gaitFrames:{'employee-a':8,'employee-b':8,ai:8},paused,preview:preview.snapshot(),reducedMotion:reducedMotion.matches,...office.snapshot(),embedded:Object.values(window.SPRITE_ASSETS).every(x=>x.startsWith('data:image/png;base64,')),loaded:Object.entries(images).every(([key,x])=>x.complete&&x.naturalWidth===1024)});

} main().catch(error=>{console.error(error);document.getElementById('story').textContent='이미지를 불러오지 못했습니다. 새로고침해 주세요.';});
