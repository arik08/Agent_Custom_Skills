from pathlib import Path
import base64, json, html

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets'
OLD = ROOT / 'assets'
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

def layer_label(kind, label):
    if kind == 'js':
        shape = '<rect x="1" y="1" width="30" height="30" rx="3" fill="#f7df1e"/><text x="17" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#292d32">JS</text>'
    else:
        color, digit = ('#e44d26', '5') if kind == 'html' else ('#1572b6', '3')
        shape = f'<path fill="{color}" d="M3 1h26l-2.4 26L16 31 5.4 27z"/><text x="16" y="23" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="900" fill="white">{digit}</text>'
    prefix = '<span>+</span>' if label.startswith('+ ') else ''
    label = label.removeprefix('+ ')
    return f'{prefix}<svg class="layer-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">{shape}</svg><span>{label}</span>'

def file_label(name):
    ext = Path(name).suffix.lower()
    kind = 'readme' if name.lower() == 'readme.md' else {'.html':'html', '.css':'css', '.js':'js', '.md':'md'}.get(ext, 'file')
    shapes = {
        'html': '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 20"/>',
        'css': '<path d="M9 3 6 21M18 3l-3 18M3 9h18M2 15h18"/>',
        'js': '<rect x="1" y="1" width="22" height="22" rx="2" fill="currentColor" stroke="none"/><text x="12" y="17" text-anchor="middle" fill="#273039" stroke="none" font-family="Arial,sans-serif" font-size="12" font-weight="700">JS</text>',
        'md': '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M5 16V8l3 4 3-4v8m6-8v8m-3-3 3 3 3-3"/>',
        'readme': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none"/>',
        'file': '<path d="M5 2h9l5 5v15H5zM14 2v6h5"/>'
    }
    return f'<svg class="workspace-file-icon icon-{kind}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{shapes[kind]}</svg><span>{html.escape(name)}</span>'

add('체험', '아이디어에서 실행까지,<br><em>AI와 함께하는 코딩</em>', '경영기획본부 · AI 기반 Vibe Coding · 입문',
    cols('<p class="hero-copy">작은 프로그램 하나를<br>직접 만들고 고쳐보며<br>코딩의 기본을 익힙니다.</p><p class="presenter">경영기획본부 경영기획DX추진TF팀<br>오명철 과장</p>','<iframe id="cover-diorama" title="사람의 요청에 따라 AI가 코드를 수정하고 실행하는 3D 코딩 작업실" tabindex="-1" sandbox="allow-scripts"></iframe>'),
    '', 'cover')

def ide(page):
    template=(ROOT/'build/ide-workshop.html').read_text(encoding='utf-8')
    icon_dir=ROOT.parent/'input/vscode-icons'
    template=template.replace('__CODEX_ICON__',(icon_dir/'codex-blossom.svg').read_text(encoding='utf-8'))
    logo=base64.b64encode((icon_dir/'code-stable.png').read_bytes()).decode()
    template=template.replace('__VSCODE_LOGO__','<img src="data:image/png;base64,'+logo+'" alt="">')
    for name in ['files','search','source-control','debug-alt','extensions','chevron-down']:
        svg=(icon_dir/(name+'.svg')).read_text(encoding='utf-8')
        template=template.replace('__ICON_'+name+'__',svg)
    initial=page==2
    values={
        '__PAGE__':str(page),
        '__CHAT_TITLE__':'테트리스 첫 버전' if initial else '같은 게임을 하나씩 개선합니다',
        '__CHAT_INTRO__':'먼저 돌아가는 게임을 만듭니다. 자동 플레이는 처음부터 빠르게 실행합니다.' if initial else '색과 화면, 점수판, 착지 효과를 차례로 요청해 보세요. 게임판은 이어집니다.',
        '__CONTEXT__':'tetris-workshop/' if initial else '@tetris.js · @style.css',
        '__PROMPT__':'',
        '__SUGGESTIONS__':'<div class="codex-suggestions"><button data-preset="build">테트리스 첫 버전 만들기</button></div>' if initial else '<div class="codex-suggestions"><button data-preset="color">① 블록 색과 화면 디자인</button><button data-preset="hud">② 큰 점수판과 다음 블록</button><button data-preset="effects">③ 착지 위치와 줄 삭제 효과</button></div>'
    }
    for key,value in values.items(): template=template.replace(key,value)
    return '\n'.join(line.rstrip() for line in template.splitlines())

