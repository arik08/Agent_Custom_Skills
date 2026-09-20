import {Office as Navigation,route} from './coding-navigation.mjs';
export const stageLabels=['요청','코드 수정','실행','결과 확인','개선','완료'];
export const phases=[
 {label:'만들 것을 요청',lines:['PERSON → AGENT','테트리스를 만들어줘'],activities:['테트리스를 만들어줘','원하는 화면 설명','요구사항 확인'],motions:[4,4,0]},
 {label:'프로젝트 파일 수정',lines:['game.js  +24 -3','function moveBlock() {','  updateBoard();','}'],activities:['게임 규칙 설명','화면 구성 확인','game.js 코드 작성'],motions:[0,0,3]},
 {label:'실행하고 오류 확인',lines:['TERMINAL','$ npm run test','✓ movement  ✓ rotation','preview ready'],activities:['실행 결과 기다리기','게임 조작해 보기','터미널 실행 · 테스트'],motions:[0,3,3]},
 {label:'사람이 결과 확인',lines:['BROWSER PREVIEW','SCORE  120','←  ↓  →     ROTATE'],activities:['게임을 직접 해보기','블록이 너무 빨라요','수정할 부분 확인'],motions:[3,4,0]},
 {label:'피드백으로 다시 수정',lines:['game.js  DIFF','- dropMs = 150','+ dropMs = 500','✓ test passed'],activities:['속도를 낮춰줘','다시 조작해 보기','속도 수정 · 재실행'],motions:[4,3,3]},
 {label:'확인한 결과 완성',lines:['PREVIEW UPDATED','SCORE  240','✓ 사람이 동작 확인'],activities:['이제 즐기기 좋아요','동작 확인 완료','수정 파일 정리'],motions:[5,5,5]}
];
const requests=[['테트리스 조작','블록 이동을 만들어줘','회전할 때 벽을 넘어요'],['게임 속도','속도를 조절하고 싶어요','처음부터 너무 빨라요'],['점수판','점수를 크게 보여줘','숫자가 잘 안 보여요'],['다음 블록','다음 블록도 보여줘','미리보기가 잘려요']];
export class Office extends Navigation {
 constructor(seed=19){super(seed);this.phase=1;this.reworks=0;this.history=[];this.nextArrival=12;}
 enqueue(type=this.serial%requests.length,stage=0){if(this.jobs.length>=5)return false;const spec=requests[type%requests.length];const job={id:++this.serial,type,title:spec[0],request:spec[1],feedback:spec[2],stage,round:0,owner:null};this.jobs.push(job);return true;}
 step(at,motion,label,min=2,max=min+2,screen){return {...super.step(at,motion,label,min,max),screen};}
 choose(w){const allowed=w.role===0?[3,0]:w.role===1?[2]:[1,4];const job=allowed.flatMap(stage=>this.jobs.filter(j=>j.stage===stage&&j.owner===null))[0];
 if(job){job.owner=w.key;w.job=job.id;
 if(w.role===0&&job.stage===0)w.plan=[this.step('planner',3,'만들 기능 정리',1.6,3.4),this.step('inbox',4,job.request,2.3,3.8)];
 else if(w.role===2&&job.stage===1)w.plan=[this.step('hub',3,job.round?'피드백 · 코드 위치 확인':'프로젝트 파일 읽기',2,3.5,1),this.step('planner',3,job.round?'원인 찾고 코드 수정':'코드 작성 · 파일 저장',3,5,job.round?4:1),this.step('hub',3,'터미널에서 테스트',2,3.8,2),...(job.id%3===0&&job.round===0?[this.step('planner',3,'테스트 실패 · 원인 수정',2,3.2,4),this.step('hub',3,'수정 후 다시 테스트',1.5,2.5,2)]:[]),this.step('inbox',4,'실행 화면 확인해 주세요',1.7,2.7,3)];
 else if(w.role===1)w.plan=[this.step('analyst',3,'게임 직접 조작하기',2.5,4.5),this.step('meeting',3,'다른 입력도 확인',1.7,3),this.step('inbox',4,job.round===0?job.feedback:'수정한 동작 확인했어요',2,3.2)];
 else if(w.role===0)w.plan=[this.step('analyst',3,'요청한 기능과 비교',2.4,4),this.step('meeting',5,'좋아요, 이 버전으로!',1.7,2.8)];
 else w.plan=[this.step('planner',3,'변경 파일 · 결과 정리',2,3.7,5),this.step('inbox',4,'완료 · 다음 요청 받을게요',1.3,2.4,5)];
 }else{w.job=null;const options=w.role===2?[
 ['hub',3,'다음 수정 위치 살펴보기'],['planner',3,'코드 구조 확인'],['inbox',0,'새 요청 확인']]:w.role===1?[
 ['analyst',3,'다른 조작도 해보기'],['frontR',0,'불편한 점 생각하기'],['meeting',3,'확인할 입력 정리']]:[
 ['library',3,'아이디어 메모 살펴보기'],['frontL',0,'다음 기능 생각하기'],['meeting',3,'화면 구성 구상']];
 const choice=options[Math.floor(this.random()*options.length)];w.plan=[this.step(...choice,1.3,3.2)];}
 this.advance(w);}
 advance(w){w.task=w.plan.shift();if(!w.task){const job=this.jobs.find(j=>j.id===w.job);if(job)this.finish(w,job);w.job=null;this.choose(w);return;}w.path=route(w.node,w.task.at);w.remaining=w.task.duration;w.age=0;this.describe(w);}
 finish(w,j){const old=j.stage;if(old===0&&w.role===0)j.stage=1;
 else if(old===1&&w.role===2)j.stage=2;
 else if(old===2&&w.role===1){if(j.round===0){j.round++;j.stage=1;this.reworks=(this.reworks||0)+1;}else j.stage=3;}
 else if(old===3&&w.role===0)j.stage=4;
 else if(old===4&&w.role===2){j.stage=5;this.finished++;this.history??=[];this.history.unshift({...j});this.history.length=Math.min(this.history.length,8);this.jobs=this.jobs.filter(x=>x!==j);}
 else throw Error('Invalid coding handoff '+old+':'+w.role);
 j.owner=null;this.handoff={from:w.key,stage:j.stage,job:j.id,time:this.time};this.log(j.title+' → '+stageLabels[Math.min(j.stage,5)]);}
 describe(w){if(w.path.length){w.motion=1;w.activity=w.task.motion===4?(w.role===2?'실행 결과 보여주러 가기':w.role===1?'AI에게 피드백 전달':'요청 이야기하러 가기'):w.task.at==='hub'?'터미널 확인하러 가기':w.task.at==='analyst'?'실행 화면 보러 가기':w.task.at==='planner'?'코드 작업대로 이동':w.task.label;}else{w.motion=w.task.motion;w.activity=w.task.label;if(w.role===2&&w.task.screen!==undefined)this.phase=w.task.screen;}}
 snapshot(){return {...super.snapshot(),phase:this.phase,phaseLabel:phases[this.phase]?.label,reworks:this.reworks,history:this.history.map(j=>({...j})),handoff:this.handoff};}
}
