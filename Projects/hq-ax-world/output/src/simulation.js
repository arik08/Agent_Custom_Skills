export const buildings = [
 ['STRATEGY TOWER','경영기획그룹',0,-5,9,'strategy','경영계획 · KPI · Forecast'],
 ['GREEN CONTROL','지속가능경영그룹',-9,-9,3,'strategy','Sustainability · Carbon · ESG'],
 ['INVESTMENT LAB','투자관리그룹',-10,-2,4,'strategy','투자 심의 · 경제성 · CAPEX'],
 ['BUSINESS CONTROL','사업관리그룹',-8,6,5,'strategy','법인 실적 · Risk · Portfolio'],
 ['FINANCIAL PLANNING','재무기획그룹',7,-10,5,'finance','재무계획 · Forecast · 재무구조'],
 ['TREASURY CENTER','자금그룹',13,-7,4,'finance','Cash · Financing · Liquidity'],
 ['COST ENGINE','회계원가그룹',8,-3,3,'finance','Accounting · Closing · Profitability'],
 ['TAX OFFICE','세무그룹',14,0,3,'finance','Tax · Global Tax · 세무 Risk'],
 ['CONTROL GATE','내부회계관리섹션',7,4,3,'finance','Validation · Internal Control'],
 ['PosPLOT LAB','PosPLOT고도화TF팀',14,6,4,'finance','Planning Platform · Data'],
 ['OPERATION & SAFETY','조업안전기술섹션',-12,12,3,'gas','설비 Monitoring · 안전 · 기술지원'],
 ['BUSINESS DEVELOPMENT','사업개발그룹',-5,12,3,'gas','신규 사업 · Project · 사업성'],
 ['MARKETING & SALES','마케팅그룹',2,11,3,'gas','고객 · 수요 · 계약 · 판매'],
 ['POHANG GAS PLANT','포항생산부',-10,20,4,'gas','산소 · 질소 · 아르곤 생산'],
 ['GWANGYANG GAS PLANT','광양생산부',1,20,4,'gas','생산량 Balance · 공급 안정성'],
 ['AX CORE','경영기획DX추진TF팀',0,3,5,'ax','AI · Knowledge · Analytics · 업무 연결']
].map(([name,group,x,z,height,district,role],id)=>({id,name,group,x,z,height,district,role}));
const raw = [
 ['광양 설비 이상징후','Equipment anomaly detected',[14,10,15,12,6,3,0],'생산 재배분 · 광양 −8% / 포항 +6%',-12,-3,'balance'],
 ['신규 해외 투자 기회','New overseas investment opportunity',[11,2,4,5,7,1,15,0],'고효율 산업가스 플랜트 투자 승인',-8,12,'build'],
 ['탄소 비용 +23%','Carbon cost increase',[1,15,6,3,0],'저탄소 제품 Mix 최적화',-18,-4,'green'],
 ['철광석 가격 급등','Iron ore price surge',[3,15,6,4,0],'원료 조달 시나리오 전환',-20,-7,'cost'],
 ['원료탄 가격 급등','Coking coal price surge',[3,6,15,5,0],'장기 계약 물량 재배분',-16,-6,'cost'],
 ['원/달러 환율 충격','KRW/USD exchange rate shock',[5,15,4,7,0],'통화별 현금흐름 매칭',-14,-4,'cash'],
 ['중국 철강 수출가 하락','China steel export price drop',[12,3,15,6,0],'고부가 제품 판매 확대',-15,-5,'cost'],
 ['자동차 강판 수요 증가','Automotive steel demand increase',[12,3,15,4,0],'고객 공급계획 확대',4,16,'demand'],
 ['글로벌 철강 수요 둔화','Global steel demand slowdown',[12,3,6,15,0],'수익성 중심 운영계획',-22,-9,'cost'],
 ['투자 프로젝트 원가 초과','Investment project cost overrun',[2,6,4,15,0],'투자 단계별 집행 재조정',-13,-5,'capex'],
 ['해외 법인 이익 감소','Subsidiary profit deterioration',[3,6,4,15,0],'법인 개선과제 실행',-17,-6,'cost'],
 ['포항 설비 경고','Pohang gas equipment warning',[13,10,15,14,6,0],'예방정비 · 광양 대체 생산',-10,-2,'reverse'],
 ['산업가스 수요 급증','Industrial gas demand surge',[12,11,13,14,15,0],'양 생산부 가동률 상향',3,13,'demand'],
 ['대형 고객 계약 기회','Major customer contract opportunity',[12,11,7,5,15,0],'장기 공급 계약 조건 승인',5,19,'demand'],
 ['물류 공급 차질','Logistics disruption',[12,10,3,15,0],'대체 운송 경로 가동',-9,-3,'cost'],
 ['자금 조달 비용 상승','Financing cost increase',[5,4,15,0],'자금 조달 만기 분산',-11,-4,'cash'],
 ['글로벌 세무 Risk 탐지','Tax risk detection',[7,8,15,5,0],'거래 증빙 검증 및 재검토',-8,-1,'tax'],
 ['분기 Closing 시즌','Closing season',[6,8,9,4,15,0],'결산 검증 완료 · 야근 불빛 OFF',-4,2,'closing'],
 ['AI 자동화 기회 발견','New AI automation opportunity',[9,15,8,6,0],'반복 보고 업무 자동화',0,7,'ai'],
 ['생산성 개선 감지','Unexpected productivity improvement',[13,14,10,15,3,0],'최적 조업 패턴 공유',2,11,'demand']
];
export const events=raw.map(([title,subtitle,route,action,before,after,type],id)=>({id,title,subtitle,route,action,before,after,type}));
export const stages=['DETECTION','COLLABORATION','ANALYSIS','DECISION','ACTION','KPI IMPACT','FEEDBACK'];
export class Simulation {
 constructor(){this.time=0;this.index=0;this.age=0;this.stage=0;this.applied=false;this.completed=0;this.projects=0;this.production=[86,89];this.kpi={performance:78.4,ebit:1240,cash:860,capex:320,esg:82,gas:94,tasks:1284};this.logs=[];this.enter();}
 get event(){return events[this.index];}
 enter(){this.lastAgent=-1;this.log('SIGNAL',this.event.subtitle);}
 log(who,message){this.logs.unshift({time:this.time,who,message});this.logs.length=Math.min(7,this.logs.length);}
 next(id=(this.index+1)%events.length){this.index=id;this.age=0;this.stage=0;this.applied=false;this.enter();}
 update(dt){if(!Number.isFinite(dt)||dt<0)return;while(dt>0){const step=Math.min(dt,.5);dt-=step;this.time+=step;this.age+=step;const s=Math.min(6,Math.floor(this.age/4));if(s!==this.stage){this.stage=s;this.kpi.tasks+=this.event.route.length*3;this.log(stages[s],this.message());}const agent=Math.min(this.event.route.length-1,Math.floor(this.age/12*this.event.route.length));if(agent!==this.lastAgent&&this.age<16){this.lastAgent=agent;const b=buildings[this.event.route[agent]];this.log(b.group,b.id===15?'유사 사례 검색 · 전문 조직에 데이터 연결':b.id===0?'영향 분석 수신 · 경영진 판단 준비':b.role+' 분석 중');}if(this.stage>=4&&!this.applied)this.apply();if(this.age>=32){this.completed++;this.next();}}}
 message(){return [this.event.subtitle,'전문 조직 Agent 협업 · AX 데이터 연결','유사 사례 1,284건 검색 · 영향 시뮬레이션','경영진 판단 단계 · 교육용 자동 승인',this.event.action,'예상 EBIT 영향 반영 · 실행 결과 관측','결과를 지식으로 환류 · 다음 대응에 활용'][this.stage];}
 apply(){this.applied=true;const e=this.event,k=this.kpi;k.ebit+=e.after;k.performance=Math.max(45,Math.min(99,k.performance+(e.after-e.before)*.025));k.cash+=e.type==='build'?-25:e.after*.3;if(e.type==='build'){k.capex+=25;this.projects++;}if(e.type==='green')k.esg=Math.min(99,k.esg+1.5);if(e.type==='balance')this.production=[92,81];else if(e.type==='reverse')this.production=[80,95];else if(e.type==='demand')this.production=this.production.map(v=>Math.min(100,v+3));else this.production=this.production.map(v=>v+(88-v)*.12);k.gas=Math.min(99,90+(this.production[0]+this.production[1]-160)*.2);}
}