add('체험','AI 에이전트에 요청해 테트리스 만들기','게임 만들기를 요청하고, 에이전트가 만든 파일과 실행된 게임을 확인합니다.',
    ide(2), '첫 버전은 투박해도 됩니다. 자동으로 움직이는 결과를 보고 다음 요청을 정합니다.', 'ide-slide')

add('체험','추가 요청으로 테트리스 기능 개선하기','화면 디자인, 점수판, 착지 효과를 차례로 요청하고 게임이 어떻게 달라지는지 비교합니다.',
    ide(3), '', 'ide-slide')

add('사람의 역할','AI가 코딩할 때, 사람은 무엇을 할까요?','사람은 만들 목적을 정하고, AI가 구현한 결과를 보며 다음에 고칠 부분을 판단합니다.',
    '<div class="roles" data-step-highlight><div class="is-current" aria-current="step"><span class="role-number">01</span><h3>목적 정하기</h3><p>“쉽게 즐길 수 있는 게임”<br>무엇을 만들지 결정합니다.</p></div><div><span class="role-number">02</span><h3>AI의 구현</h3><p>허용된 도구로 파일을 만들고<br>수정하며 실행을 돕습니다.</p></div><div><span class="role-number">03</span><h3>결과 판단하기</h3><p>“빠르다”, “잘 안 보인다”<br>사용 경험과 정답을 확인합니다.</p></div></div><div class="wide-quote"><strong>AI가 개발을 맡으면, 사람은 그 개발을 이끄는 리더가 됩니다.</strong><br><span class="leader-description">무엇을 왜 만들지 설명하고, 우선순위를 정하고,<br>결과가 목적에 맞는지 확인하며 다음 개선을 이끕니다.</span></div>',
    '이제 같은 기능을 두 방식으로 만들어 보겠습니다.', 'roles-slide')
slides[-1]['body'] = slides[-1]['body'].replace('<div class="wide-quote">', '<div class="roles-bottom"><div class="wide-quote">') + art('workshop','사람이 목적을 정하고 AI와 함께 게임 화면을 만드는 장면','roles-art') + '</div>'

add('사람의 역할','일반 챗봇과 코딩 에이전트, 무엇이 다를까?','같은 기능을 요청해 봅니다. 일반 챗봇의 코드는 사람이 옮겨 적용하고, 코딩 에이전트는 파일을 직접 수정하고 실행합니다.',
    (ROOT/'build/handoff-demo.html').read_text(encoding='utf-8'),
    '', 'handoff-slide')

add('사람의 역할','만든 테트리스, 무엇을 고쳐 달라고 할까요?','앞에서 만든 게임을 보며, 화면에 필요한 요소·보이는 방식·게임 동작을 나눠 요청합니다.',
    cols(art('judgment','두 화면의 가독성과 구성을 비교해 개선점을 찾는 사람'),
         item('화면 구성 · 다음 블록이 안 보일 때','“게임판 옆에 다음 블록을 보여주는 영역을 추가해줘.”')+item('디자인 · 점수가 잘 안 읽힐 때','“점수 글자를 키우고, 어두운 배경에서도 잘 보이는 밝은 색으로 바꿔줘.”')+item('동작 · 다시 시작해도 점수가 남을 때','“새 게임을 시작하면 이전 점수가 남지 않도록 0점으로 초기화해줘.”')),
    '이 요청들은 어떤 파일에 반영될까요? 이제 AI가 만든 프로젝트 폴더를 열어봅니다.')

add('구조 이해','AI가 만든 파일은 어디에 있고, 무슨 역할일까요?','프로젝트 폴더에서 화면·디자인·동작을 담은 파일과 작업 지침·실행 안내를 살펴봅니다.',
    '<div class="workspace"><div class="file-list"><span class="label">tetris-workshop/</span>'+btn(file_label('index.html'),'data-file="html" aria-pressed="true"')+btn(file_label('style.css'),'data-file="css"')+btn(file_label('game.js'),'data-file="js"')+btn(file_label('AGENTS.md'),'data-file="agents"')+btn(file_label('README.md'),'data-file="readme"')+'</div><div class="file-preview"><span id="file-label" class="label">index.html · 화면 구조</span><pre id="file-code"></pre><p id="file-desc"></p></div></div><p class="statement">'+term('프로젝트 폴더')+'는 코드와 자료를 함께 두는 작업 공간입니다.<br>처음에는 여러 역할을 HTML 파일 하나에 담을 수도 있습니다.</p>',
    '각 파일이 맡는 구조, 모양, 동작을 화면에서 살펴봅니다.')

