from pathlib import Path
import base64, json, html

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
OLD = ROOT.parent / 'assets'
slides = []

def term(key, label=None):
    return f'<button class="term" data-term="{key}">{label or key}</button>'

def art(name, alt, cls=''):
    return f'<img class="art {cls}" src="@@{name}@@" alt="{alt}">'

def add(section, title, lead, body, bridge, cls=''):
    slides.append(dict(section=section,title=title,lead=lead,body=body,bridge=bridge,cls=cls))

def cols(a,b,cls=''):
    return f'<div class="columns {cls}"><div>{a}</div><div>{b}</div></div>'

def item(title,body):
    return f'<div class="explain"><h3>{title}</h3><p>{body}</p></div>'

def btn(text, attrs='', cls=''):
    return f'<button class="action {cls}" {attrs}>{text}</button>'

add('체험', '말로 만들고,<br><em>알고 다듬는 코딩</em>', 'AI 기반 Vibe Coding · 입문 워크숍',
    cols('<p class="hero-copy">처음에는 만드는 감각을.<br>다음에는 구조와 보는 안목을.<br>마지막에는 직접 만드는 경험을.</p><p class="date">9월 29일 · 16:00–17:00</p>',art('workshop','사람이 목적을 정하고 AI와 함께 게임 화면을 만드는 장면')),
    '누구나 시작할 수 있습니다. 지식과 안목이 더 좋은 결과를 만듭니다.', 'cover')

def ide(page):
    template=(ROOT/'build/ide-workshop.html').read_text(encoding='utf-8')
    initial=page==2
    values={
        '__PAGE__':str(page),
        '__CHAT_TITLE__':'테트리스 첫 버전' if initial else '같은 게임을 하나씩 개선합니다',
        '__CHAT_INTRO__':'먼저 돌아가는 게임을 만듭니다. 자동 플레이는 처음부터 빠르게 실행합니다.' if initial else '색과 화면, 점수판, 착지 효과를 차례로 요청해 보세요. 게임판은 이어집니다.',
        '__CONTEXT__':'tetris-workshop/' if initial else '@tetris.js · @style.css',
        '__PROMPT__':'브라우저에서 실행하는 테트리스를 만들어줘. 처음에는 단순하게 만들고, 자동 플레이를 처음부터 빠르게 넣어줘.' if initial else '블록마다 색을 다르게 하고, 화면을 게임답게 꾸며줘.',
        '__SUGGESTIONS__':'' if initial else '<div class="codex-suggestions"><button data-preset="color">① 블록 색과 화면 디자인</button><button data-preset="hud">② 큰 점수판과 다음 블록</button><button data-preset="effects">③ 착지 위치와 줄 삭제 효과</button></div>'
    }
    for key,value in values.items(): template=template.replace(key,value)
    return '\n'.join(line.rstrip() for line in template.splitlines())

add('체험','Codex에 테트리스를 만들어 달라고 해봅니다','VS Code에서 요청하고, 생긴 파일과 실행 결과를 함께 확인하는 흐름입니다.',
    ide(2), '첫 버전은 투박해도 됩니다. 자동으로 움직이는 결과를 보고 다음 요청을 정합니다.', 'ide-slide')

add('체험','같은 게임도, 요청할수록 달라집니다','화면 디자인, 점수판, 착지 효과를 하나씩 더하며 전후 차이를 확인합니다.',
    ide(3), '사람이 개선 방향을 정하면 Codex가 파일을 수정합니다. 실행 결과를 보며 다시 판단합니다.', 'ide-slide')

add('사람의 역할','사람의 판단이 작업의 방향을 정합니다','방금 사람이 한 일은 코드를 쓰는 것보다, 원하는 경험을 설명하는 일이었습니다.',
    '<div class="roles"><div><span class="role-number">01</span><h3>목적을 정합니다</h3><p>“쉽게 즐길 수 있는 게임”<br>무엇을 만들지 결정합니다.</p></div><div class="role-ai"><span class="role-number">02</span><h3>AI가 구현합니다</h3><p>허용된 도구로 파일을 만들고<br>수정하며 실행을 돕습니다.</p></div><div><span class="role-number">03</span><h3>결과를 판단합니다</h3><p>“빠르다”, “잘 안 보인다”<br>사용 경험과 정답을 확인합니다.</p></div></div><div class="wide-quote">요청하는 것도 사람의 일.<br><em>무엇을 고칠지 알아보는 것도 사람의 일.</em></div>',
    'AI의 답변이 실제 파일 작업으로 이어지는 이유도 살펴봅니다.')

add('사람의 역할','코드 답변을 받는 것과, 파일이 바뀌는 것','같은 수정 요청을 두 방식으로 시연합니다. 답변을 실제 결과로 옮기는 과정을 비교해 보세요.',
    (ROOT/'build/handoff-demo.html').read_text(encoding='utf-8'),
    '', 'handoff-slide')

