from pathlib import Path
import json,base64,re,runpy,html
OUT=Path(__file__).resolve().parents[1]
old=runpy.run_path(str(OUT/'build/build_deck.py'))
slides=json.loads((OUT/'build/slides.json').read_text(encoding='utf-8'))
def sprite(n,cls=''):
 return f'<svg class="sprite {cls}" viewBox="{n%3*512} {n//3*512} 512 512" aria-hidden="true"><use href="#asset-atlas"/></svg>'
def scene(n):
 sets={0:[0,1,2],1:[1,3,0],2:[5,0,2],3:[4,3,1]}
 return '<div class="asset-scene"><div class="orbit o1"></div><div class="orbit o2"></div>'+''.join(sprite(v,f'piece p{k}') for k,v in enumerate(sets[n]))+'<span class="scene-word">'+['IDEA → ACTION','BUILD & REFINE','CHECK & IMPROVE','CONNECT WITH CARE'][n]+'</span></div>'
# Preserve the brief's 29 core slides + 3 reference slides, but rebuild presentation mechanics.
for s in slides:
 s['body']=re.sub(r'<div class="art art(\d)"[^>]*></div>',lambda m:scene(int(m[1])),s['body'])
 s['body']=re.sub(r'\sdata-step="\d+"','',s['body'])
 s['body']=re.sub(r'<p class="end-keys">.*?</p>','',s['body'],flags=re.S)
 s['attrs']=''
 s['body']=s['body'].replace('2026-09-16','2026-09-17')
slides[0]['body']='''<div class="cover-copy"><p class="eyebrow">AI CODING LAB / BEGINNER</p><h1>업무를 아는 당신,<br>AI와 함께<br><em>만드는 사람으로.</em></h1><p class="lede">말로 요청하고, 실행하고, 결과로 확인하는<br>AI 기반 Vibe Coding 첫 한 시간.</p><div class="cover-date">2026. 09. 29. 화　16:00–17:00</div><div class="cover-triad"><span>업무 지식</span><i>+</i><span>AI의 실행력</span><i>=</i><b>나의 작은 도구</b></div></div>'''+scene(0)
slides[0]['title']='업무를 아는 당신, AI와 함께 만드는 사람으로.'
slides[7]['body']='''<div class="anatomy-lab"><div><div class="section-label">ONE SCREEN · THREE ROLES</div><div class="tabset" role="group" aria-label="웹 구성 요소"><button data-layer="html" aria-pressed="false">HTML</button><button data-layer="css" aria-pressed="false">+ CSS</button><button data-layer="js" aria-pressed="true">+ JavaScript</button></div><div id="web-preview" class="styled"><h3>오늘의 업무</h3><p>구조 위에 디자인과 동작을 더합니다.</p><div class="preview-task">월간 실적 취합 <b>진행</b></div><div class="preview-task done">회의실 예약 <b>완료</b></div><button id="preview-filter">완료 숨기기</button></div></div><div class="rows"><div class="row" data-link="html"><b>HTML · 구조</b><p>제목, 문장, 목록, 버튼을 배치합니다. 무엇이 화면에 존재하는지 정합니다.</p></div><div class="row" data-link="css"><b>CSS · 모양</b><p>색·서체·간격·배치로 읽는 순서를 만듭니다. 같은 내용도 다르게 보입니다.</p></div><div class="row" data-link="js"><b>JavaScript · 동작</b><p>완료 항목을 숨기듯 사용자의 입력에 따라 화면과 데이터를 바꿉니다.</p></div></div></div>'''
slides[5]['body']=slides[5]['body'].replace('<div class="fake-button">미완료만 보기</div>','<button class="intro-toggle" aria-pressed="false">미완료만 보기</button>').replace('실제 조작 예제는 본 시연에서 이어집니다.','가상 업무를 사용하는 로컬 예제 · AI 실시간 생성 화면 아님')
slides[11]['body']=slides[11]['body'].replace('Low / Light','기본 설정').replace('Medium','검토 강화').replace('High / Extra High','복잡한 문제에 집중')
slides[11]['body']+='<p class="small">원안에 제시된 세 모델의 비교이며 전체 모델 목록은 아닙니다. Artificial Analysis는 참고하되 같은 업무 예제로 결과·시간·사용량을 함께 비교합니다.</p>'
slides[16]['body']=slides[16]['body'].replace('<button id="reset-demo"','<input id="task-search" aria-label="업무 검색" placeholder="업무 검색"><button id="reset-demo"')
# Ensure search exists regardless of original attribute order.
if 'task-search' not in slides[16]['body']:
 slides[16]['body']=slides[16]['body'].replace('<div class="filters">','<div class="filters"><input id="task-search" aria-label="업무 검색" placeholder="업무 검색">')