add('구조 이해','HTML·CSS·JavaScript는 각각 무엇을 할까요?','같은 화면에 구조, 디자인, 클릭 동작을 하나씩 더하며 세 가지 역할을 비교합니다.',
    cols('<div class="tabs">'+btn(layer_label('html', 'HTML'),'data-layer="html"')+btn(layer_label('css', '+ CSS'),'data-layer="css"')+btn(layer_label('js', '+ JavaScript'),'data-layer="js" aria-pressed="true"')+'</div><div id="layer-preview" class="styled"><span>오늘의 작업</span><h3>첫 프로그램 확인</h3><p>만든 결과를 실행해 보고 확인합니다.</p><div class="task-status">상태 <strong id="layer-state">확인 전</strong></div><button id="layer-action">확인 완료</button></div><p id="layer-caption" class="fine">JavaScript가 버튼의 입력을 받아 상태를 바꿉니다.</p>',
         item(term('HTML'),'제목, 입력란, 버튼 등 화면의 구성 요소')+item(term('CSS'),'글자 크기, 색, 간격과 배치 등 화면의 표현 방식')+item(term('JavaScript'),'클릭·입력에 따른 화면과 데이터의 변화')),
    '각 역할을 담은 파일은 어떻게 실행해서 확인할까요?')

add('구조 이해','HTML과 Python 파일은 어떻게 실행할까요?','HTML 파일 열기, Python 실행, Python 서버의 주소로 HTML 화면 열기를 비교합니다.',
    cols('<div class="tabs">'+btn('HTML 게임','data-run="html" aria-pressed="true"')+btn('Python 프로그램','data-run="python"')+btn('HTML+Python 혼합','data-run="hybrid"')+'</div><div class="terminal run-window" data-run-mode="html"><div class="run-titlebar"><span id="run-window-title">브라우저</span><span class="run-window-controls" aria-hidden="true">─　□　×</span></div><div class="run-window-body"><span class="label" id="run-label">주소</span><div class="run-command-row"><span id="run-prefix" aria-hidden="true">↻</span><pre id="run-command">file:///C:/tetris-workshop/index.html</pre></div><div id="run-output">HTML 파일을 브라우저로 열면 화면을 볼 수 있습니다.</div><div id="run-hybrid" hidden><div class="run-address-row"><button type="button" class="run-link" data-address="localhost">http://localhost:5000</button><span>내 PC · 이름</span></div><div class="run-address-row"><button type="button" class="run-link" data-address="127.0.0.1">http://127.0.0.1:5000</button><span>내 PC · 루프백 IP</span></div><div class="run-address-row"><button type="button" class="run-link" data-address="192.168.0.10">http://192.168.0.10:5000</button><span>다른 기기 · 내부 IP 예시</span></div><p>5000 = Python 서버가 사용하는 포트<br>다른 기기: 같은 네트워크 + 서버 0.0.0.0 바인딩 + 방화벽 허용<br>내부 IP는 실행한 PC마다 다릅니다. 사용하는 동안 서버를 켜 둡니다.</p></div><div id="run-browser" hidden><div class="hybrid-address">브라우저 · http://127.0.0.1:5000</div><strong>매출 요약</strong><p>HTML이 화면을 보여주고, Python이 데이터를 처리합니다.</p><span>이번 달 합계　₩1,250,000</span></div></div></div>'+'<p class="fine">실제로는 개발 플랫폼에 따라 실행 방법이 달라질 수 있습니다.</p>',
         item(term('터미널'),'명령을 입력하고 결과를 보는 창입니다. 에이전트도 이 창을 통해 개발도구를 실행할 수 있습니다.')+item(term('Python'),'Python으로 쓴 프로그램을 실행하려면 Python 실행 환경이 필요합니다.')+item('잘 모르겠으면...? 그냥 AI Agent에게,','“이 프로그램 실행시켜줘” 라고 하세요 😅')),
    '브라우저 화면과 Python 서버는 각각 어떤 역할을 맡을까요?')