add('사람의 역할','지식과 안목이 결과를 바꿉니다','자연어는 전달 방식입니다. 무엇을 요구하고 어떤 결과를 받아들일지는 실력입니다.',
    cols(art('judgment','두 화면의 가독성과 구성을 비교해 개선점을 찾는 사람'),
         item('알면 더 구체적으로 요구합니다','화면과 처리의 역할을 이해하면, 어디를 왜 바꿀지 설명할 수 있습니다.')+item('보이면 더 나은 결과를 고릅니다',term('GUI')+'의 정보 배치, 가독성, 조작 흐름을 구별할수록 개선 방향이 분명해집니다.')+item('경험이 쌓이면 문제를 좁힙니다','원하는 결과가 나오지 않을 때 무엇을 확인할지 판단할 수 있습니다.')),
    '그래서 기초 개념을 배웁니다. 코드를 외우기보다, 작업을 이해하기 위해서입니다.')

add('구조 이해','작업 공간에는 무엇이 있을까요?','AI가 만든 결과는 대화창 밖의 파일에 남습니다.',
    '<div class="workspace"><div class="file-list"><span class="label">tetris-workshop/</span>'+btn('index.html','data-file="html" aria-pressed="true"')+btn('style.css','data-file="css"')+btn('game.js','data-file="js"')+btn('AGENTS.md','data-file="agents"')+btn('README.md','data-file="readme"')+'</div><div class="file-preview"><span id="file-label" class="label">index.html · 화면 구조</span><pre id="file-code"></pre><p id="file-desc"></p></div></div><p class="statement">'+term('프로젝트 폴더')+'는 코드와 자료를 함께 두는 작업 공간입니다.<br>처음에는 여러 역할을 HTML 파일 하나에 담을 수도 있습니다.</p>',
    '파일을 만들었으니, 이제 실행해서 결과를 봅니다.')

add('구조 이해','파일은 실행해야 결과가 됩니다','어떤 파일을 만들었는지에 따라 실행 방법도 달라집니다.',
    cols('<div class="tabs">'+btn('HTML 게임','data-run="html" aria-pressed="true"')+btn('Python 프로그램','data-run="python"')+'</div><div class="terminal"><span class="label" id="run-label">브라우저에서 열기</span><pre id="run-command">index.html</pre><div id="run-output">HTML 파일을 브라우저로 열면 화면을 볼 수 있습니다.</div></div>'+btn('실행 과정 보기','id="run-demo"','primary')+'<p class="fine">설명용 실행 재현입니다. 실제 셸 명령은 실행하지 않습니다.</p>',
         item(term('터미널'),'명령을 입력하고 결과를 보는 창입니다. 에이전트도 이 창을 통해 개발도구를 실행할 수 있습니다.')+item(term('Python'),'Python으로 쓴 프로그램을 실행하려면 Python 실행 환경이 필요합니다.')+item('모르는 실행 방법은 그대로 질문합니다','“이 파일을 실행하려면 무엇이 필요한지 설명하고 실행을 도와줘.”')),
    '실행된 화면에도 구조, 모양, 동작이라는 서로 다른 역할이 있습니다.')

add('구조 이해','화면의 구조, 모양, 동작','하나씩 더하면 같은 화면이 어떻게 달라지는지 보입니다.',
    cols('<div class="tabs">'+btn('HTML','data-layer="html"')+btn('+ CSS','data-layer="css"')+btn('+ JavaScript','data-layer="js" aria-pressed="true"')+'</div><div id="layer-preview" class="styled"><span>오늘의 작업</span><h3>첫 프로그램 확인</h3><p>만든 결과를 실행해 보고 확인합니다.</p><div class="task-status">상태 <strong id="layer-state">확인 전</strong></div><button id="layer-action">확인 완료</button></div><p id="layer-caption" class="fine">JavaScript가 버튼의 입력을 받아 상태를 바꿉니다.</p>',
         item(term('HTML'),'제목, 입력란, 버튼 등 화면에 무엇이 있는지 정합니다.')+item(term('CSS'),'글자 크기, 색, 간격과 배치 등 어떻게 보일지 정합니다.')+item(term('JavaScript'),'클릭이나 입력에 반응하고 화면과 데이터를 바꿉니다.')),
    '화면에서 처리할 수도 있고, 서버에 일을 요청할 수도 있습니다.')

add('구조 이해','화면 뒤의 처리와 저장','화면은 보여주고, 처리 부분은 기준을 적용하고, 저장소는 결과를 보관합니다.',
    '<div class="architecture-art" style="--architecture:url(@@architecture@@)"><div class="arch-part arch-front" role="img" aria-label="입력란과 버튼이 있는 브라우저 화면"></div><div class="arch-part arch-back" role="img" aria-label="규칙을 확인하고 요청을 처리하는 부분"></div><div class="arch-part arch-db" role="img" aria-label="자료를 보관하는 저장소"></div></div><div class="architecture-labels"><div><h3>'+term('프론트엔드')+'</h3><p>사용자가 보고 조작하는 부분</p></div><div><h3>'+term('백엔드')+'</h3><p>서버에서 요청을 처리하는 부분</p></div><div><h3>'+term('데이터베이스')+'</h3><p>데이터를 저장하고 찾아 쓰는 부분</p></div></div><div class="callout">앞에서 본 작은 게임은 브라우저 안에서 실행됩니다.<br>별도의 서버와 데이터베이스가 모든 프로그램에 필요한 것은 아닙니다.</div>',
    '서버가 있는 경우에는 요청과 결과가 어떻게 오갈까요?')

