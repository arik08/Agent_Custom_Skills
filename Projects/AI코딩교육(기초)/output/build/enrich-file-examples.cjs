const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html');
let html = fs.readFileSync(target, 'utf8');
assert(!html.includes('id="file-example-details-styles"'), 'Examples already enriched');
fs.copyFileSync(target, path.join(root, 'validation/file-examples-before.html'));
const files = {
  html: [
    'index.html · 화면 구조',
    ['<link rel="stylesheet" href="style.css">', '<main class="game">', '  <h1>테트리스</h1>', '  <canvas id="board" width="240" height="480"></canvas>', '  <p>점수 <span id="score">0</span></p>', '  <div class="controls">', '    <button id="start">시작</button>', '    <button id="pause">일시정지</button>', '  </div>', '</main>', '<script src="game.js"></script>'].join('\n'),
    '화면에 게임판·점수·버튼을 배치하고, 디자인과 동작을 담은 파일을 연결합니다.',
    ['화면 디자인 파일 연결', '게임 화면을 하나로 묶기', '화면에 제목 표시', '블록을 그릴 게임판', '점수를 바꿔 표시할 자리', '조작 버튼을 묶는 영역', '게임 시작 버튼', '일시정지 버튼', '', '', 'JavaScript 동작 파일 연결'],
  ],
  css: [
    'style.css · 화면 표현',
    ['.game {', '  width: 360px;', '  margin: 0 auto;', '  text-align: center;', '}', '#board {', '  background: #10273d;', '  border: 2px solid #006295;', '}', 'button { padding: 10px 18px; color: #006295; }', 'button:hover { background: #e0eff7; }'].join('\n'),
    '화면의 크기·정렬·색과 버튼 모양을 정합니다. 게임의 점수 계산 규칙은 바뀌지 않습니다.',
    ['게임 영역의 디자인', '전체 게임 화면 너비', '화면 가운데에 배치', '제목과 버튼을 가운데 정렬', '', '게임판의 디자인', '게임판 배경을 짙은 남색으로', '게임판에 파란 테두리', '', '버튼 안쪽 여백과 글자색', '마우스를 올리면 배경색 변경'],
  ],
  js: [
    'game.js · 화면 동작',
    ['let score = 0, paused = false;', 'const scoreText = document.querySelector("#score");', 'const pauseButton = document.querySelector("#pause");', 'function addScore(clearedLines) {', '  score += clearedLines * 100;', '  scoreText.textContent = score;', '}', 'pauseButton.addEventListener("click", () => {', '  paused = !paused;', '  pauseButton.textContent = paused ? "계속하기" : "일시정지";', '});'].join('\n'),
    '점수 계산·화면 갱신·버튼 클릭 처리를 연결하는 예시입니다. 전체 게임 코드의 일부입니다.',
    ['점수와 일시정지 상태 준비', 'HTML의 점수 표시 요소 찾기', 'HTML의 일시정지 버튼 찾기', '줄 삭제 시 호출할 함수', '지운 줄 수 × 100점 더하기', '새 점수를 화면에 반영', '', '버튼을 클릭했을 때 실행', '멈춤과 진행 상태 전환', '상태에 맞게 버튼 글자 변경', '클릭 처리 마무리'],
  ],
  agents: [
    'AGENTS.md · 반복 작업 기준',
    ['# 작업 기준', '## 화면과 파일', '- 사용자에게 보이는 문구는 한국어로 작성', '- 화면은 index.html, 디자인은 style.css에 작성', '- 게임 동작은 game.js에 작성', '## 수정 후 확인', '- 시작·일시정지 버튼을 직접 눌러 확인', '- 줄 삭제 후 점수가 바뀌는지 확인', '- 브라우저 콘솔에 오류가 없는지 확인', '- 실행 방법이 바뀌면 README.md도 수정'].join('\n'),
    '지원하는 코딩 에이전트가 작업할 때 참고할 공통 기준과 확인 절차를 남깁니다.',
    ['문서의 큰 제목', '작성 규칙을 묶는 소제목', '화면 언어를 통일', '파일별 역할을 분리', '동작 코드를 둘 파일 지정', '검증할 항목을 모으기', '실제 버튼 동작 확인', '계산 결과 확인', '실행 오류 확인', '실행 안내도 함께 갱신'],
  ],
  readme: [
    'README.md · 실행 안내',
    ['# 테트리스 실행 안내', '## 실행', '1. HTML·CSS·JS 파일을 같은 폴더에 둡니다.', '2. index.html을 브라우저로 엽니다.', '3. 시작 버튼을 누릅니다.', '## 조작', '- ← / → : 블록 이동, ↑ : 회전', '- 일시정지 버튼 : 멈춤 / 계속하기', '## 확인', '- 한 줄을 지우면 점수가 100점 증가합니다.', '- 화면이 바뀌지 않으면 새로고침합니다.'].join('\n'),
    '프로그램을 사용하는 사람이 실행 순서·조작 방법·확인할 결과를 읽는 안내 문서입니다.',
    ['어떤 프로그램인지 소개', '실행 순서를 안내', '연결할 파일을 한곳에 보관', '실행할 파일 지정', '게임 시작 방법', '사용 방법을 모으기', '키보드 조작 설명', '버튼 사용법 설명', '정상 동작 확인 기준', '기대하는 점수 변화', '수정한 화면을 다시 불러오기'],
  ],
};
for (const key of ['html', 'css', 'js']) {
  files[key][1] = files[key][1].replace(/^ +/gm, indent => ' '.repeat(indent.length * 2));
}
for (const [, code, , notes] of Object.values(files)) assert.equal(code.split('\n').length, notes.length);
const dataSource = 'const files = ' + JSON.stringify(files, null, 2).replace(/</g, '\\u003c').replace(/\n/g, '\n            ') + ';';
const renderer = `function renderFileExample(target, code, language, notes) {
              target.dataset.language = language;
              target.replaceChildren();
              const markers = language === "js" ? ["// ", ""] : language === "css" ? ["/* ", " */"] : ["\\x3C!-- ", " -->"];
              code.split("\\n").forEach((line, index) => {
                const row = document.createElement("span");
                row.className = "file-code-line";
                const source = document.createElement("span");
                source.className = "file-code-source";
                highlightFileCode(source, line, language);
                const note = document.createElement("span");
                note.className = "syntax-comment file-code-note";
                note.textContent = notes[index] ? markers[0] + notes[index] + markers[1] : "";
                row.append(source, document.createTextNode("  "), note);
                target.append(row);
                if (index < notes.length - 1) target.append(document.createTextNode("\\n"));
              });
            }
            function selectFile(b) {
              pressed("[data-file]", b);
              const [label, code, desc, notes] = files[b.dataset.file];
              $("#file-label").textContent = label;
              renderFileExample($("#file-code"), code, { agents: "md", readme: "md" }[b.dataset.file] || b.dataset.file, notes);
              $("#file-desc").textContent = desc;
            }`;
