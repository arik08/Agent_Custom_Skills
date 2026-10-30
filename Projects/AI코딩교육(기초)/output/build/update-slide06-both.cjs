const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const output=path.resolve(__dirname,'..'),file=path.join(output,'260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let s=fs.readFileSync(file,'utf8');
const start=s.indexOf('<section class="slide foundations-bridge"'),end=s.indexOf('</section>',start)+10;
assert.ok(start>=0);const original=s.slice(start,end),bridge=original.match(/<div class="bridge">[\s\S]*?<\/div>/)[0];
let section=original.replaceAll('잘 될 때는 쉽습니다. 문제는 안 될 때입니다.','잘 만들게 하려면, 우리도 알아야 합니다.')
.replace('AI가 해결 방법을 알려줘도, 그 말의 의미를 모르면 다음 단계에서 막힙니다.','막혔을 때 해결 방법을 이해하는 데도, 더 좋은 기능을 떠올리는 데도 기초가 필요합니다.')
.replace('01 <span>실행이 안 될 때</span>','01 <span>막힌 곳을 풀려면, 설명을 이해해야 합니다</span>');
const articles=[...section.matchAll(/<article class="foundation-dialogue">[\s\S]*?<\/article>/g)];assert.equal(articles.length,2);
section=section.replace(articles[1][0],`<article class="foundation-dialogue foundation-possibility"><h2>02 <span>더 좋은 것을 시키려면, 가능성을 알아야 합니다</span></h2>
<p><span class="speaker">처음</span><span>“점수 좀 저장해줘.”</span></p>
<p class="ai-answer"><span class="speaker">알면</span><span>“팀원들과 순위를 공유하고,<br>매주 새로 경쟁할 수 있게 해줘.”</span></p>
<p class="possibility-note"><span class="speaker">왜?</span><span><button class="term" data-term="서버">서버</button>·<button class="term" data-term="데이터베이스">데이터베이스</button>로 함께 쓰고 기록할 수 있다는 걸<br>알아야, 이런 기능도 떠올릴 수 있습니다.</span></p></article>`);
section=section.replace(/<p class="foundation-takeaway">[\s\S]*?<\/p>/,'<p class="foundation-takeaway">어떻게 돌아가는지 알아야 <strong>막힌 곳을 풀고,</strong><br>무엇이 가능한지 알아야 <strong>더 좋은 것을 요구할 수 있습니다.</strong></p>');
assert.equal(section.match(/<div class="bridge">[\s\S]*?<\/div>/)[0],bridge);
s=s.slice(0,start)+section+s.slice(end);
s=s.replace('.foundation-takeaway strong{font-weight:700}',`.foundation-takeaway strong{font-weight:700}
.foundation-dialogue .possibility-note{font-size:23px;line-height:1.4;color:var(--deep);margin-bottom:0}
.foundation-possibility .ai-answer{border-left-color:var(--blue);font-weight:600}`);
fs.writeFileSync(file,s);
fs.appendFileSync(path.resolve(output,'../input/requirements.md'),'\n- 2026-09-23: 06페이지에 기초 학습의 두 가지 이유를 함께 표현. 기존 콘솔 대화는 유지하고, 두 번째 사례는 점수 저장 요청이 팀원들과의 주간 순위 경쟁 요청으로 발전하는 모습으로 변경. 내부 동작을 이해해야 문제를 해결하고, 가능한 일을 알아야 더 좋은 기능을 요구할 수 있다는 메시지로 통합. 기존 그림과 사용자 작성 하단 문구 유지.\n');
console.log('Slide 06 now presents both reasons; image and bridge unchanged.');