add('구조 이해','한 번의 입력이 지나가는 길','같은 점수 입력도, 처리 위치에 따라 경로가 달라집니다.',
    '<div class="tabs">'+btn('브라우저 안에서 계산','data-route="local" aria-pressed="true"')+btn('서버에 처리 요청','data-route="server"')+'</div><div class="route" id="route"><div data-node="input"><b>입력</b><span>점수 85</span></div><i>→</i><div data-node="process"><b id="process-label">브라우저 계산</b><span>80점 이상인가?</span></div><i>→</i><div data-node="result"><b>결과</b><span>기준 충족</span></div></div><div class="route-caption"><p id="route-desc">작은 순위 도구는 JavaScript로 브라우저 안에서 계산할 수 있습니다.</p>'+btn('입력 보내기','id="route-play"','primary')+'</div><div class="callout">'+term('API')+'는 프로그램이 정해진 방식으로 요청하고 결과를 받는 접점입니다.<br>서버에 맡기면 연결 상태와 오류 응답도 함께 다뤄야 합니다.</div>',
    '구조를 알았다면, 이제 결과의 품질을 보는 기준을 살펴봅니다.')

add('지식과 안목','둘 다 작동합니다. 어느 쪽이 쓰기 편한가요?','좋은 GUI를 보는 안목은 예쁜 색을 고르는 것보다 넓습니다.',
    '<div class="gui-lab"><div class="gui-controls"><label><input type="checkbox" id="gui-order"> 중요한 정보를 먼저</label><label><input type="checkbox" id="gui-spacing"> 읽기 편한 간격</label><label><input type="checkbox" id="gui-action"> 분명한 버튼 이름</label><p>같은 정보와 기능을 유지하면서<br>사용 경험을 바꿔 봅니다.</p></div><div id="gui-preview" class="rough"><div class="gui-toolbar"><span>후보 검토</span><button id="gui-button">OK</button></div><div class="gui-content"><p class="gui-date">마지막 변경 09.29</p><h3>검토할 후보 3건</h3><p class="gui-key">기준 점수 80점 · 2건 충족</p><div class="mini-row">후보 A <b>92</b><span>충족</span></div><div class="mini-row">후보 B <b>85</b><span>충족</span></div><div class="mini-row">후보 C <b>74</b><span>미달</span></div><div id="gui-feedback" aria-live="polite"></div></div></div></div>',
    '“더 예쁘게”보다 “무엇을 먼저 보고, 어떤 행동을 하게 할지”가 구체적인 기준입니다.')

add('지식과 안목','그럴듯한 결과도 틀릴 수 있습니다','화면이 정상이어도, 처리 기준이 빠졌을 수 있습니다.',
    cols('<div class="rule-input"><span class="label">업무 기준 · 80점 이상이면 충족</span><label>검토 점수<input id="rule-score" type="text" inputmode="decimal" value="85"></label><div class="tabs">'+btn('보통 값 85','data-rule="85"')+btn('경계값 80','data-rule="80"')+btn('입력 없음','data-rule=""')+btn('잘못된 값','data-rule="abc"')+'</div><label class="switch"><input id="rule-fix" type="checkbox"> 누락·경계 조건까지 수정</label></div>',
         '<div id="rule-result" class="result-panel"><span class="label">프로그램 결과</span><strong id="rule-actual">충족</strong><p id="rule-expected">기대 결과: 충족</p><p id="rule-note">이 입력에서는 맞습니다. 다른 조건도 확인해야 합니다.</p></div>')+'<p class="fine">차이를 보여주기 위해 첫 버전에는 의도적으로 잘못된 비교와 누락 처리를 넣었습니다.</p>',
    '사람이 업무 기준을 알고 있어야, 빠진 조건도 찾아낼 수 있습니다.')

add('지식과 안목','같은 “고쳐줘”에도 관찰의 깊이가 다릅니다','알고 보는 사람은 문제를 더 구체적으로 설명할 수 있습니다.',
    '<div class="lens-tabs">'+btn('화면을 보는 눈','data-lens="gui" aria-pressed="true"')+btn('처리를 이해하는 지식','data-lens="logic"')+btn('구조를 이해하는 지식','data-lens="system"')+'</div><div class="request-comparison"><div><span class="label">막연한 요청</span><blockquote id="vague-request">화면을 더 예쁘게 해줘.</blockquote></div><div><span class="label">관찰이 담긴 요청</span><blockquote id="precise-request">검토할 건수를 먼저 보여주고,<br>주요 버튼의 이름을 ‘검토 시작’으로 바꿔줘.</blockquote></div></div><p id="lens-reason" class="statement">무엇이 불편한지 볼 수 있으면, 원하는 변화도 구체적으로 말할 수 있습니다.</p>',
    '더 잘 만드는 방법을 배우는 이유는, 좋은 요구와 판단을 하기 위해서입니다.')

