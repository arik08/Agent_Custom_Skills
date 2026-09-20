import {Office as BaseOffice, route} from './autonomy.js';
export const stageLabels=['사람 · 과제 정의','AI · 초안·계산','사람 · 맥락 검토','사람 · 최종 판단','AI · 기록·실행'];
const titles=['기획 담당 · 사람','검토 담당 · 사람','AI 업무 파트너'];
export class Office extends BaseOffice {
 constructor(seed=19){super(seed);this.decisions=0;this.drafts=0;this.reworks=0;this.history=[];this.handoff=null;this.nextArrival=24;this.workers.forEach((w,i)=>w.name=titles[i]);}
 enqueue(type=this.serial%6,stage=0){const result=super.enqueue(type,stage);if(result){const job=this.jobs.at(-1);Object.assign(job,{type,round:0,brief:stage>0?'영향·대안 비교, 근거 확인':'',draft:stage>1?'기초 자료 대조 · 3개 대안 초안':'',request:'',reviewed:false,decision:null,artifact:stageLabels[stage]});job.brief=stage>0?'영향·대안 비교, 근거 확인':'';job.draft=stage>1?'기초 자료 대조 · 3개 대안 초안':'';this.logs[0].text=`${job.title} · ${stageLabels[stage]}`;}return result;}
 choose(w){const allowed=w.role===0?[3,0]:w.role===1?[2]:[4,1];const job=allowed.flatMap(stage=>this.jobs.filter(j=>j.stage===stage&&j.owner===null))[0];if(job){job.owner=w.key;w.job=job.id;
 if(w.role===2&&job.stage===4)w.plan=[this.step('hub',3,job.decision==='보류'?'보류 사유·재검토 조건 기록':'선택된 안의 실행계획 작성',2,4),this.step('hub',5,'결정·근거 지식에 반영',1.5,2.5)];
 else if(w.role===2)w.plan=[this.step('hub',3,job.round?'요청 조건으로 다시 계산':'자료 수집·출처 대조',3,5),this.step('hub',3,job.round?'추가 근거·민감도 비교':'계산·대안 3개 초안',4,6),this.step('inbox',4,'근거와 불확실성 전달',1.5,2.5)];
 else if(w.role===1)w.plan=[this.step('inbox',0,'AI 초안 받는 중',1,2),this.step('analyst',3,'현장 맥락·가정 검토',4,6),this.step('aisle',4,job.type%2===0&&job.round===0?'AI에 누락 조건 보완 요청':'판단할 쟁점·추천안 정리',2,3)];
 else if(job.stage===0)w.plan=[this.step('planner',3,'무엇을 판단할지 정의',2,4),this.step('aisle',4,'AI에 목표·제약 전달',2,3)];
 else w.plan=[this.step('planner',3,'손익·위험·우선순위 비교',3,5),this.step('meeting',4,'책임지고 대안 선택',3,4),this.step('meeting',5,job.type===2?'추가 현장 확인까지 보류':'선택안 승인',1.5,2.5)];
 this.log(`${titles[w.role]} · ${job.title}`);
 }else{w.job=null;const choices=w.role===2?['hub','library']:w.role===1?['analyst','frontL']:['planner','meeting','front'];const at=choices[Math.floor(this.random()*choices.length)];w.plan=[this.step(at,at.startsWith('front')?0:3,at.startsWith('front')?'잠깐 생각 정리':w.role===2?'중복 자료·지식 정리':'다음 판단 준비',2,4)];}
 w.plan.forEach((task,index)=>task.carry=w.role!==2&&w.job!==null&&index>0);this.advance(w);}
 finish(w,job){const old=job.stage;let target=null,label='';
 if(old===0&&w.role===0){job.brief='영향·대안 비교, 제약과 근거 확인';job.stage=1;target='ai';label='목표·제약 위임';}
 else if(old===1&&w.role===2){job.draft=job.round?'추가 조건 반영 · 민감도 비교표':'출처 대조 · 계산 결과 · 대안 3개';job.stage=2;this.drafts++;target='employee-b';label=job.round?'추가 분석 회신':'AI 초안·근거 전달';}
 else if(old===2&&w.role===1){if(job.type%2===0&&job.round===0){job.round++;job.request=job.type===2?'정비 이력과 현장 확인 조건도 비교해 주세요':'수요가 10% 낮아지는 경우도 비교해 주세요';job.stage=1;this.reworks++;target='ai';label='사람이 추가 분석 요청';}else{job.reviewed=true;job.stage=3;target='employee-a';label='맥락 검토·추천안 전달';}}
 else if(old===3&&w.role===0&&job.reviewed){job.decision=job.type===2?'보류':'승인';job.stage=4;this.decisions++;target='ai';label=`사람이 ${job.decision} 결정`;}
 else if(old===4&&w.role===2&&job.decision){this.finished++;job.stage=5;this.history.unshift({...job,owner:null});this.history.length=Math.min(6,this.history.length);this.jobs=this.jobs.filter(j=>j!==job);label=job.decision==='보류'?'보류 조건·재검토 근거 기록':'승인된 안의 실행계획·근거 기록';}
 else throw Error(`Invalid role transition ${old}:${w.role}`);
 job.owner=null;job.artifact=label;if(job.stage===5&&this.history[0]?.id===job.id)this.history[0].artifact=label;this.log(`${job.title} · ${label}`);if(target)this.handoff={from:w.key,to:target,label,time:this.time};}
 advance(w){w.task=w.plan.shift();if(!w.task){const job=this.jobs.find(j=>j.id===w.job);if(job)this.finish(w,job);w.job=null;this.choose(w);return;}w.path=route(w.node,w.task.at);w.remaining=w.task.duration;w.age=0;this.describe(w);}
 describe(w){if(w.path.length){w.motion=w.task.carry?2:1;w.activity=w.role===2?(w.task.at==='inbox'?'담당자에게 결과 전달':'데이터 스테이션으로 이동'):w.task.carry?'검토 의견 전달하러 이동':'업무 장소로 이동';}else{w.motion=w.task.motion;w.activity=w.task.label;}}
 snapshot(){return {...super.snapshot(),decisions:this.decisions,drafts:this.drafts,reworks:this.reworks,history:this.history.map(j=>({...j}))};}
}
