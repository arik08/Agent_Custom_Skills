"""Semantic, linked textbook figures. Capture pixels remain unchanged."""
from html import escape

PATHS = {
    'model': 'M9 3H6v4H3v4h3v2H3v4h3v4h4v-3h4v3h4v-4h3v-4h-3v-2h3V7h-3V3h-4v3h-4V3Z M9 10h6v5H9Z',
    'skill': 'M7 3h10v18H4V6h3V3Z M8 3v4h8V3 M8 11l1 1 2-2 M13 11h2 M8 16l1 1 2-2 M13 16h2',
    'mcp': 'M8 3v5 M16 3v5 M5 8h14v3a7 7 0 0 1-7 7v4 M5 11a7 7 0 0 0 7 7',
    'file': 'M5 2h9l5 5v15H5Z M14 2v6h5 M8 12h8 M8 16h8',
    'table': 'M3 4h18v16H3Z M3 9h18 M3 14h18 M9 4v16',
    'chart': 'M3 3v18h18 M7 17v-4 M12 17V8 M17 17V4',
    'chat': 'M3 3h18v14H9l-6 4V3Z M7 7h10 M7 12h7',
    'folder': 'M2 6h8l2 3h10v12H2Z M2 6V3h8l2 3h8v3',
    'search': 'M16 16l6 6 M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    'screen': 'M2 3h20v14H2Z M8 22h8 M12 17v5 M2 7h20',
}

def glyph(name):
    return f'<svg class="book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{PATHS[name]}"/></svg>'

def cover(data):
    return f'''<header class="hero system-cover">
<div class="hero-top"><span class="eyebrow">P-HARNESS / USER GUIDE</span><span class="edition">SYSTEM · TOOLS · WORKSPACE</span></div>
<div class="system-title"><div><span class="book-kicker">시스템을 이해하고, 필요한 기능을 찾아 쓰는</span><h1>P-Harness <span>사용자 가이드</span></h1></div><p>모델·Skill·MCP와 파일을 연결해<br> 하나의 공간에서 업무를 진행합니다.</p></div>
<div class="system-map" aria-label="P-Harness의 입력, 작업공간, 구성요소와 산출물">
 <div class="map-side map-input"><span class="map-eyebrow">INPUT</span><h2>요청과 자료</h2>
 <a href="#prompt">{glyph('chat')}<span><b>업무 요청</b><small>목적 · 범위 · 완료조건</small></span></a>
 <a href="#files">{glyph('file')}<span><b>참고자료</b><small>문서 · 표 · 이미지</small></span></a>
 <a href="#quickstart-symbols">{glyph('folder')}<span><b>작업공간 파일</b><small>기존 결과물 연결</small></span></a>
 </div>
 <div class="map-workspace"><div class="workspace-title"><b>P-Harness 작업공간</b><span>대화 · 진행 확인 · 파일 관리</span></div>
 <figure class="figure workspace-shot"><button data-zoom="P-Harness 구성 이해를 위한 MyHarness 참고 화면" aria-label="MyHarness 참고 화면 확대"><img src="data:image/jpeg;base64,{data}" width="1920" height="1080" alt="대화와 프로젝트 파일이 함께 보이는 MyHarness 참고 화면"><span class="expand">↗ 화면 확대</span></button><figcaption>실제 화면 참고: MyHarness · 메뉴와 제공 기능은 운영 환경에 따라 다를 수 있습니다.</figcaption></figure>
 <div class="component-dock">
 <a href="#model">{glyph('model')}<b>모델</b><span>이해 · 추론 · 작성</span></a>
 <a href="#skills">{glyph('skill')}<b>Skill</b><span>작업 방법 · 기준</span></a>
 <a href="#mcp">{glyph('mcp')}<b>MCP</b><span>도구 · 정보원 연결</span></a>
 </div></div>
 <div class="map-side map-output"><span class="map-eyebrow">OUTPUT</span><h2>대화와 산출물</h2>
 <a href="#artifacts">{glyph('file')}<span><b>보고서·문서</b><small>요약 · 분석 · 설명</small></span></a>
 <a href="#artifacts-format">{glyph('table')}<span><b>표·데이터</b><small>정리 · 계산 · 비교</small></span></a>
 <a href="#artifacts-format">{glyph('chart')}<span><b>시각 자료</b><small>차트 · 슬라이드</small></span></a>
 </div>
</div>
<nav class="book-entry" aria-label="가이드 시작 경로"><a href="#concept">01 구성과 원리 <span>↗</span></a><a href="#quickstart">02 실제 화면과 조작 <span>↗</span></a><a href="#skills">03 탑재된 기능 찾기 <span>↗</span></a><a href="#artifacts">04 결과물 다루기 <span>↗</span></a></nav>
</header>'''

def model_plate():
    return f'''<div class="choice-plate book-plate">
<a class="model-half" href="#model-selection"><span class="plate-label">선택 1 · MODEL</span><h4>{glyph('model')}어떤 모델로 처리할까?</h4><p>업무의 종류와 난이도에 맞는 모델을 고릅니다.</p><div class="work-scale"><span>{glyph('file')}<b>정리·초안</b></span><span>{glyph('table')}<b>조사·비교</b></span><span>{glyph('search')}<b>복잡한 판단</b></span></div><small>모델별 선택 기준 보기 ↗</small></a>
<a class="effort-half" href="#model-effort"><span class="plate-label">선택 2 · EFFORT</span><h4>{glyph('search')}얼마나 깊게 검토할까?</h4><p>선택한 모델의 검토 수준을 조절합니다.</p><ol class="effort-track"><li><i></i><b>Low</b><span>낮은 수준</span></li><li><i></i><b>Medium</b><span>중간 수준</span></li><li><i></i><b>High</b><span>높은 수준</span></li></ol><small>제공되는 선택지는 모델에 따라 다릅니다 ↗</small></a>
</div><p class="visual-takeaway"><b>모델 선택과 Effort 설정은 별개입니다.</b> 높은 설정을 고정하기보다 작업과 결과를 보고 조절합니다.</p>'''