add('지식과 안목','기준과 변경을 다음 작업에도 이어갑니다','대화에서 합의한 기준을 남기고, 확인한 변경을 기록합니다.',
    cols('<span class="label">'+term('AGENTS.md')+' · 작업 기준</span><div class="paper compact"><p>화면은 한국어로 작성합니다.</p><p>입력이 없으면 확인을 요청합니다.</p><p>수정 후 정상·경계·누락 입력을 확인합니다.</p></div><p class="fine">지원하는 에이전트가 읽는 지침 파일입니다.<br>지침을 적어도 준수 여부는 결과로 확인합니다.</p>',
         '<span class="label">'+term('Git')+' · 변경 이력</span><div class="versions">'+btn('01 첫 화면','data-version="0"')+btn('02 처리 수정','data-version="1"')+btn('03 화면 개선','data-version="2" aria-pressed="true"')+'</div><div class="version-preview"><strong id="version-title">화면 개선</strong><p id="version-body">주요 결과를 먼저 보여주고 버튼 이름을 정리했습니다.</p></div><p class="fine">버튼은 저장된 상태를 비교하는 재현입니다.<br>실제 저장소의 이력을 바꾸지는 않습니다.</p>'),
    '이제 이런 판단을 실제 제작 과정에 써보겠습니다.')

add('실제 제작','이제 실제 에이전트에 요청합니다','10분 제작 · 후보 이름과 점수를 넣으면 순위를 보여주는 작은 도구',
    cols('<div class="prompt-box"><span class="label">첫 요청</span><p id="live-prompt">이름과 점수를 한 줄에 하나씩 입력하면 높은 점수순으로 정리하는 도구를 만들어줘. 브라우저에서 바로 여는 HTML 파일 하나로 만들고, 한국어로 보여줘. 먼저 입력과 결과가 보이는 간단한 버전을 만들어줘.</p>'+btn('요청문 복사','data-copy="live-prompt"')+'<span class="copy-status" aria-live="polite"></span></div>',
         '<div class="timer"><span class="label">실제 제작 시간</span><strong id="timer-value">10:00</strong><div>'+btn('시작','id="timer-start"','primary')+btn('초기화','id="timer-reset"')+'</div></div><div class="time-plan"><span>1분 · 목적</span><span>4분 · 제작</span><span>2분 · 확인</span><span>2분 · 수정</span><span>1분 · 재확인</span></div>'),
    '여기서는 실제 사용 환경으로 전환합니다. 다음 장에는 진행을 이어갈 수 있는 준비본이 있습니다.')

add('실제 제작','첫 결과를 직접 확인합니다','준비된 첫 버전 · 외부 AI 없이 브라우저 안에서 정렬하는 도구',
    '<div class="rank-lab"><div><label for="rank-input">이름, 점수 · 한 줄에 한 명</label><textarea id="rank-input" spellcheck="false">포석호, 85\n하늘, 92\n바다, 74</textarea><div class="tabs">'+btn('정상 입력','data-rank-sample="normal"')+btn('같은 점수','data-rank-sample="tie"')+btn('점수 누락','data-rank-sample="missing"')+btn('빈 입력','data-rank-sample="empty"')+'</div><p class="fine">실제 생성이 지연되면 준비본임을 밝히고 이어갑니다.<br>입력한 자료는 외부로 전송하지 않습니다.</p></div><div class="rank-results"><div class="window-bar"><span>순위 결과</span><span id="rank-count">3명</span></div><div id="rank-errors" aria-live="polite"></div><ol id="rank-output"></ol></div></div>',
    '보기 좋게 정렬됐습니다. 같은 점수와 빠진 값은 어떻게 다뤄야 할까요?')

add('실제 제작','수정할 기준을 말하고 다시 확인합니다','실제 에이전트에 수정 요청을 보낸 뒤, 처음 입력과 예외 입력을 함께 확인합니다.',
    cols('<div class="prompt-box"><span class="label">추가 요청</span><p id="fix-prompt">같은 점수는 공동 순위로 표시해줘. 1위가 두 명이면 다음은 3위야. 점수가 비었거나 숫자가 아니거나 0~100 범위를 벗어나면 해당 줄을 알려줘. 80점 이상을 강조하고, 이름과 점수가 먼저 보이게 화면을 정리해줘. 정상·동점·누락 입력을 다시 확인해줘.</p>'+btn('수정 요청 복사','data-copy="fix-prompt"')+'<span class="copy-status" aria-live="polite"></span></div>',
         '<div class="test-select">'+btn('정상','data-test="normal" aria-pressed="true"')+btn('동점','data-test="tie"')+btn('누락','data-test="missing"')+btn('범위 밖','data-test="range"')+'</div><div class="test-result" id="final-test"></div><p class="fine">오른쪽은 수정 기준을 반영한 준비본입니다.<br>실제 생성 결과도 같은 입력으로 별도 확인합니다.</p>'),
    'AI로 만들었지만, 이 정렬 도구가 실행될 때 AI를 부르는 것은 아닙니다.')

