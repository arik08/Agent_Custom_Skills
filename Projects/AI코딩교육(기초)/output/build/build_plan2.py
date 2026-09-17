from pathlib import Path
import base64, json, re, html

O = Path(__file__).resolve().parents[1]
B = O / 'build'
slides = []
def add(ch, title, sub, body, theme='', minutes=1):
    slides.append(dict(ch=ch,title=title,sub=sub,body=body,theme=theme,minutes=minutes))
def row(title, text):
    return f'<article class="explain"><h3>{title}</h3><p>{text}</p></article>'
def split(a,b): return f'<div class="split"><div>{a}</div><div>{b}</div></div>'
def memo(cls=''):
    return f'<div class="memo {cls}"><span class="micro">업무 메모 / 001</span><h3>포석호님,<br>월간 실적 취합<br>부탁드립니다.</h3><p>기한: 9월 30일</p><div class="memo-rule"></div><small>우리가 끝까지 따라갈 한 건</small></div>'
def flow(items):
    return '<div class="flow">'+'<span class="arrow" aria-hidden="true">→</span>'.join(f'<div class="flow-node"><small>{a}</small><b>{b}</b><p>{c}</p></div>' for a,b,c in items)+'</div>'
def code(text, label='구조 설명용 예시'):
    return f'<div class="codebox"><span class="micro">{label}</span><pre>{html.escape(text)}</pre></div>'
def sprite(n,cls=''):
    return f'<svg class="sprite {cls}" viewBox="{n%3*512+34} {n//3*512+34} 444 444" aria-hidden="true"><use href="#atlas"/></svg>'

add('01 · 가능성','업무 메모 한 장이<br><em>프로그램이 되기까지.</em>','AI 기반 Vibe Coding · 초급',
    '<div class="cover-scene">'+memo('cover-memo')+'<div class="cutline"></div><div class="result-slip"><span class="micro">만들고 싶은 결과</span><h3>오늘의 업무</h3><dl><dt>담당자</dt><dd>포석호</dd><dt>할 일</dt><dd>월간 실적 취합</dd><dt>기한</dt><dd>9월 30일</dd></dl><span class="stamp">실행 가능한 작은 도구</span></div>'+sprite(1,'cover-laptop')+'</div><p class="cover-end">2026. 09. 29. 화　16:00–17:00<br><b>업무를 아는 사람이, AI와 함께 만드는 첫 한 시간.</b></p>', 'cover', .5)
add('01 · 가능성','오늘은 외우지 않아도 됩니다.','용어보다 먼저, 일이 흘러가는 모습을 이해합니다.',
    '<div class="manifesto"><p><span>01</span>“이런 게 있구나”<small>전체 흐름을 감각적으로 익히고, 세부 개념은 필요할 때 다시 묻습니다.</small></p><p><span>02</span>“일단 만들어줘”<small>작은 결과를 요청하고 실제로 실행해 봅니다. 처음 요청이 완벽할 필요는 없습니다.</small></p><p><span>03</span>“여기는 이렇게 고쳐줘”<small>내 업무의 기준으로 판단하고, 결과를 보며 다음 요청을 이어갑니다.</small></p></div>','',1)
add('01 · 가능성','AI에게 없는 것은<br>당신이 아는 업무입니다.','개발에 참여할 이유는 코딩 실력보다 업무를 판단하는 힘에 있습니다.',
    split('<div class="quote-sheet"><span class="micro">같은 요청, 다른 판단</span><blockquote>“기한이 없으면<br>어떻게 할까요?”</blockquote><p>AI는 가능한 답을 제안합니다.<br>업무 기준을 결정하는 사람은 당신입니다.</p></div>',
    row('업무 지식 → 요구','어떤 자료가 들어오고, 누구에게 어떤 결과가 필요한지 설명합니다.')+row('AI의 실행력 → 구현','허용된 도구로 파일을 만들고 수정하며 실행 결과를 확인합니다.')+row('사람의 판단 → 검증','빈 기한을 추측할지, ‘확인 필요’로 남길지 실제 업무 기준을 알려줍니다.')),'',1.5)
add('01 · 가능성','답변이 파일로 이어지는 순간.','설명을 받는 대화에서, 실제 작업 공간을 다루는 대화로.',
    '<div class="comparison"><div><span class="micro">설명 중심의 챗봇</span><h3>“이 코드를 붙여 넣으세요.”</h3><p>답변을 받은 뒤 사용자가 파일을 찾아 수정하고 실행합니다.</p><div class="paper-lines">답변 → 사람이 옮김 → 실행</div></div><div class="agent-side"><span class="micro">도구를 쓰는 코딩 에이전트</span><h3>“파일을 고치고 확인했습니다.”</h3><p>프로젝트를 읽고 해당 위치를 수정하며, 명령어로 실행까지 이어갈 수 있습니다.</p><div class="paper-lines">요청 → 파일 수정 → 실행 결과</div></div></div><p class="bottom-note">가능한 행동은 연결된 도구와 권한에 따라 달라집니다. 마우스 조작도 별도 도구가 있어야 가능합니다.</p>','',1.5)