slides[16]['body']+='<div class="owner-bars" aria-label="담당자별 표시 업무 건수"></div>'
slides[17]['body']=slides[17]['body'].replace('필수 열이 없습니다: 상태','<span id="error-output">필수 열이 없습니다: 상태</span>')
slides[17]['body']+='<div class="error-actions"><button data-case="missing" aria-pressed="true">상태 열 누락</button><button data-case="empty" aria-pressed="false">빈 파일</button><button data-case="ok" aria-pressed="false">정상 6건</button></div>'
slides[18]['body']=slides[18]['body'].replace('</div></div>', '<details class="concept-detail"><summary>지침이 적용되는 범위</summary><p>프로젝트의 반복 규칙을 기록합니다. 도구가 해당 파일을 읽는지 확인하고, 상위 폴더의 지침과 충돌하는지도 살핍니다. 지침 파일이 실행 권한이나 사내 정책을 대신하지는 않습니다.</p></details></div></div>')
slides[28]['body']=slides[28]['body'].replace('부록: 설치 링크 · 시작 명령 · 요청 문장','')
insights=[
'코딩 문법을 모두 외우는 시간이 아닙니다. 원하는 결과를 설명하고, AI가 만든 도구를 실행해 보고, 업무 기준에 맞게 고치는 흐름을 경험합니다.',
'모르는 용어는 그때 확인하면 됩니다. 더 중요한 것은 “무엇을 만들지”와 “무엇을 보면 성공인지”를 구체적으로 말하는 능력입니다.',
'설치를 동시에 따라 하는 실습은 하지 않습니다. 하나의 업무 예제를 따라 개념을 익히고, 시연 결과를 함께 확인하는 구성입니다.',
'예를 들어 “미완료”에 대기·진행·보류 중 무엇을 포함할지는 업무 담당자가 정합니다. 이 판단을 알려줘야 프로그램의 집계 기준도 정해집니다.',
'Coding Agent는 연결된 도구로 파일과 실행 결과를 다룹니다. GUI나 마우스 제어는 별도 도구와 권한이 지원될 때만 가능합니다.',
'작은 요구를 먼저 완성하면 바뀐 부분을 확인하기 쉽습니다. 기능을 한꺼번에 많이 요청하기보다, 하나를 추가하고 결과를 확인합니다.',
'이 구조는 웹 앱의 대표적인 역할 분담입니다. 오늘의 CSV 보고서는 Python으로 파일을 만들고 브라우저로 여는 방식이므로 별도 서버·DB 없이도 시작할 수 있습니다.',
'프론트엔드와 백엔드 모두 요구사항·예외·검증이 중요합니다. 보이는 화면이 예쁘다는 것과 프로그램이 정확히 동작한다는 것은 따로 확인합니다.',
'한 프로젝트의 패키지 버전을 바꿨을 때 다른 프로젝트가 깨지지 않도록 분리합니다. 라이브러리를 쓰더라도 어떤 입력과 결과를 다루는지는 확인해야 합니다.',
'CLI는 문자 명령으로 도구를 실행하는 방식입니다. Python 실행이나 파일 처리를 요청할 수 있지만, 화면·마우스 조작 자체는 GUI 자동화 도구의 역할입니다.',
'Git은 변경을 저장하는 도구이고 GitHub는 저장소를 공유하는 서비스입니다. 환경변수는 설정 전달 수단이며, 비밀값을 자동으로 암호화해 주지는 않습니다.',
'처음에는 기본값으로 작게 시도합니다. 결과가 부족하면 요구사항을 보완하고, 어려운 분석·수정에서 더 많은 추론을 쓰는 선택을 검토합니다.',
'전체 6건 중 완료는 2건, 미완료는 4건입니다. 미완료 담당자별 건수는 민지 2건·준호 1건·서연 1건이어야 합니다.',
'좋은 요청은 AI가 해야 할 일뿐 아니라 하지 말아야 할 일과 확인 방법도 담습니다. 원본 보존·출력 위치·누락 열 처리까지 함께 적습니다.',
'파일 목록은 결과가 어디 생겼는지, 변경 내용은 무엇이 바뀌었는지, 터미널은 실제 실행이 성공했는지 보여줍니다. 대화창의 완료 메시지만으로 판단하지 않습니다.',
'코드는 같은 규칙을 반복 실행하는 도구입니다. Python이 CSV를 읽어 계산한 뒤 HTML을 저장하면 브라우저는 그 결과를 화면으로 보여줍니다.',
'기본 집계와 담당자 필터는 LLM 없이도 실행됩니다. 이 화면은 네트워크를 호출하지 않는 실제 HTML 예제이며 사내 시스템과 연결된 화면이 아닙니다.',
'오류 메시지를 지우는 것보다 원인을 확인하는 것이 먼저입니다. 정상 데이터뿐 아니라 비어 있는 입력과 필수 열 누락에서도 예측 가능한 안내가 필요합니다.',
'공통 지침에는 작업 방식과 확인 기준을 남깁니다. 사용 중인 도구가 어느 경로의 지침을 읽는지도 확인해야 하며, 지침 파일 자체가 권한을 부여하지는 않습니다.',
'첫 시작은 한 가지 도구 경로로 충분합니다. 같은 목표라도 도구마다 지원 기능과 설정이 다르므로 사내에서 허용한 경로를 우선합니다.',
'Python은 오늘의 CSV 처리 예제를 실행하는 데 필요합니다. Node.js는 모든 AI 코딩의 필수품이 아니라 JavaScript 개발이나 npm 설치 방식에서 필요합니다.',
'샌드박스는 가능한 접근 범위를, 승인 정책은 어느 행동에서 확인을 받을지를 정합니다. 둘은 서로 다른 설정이며 회사 정책을 대신하지 않습니다.',
'개발할 때 AI를 썼다고 완성된 프로그램이 항상 AI를 호출하는 것은 아닙니다. 규칙 기반 집계는 그대로 실행하고, 자연어 요약이 필요할 때 별도 API 기능을 더할 수 있습니다.',
'API Key는 호출을 인증하는 정보입니다. 배포한 HTML 안에 넣으면 이용자가 볼 수 있으므로 서버 측 설정에서 관리하고 브라우저에는 전달하지 않습니다.',
'P-GPT 신청 주소·담당자·모델·인증 방식은 사내 안내로 확인해야 합니다. 공개 API의 예제가 비슷해 보여도 P-GPT와 동일하게 동작한다고 가정하지 않습니다.',
'이 코드는 공개 OpenAI API의 호출 구조를 설명합니다. 실제 실행에는 SDK·유효한 인증·접속 환경이 필요하며, 사내 P-GPT 연결 성공을 뜻하지 않습니다.',
'인증 실패, 인증서 문제, 접속 실패는 원인이 다릅니다. 오류 종류와 발생 위치를 정리해 전달하고, 인증서 검증 해제를 기본 해결책으로 사용하지 않습니다.',
'처음부터 큰 시스템을 만들 필요는 없습니다. 가상 데이터로 작은 흐름을 완성한 다음 실제 업무의 예외와 확인 기준을 하나씩 더합니다.',
'입력 → 처리 → 출력 → 확인 기준. 이 네 가지를 말할 수 있으면 다음 대화를 시작할 수 있습니다. 오늘의 목표는 완벽한 코드보다 반복해서 개선하는 방법입니다.',
'설치 링크와 도구 지원 범위는 바뀔 수 있습니다. 회사에서 승인한 설치·로그인·네트워크 기준을 먼저 확인하고 공식 안내를 따릅니다.',
'프로젝트 폴더는 AI가 작업 맥락을 이해하는 출발점입니다. 교육용 복사본을 열고, 모델·권한을 확인한 뒤 범위가 작은 첫 요청을 전달합니다.',
'질문에 기대 결과와 실제 결과를 함께 넣으면 수정 방향이 구체적이 됩니다. 한 번에 끝내기보다 실행 결과를 근거로 다음 요청을 이어갑니다.'
]
G={
'Vibe Coding':('자연어로 의도를 전달하는 개발 방식','원하는 기능을 말로 요청하고 생성된 코드를 실행·수정하며 완성합니다. 분위기만 전달하는 것보다 입력·처리·출력·확인 기준을 구체적으로 주는 것이 중요합니다.'),
'Coding Agent':('도구를 사용해 개발 작업을 수행하는 AI','대화뿐 아니라 허용된 파일 읽기·수정·명령 실행 도구로 작업합니다. 어떤 행동이 가능한지는 연결 도구와 권한에 따라 다릅니다.'),
'프론트엔드':('Frontend · 사용자가 만나는 화면','브라우저의 제목, 목록, 입력란, 버튼과 그 동작을 담당합니다. 사용자의 입력을 받아 서버에 요청하거나 브라우저 안에서 직접 처리할 수 있습니다.'),
'백엔드':('Backend · 뒤에서 요청을 처리하는 부분','자료를 읽고 계산하고 저장한 뒤 결과를 돌려줍니다. Python은 구현에 사용할 수 있는 언어 중 하나입니다. 작은 파일 기반 도구에는 서버가 없어도 됩니다.'),
'JavaScript':('화면을 반응하게 만드는 프로그래밍 언어','버튼 클릭을 처리하고 목록을 필터링하거나 화면 내용을 바꿉니다. 브라우저 밖에서도 Node.js 같은 실행 환경으로 사용할 수 있습니다.'),
'HTML':('HyperText Markup Language · 화면의 구조','제목·문단·표·입력란처럼 화면을 구성하는 요소와 의미를 작성합니다. 이 발표 자료도 HTML로 구성돼 브라우저에서 열립니다.'),
'CSS':('Cascading Style Sheets · 화면의 모양','색·글자·간격·정렬·애니메이션을 정합니다. HTML의 같은 구조를 유지하면서 디자인을 바꿀 수 있습니다.'),
'CSV':('Comma-Separated Values · 표를 저장하는 텍스트','행과 열로 된 자료를 쉼표로 구분해 저장합니다. 오늘 예제는 담당자·업무·상태 세 열을 사용합니다. 따옴표나 인코딩에 따라 읽기 처리가 필요할 수 있습니다.'),
'Python':('자료 처리와 자동화에 많이 쓰는 언어','파일을 읽고 계산하고 결과 파일을 저장하는 프로그램을 만들 수 있습니다. 이번 예제에서는 CSV를 읽고 HTML 보고서를 만듭니다.'),
'라이브러리':('미리 만들어 둔 재사용 기능','표 처리·이미지 변환·차트 등 필요한 기능을 가져다 씁니다. 직접 작성할 코드를 줄이지만 버전과 사용 방법은 확인해야 합니다.'),
'가상환경':('프로젝트별 패키지를 분리하는 작업 환경','A 프로젝트와 B 프로젝트가 서로 다른 패키지 버전을 쓰도록 분리합니다. 별도의 컴퓨터나 가상 머신을 만드는 것은 아닙니다.'),
'터미널':('문자 명령을 입력하고 결과를 보는 창','터미널 안에서 PowerShell 같은 셸이 명령을 해석합니다. 파일 목록을 보거나 Python 프로그램을 실행하는 데 사용합니다.'),
'CLI':('Command Line Interface · 문자 명령 방식','버튼 대신 명령어와 옵션으로 프로그램을 조작합니다. 터미널은 창, 셸은 명령 해석기, CLI는 도구를 사용하는 방식입니다.'),
'PowerShell':('Windows에서 사용하는 셸과 자동화 환경','명령을 해석하고 도구를 실행합니다. pwd는 현재 위치, dir은 목록, cd는 폴더 이동, cls는 화면 정리, ipconfig는 네트워크 설정 확인에 사용합니다.'),
'GitHub':('Git 저장소를 원격에 보관하는 협업 서비스','변경 이력을 공유하고 검토할 수 있습니다. 저장소가 공개되면 파일도 공개될 수 있으므로 코드에 API Key 등 비밀값을 넣지 않습니다.'),
'Git':('파일의 변경 이력을 관리하는 도구','작업의 특정 상태를 기록하고 차이를 비교하거나 이전 내용을 되찾을 수 있습니다. 커밋은 변경 상태를 남기는 기록 단위입니다.'),
'환경변수':('코드 밖에서 프로그램에 전달하는 설정','API 주소·모델 이름·인증 정보 등을 실행 환경에서 전달합니다. 그 자체가 자동 암호화 저장소는 아니므로 접근 권한과 로그 노출을 관리해야 합니다.'),
'Node.js':('브라우저 밖에서 JavaScript를 실행하는 환경','웹 서버나 개발 도구를 실행할 때 사용합니다. npm 기반 도구 설치 경로에서도 필요하지만 모든 Python 업무 자동화에 필요한 것은 아닙니다.'),
'npm':('JavaScript 패키지 관리 도구','필요한 패키지나 CLI를 설치하고 프로젝트 명령을 실행합니다. 설치 명령의 출처와 회사에서 허용한 경로를 확인합니다.'),
'API Key':('API 호출을 인증하는 비밀 정보','호출 주체와 권한을 확인하는 데 쓰입니다. HTML·공개 저장소에 넣거나 화면에 노출하지 않고 서버 측 설정에서 관리합니다.'),
'Responses API':('모델에 입력을 보내 응답을 받는 API','공개 OpenAI API의 요청 방식 중 하나입니다. 예제의 model은 사용할 모델, input은 입력이며 output_text로 응답 텍스트를 읽습니다. P-GPT의 지원 여부는 별도로 확인해야 합니다.'),
'API':('Application Programming Interface · 프로그램 간 약속','어느 주소로 어떤 요청을 보내고 어떤 응답을 받을지 정합니다. 식당의 주문서처럼 형식이 맞아야 처리할 수 있습니다.'),
'LLM':('Large Language Model · 대규모 언어 모델','문맥을 바탕으로 언어를 생성·분석하는 모델입니다. 자연어 요약에는 유용하지만 정해진 규칙의 집계에 반드시 필요한 것은 아닙니다.'),
'P-GPT':('기획안에서 다루는 사내 AI 서비스','실제 주소·인증·모델·요청 형식은 사내 공식 안내가 기준입니다. 이 발표의 공개 API 예제를 사내 호환성 검증으로 해석하지 않습니다.'),
'AGENTS.md':('프로젝트 작업 규칙을 전달하는 지침 파일','원본 보존·결과 폴더·오류 처리·검증 기준 같은 반복 규칙을 적습니다. 도구별로 읽는 위치와 적용 범위를 확인해야 합니다.'),
'샌드박스':('프로그램이 접근할 수 있는 범위를 제한하는 장치','파일·네트워크 등 접근 범위를 제어합니다. 행동마다 확인을 받을지를 정하는 승인 정책과는 구분됩니다.'),
'Full Access':('Agent의 접근 범위를 넓히는 설정','파일·명령·네트워크 등의 접근 범위를 넓힐 수 있습니다. 사용 가능한 범위와 승인 방식은 환경에 따라 다르므로 회사 정책과 맡길 일을 함께 확인합니다.'),
'프록시':('통신을 중간에서 전달하는 서버','사내 네트워크에서 외부 연결을 중계하거나 정책을 적용합니다. 주소가 맞아도 프록시 설정 때문에 접속이 되지 않을 수 있습니다.'),
'CA':('Certificate Authority · 인증서 발급 기관','통신 상대의 인증서를 신뢰할지 판단하는 체계와 관련됩니다. 회사에서 정한 CA 적용 방법을 따르고 검증을 끄는 방식으로 우회하지 않습니다.'),
'추론':('문제를 풀기 위해 검토하는 과정','추론 노력을 높이면 더 많은 시간과 사용량을 들여 검토할 수 있지만 정답을 보장하지는 않습니다. 기본값에서 시작해 결과를 비교합니다.'),
'Ultra':('여러 에이전트를 활용하는 작업 모드','여러 에이전트가 작업을 나누는 방식입니다. 단일 모델의 추론 노력 설정과 구분하며 제공 여부와 사용량은 환경에서 확인합니다.'),
'VS Code':('Visual Studio Code · 파일과 코드를 다루는 편집기','폴더·코드·터미널·확장을 한 화면에서 사용할 수 있습니다. AI 확장을 연결하면 프로젝트 맥락에서 작업을 요청할 수 있습니다.'),
'DB':('Database · 자료를 구조적으로 저장하는 곳','데이터를 조회·수정하며 관리합니다. 작은 예제에서는 별도 데이터베이스 대신 CSV 같은 파일로도 시작할 수 있습니다.')
}
fontcss=''.join(f"@font-face{{font-family:Paperlogy;font-weight:{w};font-display:swap;src:url(data:font/woff2;base64,{base64.b64encode((OUT/'assets'/f'Paperlogy-{n}.woff2').read_bytes()).decode()}) format('woff2')}}" for w,n in [(400,'4Regular'),(600,'6SemiBold'),(800,'8ExtraBold')])
asset=base64.b64encode((OUT/'assets/interactive-v2/asset-sheet.png').read_bytes()).decode()
basecss=old['CSS'].split('#chapter-tag')[0]
css=(OUT/'build/interactive-v2.css').read_text(encoding='utf-8')
js=(OUT/'build/interactive-v2.js').read_text(encoding='utf-8')
render=[]
for i,s in enumerate(slides):
 title=re.sub('<[^>]+>',' ',s['title']).replace('\n',' ')
 header='' if i==0 else f'<header><p class="kicker">{s["chapter"]}</p><h2>{s["title"]}</h2>'+ (f'<p class="lede">{s["sub"]}</p>' if s['sub'] else '')+'</header>'
 cls=s['cls']+' '+(' dark' if i in [0,12,22,28] else '')
 render.append(f'<section class="slide {cls}" data-noclick data-index="{i}" data-title="{html.escape(title)}" data-chapter="{s["chapter"]}">{header}<div class="slide-body">{s["body"]}</div><aside class="insight"><span>'+('TODAY’S PROMISE' if i==0 else '업무로 연결하기')+f'</span><p>{insights[i]}</p></aside></section>')
