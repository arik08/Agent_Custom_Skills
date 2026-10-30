const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const output=path.resolve(__dirname,'..'),file=path.join(output,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let s=fs.readFileSync(file,'utf8');const start=s.indexOf('<section class="slide foundations-bridge"'),end=s.indexOf('</section>',start)+10;assert.ok(start>=0);
const old=s.slice(start,end),bridge=old.match(/<div class="bridge">[\s\S]*?<\/div>/)[0];
let section=old.replace('막혔을 때 해결 방법을 이해하는 데도, 더 좋은 기능을 떠올리는 데도 기초가 필요합니다.','실적 조회 프로그램을 만든 뒤에도, 문제를 이해하고 더 나은 방법을 요구할 지식이 필요합니다.');
const articles=[...section.matchAll(/<article class="foundation-dialogue[^"\n]*">[\s\S]*?<\/article>/g)];assert.equal(articles.length,2);
section=section.replace(articles[0][0],`<article class="foundation-dialogue"><h2>01 <span>기초를 알아야, AI의 해결책을 이해합니다</span></h2>
<p><span class="speaker">나</span><span>“조회 버튼을 누르면 화면이 한참 멈춰. 고쳐줘.”</span></p>
<p class="ai-answer"><span class="speaker">AI</span><span>“전체 데이터를 한꺼번에 불러와서 느립니다.<br><button class="term" data-term="서버">서버</button>에서 조건에 맞는 데이터를 찾고, 화면에는 50개씩 보여주겠습니다.”</span></p>
<p class="stuck"><span class="speaker">나</span><strong>“……지금 계산은 내 PC에서 하고 있었나?<br>서버로 옮기면 뭐가 달라지지?”</strong></p></article>`);
section=section.replace(articles[1][0],`<article class="foundation-dialogue foundation-possibility"><h2>02 <span>기술을 알아야, 더 나은 방법을 요구합니다</span></h2>
<p><span class="speaker">처음</span><span>“검색을 좀 더 빠르게 해줘.”</span></p>
<p class="ai-answer"><span class="speaker">알면</span><span>“검색할 때마다 전체 데이터를 읽고 있네.<br>사업코드·기준일 검색에 맞춰 <button class="term" data-term="DB 인덱스">DB 인덱스</button>를 검토하고,<br><button class="term" data-term="실행 계획">실행 계획</button>으로 효과를 확인해줘.”</span></p>
<p class="possibility-note"><span class="speaker">뜻</span><span><b>인덱스</b>는 데이터를 빨리 찾기 위한 색인,<br><b>실행 계획</b>은 데이터베이스가 데이터를 찾는 방식입니다.</span></p></article>`);
section=section.replace(/<p class="foundation-takeaway">[\s\S]*?<\/p>/,'<p class="foundation-takeaway">기초를 알아야 <strong>AI의 해결책을 이해하고,</strong><br>기술을 알아야 <strong>더 나은 방법을 요구할 수 있습니다.</strong></p>');
assert.equal(section.match(/<div class="bridge">[\s\S]*?<\/div>/)[0],bridge);s=s.slice(0,start)+section+s.slice(end);
s=s.replace('grid-template-columns:.9fr 1.1fr;gap:48px','grid-template-columns:.68fr 1.32fr;gap:40px').replace('.foundations-bridge .slide-body{padding-top:28px;display:flex;flex-direction:column;gap:22px}', '.foundations-bridge .slide-body{padding-top:18px;display:flex;flex-direction:column;gap:16px}').replace('gap:14px;font-size:26px;line-height:1.45;margin:7px 0','gap:14px;font-size:25px;line-height:1.35;margin:5px 0').replace('.foundation-dialogues{display:grid;gap:12px;min-width:0}', '.foundation-dialogues{display:grid;gap:10px;min-width:0}').replace('.foundation-dialogue{border-top:2px solid var(--line);padding-top:12px}', '.foundation-dialogue{border-top:2px solid var(--line);padding-top:9px}').replace('padding:9px 18px;margin:9px 0','padding:7px 18px;margin:7px 0').replace('font-size:23px;line-height:1.4;color:var(--deep)','font-size:22px;line-height:1.35;color:var(--deep)').replace('margin:0 0 48px;padding:18px 24px','margin:0 0 40px;padding:14px 24px');
s=s.replace('const GLOSSARY={',`const GLOSSARY={
'DB 인덱스':['데이터베이스에서 필요한 행을 빠르게 찾기 위해 만드는 색인입니다. 책의 색인처럼 전체 내용을 매번 훑지 않고 필요한 위치를 찾도록 돕습니다.','사업코드와 기준일로 자주 검색한다면 그 검색 조건에 맞는 인덱스를 검토할 수 있습니다. 무조건 빨라지는 것은 아니며, 저장 공간과 데이터 추가·수정 비용도 늘 수 있어 실제 조회 성능을 확인해야 합니다.'],
'실행 계획':['데이터베이스가 데이터를 어떤 순서와 방식으로 찾고 결합할지 보여주는 정보입니다. 전체 데이터를 읽는지, 인덱스를 사용하는지 등을 확인합니다.','예상 실행 계획은 효과를 확정하는 성능 측정값이 아닙니다. 인덱스 적용 전후의 실제 실행 시간과 읽은 데이터 양도 비교해야 합니다.'],`);
fs.writeFileSync(file,s);
fs.appendFileSync(path.resolve(output,'../input/requirements.md'),'\n- 2026-09-24: 06페이지의 두 예시를 실적 조회 프로그램으로 교체. ① 전체 데이터를 브라우저에서 처리해 느린 상황에서 서버 처리·50개씩 표시하는 해결책을 이해하지 못하는 사례. ② 막연한 속도 개선 요청에서 사업코드·기준일의 DB 인덱스 검토와 실행 계획 확인을 요구하는 사례. 인덱스·실행 계획의 쉬운 설명과 용어 해설 추가. 페이지네이션이라는 표현은 사용하지 않으며, 기존 그림 및 사용자 작성 하단 문구 유지.\n');
console.log('Updated realistic examples, preserving image and bridge.');