add('01 · 가능성','말로 바꾸는 감각부터.','게임을 보며 “조금 느리게, 점수는 더 크게”라고 요청한다고 생각해 보세요.',
    '<div class="game-layout"><div class="game-cabinet"><canvas id="blocks" width="360" height="576" aria-label="자동 블록 쌓기 게임"></canvas><div class="game-score"><span>지운 줄</span><strong id="game-score">0</strong><span>자동 배치 중</span></div></div><div class="game-copy"><div class="speech">“속도를 낮춰줘.”</div><label class="range-label">자동 플레이 속도 <input id="game-speed" type="range" min="1" max="5" value="1"><output id="speed-label">1</output></label><div class="speech secondary">“점수를 더 잘 보이게 해줘.”</div><button id="score-size" aria-pressed="false">점수 강조</button><button id="game-reset" class="quiet">새 게임</button><p>원하는 변화를 말하고, 눈앞의 결과로 확인합니다. 코드 문법을 알아야만 변경을 요청할 수 있는 것은 아닙니다.</p><small>준비된 HTML 게임 · 현재 조작은 로컬 코드 실행이며 AI 실시간 생성이 아닙니다.</small></div></div>','blue',2)
add('01 · 가능성','오늘의 한 시간은<br>이 메모를 따라갑니다.','가능성을 보고 → 구조를 이해하고 → 만들고 → 사내 AI에 연결합니다.',
    '<div class="journey"><div><b>08</b><span>분 · 가능성</span><p>챗봇에서<br>에이전트로</p></div><div><b>15</b><span>분 · 기초</span><p>화면에서<br>실행 환경까지</p></div><div><b>15</b><span>분 · 제작</span><p>요청하고<br>확인하고 수정</p></div><div><b>09</b><span>분 · 준비</span><p>개발도구와<br>실행 방법</p></div><div><b>08</b><span>분 · 사내 연결</span><p>P-GPT와<br>API의 역할</p></div><div><b>05</b><span>분 · Q&A</span><p>내 업무로<br>가져갈 질문</p></div></div><p class="bottom-note">설치를 동시에 따라 하는 시간이 아닙니다. 제작 시연을 보면서 각 도구가 맡은 역할을 연결해 봅니다.</p>','',1.5)

add('02 · 기초','화면 뒤를 펼쳐 보면.','우리가 보는 업무 도구는 역할이 다른 부분들이 연결된 결과입니다.',
    '<div class="anatomy">'+flow([('입력하는 사람','사용자','업무 요청을 전달'),('보이고 반응하는 곳','프론트엔드','HTML · CSS · JavaScript'),('요청과 응답의 약속','API','정해진 형식으로 교환'),('규칙을 실행하는 곳','백엔드','Python 등으로 처리'),('필요할 때 저장','DB','다시 꺼내 쓸 데이터')])+'</div>'+split(row('화면과 처리 로직은 역할이 다릅니다','버튼의 색과 위치는 화면의 문제입니다. 기한이 빠졌을 때 무엇을 반환할지는 처리 규칙의 문제입니다.'),row('모든 도구에 다 필요한 것은 아닙니다','작은 HTML 도구는 브라우저 안에서 처리할 수 있습니다. 서버나 별도 DB 없이 시작하는 프로그램도 있습니다.')),'',2)
add('02 · 기초','같은 화면에 세 겹을 입힙니다.','구조가 생기고, 모양이 정돈되고, 사용자의 행동에 반응합니다.',
    '<div class="split"><div><div class="tabs" aria-label="웹 화면 구성"><button data-layer="html">HTML</button><button data-layer="css">+ CSS</button><button data-layer="js" aria-pressed="true">+ JavaScript</button></div><div id="web-preview" class="styled"><span>업무 요청 / 001</span><h3>월간 실적 취합</h3><p>담당자 포석호 · 기한 9월 30일</p><div class="task-line">검토할 요청 <b id="preview-state">미완료</b></div><button id="preview-done">완료로 표시</button></div></div><div>'+row('HTML · 무엇이 있는가','제목, 문단, 입력란, 버튼처럼 화면의 구조와 의미를 정합니다.')+row('CSS · 어떻게 보이는가','색, 글자, 간격, 배치로 읽는 순서를 만듭니다.')+row('JavaScript · 무엇이 바뀌는가','버튼을 누르면 상태가 바뀌듯, 입력에 따라 화면과 데이터를 갱신합니다.')+'</div></div>','',2)