add('AI 연결','AI로 제작하기와 AI 기능 넣기','AI가 코드를 작성했는지와 프로그램이 AI를 호출하는지는 서로 다른 질문입니다.',
    '<div class="compare"><div class="paper"><span class="label">AI로 만든 프로그램</span><h3>점수 정렬</h3><div class="simple-flow"><b>85, 92, 74</b><span>정해진 코드로 계산</span><b>92, 85, 74</b></div><p>실행할 때 AI 호출 없이 동작합니다.<br>앞에서 만든 도구가 여기에 해당합니다.</p></div><div class="paper blue-paper"><span class="label">실행 중 AI를 사용하는 프로그램</span><h3>문장 분류</h3><div class="simple-flow"><b>“접속이 자꾸 끊겨요.”</b><span>AI 서비스에 분류 요청</span><b>접속 문제</b></div><p>AI의 결과를 받아 화면에 활용합니다.<br>분류가 맞는지 확인할 기준도 필요합니다.</p></div></div>',
    '프로그램 안에서 AI 기능을 쓰려면 서비스와 연결해야 합니다.')

add('AI 연결','AI 요청이 지나가는 경로','P-GPT를 연결하는 경우의 개념도입니다. 실제 주소와 지원 형식은 사내 안내로 확인합니다.',
    '<div class="api-lab"><div class="api-input"><label for="api-text">분류할 문장</label><input id="api-text" value="접속이 자꾸 끊겨요."><div class="tabs">'+btn('정상 응답','data-api-mode="ok" aria-pressed="true"')+btn('연결 실패','data-api-mode="error"')+'</div>'+btn('요청 흐름 보기','id="api-send"','primary')+'<p class="fine">미리 정한 규칙으로 응답을 재현합니다.<br>실제 P-GPT 호출이나 AI 분류가 아닙니다.</p></div><div class="api-route"><div id="api-screen"><span>화면</span><p>사용자 입력</p></div><i>↓</i><div id="api-server"><span>백엔드</span><p>'+term('API 키')+'는 서버 측에서 사용</p></div><i>↓</i><div id="api-service"><span>P-GPT API</span><p id="api-result">아직 요청하지 않았습니다.</p></div></div></div>',
    '연결 방식뿐 아니라, AI가 틀리거나 응답하지 않을 때도 생각해야 합니다.')

add('AI 연결','연결 전에 확인할 내용','개념을 이해한 다음, 실제 사용 환경에 맞는 정보를 확인합니다.',
    '<div class="connection-grid"><div><span class="large-index">01</span><h3>사용 가능한 방식</h3><p>사내 신청 경로와 사용 권한,<br>호출 주소·요청 형식을 확인합니다.</p></div><div><span class="large-index">02</span><h3>키와 입력 자료</h3><p>키를 공유 화면이나 코드에 노출하지 않고,<br>입력 가능한 자료 범위를 확인합니다.</p></div><div><span class="large-index">03</span><h3>결과와 실패 처리</h3><p>AI 응답이 틀리거나 연결이 끊겼을 때<br>사용자에게 무엇을 보여줄지 정합니다.</p></div></div><div class="callout">'+term('환경변수')+'로 실행 설정을 분리할 수 있습니다.<br>환경변수 자체가 키를 암호화하거나 노출을 자동으로 막아주지는 않습니다.</div><p class="fine">사내 신청 링크·모델·주소·지원 기능은 이 자료에서 확인되지 않았습니다.</p>',
    '처음 시작할 때는, 필요한 도구부터 하나씩 준비하면 됩니다.')

add('시작과 질문','무엇을 만들지에 따라 준비가 달라집니다','먼저 사용할 에이전트와 작업 폴더를 정하고, 실행에 필요한 것만 준비합니다.',
    '<div class="tabs">'+btn('HTML 도구','data-setup="html" aria-pressed="true"')+btn('Python 처리','data-setup="python"')+btn('AI 연결 도구','data-setup="api"')+'</div><div class="setup-path" id="setup-path"></div><p id="setup-desc" class="statement"></p><div class="callout">'+term('라이브러리')+'는 이미 만들어진 기능을 가져다 쓰는 방법입니다.<br>Python '+term('가상환경')+'은 프로젝트별 패키지를 분리합니다. 필요해질 때 배우면 됩니다.</div>',
    '설치 이름을 모두 외우기보다, 지금 필요한 이유를 물어보면 됩니다.')

add('시작과 질문','막히면 현재 상황을 보여줍니다','설명을 부탁하는 것과 작업을 부탁하는 것을 함께 사용할 수 있습니다.',
    '<div class="question-stack"><div><span>뜻이 낯설 때</span><blockquote>“지금 나온 API가 이 프로그램에서 무슨 역할인지 설명해줘.”</blockquote></div><div><span>실행이 안 될 때</span><blockquote>“이 오류가 났어. 원인을 확인하고, 필요한 작업을 진행해줘.”</blockquote></div><div><span>결과가 이상할 때</span><blockquote>“80점도 충족이어야 하는데 미달로 나와. 이 기준으로 고쳐줘.”</blockquote></div></div><p class="statement">현재 입력, 실제 결과, 기대한 결과를 함께 보여주면<br>어디서 차이가 생겼는지 확인하기 쉽습니다.</p>',
    '만들면서 배우고, 배운 만큼 더 구체적으로 요청합니다.')

