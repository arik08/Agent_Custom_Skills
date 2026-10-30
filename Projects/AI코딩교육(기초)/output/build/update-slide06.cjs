const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const output = path.resolve(__dirname, '..');
const file = path.join(output, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('<section class="slide" data-index="5"');
if (start < 0) throw Error('Expected original slide 06');
const end = source.indexOf('</section>', start) + 10;
const old = source.slice(start, end);
const bridge = old.match(/<div class="bridge">[\s\S]*?<\/div>/)[0];
const img = old.match(/<img[^>]+>/)[0];
const section = `<section class="slide foundations-bridge" data-index="5" data-section="사람의 역할" data-noclick="" aria-label="6. 잘 될 때는 쉽습니다. 문제는 안 될 때입니다." inert="" aria-hidden="true">
<header><div class="eyebrow">AI CODING WORKSHOP <span>사람의 역할</span></div><h1>잘 될 때는 쉽습니다. 문제는 안 될 때입니다.</h1><p class="lead">AI가 해결 방법을 알려줘도, 그 말의 의미를 모르면 다음 단계에서 막힙니다.</p></header>
<main class="slide-body">
<div class="foundation-scene"><div class="foundation-art">${img}</div>
<div class="foundation-dialogues">
<article class="foundation-dialogue"><h2>01 <span>실행이 안 될 때</span></h2>
<p><span class="speaker">나</span><span>“게임이 안 켜져. 고쳐줘.”</span></p>
<p class="ai-answer"><span class="speaker">AI</span><span>“브라우저 <button class="term" data-term="콘솔">콘솔</button>에 표시되는 오류를 알려주세요.”</span></p>
<p class="stuck"><span class="speaker">나</span><strong>“……콘솔이 어디죠?”</strong></p></article>
<article class="foundation-dialogue"><h2>02 <span>함께 쓰고 싶을 때</span></h2>
<p><span class="speaker">나</span><span>“동료도 점수를 볼 수 있게 해줘.”</span></p>
<p class="ai-answer"><span class="speaker">AI</span><span>“현재는 브라우저에 저장됩니다.<br>공유하려면 <button class="term" data-term="서버">서버</button>와 <button class="term" data-term="데이터베이스">데이터베이스</button>가 필요합니다.”</span></p>
<p class="stuck"><span class="speaker">나</span><strong>“……지금 만든 건 어디에 저장되고 있었죠?”</strong></p></article>
</div></div>
<p class="foundation-takeaway">코드를 직접 쓰지 않더라도,<br><strong>내가 만든 프로그램이 어떻게 돌아가는지는 알아야 합니다.</strong></p>
</main>
${bridge}
</section>`;
const css = `<style id="slide06-foundations-style">
.foundations-bridge .slide-body{padding-top:28px;display:flex;flex-direction:column;gap:22px}
.foundation-scene{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:center;flex:1;min-height:0}
.foundation-art{min-width:0;display:flex;align-items:center;justify-content:center;height:100%}
.foundation-art .art{width:100%;max-height:475px;object-fit:contain}
.foundation-dialogues{display:grid;gap:22px;min-width:0}
.foundation-dialogue{border-top:2px solid var(--line);padding-top:17px}
.foundation-dialogue h2{font-size:20px;color:var(--blue);font-weight:700;margin:0 0 15px;letter-spacing:1px}
.foundation-dialogue h2 span{letter-spacing:0;margin-left:12px;color:var(--muted)}
.foundation-dialogue p{display:grid;grid-template-columns:38px 1fr;gap:14px;font-size:26px;line-height:1.55;margin:10px 0;color:var(--ink);word-break:keep-all}
.foundation-dialogue .speaker{font-size:19px;font-weight:700;color:var(--muted);padding-top:5px}
.foundation-dialogue .ai-answer{background:#fff;border-left:3px solid #9dbdd2;padding:12px 18px;margin:12px 0}
.foundation-dialogue .ai-answer .speaker{color:var(--blue)}
.foundation-dialogue .stuck{color:#9c493c;margin-bottom:0}
.foundation-dialogue .stuck .speaker{color:#9c493c}
.foundation-takeaway{flex:none;margin:0 0 48px;padding:18px 24px;border-left:5px solid var(--blue);background:#eaf2f7;color:var(--deep);font-size:28px;line-height:1.55}
.foundation-takeaway strong{font-weight:700}
</style>`;
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
fs.writeFileSync(path.join(output,'validation/slide06-before.json'),JSON.stringify({bridge,prefixHash:hash(source.slice(0,start)),suffixHash:hash(source.slice(end))},null,2));
source = source.slice(0,start)+section+source.slice(end);
source = source.replace('</head>',css+'\n</head>');
if (!source.includes("'콘솔':")) source = source.replace('const GLOSSARY={',"const GLOSSARY={\n'콘솔':['브라우저에서 프로그램의 오류와 실행 기록을 확인하는 개발자 도구의 한 영역입니다.','게임이 멈추거나 화면이 나타나지 않을 때 오류 메시지를 확인해 AI에게 전달할 수 있습니다.'],");
if (!source.includes("'데이터베이스':")) source = source.replace('const GLOSSARY={',"const GLOSSARY={\n'데이터베이스':['점수나 사용자 정보처럼 나중에 다시 사용할 데이터를 체계적으로 저장하고 조회하는 곳입니다.','여러 사람이 같은 순위를 보려면 함께 접근할 저장소가 필요하며, 서버가 데이터를 읽고 쓰도록 구성할 수 있습니다.'],");
fs.writeFileSync(file,source);
fs.appendFileSync(path.resolve(output,'../input/requirements.md'),'\n- 2026-09-23: 06페이지를 “잘 될 때는 쉽습니다. 문제는 안 될 때입니다.”로 변경. 콘솔 오류 확인과 공유 점수 저장에 관한 AI 답변을 이해하지 못하는 두 대화로 프로그래밍 기초 학습의 필요성을 전달. 기존 하단 사용자 작성 문구는 그대로 유지. 그림은 기존 인물·파란색 웹툰 화풍·돋보기 모티프를 유지하되 콘솔과 서버·데이터 저장 구조 앞에서 고민하는 장면으로 수정.\n');
console.log('Updated slide 06; original bridge preserved.');