add('02 · 기초','메모가 결과로 바뀌는 규칙.','백엔드는 요청을 받아, 업무 기준에 따라 처리하고 결과를 돌려줍니다.',
    split(memo(),'<div class="rule-tape"><span>받기</span><b>담당자·업무·기한을 읽는다</b><span>처리</span><b>없는 값은 ‘확인 필요’로 남긴다</b><span>반환</span><b>화면에 보여 줄 결과를 만든다</b></div>')+'<p class="bottom-note">Python은 이 처리를 구현할 수 있는 언어입니다. 오늘의 첫 예제는 정해진 표기를 읽는 규칙 기반 처리입니다.</p>','',1.5)
add('02 · 기초','프로젝트 폴더는<br>AI와 공유하는 작업대입니다.','코드, 참고 자료, 결과, 반복 규칙을 같은 맥락 안에서 다룹니다.',
    split('<div class="folder-tree"><strong>업무요청_정리도구/</strong><p>├ input/ <span>가상 업무 자료</span></p><p>├ app.py <span>처리 코드</span></p><p>├ index.html <span>사용자 화면</span></p><p>├ AGENTS.md <span>반복 작업 규칙</span></p><p>└ README.md <span>설치·실행 안내</span></p></div>',row('파일을 찾고 해당 부분을 고칩니다','에이전트가 “어느 폴더에서 일하는가”를 알아야 기존 코드와 자료를 바탕으로 작업할 수 있습니다.')+row('결과물의 위치도 확인합니다','대화창의 완료 메시지만 보지 않고, 실제 생성 파일과 실행 결과를 함께 확인합니다.')+row('원본과 결과는 구분합니다','참고 자료를 보존하고 가공한 결과를 별도 위치에 남기면, 수정 전후를 비교하기 쉽습니다.')),'',1.5)
add('02 · 기초','터미널은 실행을 부탁하는 창.','터미널·셸·CLI는 서로 연결되지만 같은 뜻은 아닙니다.',
    split('<div class="terminal"><div class="terminal-cap">PowerShell · 실행 예시</div><div class="terminal-prompt">PS C:\\work\\request-tool&gt;</div><div class="terminal-command">python app.py</div><div class="terminal-result">입력 1건을 읽었습니다.<br>담당자: 포석호<br>기한: 9월 30일<br>결과 파일을 저장했습니다.</div></div>',row('터미널(Terminal) · 창','명령어를 입력하고 실행 결과를 보는 공간입니다.')+row('셸(Shell) · 명령 해석기','PowerShell, Bash 등이 명령을 해석해 도구를 실행합니다.')+row('CLI · 사용하는 방식','Command Line Interface. 버튼 대신 문자 명령으로 프로그램을 사용합니다.'))+'<p class="bottom-note">에이전트 → 터미널 → Python·개발도구 실행. 화면과 마우스 조작은 별도 GUI 자동화 도구의 역할입니다.</p>','dark',2)
add('02 · 기초','필요한 부품을 가져오고,<br>프로젝트별로 분리합니다.','라이브러리·패키지·패키지 관리자는 “재사용할 기능”을 준비하는 과정입니다.',
    '<div class="workbenches"><div class="workbench"><span class="micro">프로젝트 A · 가상환경</span><h3>보고서 도구</h3><div class="parts"><b>표 처리<br><small>버전 A</small></b><b>차트</b><b>파일 읽기</b></div></div><div class="workbench"><span class="micro">프로젝트 B · 가상환경</span><h3>자료 검토 도구</h3><div class="parts"><b>표 처리<br><small>버전 B</small></b><b>문서 추출</b></div></div></div>'+split(row('라이브러리와 패키지','이미 만들어진 기능을 가져다 씁니다. 패키지는 배포·설치 가능한 묶음이며 라이브러리를 담을 수 있습니다.'),row('설치와 격리','pip·uv는 Python 패키지 관리에, npm은 JavaScript 패키지 관리에 쓰입니다. 가상환경은 Python 프로젝트의 패키지를 분리합니다.')),'',1.5)
add('02 · 기초','기록, 규칙, 기능, 연결.<br>비슷해 보여도 역할이 다릅니다.','파일은 설명을 담고, 도구는 실제로 행동합니다.',
    '<div class="ledger"><div><b>Markdown · .md</b><p>제목·목록을 간단한 문법으로 적는 문서 형식입니다.</p><span>문서를 쓰는 형식</span></div><div><b>AGENTS.md</b><p>지원하는 에이전트에게 프로젝트의 반복 작업 규칙을 전달합니다.</p><span>이곳의 작업 기준</span></div><div><b>Skill</b><p>반복하는 작업의 방법과 참고 자료를 묶어 재사용합니다.</p><span>일하는 방법</span></div><div><b>MCP</b><p>AI 앱과 외부 도구·데이터를 연결하는 공통 규약입니다.</p><span>도구와 연결</span></div></div><p class="bottom-note">지침을 적었다고 권한이 생기지는 않습니다. 도구가 읽는 지침 위치와 실제 연결·권한을 함께 확인합니다.</p>','',1.5)