add('시작과 질문','배운 만큼 보이고, 보이는 만큼 다듬습니다','작은 제작 경험에 구조 이해와 GUI 안목을 계속 더합니다.',
    cols(art('learning','기술 자료를 읽으며 작은 프로그램을 점차 개선하는 사람'),
         item('하나 만들고','입력과 결과가 분명한 작은 기능부터 실행해 봅니다.')+item('왜 그런지 묻고','파일과 코드가 어떤 역할을 하는지 설명을 받습니다.')+item('좋은 결과와 비교합니다','읽기 쉬운 화면과 정확한 처리의 차이를 구체적으로 찾아봅니다.')),
    '만들기 시작하는 문턱은 낮아졌습니다. 잘 만드는 지식과 안목은 계속 쌓아갑니다.')

add('시작과 질문','어떤 부분이 궁금하신가요?','Q&A · 5분',
    '<div class="qa"><div class="qa-mark">?</div><div><h3>처음 시작하는 방법</h3><h3>화면과 처리의 역할</h3><h3>내 업무에서 만들 수 있는 작은 기능</h3><p>오늘 기억할 것은 요청, 실행, 확인, 수정의 흐름입니다.<br>무엇을 요구하고 어떻게 판단할지는 지식과 경험이 채워줍니다.</p></div></div>',
    '누구나 시작할 수 있습니다. 더 잘 만드는 힘은 지식과 안목에서 나옵니다.', 'closing')