appendix=[]
items=list(G.items())
for start in range(0,len(items),7):
 appendix.append('<section class="print-glossary"><p>AI CODING LAB · 용어 해설</p><h2>개념을 다시 살펴보기</h2><div>'+''.join(f'<article><h3>{html.escape(k)}</h3><b>{html.escape(v[0])}</b><p>{html.escape(v[1])}</p></article>' for k,v in items[start:start+7])+'</div></section>')
page='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI 코딩 교육 · 인터랙티브 랩</title><link rel="icon" href="data:,"><style>'+fontcss+basecss+css+'</style></head><body><svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><image id="asset-atlas" width="1536" height="1024" href="data:image/png;base64,'+asset+'"/></defs></svg><main id="stage">'+''.join(render)+'</main><footer id="deck-progress"><div id="chapter-track"></div><div class="progress-meta"><span id="current-label"></span><span id="counter"></span></div><div class="progress-rail"><i></i></div></footer><div id="concept-tip" role="tooltip" hidden><div class="tip-eyebrow">CONCEPT NOTE</div><h3></h3><b></b><p></p></div>'+''.join(appendix)+'<script>const glossary='+json.dumps(G,ensure_ascii=False)+';\n'+js+'</script></body></html>'
(OUT/'AI코딩교육_인터랙티브_v2.html').write_text(page,encoding='utf-8')
(OUT/'build/interactive-v2-content.json').write_text(json.dumps([{k:v for k,v in s.items() if k!='note'} for s in slides],ensure_ascii=False,indent=2),encoding='utf-8')
print('Built',len(slides),'slides;',len(G),'concepts;',round(len(page.encode())/1048576,2),'MB')