add('02 · 기초','변경을 기억하는 도구,<br>설정을 전달하는 통로.','Git·GitHub와 환경변수는 서로 다른 문제를 해결합니다.',
    split('<div class="history"><span class="micro">Git · 변경 이력</span><div class="commit"><i></i><b>첫 화면</b><span>요청을 입력할 수 있음</span></div><div class="commit"><i></i><b>기한 누락 처리</b><span>‘확인 필요’를 표시</span></div><div class="commit"><i></i><b>복사 버튼</b><span>결과를 다시 활용</span></div><p>GitHub는 이 저장소를 온라인에서 보관하고 협업하는 서비스입니다.</p></div>',row('환경변수 · 코드 밖의 설정','프로그램에 주소나 설정값을 전달합니다. 다른 환경에서 같은 코드를 실행할 때 설정만 바꿀 수 있습니다.')+code('SERVICE_URL = 실행 환경에서 전달\nAPI_KEY     = 서버 측 설정에서 전달','설정 전달의 개념')+'<p class="small">환경변수 자체가 비밀값을 자동으로 암호화해 주는 것은 아닙니다. 화면·로그·공유 파일에 노출하지 않도록 관리합니다.</p>'),' ',1.5)
add('02 · 기초','모델을 고르는 기준도<br>결과에서 시작합니다.','작업의 난도·응답 속도·비용을 함께 보고 선택합니다.',
    '<div class="model-rig"><div class="model-dial"><span>작은 변경</span><div class="dial-arc"></div><b>같은 작업으로<br>비교하기</b><span>복잡한 원인 분석</span></div><div>'+row('먼저 기본 설정으로 작게 시도','간단한 문구 변경과 여러 파일에 걸친 오류 수정은 필요한 검토의 깊이가 다릅니다.')+row('추론 노력은 검토에 쓰는 자원','설정을 높이면 더 많은 시간·사용량을 쓸 수 있지만 정확성을 보장하지는 않습니다.')+row('모르는 설정도 그대로 질문','“이 작업에 어떤 모델과 설정이 적합한지 이유와 함께 설명해줘.” 구체적인 이름과 지원 단계는 사용 환경에서 확인합니다.')+'</div></div>','',1.5)

add('03 · 제작','이제 이 메모로<br>작은 도구를 만듭니다.','15분 제작 시연 · 파일 생성 → 실행 → 결과 확인 → 수정',
    split(memo(),'<div class="request-quote"><span class="micro">첫 요청</span><blockquote>업무 요청을 붙여 넣으면<br>담당자, 할 일, 기한을 정리해 주는<br>간단한 도구를 만들어줘.</blockquote><p>첫 버전은 외부 API 없이 만듭니다.<br>먼저 실행 가능한 흐름을 만들고, 부족한 부분을 고칩니다.</p></div>'),'blue',2)
add('03 · 제작','개발화면은 네 곳만 봅니다.','어디에 생겼는지, 무엇이 바뀌었는지, 실제로 실행됐는지.',
    '<div class="ide"><div class="ide-top">VS Code 화면 구성 예시 <span>실제 배치는 설정에 따라 다릅니다</span></div><div class="ide-files"><b>① 파일</b><p>app.py</p><p>index.html</p><p>AGENTS.md</p></div><div class="ide-code"><b>② 코드와 변경 내용</b><pre>def read_request(text):\n    fields = parse_fields(text)\n    return fields</pre><div class="code-comment">에이전트가 수정한 위치를 확인합니다.</div></div><div class="ide-agent"><b>④ 에이전트 대화</b><p>“기한이 없으면<br>확인 필요로 표시해줘.”</p><span>파일 확인 → 수정 → 실행</span></div><div class="ide-terminal"><b>③ 터미널</b><span>python app.py</span><p>입력 1건 · 결과 저장 완료</p></div></div>','',2)
add('03 · 제작','첫 버전은, 눈앞에서 작동하게.','붙여 넣은 값을 읽어 담당자·할 일·기한으로 정리합니다.',
    '<div class="request-lab"><div><label for="request-input" class="micro">입력 · 가상 업무 자료</label><textarea id="request-input" spellcheck="false">담당자: 포석호\n업무: 월간 실적 취합\n기한: 9월 30일</textarea><div class="tabs"><button data-sample="normal">기한 있음</button><button data-sample="missing">기한 없음</button><button data-sample="empty">빈 입력</button></div><small>담당자: / 업무: / 기한: 표기를 읽는 로컬 규칙입니다.<br>자유로운 문장의 의미를 이해하는 AI 기능은 아닙니다.</small></div><div class="live-result"><span class="micro">처리 결과</span><dl id="request-result"></dl><p id="request-message" aria-live="polite"></p><button id="copy-result">결과 복사</button><span id="copy-state" class="small"></span></div></div>','',3)