glossary = {
'Vibe Coding':['원하는 기능을 자연어로 설명하고, AI가 만든 코드를 실행하고 수정하며 프로그램을 만드는 접근입니다.','이 교육에서는 요청, 실행, 결과 확인, 수정의 흐름으로 경험합니다. AI가 코드를 작성하더라도 목적과 업무 기준을 설명하고 결과를 판단하는 일이 필요합니다.','시작하는 문턱은 낮아지지만, 복잡한 기능을 잘 만들려면 프로그램 지식과 화면을 보는 안목을 계속 쌓아야 합니다.'],
'브라우저':['웹 페이지를 열고 사용하는 프로그램입니다.','Edge, Chrome 등이 해당합니다. HTML과 CSS로 화면을 표시하고 JavaScript를 실행합니다. 브라우저에서 할 수 있는 일과 서버에서 하는 일은 구분해서 봅니다.','오늘의 HTML 파일은 브라우저에서 직접 열어 사용할 수 있고, 외부 서비스 연결 없이 준비된 체험이 동작합니다.'],
'서버':['다른 프로그램의 요청을 받아 기능이나 데이터를 제공하는 프로그램 또는 그 실행 환경입니다.','브라우저가 요청하는 계산, 저장, 인증 같은 일을 맡을 수 있습니다. 서버 쪽 처리 부분을 백엔드라고 부릅니다. 모든 작은 도구에 별도 서버가 필요한 것은 아닙니다.','여러 사람이 같은 자료를 조회하거나, 비밀 키를 사용해 AI 서비스에 요청할 때 서버 쪽 처리를 둘 수 있습니다.'],
'Node.js':['JavaScript를 브라우저 밖에서 실행하는 환경입니다.','서버 프로그램이나 일부 개발도구가 이를 사용합니다. JavaScript를 사용하는 모든 화면에 별도로 설치해야 하는 것은 아닙니다.','오늘처럼 브라우저에서 여는 단일 HTML 파일에는 Node.js 설치가 필요하지 않습니다. 만들 프로그램에 맞춰 필요한지 확인합니다.'],
'패키지':['프로그램 기능이나 도구를 설치하고 배포할 수 있게 묶은 단위입니다.','라이브러리나 실행 프로그램이 담길 수 있습니다. 패키지 관리자는 이런 묶음을 설치하고 버전을 관리하는 도구입니다.','Python의 pip, JavaScript 생태계의 npm 등이 있습니다. 특정 패키지가 왜 필요한지, 어떻게 설치하는지는 에이전트에게 물어볼 수 있습니다.'],
'Markdown':['제목과 목록 같은 문서 구조를 간단한 문자 기호로 표현하는 형식입니다.','파일 확장자는 보통 .md입니다. 코드를 실행하는 프로그램이 아니라 사람이 읽을 설명과 규칙을 적는 데 자주 사용합니다.','README.md에는 실행 안내를, AGENTS.md에는 지원하는 에이전트가 참고할 작업 기준을 기록할 수 있습니다.'],
'코딩 에이전트':['파일과 도구를 사용해 코딩 작업을 수행하는 AI 시스템입니다.','일반적인 코드 답변을 넘어, 연결된 작업 공간에서 파일을 읽고 수정하고 명령을 실행할 수 있습니다. 가능한 행동은 제품, 연결된 도구, 권한에 따라 달라집니다.','게임의 점수 표시를 수정하고 실행 결과를 확인하도록 요청할 수 있습니다. 완료 메시지와 실제 결과는 함께 확인합니다.'],
'GUI':['Graphical User Interface. 화면의 버튼, 입력란, 목록 등으로 조작하는 사용자 인터페이스입니다.','정보가 어떤 순서로 보이는지, 글자가 읽히는지, 다음 행동이 분명한지를 함께 봅니다. 보기 좋은 장식만 뜻하지 않습니다.','“예쁘게”보다 “검토 건수를 먼저 보여주고 주요 버튼의 이름을 구체적으로 바꿔줘”라고 요청할 수 있습니다.'],
'프로젝트 폴더':['하나의 프로그램에 필요한 파일과 자료를 모아 둔 폴더입니다.','코드, 참고 자료, 설정, 실행 안내를 함께 관리합니다. 에이전트가 어느 폴더에서 작업하는지 확인해야 다른 작업과 섞이지 않습니다.','tetris-workshop 폴더에 index.html과 실행 안내를 두고, 그 폴더에서 변경을 이어갑니다.'],
'터미널':['문자 명령을 입력하고 프로그램의 출력을 보는 창입니다.','PowerShell 같은 셸이 명령을 해석합니다. CLI는 버튼 대신 명령어로 도구를 사용하는 방식을 뜻합니다. 터미널, 셸, CLI는 연결된 개념이지만 같은 뜻은 아닙니다.','python app.py에서 python은 실행할 도구, app.py는 실행할 파일입니다. 파일 위치와 설치 상태가 맞아야 실행됩니다.'],
'Python':['데이터 처리나 서버 프로그램 등에 사용하는 프로그래밍 언어입니다.','Python 코드를 실행하는 환경을 설치해야 해당 코드를 동작시킬 수 있습니다. 웹 화면을 구성하는 HTML과 역할이 다릅니다.','점수를 읽어 계산하는 app.py를 Python으로 실행할 수 있습니다. 모든 작은 HTML 도구에 Python이 필요한 것은 아닙니다.'],
'HTML':['웹 화면의 구조와 내용에 의미를 부여하는 마크업 언어입니다.','제목, 문단, 입력란, 버튼 같은 요소를 표현합니다. 그 자체가 AI 기능이거나 서버를 뜻하지는 않습니다.','버튼이 있다는 구조는 HTML로, 버튼의 색과 간격은 CSS로, 누른 뒤의 변화는 JavaScript로 구성할 수 있습니다.'],
'CSS':['화면의 색, 크기, 간격, 배치 같은 표현을 정하는 스타일 언어입니다.','같은 HTML이어도 CSS에 따라 읽는 순서와 사용 경험이 달라집니다. 화면 크기에 맞는 배치도 다룹니다.','점수를 크게 표시하고 주된 버튼을 눈에 띄게 배치합니다. 색을 바꾼다고 잘못된 계산이 고쳐지는 것은 아닙니다.'],
'JavaScript':['웹 화면의 입력과 상태 변화 등을 구현하는 프로그래밍 언어입니다.','브라우저에서 버튼 클릭에 반응하고 데이터를 계산할 수 있습니다. 브라우저 밖의 실행 환경에서도 사용할 수 있습니다.','오늘의 순위 도구는 브라우저 안에서 입력을 읽고 정렬합니다. 외부 AI나 별도 서버를 호출하지 않습니다.'],
'프론트엔드':['사용자가 직접 보고 조작하는 부분입니다.','웹 프로그램에서는 브라우저에 표시되는 화면과 그 동작이 대표적입니다. 화면 구성뿐 아니라 입력 검사나 일부 계산도 할 수 있습니다.','이름과 점수를 입력하는 칸, 정렬 결과, 오류 안내가 해당합니다. 모든 처리 로직이 반드시 백엔드에 있어야 하는 것은 아닙니다.'],
'백엔드':['서버 쪽에서 요청을 받아 처리하는 부분입니다.','데이터 확인, 공통 업무 규칙, 권한 검사, 저장, 다른 서비스 호출 등을 맡을 수 있습니다. 브라우저만으로 충분한 도구에는 별도 백엔드가 없을 수도 있습니다.','여러 사용자가 공유하는 자료를 저장하거나, 서버에서 인증 정보를 사용해 AI 서비스에 요청할 때 필요할 수 있습니다.'],
'데이터베이스':['데이터를 체계적으로 저장하고 조회하는 저장소입니다.','화면을 닫은 뒤에도 자료를 보관하거나 여러 조건으로 찾아 쓰는 데 활용합니다. 어떤 자료를 어떻게 보관할지에 따라 구조가 달라집니다.','현재 순위 도구는 입력을 메모리에서만 처리합니다. 계속 보관하려면 파일 저장이나 데이터베이스 등 저장 방법을 별도로 설계해야 합니다.'],
'API':['Application Programming Interface. 프로그램끼리 정해진 방법으로 기능을 요청하고 결과를 받는 접점입니다.','웹 API에서는 주소, 요청 형식, 인증 방식과 응답 형식 등을 약속합니다. API는 AI에만 있는 것이 아닙니다.','브라우저가 서버에 점수 계산을 요청하거나, 백엔드가 AI 서비스에 문장 분류를 요청할 수 있습니다. 실패 응답도 처리해야 합니다.'],
'AGENTS.md':['이를 지원하는 코딩 에이전트에 프로젝트의 작업 규칙을 전달하는 문서입니다.','Markdown 형식의 텍스트 파일입니다. 읽는 위치와 적용 범위는 사용하는 도구에 따라 다르며, 파일이 있다는 것만으로 모든 도구가 자동 적용하지는 않습니다.','“한국어 화면으로 작성”, “수정 후 정상·누락·경계 입력 확인” 같은 기준을 남깁니다. 규칙을 적어도 결과 확인은 필요합니다.'],
'Git':['파일의 변경 이력을 기록하고 비교하는 버전 관리 도구입니다.','확인한 변경을 커밋으로 기록하고 과거 내용과 차이를 볼 수 있습니다. 자동으로 모든 수정이 기록되는 것은 아닙니다. GitHub는 저장소를 온라인으로 보관하고 협업하는 서비스입니다.','화면 수정 전후를 비교하거나, 잘 동작하던 상태를 찾아 복구 방법을 검토할 수 있습니다.'],
'API 키':['서비스를 사용하는 주체나 권한을 확인하는 인증 정보입니다.','노출되면 다른 사람이 권한이나 사용량을 악용할 수 있습니다. 브라우저에 전달한 코드와 값은 사용자에게 보일 수 있으므로, 비밀 키는 서버 측에서 관리합니다.','발표자료·공유 파일·브라우저 화면에 실제 키를 넣지 않습니다. 이 자료에는 실제 키 입력란이나 서비스 연결이 없습니다.'],
'환경변수':['실행 환경에서 프로그램으로 전달하는 설정값입니다.','코드 자체를 바꾸지 않고 주소나 실행 옵션을 다르게 주는 데 사용합니다. 비밀값도 전달할 수 있지만, 자동 암호화나 유출 방지를 보장하지는 않습니다.','서버 실행 시 서비스 주소와 인증 정보를 설정합니다. 로그에 출력하거나 화면에 전달하면 노출될 수 있습니다.'],
'라이브러리':['다른 프로그램에서 가져다 쓸 수 있도록 만든 기능 모음입니다.','패키지는 설치·배포 가능한 묶음이고 라이브러리를 포함할 수 있습니다. 패키지 관리자는 이런 묶음의 설치와 버전을 관리합니다.','표 읽기, 차트 그리기 같은 기능을 가져다 쓸 수 있습니다. 무엇이 필요한지는 만드는 프로그램에 따라 달라집니다.'],
'가상환경':['Python 프로젝트마다 패키지 설치 환경을 분리하는 공간입니다.','서로 다른 프로젝트에서 필요한 패키지 버전이 충돌하는 일을 줄입니다. 가상 머신이나 별도의 컴퓨터를 만드는 것은 아닙니다.','프로젝트 A와 B가 서로 다른 버전의 같은 라이브러리를 쓸 때 각 환경을 따로 준비할 수 있습니다.']
}