add('구조 이해','프론트엔드·백엔드·데이터베이스의 역할','사용자가 보는 화면, 서버의 요청 처리, 데이터 저장이 각각 어떤 일을 맡는지 살펴봅니다.',
    '<div class="architecture-art" style="--architecture:url(@@architecture@@)"><div class="arch-part arch-front" role="img" aria-label="입력란과 버튼이 있는 브라우저 화면"></div><div class="arch-part arch-back" role="img" aria-label="규칙을 확인하고 요청을 처리하는 부분"></div><div class="arch-part arch-db" role="img" aria-label="자료를 보관하는 저장소"></div></div><div class="architecture-labels"><div><h3>'+term('프론트엔드')+'</h3><p>사용자가 보고 조작하는 부분</p></div><div><h3>'+term('백엔드')+'</h3><p>서버에서 요청을 처리하는 부분</p></div><div><h3>'+term('데이터베이스')+'</h3><p>데이터를 저장하고 찾아 쓰는 부분</p></div></div><div class="callout">앞에서 본 작은 게임은 브라우저 안에서 실행됩니다.<br>별도의 서버와 데이터베이스가 모든 프로그램에 필요한 것은 아닙니다.</div>',
    '서버가 있는 경우에는 요청과 결과가 어떻게 오갈까요?')

add('구조 이해','간단한 계산은 JS로, 복잡한 계산은 백엔드로','평균 계산은 브라우저에서 바로, 조건이 많은 생산 계획 계산은 서버에 맡기는 예시입니다.',
    (ROOT/'build/route-comparison.html').read_text(encoding='utf-8'),
    '처리 위치는 계산량과 필요한 데이터에 따라 정합니다. 백엔드에서도 JavaScript를 사용할 수 있습니다.')

add('안목과 지식','좋은 화면을 보는 안목이란?','화면에서 무엇이 불편한지 알아보고, 어떻게 바꾸면 쓰기 편해질지 판단하는 능력입니다.',
    '<div class="gui-lab"><div class="gui-controls"><label><input type="checkbox" id="gui-spacing"> 읽기 편한 간격</label><label><input type="checkbox" id="gui-order"> 중요한 정보를 먼저</label><label><input type="checkbox" id="gui-action"> 분명한 버튼 이름</label><label><input type="checkbox" id="gui-radius"> 절제된 모서리 라운드</label><p>무엇이 불편한가요?<br>하나씩 바꾸며 비교해 보세요.</p></div><div id="gui-preview" class="rough"><div class="gui-toolbar"><span>후보 검토</span><button id="gui-button">OK</button></div><div class="gui-content"><p class="gui-date">마지막 변경 09.29</p><h3>검토할 후보 3건</h3><p class="gui-key">기준 점수 80점 · 2건 충족</p><div class="mini-row">후보 A <b>92</b><span>충족</span></div><div class="mini-row">후보 B <b>85</b><span>충족</span></div><div class="mini-row">후보 C <b>74</b><span>미달</span></div><div id="gui-feedback" aria-live="polite"></div></div></div></div>',
    '이 판단이 있어야 AI에게 “더 예쁘게”를 넘어, 어디를 왜 바꿀지 말할 수 있습니다.')

add('안목과 지식','막연한 “고쳐줘”가 아닌 구체적인 수정 요청으로','어디가 불편한지 짚고, 원하는 결과를 말하면 AI가 수정할 기준이 생깁니다.',
    (ROOT/'build/request-examples.html').read_text(encoding='utf-8'),
    '요청의 핵심은 두 가지입니다. “지금 어떤 문제가 있는지” + “어떻게 되어야 하는지”.')

add('안목과 지식','AGENTS.md로 지침을, Git으로 되돌릴 지점을','반복해서 시키는 일은 지침으로 남기고, 중요한 작업 상태는 저장해 안심하고 수정합니다.',
    (ROOT/'build/agents-git.html').read_text(encoding='utf-8'),
    'AGENTS.md는 앞으로 지킬 지침, Git은 돌아갈 수 있는 작업 기록입니다.', 'agents-git-slide')