add('03 · 제작','빠진 기한을 어떻게 다룰까요?','오류가 사라졌는지보다 업무 규칙이 맞는지를 봅니다.',
    '<div class="revision"><div><span class="micro">입력</span><h3>담당자: 포석호<br>업무: 월간 실적 취합</h3><p>기한이 없는 요청도 들어옵니다.</p></div><div><div class="tabs"><button data-revision="before" aria-pressed="true">수정 전</button><button data-revision="after">수정 후</button></div><div id="deadline-result" class="deadline blank">기한 <b>—</b></div><p id="revision-caption">빈칸만 보이면, 누락인지 오류인지 알기 어렵습니다.</p></div></div><div class="speech wide">“기한이 없으면 추측하지 말고 ‘확인 필요’로 표시해줘.”</div><p class="bottom-note">수정 뒤에는 기한이 있는 요청과 없는 요청을 모두 확인합니다. 새 규칙이 정상 입력까지 바꾸지 않는지 봅니다.</p>','',3)
add('03 · 제작','한 번 말한 기준을<br>다음 작업에도 이어갑니다.','AGENTS.md에는 반복 규칙을, 실행 안내에는 시작 방법을 남깁니다.',
    split(code('# 작업 규칙\n- 화면은 한국어로 작성합니다.\n- 기한이 없으면 확인 필요로 표시합니다.\n- 수정 후 정상·누락·빈 입력을 확인합니다.\n- 원본 자료는 덮어쓰지 않습니다.','AGENTS.md · 예시'),'<div class="request-quote"><blockquote>앞으로도 이 기준을 따르도록<br>AGENTS.md에 정리해줘.</blockquote><p>직접 파일 문법을 외우지 않아도 됩니다. 반복해서 말하는 기준을 에이전트에게 정리해 달라고 요청합니다.</p></div>')+'<p class="bottom-note">다른 컴퓨터에서도 실행할 수 있도록 필요한 패키지와 실행 명령을 README.md에 함께 남깁니다.</p>','',2)
add('03 · 제작','만드는 일은 한 번의 주문보다<br>짧은 왕복에 가깝습니다.','실행 결과가 다음 요청의 근거가 됩니다.',
    '<div class="loop">'+''.join(f'<div><span>{n}</span><h3>{t}</h3><p>{d}</p></div>' for n,t,d in [('01','요청','원하는 결과를 말합니다.'),('02','실행','만든 파일을 직접 엽니다.'),('03','확인','정상·예외 입력을 봅니다.'),('04','수정','차이를 다음 요청에 담습니다.')])+'</div><div class="closing-line">“안 돼요”에서 한 걸음 더.<br><b>“기한이 없을 때 빈칸입니다. 확인 필요로 표시해줘.”</b></div>','dark',3)

add('04 · 준비','내 작업에 맞는 입구 하나.','앱·편집기 확장·CLI는 에이전트와 만나는 방식입니다.',
    '<div class="tool-paths"><div><span class="micro">앱</span><div class="window-icon">AI</div><h3>대화와 작업 공간</h3><p>앱이 제공하는 작업 흐름에서 프로젝트를 다룹니다.</p></div><div class="featured"><span class="micro">편집기 확장 · 시연 기준</span><div class="window-icon">&lt; / &gt;</div><h3>파일과 대화를 함께</h3><p>VS Code에서 코드, 터미널, 에이전트를 함께 봅니다.</p></div><div><span class="micro">CLI</span><div class="window-icon">&gt;_</div><h3>명령어 기반 작업</h3><p>터미널에서 에이전트를 실행하고 요청합니다.</p></div></div><p class="bottom-note">Codex, Claude Code, Cline, Kilo Code 등은 도구 후보입니다. 실제 사용 형태·기능·접근 가능 여부는 사내 허용 환경에서 확인합니다.</p>','',2)
add('04 · 준비','무엇을 만들지에 따라<br>필요한 도구가 달라집니다.','모두 설치해야 시작할 수 있는 것은 아닙니다.',
    '<div class="setup-lab"><div class="tabs"><button data-setup="html" aria-pressed="true">HTML 파일</button><button data-setup="python">Python 처리</button><button data-setup="node">npm 기반 웹 프로젝트</button></div><div id="setup-equipment" class="equipment"></div><p id="setup-reason" class="setup-reason"></p></div><div class="links"><a href="https://code.visualstudio.com/download" target="_blank" rel="noreferrer">VS Code ↗</a><a href="https://www.python.org/downloads/" target="_blank" rel="noreferrer">Python ↗</a><a href="https://nodejs.org/en/download" target="_blank" rel="noreferrer">Node.js ↗</a><a href="https://git-scm.com/install/windows" target="_blank" rel="noreferrer">Git ↗</a></div><p class="small">공식 설치 안내 확인: 2026-09-17 · 회사에서 승인한 설치 경로를 우선합니다.</p>','',2.5)
