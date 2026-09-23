import {nodes,route} from './coding-navigation.mjs';
export const stageLabels=['요청','코드 수정','실행','결과 확인','개선','완료'];
export const phases=[
 {label:'만들 것을 요청',lines:['PERSON → AGENT','테트리스를 만들어줘']},
 {label:'프로젝트 파일 수정',lines:['game.js  +24 -3','function moveBlock() {','  updateBoard();','}']},
 {label:'실행하고 오류 확인',lines:['TERMINAL','$ npm run test','movement / rotation','running...']},
 {label:'사람이 결과 확인',lines:['BROWSER PREVIEW','SCORE  120','←  ↓  →     ROTATE']},
 {label:'피드백으로 다시 수정',lines:['game.js  DIFF','- dropMs = 150','+ dropMs = 500','saved / retest']},
 {label:'확인한 결과 완성',lines:['PREVIEW UPDATED','SCORE  240','✓ 사람이 동작 확인']}
];
// One shared task. Arrival and task state gate every authored turn.
const move=(id,actor,to,phase,companions=[])=>({id,actor,to,phase,companions,duration:.3});
const say=(id,speaker,text,phase,extra={})=>({id,speaker,text,phase,duration:Math.max(2.8,text.length*.13),...extra});
const work=(id,actor,duration,phase,extra={})=>({id,actor,duration,phase,...extra});
export const beats=[
 move('gather-planner',0,'frontL',0),move('gather-tester',1,'right',0),move('gather-agent',2,'inbox',0),
 say('request',0,'방향키로 움직이는 테트리스를 만들어 줘.',0),
 say('clarify',2,'처음 하는 사람도 쉽게 즐길 수 있도록 만들까요?',0),
 say('criteria',0,'응. 블록 이동과 속도를 직접 확인할게.',0,{effect:o=>o.task.requested=true}),
 say('accept',2,'먼저 만들고, 실행해서 보여 드릴게요.',0),
 move('to-code',2,'planner',1,[{actor:0,to:'aisleL'},{actor:1,to:'meeting'}]),
 work('implement',2,4,1,{guard:o=>o.task.requested,effect:o=>o.task.built=true}),
 work('test',2,2.6,2,{guard:o=>o.task.built,effect:o=>o.task.tested=true}),
 move('return-preview',2,'inbox',3,[{actor:0,to:'frontL'},{actor:1,to:'right'}]),
 say('handoff',2,'이동·회전 테스트는 통과했어요. 해 보실래요?',3,{guard:o=>o.task.tested}),
 move('to-preview',1,'analyst',3),
 work('try-game',1,3.8,3,{effect:o=>{o.task.tooFast=o.task.dropMs<400;o.task.accepted=!o.task.tooFast&&o.task.tested;}}),
 move('return-feedback',1,'right',3),
 say('feedback',1,'블록은 움직이는데, 내려오는 게 너무 빨라요.',3,{guard:o=>o.task.tooFast}),
 say('propose',2,'간격을 0.15초에서 0.5초로 늘릴까요?',4),
 say('approve-change',0,'좋아. 속도를 낮추고 다시 실행해 줘.',4,{effect:o=>o.task.changeApproved=true}),
 move('to-fix',2,'planner',4,[{actor:0,to:'aisleL'},{actor:1,to:'meeting'}]),
 work('fix',2,3.5,4,{guard:o=>o.task.changeApproved,effect:o=>{o.task.dropMs=500;o.task.revised=true;o.reworks++;}}),
 work('retest',2,2.4,2,{guard:o=>o.task.revised,effect:o=>o.task.retested=true}),
 move('return-revised',2,'inbox',4,[{actor:0,to:'frontL'},{actor:1,to:'right'}]),
 say('revised-handoff',2,'속도를 낮췄어요. 다시 해 보시겠어요?',4,{guard:o=>o.task.retested}),
 move('to-recheck',1,'analyst',3,[{actor:0,to:'planner',via:'aisleL'}]),
 work('recheck',1,3.8,3,{effect:o=>o.task.accepted=o.task.dropMs>=400&&o.task.retested}),
 move('return-verdict',1,'right',3,[{actor:0,to:'frontL',via:'aisleL'}]),
 say('verdict',1,'이제 따라갈 만해요. 이동과 회전도 잘돼요.',3,{guard:o=>o.task.accepted}),
 say('signoff',0,'좋아, 직접 확인했으니 이 버전으로 하자.',5),
 say('complete',2,'확인한 버전으로 저장했어요!',5,{effect:o=>{o.finished++;o.history.unshift({...o.task});o.history.length=Math.min(8,o.history.length);}}),
 work('settle',-1,4,5)
];
export class Office {
 constructor({dropMs=150}={}){
  this.initialDropMs=Number.isFinite(dropMs)&&dropMs>0?dropMs:150;
  this.time=0;this.phase=0;this.finished=0;this.reworks=0;this.history=[];this.serial=0;this.queued=0;
  this.workers=['employee-a','employee-b','ai'].map((key,i)=>({key,role:i,node:['front','analyst','inbox'][i],x:nodes[['front','analyst','inbox'][i]][0],z:nodes[['front','analyst','inbox'][i]][1],motion:0,gaitDistance:0,age:0,speed:[1.05,1.08,1.15][i],velocity:0,face:1,path:[],activity:'대화 준비',job:1}));
  this.start();
 }
 start(){this.task={id:++this.serial,title:'처음 하는 사람을 위한 테트리스',dropMs:this.initialDropMs,requested:false,built:false,tested:false,revised:false,retested:false,accepted:false};this.enter(0);}
 enqueue(){if(this.queued>=4)return false;this.queued++;return true;}
 enter(index){
  this.index=index;this.beat=beats[index];this.elapsed=0;this.phase=this.beat.phase;
  this.workers.forEach(w=>{w.motion=0;w.age=0;w.activity='동료의 작업 지켜보기';w.job=this.task.id;});
  if(this.beat.to)for(const move of [this.beat,...this.beat.companions]){const w=this.workers[move.actor];w.path=move.via?[...route(w.node,move.via),...route(move.via,move.to)]:route(w.node,move.to);}
 }
 get speech(){const b=this.beat;return b.speaker!==undefined&&this.elapsed>=.3&&this.elapsed<b.duration+.3?{speaker:b.speaker,text:b.text,turn:b.id}:{speaker:-1,text:'',turn:b.id};}
 update(dt){if(!Number.isFinite(dt)||dt<=0)return;while(dt>1e-9){const d=Math.min(dt,.05);dt-=d;this.tick(d);}}
 tick(dt){
  this.time+=dt;const b=this.beat;this.workers.forEach(w=>w.age+=dt);
  const moving=this.workers.filter(w=>w.path.length);
  for(const w of moving){const end=nodes[w.path[0]],dx=end[0]-w.x,dz=end[1]-w.z,len=Math.hypot(dx,dz);
   // Ease into a walk, brake before the final mark, and slow down at corners.
   const next=w.path[1]&&nodes[w.path[1]],corner=next?Math.max(.35,(dx*(next[0]-end[0])+dz*(next[1]-end[1]))/(Math.max(.001,len)*Math.hypot(next[0]-end[0],next[1]-end[1]))):0;
   const targetSpeed=Math.min(w.speed,Math.sqrt(2*1.8*len)+(next?w.speed*corner:0));
   w.velocity+=Math.max(-2.5*dt,Math.min(2*dt,targetSpeed-w.velocity));
   const step=Math.min(len,w.velocity*dt);w.motion=1;w.activity='작업 장소로 이동';w.gaitDistance+=step;
   if(Math.abs(dx-dz*.72)>.01)w.face=dx-dz*.72>0?1:-1;
   if(len<=Math.max(step,.002)){w.x=end[0];w.z=end[1];w.node=w.path.shift();w.age=0;if(!w.path.length){w.motion=0;w.velocity=0;}}else{w.x+=dx/len*step;w.z+=dz/len*step;}
  }
  if(moving.length){this.workers.filter(w=>!w.path.length).forEach(w=>{w.motion=(this.phase===1||this.phase===4)?3:0;w.activity=w.motion===3?'화면과 메모 확인':'동료 기다리기';});return;}
  if(b.guard&&!b.guard(this))return;
  this.elapsed+=dt;
  const speaker=this.speech.speaker;
  this.workers.forEach((w,i)=>{
   w.motion=i===speaker?4:b.actor===i&&!b.to?3:b.id==='settle'?5:speaker<0&&['implement','test','fix','retest','recheck'].includes(b.id)&&i<2?3:0;
   w.activity=i===speaker?b.text:w.motion===3?'작업 중':'경청';
   const target=w.motion===3?{x:w.x,z:w.z-2}:speaker>=0&&speaker!==i?this.workers[speaker]:speaker===i?this.workers[i===2?1:2]:b.actor>=0&&b.actor!==i?this.workers[b.actor]:null;
   if(target){const dx=target.x-w.x,dz=target.z-w.z;if(Math.abs(dx-dz*.72)>.05)w.face=dx-dz*.72>0?1:-1;}
  });
  if(this.elapsed>=b.duration+(b.speaker!==undefined?.65:0)){
   b.effect?.(this);
   if(this.index===beats.length-1){if(this.queued)this.queued--;this.start();}
   else if(b.id==='return-feedback'&&!this.task.tooFast)this.enter(beats.findIndex(x=>x.id==='verdict'));
   else if(b.id==='return-verdict'&&!this.task.accepted)this.enter(beats.findIndex(x=>x.id==='feedback'));
   else this.enter(this.index+1);
  }
 }
 snapshot(){return {time:this.time,finished:this.finished,pending:1+this.queued,phase:this.phase,phaseLabel:phases[this.phase].label,beat:this.beat.id,elapsed:this.elapsed,speech:this.speech,task:{...this.task},reworks:this.reworks,history:this.history.map(j=>({...j})),workers:this.workers.map(w=>({...w,path:[...w.path]}))};}
}