import runpy
runpy.run_path(str(ROOT / 'build/ranking-story.py'))['install'](add, ROOT)

add('LLM API 연동 프로그램 개발하기','API 키는 환경변수나 .env에 보관하세요','API 키는 내 계정으로 AI를 쓰게 해 주는 비밀 열쇠입니다. 코드에 직접 적지 않고 따로 관리합니다.',
    '<div class="key-guide"><div class="key-instructions"><div class="key-step"><span>01</span><div><h3>키는 코드 밖에 저장</h3><p>'+term('환경변수')+'는 실행할 때 전달하는 설정값,<br>'+term('.env')+'는 그 값을 적어 두는 파일입니다.</p></div></div><div class="key-example"><b>.env 파일 예시</b><code>API_KEY=여기에_발급받은_키</code><small>설명용 예시입니다. 실제 키를 화면에 공유하지 마세요.</small></div><div class="key-step"><span>02</span><div><h3>프로그램은 저장한 값을 읽어 사용</h3><p>AI에게 “키를 환경변수에서 읽도록 해줘.<br>.env를 쓸 경우 불러오는 설정도 해줘.”</p></div></div><div class="key-step"><span>03</span><div><h3>공유 전 확인도 AI에게 맡기기</h3><p>“공유할 파일에 API 키가 들어 있지 않은지<br>확인하고, 필요한 설정도 해줘.”</p></div></div></div><figure class="key-warning"><img src="@@api-key-thief@@" alt="API KEY를 훔친 도둑이 AI를 마구 사용해 주인의 지갑이 비고 긴 영수증이 나오는 만화"><figcaption><strong>“AI는 도둑이 쓰고, 요금은 내가?!”</strong><p>키가 유출되면 충전 잔액이 바닥날 수 있어요.<br>결제 설정에 따라 추가 요금도 생길 수 있습니다.</p><small>유출됐다면 즉시 키를 폐기하고 새로 발급받으세요.</small></figcaption></figure></div>',
    '기억할 것은 하나: API 키는 환경변수나 .env에. 설정과 확인은 AI에게 요청하세요.', 'api-key-guide')

add('라이브러리와 실행 환경','코딩에는 어떤 재료와 준비가 필요할까요?','모든 기능을 처음부터 만들지 않습니다. 공개된 오픈소스를 가져와, 내 목적에 맞게 연결하고 필요한 부분을 만듭니다.',
    (ROOT/'build/package-blocks.html').read_text(encoding='utf-8'),
    'AI에게 “필요한 라이브러리와 이유를 설명하고, 이 프로젝트의 가상환경에 설치한 뒤 실행해줘.”', 'package-slide')

add('크고 복잡한 일은 사전 의견일치부터','복잡한 작업은, AI와 생각을 맞춘 뒤 시작하기','대화로 목표와 방법을 구체화하고, 서로 이해한 내용이 맞는지 확인한 뒤 코딩을 시작합니다.',
    (ROOT/'build/learning-scenes.html').read_text(encoding='utf-8'),
    '', 'learning-slide')

add('Q & A · 질의응답','여러분은 어떤 부분이 궁금하신가요?','',
    '<div class="qa"><img class="qa-illustration" src="@@qa-discussion@@" alt="노트북을 둘러싸고 질문과 의견을 나누는 사람들"></div>',
    '', 'closing')