add('04 · 준비','만들었다면, 실행 방법까지.','다른 컴퓨터에서는 파일 외에 실행 환경과 패키지도 필요할 수 있습니다.',
    '<div class="runways"><div><b>HTML 파일</b><span>브라우저에서 열기</span><p>브라우저 안에서만 처리하는 단순한 도구라면 파일 하나로 사용할 수 있습니다.</p></div><div><b>Python 프로그램</b><span>Python + 필요한 패키지</span><p>프로그램의 안내에 따라 환경을 준비하고 터미널에서 실행합니다.</p></div><div><b>서버가 있는 웹 앱</b><span>서버 실행 또는 배포</span><p>화면 파일만 복사해도 서버 기능이 함께 옮겨지는 것은 아닙니다.</p></div></div><div class="speech wide">“처음 받는 사람도 실행할 수 있도록 설치 항목과 실행 순서를 적어줘.”</div>','',2)
add('04 · 준비','작업 범위와 승인 기준은<br>알고 맡깁니다.','접근할 수 있는 범위와 행동할 때 확인받는 방식은 구분합니다.',
    split('<div class="permission-map"><div><span>접근 범위</span><b>어떤 폴더·명령·네트워크를<br>사용할 수 있는가</b></div><div><span>승인 방식</span><b>어떤 행동 전에<br>사용자 확인이 필요한가</b></div></div>',row('맡길 작업에 맞게 설정','파일 수정, 프로그램 실행, 외부 연결 중 무엇이 필요한지 보고 설정을 확인합니다.')+row('Full Access의 의미','접근 범위를 넓히는 설정이지만 모든 작업의 필수 조건은 아닙니다. 구체적인 범위는 도구별로 다릅니다.')+row('회사에서 가능한 방식으로','지침 파일이나 사용자 편의 설정이 회사 정책을 대신하지는 않습니다. 허용된 도구와 권한으로 시작합니다.')),'',2.5)

add('05 · 사내 연결','AI로 만든 프로그램과<br>AI를 부르는 프로그램.','개발할 때 AI를 썼다는 것과, 실행할 때 AI를 호출한다는 것은 다릅니다.',
    '<div class="comparison"><div><span class="micro">지금 만든 첫 버전</span><h3>규칙으로 정리</h3><p>‘담당자:’ 같은 정해진 표기를 읽고 누락된 값을 표시합니다. 실행 중 모델을 호출하지 않습니다.</p><div class="paper-lines">입력 → 정해진 코드 → 결과</div></div><div class="agent-side"><span class="micro">다음에 더할 기능</span><h3>문맥을 읽어 정리</h3><p>자유로운 문장을 AI 서비스에 보내 담당자·할 일·기한을 제안받습니다. 결과 확인은 여전히 필요합니다.</p><div class="paper-lines">입력 → API → AI 응답</div></div></div>','blue',1.5)
add('05 · 사내 연결','이 메모가 API로 건너갑니다.','프로그램이 AI 서비스에 요청하고, 응답을 받아 업무 화면에 사용합니다.',
    '<div class="api-route">'+flow([('브라우저','HTML 화면','업무 요청 입력'),('회사에서 준비할 서버','Python 백엔드','입력 검토 · 인증 설정'),('사내 AI 서비스','P-GPT API','모델에 요청'),('돌아온 결과','화면 표시','업무 기준으로 확인')])+'</div>'+split(code('입력: 포석호님, 월간 실적을\n      9월 30일까지 취합해 주세요.','요청 내용의 개념'),code('담당자: 포석호\n할 일: 월간 실적 취합\n기한: 9월 30일','응답 내용의 개념'))+'<p class="bottom-note">호출 구조를 설명하는 예시입니다. 실제 P-GPT 주소·인증·응답 형식은 사내 안내를 확인해야 합니다.</p>','',2)
add('05 · 사내 연결','키는 화면 뒤에 둡니다.','API 키는 서비스 사용 권한을 확인하는 인증 정보입니다.',
    '<div class="key-scene"><div class="browser-face"><span class="micro">사용자에게 전달되는 화면</span><h3>업무 요청 정리 도구</h3><p>입력과 결과</p><div class="key-cross">API 키를 넣지 않음</div></div><div class="server-face"><span class="micro">서버 측 설정</span><h3>백엔드</h3>'+sprite(4,'key-asset')+'<p>환경변수 등으로 인증 정보를 전달</p></div></div><p class="bottom-note">HTML 안에 넣은 키는 이용자가 확인할 수 있습니다. 공개 저장소, 공유 문서, 로그에도 인증 정보를 남기지 않습니다.</p>','dark',1.5)