def mcp_plate():
    rows=[('mcp-company','기업 공시','DART · SEC EDGAR · Companies House'),('mcp-economy','경제·통계','ECOS · KOSIS · FRED · World Bank'),('mcp-trade','무역·산업','UN Comtrade · EIA · Eurostat'),('mcp-law','법령·입법','법제처 · 국회 · 해외 의회·법령'),('mcp-tech','특허·연구','KIPRISPlus · EPO · OpenAlex')]
    branches=''.join(f'<a href="#{id}"><b>{label}</b><span>{names}</span><i aria-hidden="true">↗</i></a>' for id,label,names in rows)
    return f'''<div class="source-network book-plate"><div class="network-root">{glyph('mcp')}<span class="plate-label">MCP · 도구와 정보원</span><strong>어디에 연결해서<br> 무엇을 가져올까?</strong><p>필요한 근거의 종류에서 출발합니다.</p><a href="#mcp-browse"><code>/</code> 명령어 → MCP 목록 ↗</a></div><div class="network-branches">{branches}<a class="internal-branch" href="#mcp-internal"><b>사내 연결</b><span>문서 · 메일 · 업무 시스템</span><small>환경·권한 확인 ↗</small></a></div></div><p class="visual-takeaway"><b>Skill은 작업 방법, MCP는 도구·정보원에 접근하는 연결입니다.</b> 등록·활성 표시만으로 실제 조회 성공을 판단하지 않습니다.</p>'''

def file_plate():
    return f'''<div class="file-journey book-plate"><a href="#files-ecm" class="journey-input">{glyph('folder')}<span class="plate-label">가져올 자료</span><b>기존 보고서 · 이번 데이터</b><small>기존 형식과 새 사실을 구분</small></a><span class="journey-arrow" aria-hidden="true">→</span><a href="#files-recognition" class="journey-gate">{glyph('search')}<span class="plate-label">인식 확인</span><b>표 · 단위 · 기간 · 그림</b><small>읽힌 내용을 원본과 대조</small></a><span class="journey-arrow" aria-hidden="true">→</span><a href="#files-reuse" class="journey-output">{glyph('chat')}<span class="plate-label">업무에 사용</span><b>참고 목적과 우선순위</b><small>어떤 자료를 무엇의 기준으로 쓸지</small></a></div>'''

def output_plate():
    return f'''<div class="output-shelf book-plate"><div class="output-intro"><span class="plate-label">ARTIFACT · 만들어진 파일</span><strong>답변을 읽고,<br> 파일을 열어 확인합니다.</strong><a href="#artifacts-viewer">오른쪽 프로젝트 파일에서 열기 ↗</a></div><a class="output-paper" href="#artifacts-format">{glyph('file')}<b>문서·보고서</b><span>HTML · PDF 등</span><div class="paper-lines" aria-hidden="true"></div></a><a class="output-paper" href="#artifacts-format">{glyph('table')}<b>표·데이터</b><span>스프레드시트 · CSV 등</span><div class="paper-grid" aria-hidden="true"></div></a><a class="output-paper" href="#artifacts-format">{glyph('chart')}<b>발표·시각 자료</b><span>슬라이드 · 이미지 등</span><div class="paper-bars" aria-hidden="true"><i></i><i></i><i></i></div></a></div>'''

def screen_map(data):
    areas=[('history','왼쪽','대화 기록','업무별 대화를 찾습니다.','#artifacts-history'),('composer','가운데 아래','요청과 자료','지시·첨부·모델 설정을 합니다.','#quickstart-send'),('tools','좌상단의 / 버튼','명령어 버튼','누르면 Skill·MCP 목록이 열립니다.','#skills-use'),('results','오른쪽','결과 파일','열기·미리보기·저장합니다.','#artifacts-viewer')]
    links=''.join(f'<a class="screen-key key-{name}" href="{url}"><span>{i:02}</span><div><small>{where}</small><b>{label}</b><p>{desc}</p></div></a>' for i,(name,where,label,desc,url) in enumerate(areas,1))
    overlays=''.join(f'<span class="screen-zone zone-{name}" aria-hidden="true"><b>{f"{i:02}" if name == "tools" else f"{i:02} {label}"}</b></span>' for i,(name,where,label,_,_) in enumerate(areas,1))
    return f'''<div class="screen-atlas"><figure class="figure atlas-figure"><button data-zoom="MyHarness 화면 구성 지도" aria-label="화면 구성 지도 원본 확대"><img src="data:image/jpeg;base64,{data}" width="1920" height="1080" loading="lazy" alt="MyHarness의 좌측 대화 기록, 좌상단 명령어, 하단 입력창, 우측 결과 파일">{overlays}<span class="expand">↗ 원본 확대</span></button><figcaption>MyHarness 실제 참고 화면에 영역 표시를 덧붙였습니다. 클릭하면 FHD 원본이 열립니다.</figcaption></figure><div class="screen-keys">{links}</div></div>'''

def panels():
    return {
      'model': ('model-map','모델과 Effort: 두 가지 선택',model_plate()),
      'mcp': ('mcp-map','MCP: 연결 가능한 정보원',mcp_plate()),
      'artifacts': ('artifacts-map','산출물의 종류와 확인 위치',output_plate()),
    }
