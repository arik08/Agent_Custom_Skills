// Local, offline simulation. Each worker owns a plan, route, clock and animation.
export const nodes={aisleL:[-3.7,-.45],planner:[-2,-.45],aisle:[0,-.45],analyst:[2,-.45],library:[-4.5,-2.55],left:[-3.7,1.3],middle:[-1,1.3],right:[1.7,1.3],meeting:[1.9,2.3],hub:[-2.8,2.5],frontL:[-2,3.5],front:[0,3.5],frontR:[1.7,3.5],inbox:[.3,1.3]};
const edges=[['library','aisleL'],['aisleL','planner'],['planner','aisle'],['aisle','analyst'],['aisleL','left'],['left','middle'],['middle','inbox'],['inbox','right'],['right','meeting'],['aisle','inbox'],['left','hub'],['hub','frontL'],['frontL','front'],['front','frontR'],['frontR','meeting'],['middle','frontL'],['right','analyst']];
export function route(from,to){const distance=Object.fromEntries(Object.keys(nodes).map(n=>[n,Infinity])),prev={},todo=new Set(Object.keys(nodes));distance[from]=0;while(todo.size){const current=[...todo].reduce((a,b)=>distance[a]<distance[b]?a:b);todo.delete(current);if(current===to)break;for(const [a,b]of edges){const next=a===current?b:b===current?a:null;if(!next||!todo.has(next))continue;const d=distance[current]+Math.hypot(nodes[current][0]-nodes[next][0],nodes[current][1]-nodes[next][1]);if(d<distance[next]){distance[next]=d;prev[next]=current;}}}if(!Number.isFinite(distance[to]))throw Error('Unreachable station');const path=[];for(let n=to;n!==from;n=prev[n])path.unshift(n);return path;}
const jobs=['월간 실적 전망','원료비 변동 검토','설비 이상 영향','고객 수요 변화','투자안 사전 검토','탄소 지표 점검'];
const titles=['기획 동료','분석 동료','AI 동료'];
export class Office {
 constructor(seed=19){this.seed=seed;this.time=0;this.serial=0;this.finished=0;this.nextArrival=17;this.logs=[];this.jobs=[];this.locks={};this.workers=['employee-a','employee-b','ai'].map((key,i)=>({key,name:titles[i],role:i,node:['planner','analyst','hub'][i],x:nodes[['planner','analyst','hub'][i]][0],z:nodes[['planner','analyst','hub'][i]][1],motion:0,gaitDistance:0,age:i*.23,remaining:0,speed:[.83,.94,1.12][i],face:1,plan:[],path:[],task:null,activity:'준비 중',job:null}));this.enqueue(0,2);this.enqueue(1,1);this.enqueue(2,0);this.workers.forEach(w=>this.choose(w));}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
 log(text){this.logs.unshift({time:this.time,text});this.logs.length=Math.min(6,this.logs.length);}
 enqueue(type=this.serial%jobs.length,stage=0){if(this.jobs.length>=7)return false;const job={id:++this.serial,title:jobs[type],stage,owner:null,created:this.time};this.jobs.push(job);this.log(`${job.title} · ${stage===0?'자료 수집 요청':stage===1?'자료 수집 완료':'분석 완료'}`);return true;}
 step(at,motion,label,min=2,max=min+2){return {at,motion,label,duration:min+this.random()*(max-min)};}
 choose(w){const targetStage=2-w.role;const job=this.jobs.find(j=>j.stage===targetStage&&j.owner===null);if(job){job.owner=w.key;w.job=job.id;
 if(w.role===2)w.plan=[this.step('library',3,'자료 찾는 중',2,4),this.step('hub',3,'유사 사례 검색',4,7),this.step('inbox',4,'분석 자료 전달',1.5,2.5)];
 else if(w.role===1)w.plan=[this.step('inbox',0,'자료 받는 중',1,2),this.step('analyst',3,'영향 분석 중',5,9),this.step('aisle',4,'분석 결과 보고',2,4)];
 else w.plan=[this.step('planner',3,'대안 검토 중',4,6),this.step('meeting',4,'중요 판단 정리',3,5),this.step('meeting',5,'검토 완료',1.4,2)];
 this.log(`${w.name} · ${job.title} 담당`);
 }else{w.job=null;const choices=w.role===2?['hub','library','front']:w.role===1?['analyst','library','frontL']:['planner','meeting','front'];const at=choices[Math.floor(this.random()*choices.length)];w.plan=[this.step(at,at.startsWith('front')?0:3,at.startsWith('front')?'잠깐 생각 정리':w.role===2?'지식 정리 중':'다음 업무 준비',2,5)];}
 w.plan.forEach((task,index)=>task.carry=w.job!==null&&index>0);this.advance(w);}
 advance(w){w.task=w.plan.shift();if(!w.task){if(w.job!==null){const job=this.jobs.find(j=>j.id===w.job);if(job){job.stage++;job.owner=null;if(job.stage===3){this.finished++;this.jobs=this.jobs.filter(j=>j!==job);this.log(`${job.title} · 검토 완료`);}else this.log(`${job.title} · ${job.stage===1?'분석 담당에게 전달':'기획 담당에게 전달'}`);}}w.job=null;this.choose(w);return;}w.path=route(w.node,w.task.at);w.remaining=w.task.duration;w.age=0;this.describe(w);}
 describe(w){if(w.path.length){w.motion=w.task.carry?2:1;w.activity=w.motion===2?'자료 전달하러 이동':'업무 장소로 이동';}else{w.motion=w.task.motion;w.activity=w.task.label;}}
 update(dt){if(!Number.isFinite(dt)||dt<0)return;while(dt>0){const d=Math.min(dt,.05);dt-=d;this.time+=d;if(this.time>=this.nextArrival){this.enqueue();this.nextArrival=this.time+17+this.random()*10;}
 for(const w of this.workers){w.age+=d;if(w.path.length){const dest=w.path[0],end=nodes[dest],edge=[w.node,dest].sort().join('|');if(this.locks[edge]&&this.locks[edge]!==w.key){w.motion=0;w.activity='동료가 지나가길 기다리는 중';continue;}this.locks[edge]=w.key;const dx=end[0]-w.x,dz=end[1]-w.z,len=Math.hypot(dx,dz),step=w.speed*d;w.gaitDistance+=Math.min(len,step);this.describe(w);if(Math.abs(dx-dz*.72)>.01)w.face=dx-dz*.72>0?1:-1;if(len<=step){w.x=end[0];w.z=end[1];w.node=dest;w.path.shift();delete this.locks[edge];w.age=0;this.describe(w);}else{w.x+=dx/len*step;w.z+=dz/len*step;}}
 else{w.remaining-=d;if(w.remaining<=0)this.advance(w);}}
 }}
 snapshot(){return {time:this.time,finished:this.finished,pending:this.jobs.length,jobs:this.jobs.map(j=>({...j})),workers:this.workers.map(w=>({key:w.key,x:w.x,z:w.z,motion:w.motion,gaitDistance:w.gaitDistance,activity:w.activity,job:w.job,remaining:w.remaining}))};}
}