glossary = {
'Vibe Coding':['원하는 기능을 자연어로 설명하고, AI가 만든 코드를 실행하고 수정하며 프로그램을 만드는 접근입니다.','이 교육에서는 요청, 실행, 결과 확인, 수정의 흐름으로 경험합니다. AI가 코드를 작성하더라도 목적과 업무 기준을 설명하고 결과를 판단하는 일이 필요합니다.','예를 들어 테트리스를 만든 뒤, 점수판 추가와 블록 색 변경을 요청하고 게임에 반영됐는지 확인합니다.'],
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
 'AGENTS.md':['AI 에이전트가 작업을 시작하기 전에 읽고 따르는 프로젝트 지침 파일입니다.','사용자가 반복해서 요청하는 방식과 꼭 지킬 규칙을 적어 두면 매번 다시 설명하지 않아도 작업마다 적용할 수 있습니다. 단, Claude의 경우 AGENTS.md가 아닌 CLAUDE.md를 기본으로 읽습니다.','AGENTS.md를 지원하는 에이전트에서 사용하며, 읽는 위치와 적용 범위는 도구에 따라 다릅니다.'],
'Git':['작업 상태를 기록해 이전 상태로 되돌리고, 여러 사람의 변경을 합칠 수 있는 버전 관리 도구입니다.','커밋은 프로젝트 전체 상태를 가리키는 저장 지점입니다. 매번 전체 파일을 새로 복사하지 않고, 바뀌지 않은 파일은 기존 내용을 재사용합니다. 변경된 코드 부분은 차이 비교로 확인할 수 있습니다. 브랜치는 작업 흐름을 나누고, 머지는 나눈 작업을 합칩니다.','수정 전에 커밋을 남기면 문제가 생겼을 때 복원할 수 있습니다. GitHub 같은 원격 저장소에 올려 두면 별도 백업과 팀 협업에도 활용할 수 있습니다.'],
'API 키':['서비스를 사용하는 주체나 권한을 확인하는 인증 정보입니다.','노출되면 다른 사람이 권한이나 사용량을 악용할 수 있습니다. 브라우저에 전달한 코드와 값은 사용자에게 보일 수 있으므로, 비밀 키는 서버 측에서 관리합니다.','발표자료·공유 파일·브라우저 화면에 실제 키를 넣지 않습니다. 이 자료에는 실제 키 입력란이나 서비스 연결이 없습니다.'],
'환경변수':['실행 환경에서 프로그램으로 전달하는 설정값입니다.','API_KEY라는 이름에 발급받은 키를 설정하면 프로그램은 이름으로 그 값을 읽을 수 있습니다. 코드에 실제 키를 적지 않아도 됩니다.','환경변수나 .env가 자동으로 암호화해 주지는 않습니다. 키를 로그에 출력하거나 브라우저에 전달하지 않습니다.'],
'.env':['API_KEY=값처럼 실행 설정을 적어 두는 파일입니다.','프로젝트에서 .env를 읽도록 설정해야 값이 프로그램에 전달됩니다. 파일만 만들었다고 모든 프로그램이 자동으로 읽는 것은 아닙니다.','실제 키가 든 .env는 공유하거나 GitHub에 올리지 않습니다. 웹 서비스에서는 서버 측에서 불러오며, 브라우저에 포함되는 공개 설정으로 사용하지 않습니다.'],
'.gitignore':['Git에 새로 기록하지 않을 파일을 지정하는 목록입니다.','.gitignore 파일에 .env를 한 줄로 적으면 Git이 아직 추적하지 않는 .env 파일을 제외할 수 있습니다.','이미 Git에 기록한 파일에는 소급 적용되지 않습니다. 키가 올라갔다면 파일을 지우는 것만으로는 부족하므로 키를 즉시 폐기하고 재발급합니다.'],
'라이브러리':['다른 프로그램에서 가져다 쓸 수 있도록 만든 기능 모음입니다.','패키지는 설치·배포 가능한 묶음이고 라이브러리를 포함할 수 있습니다. 패키지 관리자는 이런 묶음의 설치와 버전을 관리합니다.','표 읽기, 차트 그리기 같은 기능을 가져다 쓸 수 있습니다. 무엇이 필요한지는 만드는 프로그램에 따라 달라집니다.'],
'가상환경':['Python 프로젝트마다 패키지 설치 환경을 분리하는 공간입니다.','서로 다른 프로젝트에서 필요한 패키지 버전이 충돌하는 일을 줄입니다. 가상 머신이나 별도의 컴퓨터를 만드는 것은 아닙니다.','프로젝트 A와 B가 서로 다른 버전의 같은 라이브러리를 쓸 때 각 환경을 따로 준비할 수 있습니다.']
}