def main():
    css='\n'.join((ROOT/('build/'+name)).read_text(encoding='utf-8') for name in ['style.css','ide-workshop.css','handoff-demo.css'])
    js='\n'.join((ROOT/('build/'+name)).read_text(encoding='utf-8') for name in ['tetris-workshop.js','handoff-game.js','handoff-demo.js','app.js'])
    fonts=''.join('@font-face{font-family:Paperlogy;font-weight:'+str(weight)+';font-display:swap;src:url(data:font/woff2;base64,'+base64.b64encode((OLD/name).read_bytes()).decode()+') format("woff2")}\n' for weight,name in [(400,'Paperlogy-4Regular.woff2'),(600,'Paperlogy-6SemiBold.woff2'),(800,'Paperlogy-8ExtraBold.woff2')])
    parts=[]
    for i,s in enumerate(slides):
        parts.append(f'<section class="slide {s["cls"]}" data-index="{i}" data-section="{s["section"]}" data-noclick aria-label="{i+1}. {html.escape(s["title"].replace("<br>"," ").replace("<em>","").replace("</em>",""))}"><header><div class="eyebrow">AI CODING WORKSHOP <span>{s["section"]}</span></div><h1>{s["title"]}</h1><p class="lead">{s["lead"]}</p></header><main class="slide-body">{s["body"]}</main><div class="bridge">{s["bridge"]}</div>'+('<div class="fullscreen-note">F 또는 우클릭으로 전체화면 보기</div>' if i==0 else '')+'</section>')
    glossary_html='<section class="print-glossary"><h1>용어 자세히 보기</h1>'+''.join('<article><h2>'+html.escape(k)+'</h2>'+''.join('<p>'+html.escape(p)+'</p>' for p in v)+'</article>' for k,v in glossary.items())+'</section>'
    result='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 코딩 · 체험과 안목 v3</title><link rel="icon" href="data:,"><style>'+fonts+css+'</style></head><body><div id="stage">'+''.join(parts)+'<footer><div class="progress-track"><i id="progress-fill"></i></div><div class="footer-label"><span id="section-label"></span><span id="page-label" aria-live="polite"></span></div></footer></div><aside id="term-panel" role="tooltip" hidden></aside>'+glossary_html+'<script>const GLOSSARY='+json.dumps(glossary,ensure_ascii=False)+';</script><script>'+js+'</script></body></html>'
    for name in ['workshop','judgment','architecture','learning']:
        result=result.replace('@@'+name+'@@','data:image/webp;base64,'+base64.b64encode((ASSETS/(name+'.webp')).read_bytes()).decode())
    (ROOT/'AI코딩교육_체험과안목_v3.html').write_text(result,encoding='utf-8')
    (ROOT/'build/slides.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding='utf-8')
    (ROOT/'build/glossary.json').write_text(json.dumps(glossary,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'slides':len(slides),'glossary':len(glossary),'html_bytes':len(result.encode())}))

if __name__=='__main__': main()