add('05 · 사내 연결','공개 예제를 그대로 붙이기 전에.','사내 서비스의 실제 계약부터 확인합니다.',
    '<div class="check-ledger"><div><span>01</span><h3>신청과 접근</h3><p>신청 위치, 승인 담당, 이용 가능한 네트워크를 확인합니다.</p></div><div><span>02</span><h3>주소와 인증</h3><p>연결 주소, API 키 전달 방식, 허용 모델을 확인합니다.</p></div><div><span>03</span><h3>요청과 응답</h3><p>입력 형식, 결과 형식, 오류 응답과 지원 기능을 확인합니다.</p></div></div><details><summary>Responses API 예제를 사용할 때</summary><p>Responses API는 요청·응답 방식의 한 예입니다. P-GPT가 해당 방식과 필요한 기능을 지원하는지 확인한 뒤 실제 지원 형식에 맞춥니다. 공개 예제를 사내 연결 검증으로 간주하지 않습니다.</p></details>','',1.5)
add('05 · 사내 연결','웹 검색도, 어디서 하느냐가 다릅니다.','AI 서비스 안의 검색과 프로그램의 직접 웹 접근을 구분합니다.',
    '<div class="network-map"><div><span class="micro">경로 A</span><h3>프로그램 → P-GPT → 검색</h3><p>사내 서비스가 내장 검색을 제공하는지, 어떤 모델과 도구에서 사용할 수 있는지 확인합니다.</p></div><div><span class="micro">경로 B</span><h3>프로그램 → 외부 웹사이트</h3><p>사내 네트워크 허용 범위와 필요한 인증서·프록시 설정을 확인합니다.</p></div></div><p class="bottom-note">접속 실패, 인증 실패, 인증서 오류는 원인이 다릅니다. 실제 오류와 발생 위치를 확인하고 담당 부서의 연결 안내를 따릅니다.</p>','',1.5)

add('06 · Q&A','내 업무에서는<br>무엇부터 바꿔볼까요?','개념, 시작 방법, 업무 적용에 대한 질문을 나눕니다.',
    '<div class="final-scene"><div class="final-questions"><p>반복해서 정리하는 자료가 있나요?</p><p>결과가 맞는지 판단할 기준은 무엇인가요?</p><p>가상 자료 한 건으로 어디까지 해볼 수 있나요?</p></div>'+memo('final-memo')+'</div><div class="last-word">모르는 것은 묻고.<br><b>필요한 것은 요청하고, 결과로 확인합니다.</b></div>','cover',5)

from visual_plan2 import enhance
slides=enhance(slides)
from poseokho_plan2 import add_companions
slides=add_companions(slides)
# Reuse the actual transparent assets and embedded fonts prepared for this topic.
fontcss=''
for weight,name in [(400,'4Regular'),(600,'6SemiBold'),(800,'8ExtraBold'),(900,'9Black')]:
    data=base64.b64encode((O/f'assets/Paperlogy-{name}.woff2').read_bytes()).decode()
    fontcss+=f'@font-face{{font-family:Paperlogy;font-weight:{weight};src:url(data:font/woff2;base64,{data}) format("woff2");font-display:swap;}}'