def main():
    css='\n'.join((ROOT/('build/'+name)).read_text(encoding='utf-8') for name in ['style.css','ide-workshop.css','handoff-demo.css','ranking-story.css'])
    js='\n'.join((ROOT/('build/'+name)).read_text(encoding='utf-8') for name in ['tetris-workshop.js','handoff-game.js','handoff-demo.js','app.js','cover-diorama.js'])
    fonts=''.join('@font-face{font-family:Paperlogy;font-weight:'+str(weight)+';font-display:swap;src:url(data:font/woff2;base64,'+base64.b64encode((OLD/name).read_bytes()).decode()+') format("woff2")}\n' for weight,name in [(400,'Paperlogy-4Regular.woff2'),(600,'Paperlogy-6SemiBold.woff2'),(800,'Paperlogy-8ExtraBold.woff2')])
    parts=[]
    for i,s in enumerate(slides):
        header_date = '<p class="date">9월 29일 · 16:00–17:00</p>' if i == 0 else ""
        parts.append(f'<section class="slide {s["cls"]}" data-index="{i}" data-section="{s["section"]}" data-noclick aria-label="{i+1}. {html.escape(s["title"].replace("<br>"," ").replace("<em>","").replace("</em>",""))}"><header><div class="eyebrow">AI CODING WORKSHOP <span>{s["section"]}</span></div><h1>{s["title"]}</h1><p class="lead">{s["lead"]}</p>{header_date}</header><main class="slide-body">{s["body"]}</main><div class="bridge">{s["bridge"]}</div>'+('<div class="fullscreen-note"><span>F 또는 우클릭으로 전체화면 보기</span><span>마우스 휠 또는 ←, → 키로 슬라이드 넘기기</span></div>' if i==0 else '')+'</section>')
    glossary_html='<section class="print-glossary"><h1>용어 자세히 보기</h1>'+''.join('<article><h2>'+html.escape(k)+'</h2>'+''.join('<p>'+html.escape(p)+'</p>' for p in v)+'</article>' for k,v in glossary.items())+'</section>'
    result='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 코딩 · 체험과 안목 v3</title><link rel="icon" href="data:,"><style>'+fonts+css+'</style></head><body><div id="stage">'+''.join(parts)+'<footer><div class="progress-track"><i id="progress-fill"></i></div><div class="footer-label"><span id="section-label"></span><span id="page-label" aria-live="polite"></span></div></footer></div><aside id="term-panel" role="tooltip" hidden></aside>'+glossary_html+'<script>const GLOSSARY='+json.dumps(glossary,ensure_ascii=False)+';</script><script>'+js+'</script></body></html>'
    scene_data=base64.b64encode((ROOT/'build/cover-diorama.html').read_bytes()).decode()
    result=result.replace('<script>const GLOSSARY=', '<script id="cover-diorama-data" type="application/octet-stream">'+scene_data+'</script><script>const GLOSSARY=')
    for name in ['workshop','judgment','learning']:
        result=result.replace('@@'+name+'@@','data:image/webp;base64,'+base64.b64encode((ASSETS/(name+'.webp')).read_bytes()).decode())
    result=result.replace('@@architecture@@','data:image/png;base64,'+base64.b64encode((ASSETS/'architecture-webtoon-spaced.png').read_bytes()).decode())
    result=result.replace('@@planning-together@@','data:image/png;base64,'+base64.b64encode((ASSETS/'planning-together-transparent.png').read_bytes()).decode())
    result=result.replace('@@qa-discussion@@','data:image/webp;base64,'+base64.b64encode((ASSETS/'qa-discussion-transparent.webp').read_bytes()).decode())
    result=result.replace('@@bob-ross-easy@@','data:image/png;base64,'+base64.b64encode((ASSETS/'bob-ross-easy.png').read_bytes()).decode())
    result=result.replace('@@api-key-thief@@','data:image/png;base64,'+base64.b64encode((ASSETS/'api-key-thief-transparent-v2.png').read_bytes()).decode())
    result=result.replace('@@python-project-preparation@@','data:image/png;base64,'+base64.b64encode((ASSETS/'python-project-preparation.png').read_bytes()).decode())
    (ROOT/'AI코딩교육_체험과안목_v3.html').write_text(result,encoding='utf-8')
    (ROOT/'build/slides.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding='utf-8')
    (ROOT/'build/glossary.json').write_text(json.dumps(glossary,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'slides':len(slides),'glossary':len(glossary),'html_bytes':len(result.encode())}))

if __name__=='__main__': main()