function replaceExamples(source) {
  const dataPattern = /const files\s*=\s*\{[\s\S]*?\};(?=\s*function highlightFileCode)/;
  const renderPattern = /function selectFile\(b\)\s*\{[\s\S]*?\}(?=\s*\$\$\(["']\[data-file\]["']\)\.forEach)/;
  assert(dataPattern.test(source));
  assert(renderPattern.test(source));
  return source.replace(dataPattern, () => dataSource).replace(renderPattern, () => renderer);
}
html = replaceExamples(html);
const css = `
/* File examples use the existing panel size, with aligned explanatory comments. */
.workspace { height: 481px; min-height: 481px; }
.workspace .file-preview { padding: 24px 36px 22px; min-width: 0; }
.workspace #file-label { margin-bottom: 12px; }
#file-code { height: 341px; font-size: 23px; line-height: 31px; white-space: normal; }
#file-code .file-code-line { display: grid; grid-template-columns: 740px minmax(0, 1fr); gap: 24px; min-height: 31px; }
#file-code .file-code-source { white-space: pre; tab-size: 4; }
#file-code .file-code-note,
#file-code[data-language="js"] .file-code-note { position: static; white-space: pre; font-size: 21px; line-height: 31px; font-style: normal; color: #517065; }
.workspace #file-desc { margin-top: 12px; font-size: 21px; line-height: 1.5; }
`;
html = html.replace('  </head>', '    <style id="file-example-details-styles">\n' + css + '    </style>\n  </head>');
const escapeHTML = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
html = html.replace(/<pre id="file-code"[^>]*>[\s\S]*?<\/pre>/, () => '<pre id="file-code" data-language="html">' + escapeHTML(files.html[1]) + '</pre>');
html = html.replace(/(<p id="file-desc">)[\s\S]*?(<\/p>)/, (_, start, end) => start + files.html[2] + end);
fs.writeFileSync(target, html);
const app = path.join(__dirname, 'app.js');
fs.writeFileSync(app, replaceExamples(fs.readFileSync(app, 'utf8')));
fs.appendFileSync(path.join(__dirname, 'style.css'), css);
fs.writeFileSync(path.join(__dirname, 'file-examples.json'), JSON.stringify(files, null, 2));
console.log('Expanded five file examples with aligned per-line notes in the existing 481px panel.');