old=(O/'AI코딩교육_인터랙티브_v2.html').read_text(encoding='utf-8')
G=json.JSONDecoder().raw_decode(old.split('const glossary=',1)[1])[0]
G.pop('Ultra',None)
G.update({'MCP':['Model Context Protocol · 도구 연결 규약','AI 애플리케이션이 외부 도구나 데이터에 연결되는 공통 규약입니다. 어떤 기능을 쓸 수 있는지는 연결된 서버와 권한에 따라 달라집니다.'], 'Skill':['반복 작업을 위한 지침과 자료','작업 순서, 참고 자료, 보조 스크립트 등을 묶어 재사용합니다. 실제로 읽고 적용하는 방식은 사용하는 에이전트에 따라 다릅니다.'], '셸':['Shell · 명령을 해석하는 프로그램','터미널에 입력한 명령을 해석해 다른 프로그램을 실행합니다. PowerShell과 Bash가 대표적인 예입니다.'], 'Markdown':['마크다운 · 간단한 문서 작성 형식','#으로 제목을, -로 목록을 표현하는 등 텍스트에 간단한 기호를 붙여 문서를 작성합니다. .md는 흔히 사용하는 파일 확장자입니다.'], '패키지':['설치와 배포를 위한 묶음','재사용할 코드와 관련 자료를 설치 가능한 단위로 묶습니다. 라이브러리를 패키지로 배포할 수 있습니다.'], 'pip':['Python 패키지 설치 도구','Python 프로젝트에서 필요한 패키지를 설치하고 관리할 때 사용합니다. 프로젝트의 가상환경 안에서 실행할 수 있습니다.'], 'uv':['Python 프로젝트와 패키지 관리 도구','Python 환경과 패키지를 준비하고 프로젝트를 실행하는 작업을 돕습니다. pip과 모든 명령이 같은 것은 아닙니다.']})
G['Python'][1]='자료 처리와 자동화를 구현할 수 있는 언어입니다. 이번 교육에서는 업무 요청을 읽고 정해진 규칙으로 결과를 만드는 역할을 설명합니다.'
G['추론'][1]='문제를 풀기 위해 검토하는 과정입니다. 추론 노력의 지원 단계와 동작은 모델·도구마다 다릅니다. 많은 자원을 쓴다고 항상 정답인 것은 아닙니다.'
G['DB'][1]='자료를 구조적으로 저장하고 조회·수정하는 데이터베이스입니다. 작은 도구는 파일에 결과를 저장하거나 브라우저 안에서만 처리할 수도 있어, 별도 DB가 항상 필요한 것은 아닙니다.'
G['P-GPT'][1]='이번 교육에서 연결 대상으로 설명하는 사내 AI 서비스입니다. 실제 주소·인증·모델·요청 형식은 사내 공식 안내가 기준이며, 이 자료에서는 실연결을 검증하지 않았습니다.'
G['Responses API'][1]='모델에 요청을 보내고 응답을 받는 API 방식의 하나입니다. 사내 P-GPT가 이 방식과 필요한 기능을 지원하는지 먼저 확인하고, 실제 지원되는 형식으로 요청해야 합니다.'
G['Vibe Coding'][1]='원하는 기능을 자연어로 요청하고, AI가 만든 프로그램을 실행·확인·수정하며 완성하는 방식입니다. 업무 담당자는 원하는 결과와 판단 기준을 설명합니다.'
asset=base64.b64encode((O/'assets/interactive-v2/asset-sheet.png').read_bytes()).decode()
render=[]
for i,s in enumerate(slides):
    render.append(f'<section class="slide {s["theme"]}" data-noclick data-index="{i}" data-chapter="{s["ch"]}" data-title="{html.escape(re.sub("<.*?>","",s["title"]))}"><header><p class="kicker">{s["ch"]} <span>AI CODING / THE MAKING ROOM</span></p><h1>{s["title"]}</h1><p class="lede">{s["sub"]}</p></header><div class="slide-body">{s["body"]}</div><span class="page-number">{i+1:02}</span></section>')
# Skeleton-derived stage, scaling and navigation; contemporary deck contract replaces manual reveals.
assert 'id="stage"' in (B/'skeleton.html').read_text(encoding='utf-8')
glossary_print=[]
used=[(k,v) for k,v in G.items() if any(k in s['body']+s['sub']+s['title'] for s in slides)]
for start in range(0,len(used),6):
    glossary_print.append('<section class="print-glossary"><p>참고 · 용어 해설</p><h2>필요할 때 다시 보는 개념</h2>'+''.join(f'<article><h3>{html.escape(k)}</h3><b>{html.escape(v[0])}</b><p>{html.escape(v[1])}</p></article>' for k,v in used[start:start+6])+'</section>')
css=(B/'plan2.css').read_text(encoding='utf-8')+(B/'visual-plan2.css').read_text(encoding='utf-8')
css+=(B/'poseokho-plan2.css').read_text(encoding='utf-8')
js=(B/'plan2.js').read_text(encoding='utf-8')+(B/'visual-plan2.js').read_text(encoding='utf-8')
page='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>업무 메모 한 장이 프로그램이 되기까지 · AI 코딩 교육</title><link rel="icon" href="data:,"><style>'+fontcss+css+'</style></head><body><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><image id="atlas" width="1536" height="1024" href="data:image/png;base64,'+asset+'"/></defs></svg><main id="stage">'+''.join(render)+'</main><footer id="deck-progress" role="status"><span id="current-label"></span><div id="chapter-track"></div><span id="counter"></span><div class="progress-rail"><i></i></div></footer><div id="concept-tip" role="tooltip" hidden><span class="tip-eyebrow">말의 뜻, 일의 맥락</span><h3></h3><b></b><p></p></div>'+''.join(glossary_print)+'<script>const glossary='+json.dumps(G,ensure_ascii=False)+';\n'+js+'</script></body></html>'
(O/'AI코딩교육_기획안2.html').write_text(page,encoding='utf-8')
(B/'plan2-content.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'slides':len(slides),'minutes':sum(s['minutes'] for s in slides),'file':'AI코딩교육_기획안2.html','bytes':len(page.encode())}))
