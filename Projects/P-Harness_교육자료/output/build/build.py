from pathlib import Path
from html import escape as E
import base64
import runpy
import os
from functools import lru_cache
from xml.etree import ElementTree
from PIL import ImageFont

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent.parent
CAP = PROJECT / 'input' / 'captures'
OUT = ROOT.parent
VISUALS = runpy.run_path(str(ROOT / 'visuals.py'))
CHAPTER_PANELS = VISUALS['panels']()
HOME_SCREEN = base64.b64encode((CAP / '01-home-fhd.jpg').read_bytes()).decode()

def icon(name):
    paths={'menu':'M4 6h16M4 12h16M4 18h16','search':'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0','full':'M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5','help':'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0','arrow':'M5 12h14M13 6l6 6-6 6'}
    return f'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{paths[name]}"/></svg>'

def table(headers, rows, cls=''):
    return '<div class="table-wrap" tabindex="0" role="region" aria-label="'+E(' · '.join(headers))+'"><table class="'+cls+'"><thead><tr>'+''.join(f'<th scope="col">{x}</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{c}</td>' for c in row)+'</tr>' for row in rows)+'</tbody></table></div>'

def screen_guide(instructions,figure):
    return f'<div class="screen-guide"><div class="screen-instructions">{instructions}</div>{figure}</div>'

def block(id,title,html): return f'<section class="block" id="{id}"><h3>{title}</h3>{html}</section>'
def note(title,text,warning=False):
    symbol, label = ('📌','확인하고 넘어가세요') if warning else ('💡','알아두면 편해요')
    return f'<aside class="callout{" warning" if warning else ""}"><span class="note-icon" aria-hidden="true">{symbol}</span><div><span class="note-kind">{label}</span><strong>{title}</strong><p>{text}</p></div></aside>'
def prompt(id,title,text): return f'<div class="prompt-box"><div class="prompt-head"><span><span aria-hidden="true">📝</span> {title}</span><button data-copy="{id}">요청문 복사</button></div><pre id="{id}" tabindex="0">{E(text.strip())}</pre></div>'
def fold(title,html): return f'<details class="fold"><summary>{title}</summary><div class="fold-body">{html}</div></details>'
def steps(rows): return '<ol class="steps">'+''.join(f'<li><b>{a}</b><p>{b}</p></li>' for a,b in rows)+'</ol>'
def cards(rows): return '<div class="grid3">'+''.join(f'<article class="card"><span class="n">{i+1:02}</span><h4>{a}</h4><p>{b}</p></article>' for i,(a,b) in enumerate(rows))+'</div>'
def shot(filename,title,caption,crop=None):
    p=CAP/filename
    if not p.exists(): return ''
    # Preserve the captured pixels; no generated UI is substituted for a screenshot.
    data=base64.b64encode(p.read_bytes()).decode()
    focus = ' focus-shot' if filename.startswith(('02-','03-','04-','07-')) else ''
    position = ' attachment-shot' if filename.startswith('07-') else ''
    crop_class = ' crop-shot' if crop else ''
    crop_style = ''
    if crop:
        x,y,width,height=crop
        crop_style=f' style="--shot-ratio:{width}/{height};--shot-width:{1920/width*100}%;--shot-left:{-x/width*100}%;--shot-top:{-y/height*100}%"'
    annotations = {
        '01-home-fhd.jpg': [(9,15,'대화 찾기','왼쪽에서 업무별 대화를 선택합니다.'),(35,91,'요청 입력','아래 입력창에서 자료와 조건을 전달합니다.'),(86,10,'결과 파일','오른쪽에서 완성 파일을 찾아 엽니다.')],
        '06-viewer-fhd.jpg': [(56,6,'열린 파일 확인','상단 파일명으로 검토할 대상을 확인합니다.'),(73,59,'내용 검토','본문·표·출처를 함께 확인합니다.'),(96.5,6,'다운로드','오른쪽 위의 내려받기 버튼을 사용합니다.')],
        '08-commands-entry-fhd.jpg': [(81.7,35,'/ 명령어 버튼','좌상단에서 스킬·MCP 목록을 엽니다.')],
    }.get(filename, [])
    pins=''.join(f'<span class="shot-pin" style="left:{x}%;top:{y}%" aria-hidden="true">{i:02}</span>' for i,(x,y,_,_) in enumerate(annotations,1))
    legend = '<ol class="shot-legend">'+''.join(f'<li><span aria-hidden="true">{i:02}</span><div><b>{a}</b><p>{b}</p></div></li>' for i,(_,_,a,b) in enumerate(annotations,1))+'</ol>' if annotations else ''
    hints={'02-model-fhd.jpg':'입력창 아래 → 모델 이름','03-effort-fhd.jpg':'입력창 아래 → 노력도 설정','04-skills-fhd.jpg':'보조 방법 · 입력창 아래 → Skill 및 MCP 호출','07-attachment-fhd.jpg':'파일 첨부 표시 → 인식 확인 요청','08-commands-entry-fhd.jpg':'먼저 여기부터 · 좌상단 / 명령어','09-commands-skills-fhd.jpg':'/ 명령어 → 스킬 펼치기','10-commands-mcp-fhd.jpg':'/ 명령어 → MCP 펼치기'}
    hint=f'<div class="shot-hint"><span aria-hidden="true">↳</span> {hints[filename]}</div>' if filename in hints else ''
    return f'<figure class="figure screenshot{focus}{position}{crop_class}"><div class="figure-top"><span><span aria-hidden="true">🖥️</span> 화면으로 보기</span><small>MyHarness · FHD</small></div>{hint}<button data-zoom="{E(title)}" aria-label="{E(title)} 확대"{crop_style}><img src="data:image/jpeg;base64,{data}" width="1920" height="1080" loading="lazy" alt="{E(title)}">{pins}<span class="expand">↗ 크게 보기</span></button><figcaption>{legend}<strong>{title}</strong> · {caption}</figcaption></figure>'

def svgfigure(title,caption,svg):
    data=base64.b64encode(svg.encode()).decode()
    root=ElementTree.fromstring(svg)
    width,height=root.attrib['width'],root.attrib['height']
    return f'<figure class="figure"><button data-zoom="{E(title)}" aria-label="{E(title)} 확대"><img src="data:image/svg+xml;base64,{data}" width="{width}" height="{height}" loading="lazy" alt="{E(title)}"><span class="expand">↗ 크게 보기</span></button><figcaption>{caption}</figcaption></figure>'

@lru_cache(maxsize=8)
def diagram_font(size,bold=False):
    directory=Path(os.environ.get('WINDIR','C:/Windows'))/'Fonts'
    return ImageFont.truetype(str(directory/('malgunbd.ttf' if bold else 'malgun.ttf')),size)

def wrap_diagram_text(text,size,width,bold=False):
    """Wrap using actual font widths, including long words without spaces."""
    font=diagram_font(size,bold)
    lines=[]
    for paragraph in str(text).split('\n'):
        line=''
        for word in paragraph.split():
            candidate=f'{line} {word}' if line else word
            if font.getlength(candidate)<=width:
                line=candidate
                continue
            if line: lines.append(line)
            line=''
            for char in word:
                if line and font.getlength(line+char)>width:
                    lines.append(line)
                    line=''
                line+=char
        lines.append(line)
    return lines or ['']

def flow_svg(labels,subtitles,heading='WORKFLOW / 업무를 맡기는 순서'):
    if not labels or len(labels)!=len(subtitles):
        raise ValueError('Each flow step needs a title and a subtitle.')
    card_width,gap,padding=222,38,22
    width=80+len(labels)*card_width+(len(labels)-1)*gap
    # Extra room absorbs small font-renderer differences without shrinking text.
    safe_width=card_width-2*padding-10
    titles=[wrap_diagram_text(t,25,safe_width,True) for t in labels]
    captions=[wrap_diagram_text(t,17,safe_width) for t in subtitles]
    headings=wrap_diagram_text(heading,17,width-84)
    card_y=95+(len(headings)-1)*24
    title_y=card_y+84
    subtitle_y=title_y+(max(map(len,titles))-1)*34+36
    card_bottom=max(card_y+188,subtitle_y+(max(map(len,captions))-1)*24+34)
    height=card_bottom+77
    s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="{width}" height="{height}" fill="#f0f3f6"/><g font-family="Malgun Gothic, sans-serif">']
    s.extend(f'<text x="42" y="{47+j*24}" font-size="17" fill="#345064">{E(line)}</text>' for j,line in enumerate(headings))
    for i,(label,title_lines,caption_lines) in enumerate(zip(labels,titles,captions)):
        x=40+i*(card_width+gap)
        s.append(f'<g class="flow-node" data-label="{E(label)}"><rect x="{x}" y="{card_y}" width="{card_width}" height="{card_bottom-card_y}" rx="7" fill="white" stroke="#b8c7d2"/><text data-role="number" x="{x+padding}" y="{card_y+40}" font-size="17" fill="#05507d">{i+1:02}</text>')
        s.extend(f'<text data-role="title" x="{x+padding}" y="{title_y+j*34}" font-size="25" font-weight="700" fill="#182e3d">{E(line)}</text>' for j,line in enumerate(title_lines))
        s.extend(f'<text data-role="subtitle" x="{x+padding}" y="{subtitle_y+j*24}" font-size="17" fill="#52616c">{E(line)}</text>' for j,line in enumerate(caption_lines))
        s.append('</g>')
        if i<len(labels)-1:
            middle=(card_y+card_bottom)/2
            s.append(f'<path d="M{x+card_width+8} {middle}h22m-7-7 7 7-7 7" fill="none" stroke="#4b6b82" stroke-width="2"/>')
    s.append('</g></svg>')
    return ''.join(s)

competitor='''포스코 경영진의 전략 검토를 위한 경쟁사 분석 보고서를 만들어줘.

대상은 (주)포스코의 철강사업과 일본제철, 아르셀로미탈, 보무강철이고, 비교 기간은 2023~2025년이야.
매출액·영업이익·영업이익률의 흐름과 차이를 분석하되, 연결 범위·회계연도·통화·단위를 먼저 확인해줘. 비교가 어려운 수치는 이유를 표시해줘.

연료·원료 수급을 위한 원료법인 구성과 제품·판매 전략도 별도 단락으로 비교하고, 포스코에 주는 시사점을 도출해줘.
첨부한 기존 보고서는 업무 맥락과 형식의 참고로 사용하고, 실적은 각 기업의 공시 원문으로 검증해줘.

결론이 먼저 보이는 HTML 보고서로 작성해줘. 주요 사실에 출처와 기준일을 표시하고, 원인으로 확인된 사실과 추정한 가설을 구분해줘.
작업에 필요한 정보가 부족하면 먼저 나에게 물어보고 확인해줘.'''
environment='''2027년 (주)포스코 철강사업의 경영계획 수립을 위한 거시경제·경영환경 분석 보고서를 만들어줘.

주요 국가별 경제 성장, 환율, 연료·원료 가격, 철강 전후방 산업 전망, 환경규제, 노무·안전 관련 입법환경을 종합해줘.
자동차·조선·건설·에너지뿐 아니라 AI 데이터센터와 전기강판 관련 수요도 포함해줘.

전망치마다 발표기관·발표일·대상 기간을 표시하고, 확정된 사실과 전망·가정을 구분해줘. 전망이 엇갈리면 기본·상방·하방 시나리오로 정리해줘.
각 변화가 판매·원가·투자·리스크에 미치는 경로와 경영계획에 반영할 점을 제시해줘.

내가 빠뜨린 핵심 항목은 추가로 제안하고, 중요한 범위나 기준일이 불분명하면 먼저 물어봐줘.
최종 결과는 경영진이 빠르게 읽을 수 있는 HTML 보고서로 작성해줘.'''
legislation='''[조사 기준일] 기준으로 한국·미국·EU·영국의 입법동향 중 포스코 그룹의 철강·배터리·환경정책에 영향을 줄 수 있는 법안을 조사해줘.

계류 법안과 이미 확정된 법률을 분리하고, 법안명·식별번호·관할·발의일·현재 단계·최근 변경일·공식 원문을 정리해줘.
발의자 이름과 소속 정당은 공식 자료에서 확인되는 범위까지 포함하고, 확인되지 않은 항목은 미확인으로 표시해줘.

사업별 예상 영향, 대응 우선순위, 다음 확인 시점을 제시해줘. 통과 가능성과 예상 영향은 사실과 추정으로 구분해줘.
국가별 공식 의회·법령 자료를 확인하고 조회 실패나 누락된 범위도 밝혀줘.
출처가 포함된 HTML 보고서로 작성하되, 필요한 정보가 있으면 먼저 물어봐줘.'''
template='''[목적·독자] [보고 대상]이 [의사결정 또는 업무 목적]에 사용할 자료를 만들려고 합니다.
[대상·범위] [대상]의 [기간]을 분석하고 자료 기준일은 [날짜]로 해주세요.
[제공 자료] 첨부한 [자료]를 참고하고 핵심 표의 단위·기간·항목을 먼저 확인해주세요.
[수행할 일] [비교 항목 또는 분석 질문]을 분석하고 원인과 시사점을 정리해주세요.
[결과·검증] [형식·분량]으로 작성하고 주요 사실에 출처를 표시해주세요. 사실과 추정, 읽지 못한 부분을 구분해주세요.
[추가 확인] 필요한 정보가 부족하면 나에게 질문하여 확인한 뒤 진행해주세요.'''

CHAPTER_STYLE = {
    'start':('🧭','가이드 둘러보기'), 'concept':('🧩','개념 잡기'),
    'quickstart':('🚀','첫 업무 시작'), 'model':('⚙️','나에게 맞게 설정'),
    'prompt':('🎯','요청의 완성도 높이기'), 'files':('📎','우리 자료 활용'),
    'workflow':('🏭','업무 흐름 따라가기'), 'cases':('📝','바로 꺼내 쓰기'),
    'skills':('🛠️','업무 방식 확장'), 'mcp':('🔗','근거 연결'),
    'artifacts':('📂','결과 정리'), 'review':('🔎','마지막 확인'),
    'reference':('📌','필요할 때 다시 찾기'),
}

def before_after(before,after):
    return f'<div class="before-after"><div class="before-cell"><span class="comparison-label">BEFORE · 짧은 요청</span><p>{before}</p></div><span class="comparison-arrow" aria-hidden="true">→</span><div class="after-cell"><span class="comparison-label">AFTER · 조건을 더하면</span><p>{after}</p></div></div>'

def request_map(rows):
    return '<div class="request-map">'+''.join(f'<div class="request-factor"><span class="factor-no">{i:02}</span><div><h4>{a}</h4><p>{b}</p><p class="factor-example">{c}</p></div></div>' for i,(a,b,c) in enumerate(rows,1))+'</div>'

chapters=[]
def chapter(id,title,headline,lead,content,tint=False):
    if id in CHAPTER_PANELS:
        content = block(*CHAPTER_PANELS[id]) + content
    i=len(chapters)
    symbol, label = CHAPTER_STYLE.get(id, ('📖','사용자 가이드'))
    feature=' chapter-feature' if id in ('quickstart','prompt','workflow','mcp') else ''
    chapters.append(f'<section class="chapter{" next-tint" if tint else ""}{feature}" id="{id}" data-title="{title}" data-symbol="{symbol}"><header class="chapter-head"><div class="section-no"><span class="chapter-symbol" aria-hidden="true">{symbol}</span><span>{label}<small>CHAPTER {i:02} / {title}</small></span></div><span class="chapter-number" aria-hidden="true">{i:02}</span><h2>{headline}</h2><p class="lead">{lead}</p></header>{content}</section>')

chapter('start','가이드의 구성','전체를 이해하고, 필요한 기능으로 들어갑니다.','P-Harness의 구성요소를 이해한 뒤 실제 화면에서 기능을 찾고, 자료와 결과물을 다루는 방법으로 이어집니다.',
block('start-goals','이 가이드에서 익힐 세 가지',cards([('시스템의 구조 이해하기','모델·Skill·MCP와 작업공간이 맡는 역할을 구분합니다.'),('화면에서 기능 찾기','메뉴의 위치와 사용 순서를 실제 화면에서 확인합니다.'),('자료와 결과물 다루기','파일을 연결하고, 산출물을 열어 검토·수정·저장합니다.')]))+
block('start-reading','필요한 곳으로 바로 이동하세요','''<div class="link-grid"><a href="#quickstart">처음 쓰는 분 · 첫 업무 시작 <span>↗</span></a><a href="#cases">바로 적용할 분 · 요청문 모음 <span>↗</span></a><a href="#mcp">조사할 자료 찾기 · MCP <span>↗</span></a><a href="#review">결과가 아쉬울 때 · 문제 해결 <span>↗</span></a></div><p class="small muted">왼쪽 목차에서 장별로 이동하고, 세부 내용은 검색으로 찾을 수 있습니다. 검색은 상단 버튼 또는 Ctrl+K, 전체화면은 우클릭 또는 상단 버튼을 사용하세요. 이미지는 클릭하면 확대됩니다.</p>'''+note('화면 안내 기준','조작 화면은 2026.09.28 MyHarness를 FHD로 캡처했습니다. P-Harness의 메뉴·모델·권한은 실제 배포 환경에 따라 다를 수 있습니다.')))

report_example=block('start-result','어떤 결과물을 만들 수 있나요?', '''<div class="report-preview"><div class="report-title"><small>OUTPUT PREVIEW · 교육용 구성 예시</small><h4>철강 경쟁사 분석 보고서</h4><small>핵심 결론 → 실적 비교 → 원인 분석 → 전략적 시사점</small></div><div class="report-body"><div><p>경영진이 판단할 내용을 앞에 두고, 사실·해석·제안을 구분합니다.</p><div class="report-line"><b>01</b><span><strong>실적 비교</strong><br>기간·통화·연결 범위가 같은지 확인</span></div><div class="report-line"><b>02</b><span><strong>차이의 원인</strong><br>판매 구성·원료 조달·비용 구조 검토</span></div><div class="report-line"><b>03</b><span><strong>시사점과 대응</strong><br>판단에 필요한 근거와 추가 확인 사항</span></div></div><div><p class="small muted">각 항목을 눌러 확인 기준을 보세요.</p><button class="evidence-button" data-evidence="0" aria-pressed="true">① 사실 · 공시에서 확인한 수치</button><button class="evidence-button" data-evidence="1" aria-pressed="false">② 해석 · 차이의 원인에 대한 가설</button><button class="evidence-button" data-evidence="2" aria-pressed="false">③ 제안 · 검토할 대응 방향</button><div class="evidence-detail" aria-live="polite"><b id="evidence-title">사실에는 근거가 필요합니다</b><p id="evidence-text" class="nomargin">매출액·영업이익·영업이익률은 공시 원문, 회계연도, 단위, 연결 범위를 함께 확인합니다. 이 미리보기는 실제 기업 수치를 제시하지 않습니다.</p></div></div></div></div>''')

chapter('concept','P-Harness 이해하기','답변을 넘어, 업무가 이어지는 환경','P-Harness는 요청, 자료, 도구, 실행 과정과 결과물을 한 흐름으로 연결하는 업무용 AI 환경입니다.',
block('concept-harness','Harness, 무엇을 묶어주나요?', '<p><strong>모델(LLM, 대규모 언어 모델)</strong>은 문맥을 이해하고 답변을 만드는 구성요소입니다. 모델 자체가 우리 회사의 업무 절차와 최신 자료를 모두 알고 있는 것은 아닙니다. Harness는 대화 맥락과 파일을 관리하고, 필요한 Skill과 도구를 활용해 조사·분석·산출물 작성이 이어지도록 돕습니다.</p>'+svgfigure('요청에서 검증까지의 업무 흐름','개념도 · 실제 내부 호출 순서를 나타내는 실행 로그는 아닙니다.',flow_svg(['업무 요청','자료·도구 연결','분석·산출물','담당자 검증'],['목적과 범위 정의','Skill · MCP · 파일','근거를 담은 초안','확인하고 최종 사용'])))+
block('concept-roles','모델·Skill·MCP의 역할', '''<div class="role-panel"><div class="flow-buttons" aria-label="역할별 설명"><button data-role-step="0" aria-pressed="true"><small>01 / MODEL</small>이해하고 추론</button><button data-role-step="1" aria-pressed="false"><small>02 / SKILL</small>업무 기준 적용</button><button data-role-step="2" aria-pressed="false"><small>03 / MCP</small>자료·도구 연결</button><button data-role-step="3" aria-pressed="false"><small>04 / HARNESS</small>실행과 결과 관리</button></div><div class="flow-detail" aria-live="polite"><h4 id="role-title">요청을 이해합니다</h4><p id="role-text">모델은 사용자의 목적과 자료를 읽고, 비교 기준과 부족한 정보를 파악합니다.</p></div></div>'''+table(['구성요소','실무에서의 의미','경쟁사 분석 예'],[['모델(LLM)','이해·추론·작성 능력','영업이익률 차이를 해석하고 설명'],['Skill','업무 절차·판단 기준·산출물 방식','기업 비교에서 빠뜨리지 않을 항목 적용'],['MCP','도구와 데이터에 접근하는 연결 방식','기업 공시·경제 통계 등 근거 조회'],['Harness','대화·파일·도구 실행을 함께 관리하는 환경','자료를 붙이고 조사 과정을 확인한 뒤 보고서 열기']]))+
block('concept-scope','지금 특히 잘 활용할 수 있는 업무', '<p>제공된 운영 안내는 <strong>외부 정보 조사와 해석, 본 작업 전 초안 작성</strong>을 주요 활용 영역으로 제시합니다. 좋은 기존 보고서와 업무 기준을 함께 제공하면 원하는 결과의 방향을 더 분명하게 전달할 수 있습니다.</p>'+note('최종 사용 전에는 담당자의 판단이 필요합니다','업무 Skill과 사내 연결은 고도화되는 영역입니다. 초안이 완성됐더라도 사실 확인과 업무적 해석을 거쳐 사용하세요.')+fold('MyHarness와 P-Harness의 관계', '<p>참고자료는 MyHarness를 기능을 먼저 시험하는 환경, P-Harness를 다수 사용자가 활용하는 사내 서비스로 설명합니다. 이 매뉴얼은 사용자의 안내에 따라 MyHarness 화면을 조작 참고로 사용합니다. 로컬 MyHarness의 Codex 구독 모델이나 연결 상태가 P-Harness 운영 상태를 보증하지는 않습니다.</p>')+'<p><a href="https://www.youtube.com/watch?v=DrekqeDlO1w" target="_blank" rel="noopener noreferrer">↗ 참고 영상 · 하네스 공식문서 100번 읽은 것처럼 만들어드림</a><br><span class="small muted">상사 피드백에 첨부된 개념 참고 영상입니다. 외부 접속이 필요하며 P-Harness의 개별 기능 설명과는 구분합니다.</span></p>'))

chapter('quickstart','첫 업무 시작하기','화면을 익히고, 첫 요청을 보내보세요.','대화는 가운데에서 진행하고, 입력창 아래에서 자료와 도구를 선택하며, 완성 파일은 오른쪽에서 확인합니다.',
block('quickstart-screen','화면 구성 한눈에 보기',VISUALS['screen_map'](HOME_SCREEN)+table(['영역','할 수 있는 일','처음 확인할 것'],[['좌상단 / 명령어','스킬·MCP 목록 펼치기·설명 확인','처음 사용할 도구의 이름과 역할'],['왼쪽 대화 목록','기존 대화 찾기·이름 변경·고정','현재 업무의 대화가 맞는지'],['가운데 채팅','업무 지시·질문에 답변·진행 확인','AI가 이해한 범위와 추가 질문'],['입력창 아래 도구','파일 첨부·참고자료·Skill·MCP·모델·Effort','첨부 대상과 적용할 옵션'],['오른쪽 파일·미리보기','결과물 열기·확인·다운로드','파일 이름과 최종 수정 내용']]))+
block('quickstart-send','첫 요청은 다섯 단계로',steps([('자료를 연결합니다','파일을 드래그하거나 파일첨부 버튼을 사용합니다. 첨부된 이름을 확인하세요.'),('목적과 완료조건을 입력합니다','누가 왜 쓸 자료인지, 분석 범위와 원하는 결과 형식을 적습니다.'),('부족한 정보를 확인합니다','“필요한 정보가 있으면 먼저 질문해줘”를 덧붙이고, 질문에 답합니다.'),('진행 상태를 확인합니다','조사 범위가 다른 경우 바로잡고, 연결 실패와 누락 자료를 구분합니다.'),('결과 파일을 열어 검토합니다','본문·표·차트·출처를 확인한 뒤 필요한 수정을 요청합니다.')])+prompt('prompt-first','처음 시도하는 업무 요청','첨부한 문서의 목적과 핵심 내용을 정리해줘. 먼저 문서의 제목, 기준 시점, 중요한 표의 항목과 단위를 제대로 읽었는지 설명해줘. 읽지 못한 부분이 있으면 알려주고, 요약에 필요한 정보가 부족하면 나에게 질문해줘.'))+
block('quickstart-symbols','목록은 /에서, 빠른 지정은 @·$로','<p>처음에는 <strong>좌상단 <code>/</code> 명령어 버튼</strong>을 눌러 스킬·MCP 항목을 펼쳐보세요. 사용할 수 있는 도구와 설명을 확인한 뒤 채팅으로 업무를 요청합니다. <a href="#skills-use">화면으로 따라 보기 ↗</a></p>'+table(['방법','하는 일','사용할 때'],[['좌상단 <code>/</code> 명령어 버튼','스킬·MCP 목록과 설명 확인','처음 도구를 둘러보거나 어떤 기능이 있는지 볼 때'],['입력창 <code>@</code>','작업공간 파일을 골라 참고 대상으로 연결','기존 파일을 정확히 지정하거나 수정할 때'],['입력창 <code>$</code>','특정 Skill·MCP를 골라 요청에 넣기','목록에서 알아본 도구를 이번 요청에 직접 지정할 때'],['파일첨부','내 PC의 자료를 업로드','ECM에서 내려받은 문서나 캡처를 제공할 때']])+'<p class="small muted">목록을 열어보는 것과 특정 도구를 요청에 지정하는 것은 다릅니다. <code>@</code>는 파일 연결이며 Skill·MCP 목록을 여는 기호가 아닙니다.</p>'))

chapter('model','모델과 Effort 선택','모델과 검토 수준을 각각 선택합니다.','복잡한 판단에 더 많은 자원을 쓰고, 간단한 정리와 초안에는 가벼운 모델부터 활용합니다.',
block('model-selection','업무별 선택 기준',table(['업무 상황','시작할 선택','결과에서 확인할 것'],[['짧은 요약·문구 정리·초안','GPT-5.6-Luna 또는 Gemini-3.8-Flash','누락·형식·기본 사실'],['일반 조사·비교·보고서','GPT-5.6-Terra 또는 GPT-5.6-Sol, Medium 수준 검토','출처·비교 기준·논리 연결'],['복잡한 판단·여러 자료의 충돌','상위 모델과 충분한 검토 수준','상충 근거·대안·가정·한계']])+'<p class="source-label">업무별 권장 방향은 제공된 운영 안내 기준입니다. GPT-6를 포함한 전체 모델 비교는 다음 항목에서 확인하고, 실제 선택 가능 여부는 운영 화면을 우선하세요.</p>'+shot('02-model-fhd.jpg','모델 선택 메뉴','MyHarness의 입력창 아래 모델 버튼. 캡처의 Codex Subscription 목록은 P-Harness 제공 목록과 다를 수 있습니다.'))+
block('model-lineup','GPT-6를 포함한 모델·단가 비교',
'<p>원본 강의안은 GPT-5.6 계열과 Gemini-3.8-Flash를 강의 기준 모델로, <strong>GPT-6 계열을 글로벌 신규 출시·P-GPT 미적용</strong>으로 구분합니다. 아래는 그 자료에 실린 비교값입니다.</p>'+
table(['원본 자료의 구분','모델','출력 100만 토큰당','상대비용'],[
['강의 기준','GPT-5.6-Astra','$50','약 42배'],
['강의 기준','GPT-5.6-Sol','$20','약 17배'],
['강의 기준','GPT-5.6-Terra','$12','10배'],
['강의 기준','GPT-5.6-Luna','$1.2','1배 · 비교 기준'],
['강의 기준','Gemini-3.8-Flash','$3.7','약 3배'],
['신규 출시 · P-GPT 미적용','GPT-6-Astra','$50','약 42배'],
['신규 출시 · P-GPT 미적용','GPT-6-Sol','$10','약 8배'],
['신규 출시 · P-GPT 미적용','GPT-6-Luna','$0.5','약 0.4배']])+ 
'<p class="source-label">출처: 제공된 P-Harness_사용법_v3.html · 금액은 USD, 상대비용은 GPT-5.6-Luna 대비 원본의 반올림 값입니다. 현재 요금표나 총 사용 비용을 뜻하지 않습니다.</p>'+
note('출시 정보와 사내 적용 여부를 함께 확인하세요','원본의 “P-GPT 미적용”은 자료 작성 당시의 구분입니다. 실제 업무에서는 P-Harness 모델 선택 메뉴와 사내 운영 공지를 먼저 확인하세요. GPT-6가 보이지 않으면 제공 중인 모델로 시작합니다.'))+
block('model-effort','Effort는 검토 깊이입니다','<p>Effort는 모델이 답을 만들기 위해 어느 정도로 검토할지를 조절합니다. 높은 설정을 기본값으로 고정하기보다, 업무 난이도와 누락·논리 오류를 보고 조절하세요.</p>'+table(['상황','설정 방향','이유'],[['단순 정리와 반복 형식','낮은 수준부터 시작','필요한 결과가 명확하고 판단 부담이 작음'],['출처를 비교하는 일반 분석','중간 수준 고려','비교 기준과 해석을 함께 확인'],['가정이 많거나 근거가 충돌','필요한 경우 한 단계 높임','대안과 예외를 충분히 검토']])+shot('03-effort-fhd.jpg','추론 노력도 메뉴','Auto·Low·Medium·High 등 선택지는 모델에 따라 다릅니다. 제공되지 않는 설정을 강제로 찾을 필요는 없습니다.'))+
block('model-budget','토큰 한도와 재작업을 함께 생각하세요', '<div class="wide-note"><b>처음 요청의 명확함이<br>반복 수정을 줄입니다.</b><p>목적·대상·기간·자료·완료조건을 먼저 정리하세요. 늘 가장 높은 모델을 사용하면 월별 할당량을 빠르게 소진할 수 있습니다.</p></div><ul class="list"><li>사용량 표시에서 이번 응답과 대화의 사용량을 확인합니다.</li><li>긴 원문을 반복 붙여넣기보다 필요한 파일과 범위를 정확히 지정합니다.</li><li>수정할 부분과 유지할 부분을 함께 알려 전체 재작업을 줄입니다.</li><li>모델을 바꿀 때는 맥락·비용·기능 차이를 고려합니다. 새 업무라면 새 대화를 활용하세요.</li></ul>'+fold('단가와 모델 변경 비용을 읽을 때','<p>실제 비용은 입력·출력·캐시·운영 정책에 따라 달라집니다. 앞의 출력단가 표는 원본 자료의 비교값이며 총 비용을 계산하는 기준은 아닙니다. “모델 변경 시 최대 10배” 같은 수치도 모든 환경에 적용되는 규칙으로 사용하지 않습니다. 사내 한도와 과금 안내를 우선하세요.</p>')))

chapter('skills','Skill 활용하기','Skill은 작업 방법과 기준을 담은 지침입니다.','문서 작성·데이터 분석·검토처럼 반복되는 작업에서, 등록된 지침을 찾아 활용합니다.',
block('skills-use','좌상단 / 버튼에서 Skill을 살펴보세요','<p><strong>좌상단 <code>/</code> 명령어 → 스킬 펼치기 → 이름·설명 확인</strong> 순서입니다. 처음에는 어떤 도구가 있는지 목록부터 둘러보세요.</p>'+screen_guide(shot('08-commands-entry-fhd.jpg','명령어 버튼 위치','MyHarness 좌상단의 / 버튼. 누르면 명령어 안내 창이 열립니다.',crop=(0,0,300,100))+steps([('좌상단 / 명령어 버튼을 누릅니다','왼쪽 사이드바 위쪽에 있는 / 모양의 버튼입니다.'),('스킬 항목을 펼칩니다','그룹별로 등록된 이름과 설명, 활성 표시를 확인합니다.'),('업무에 맞는 설명을 읽습니다','문서 작성·표 분석·검증 등 원하는 작업과 맞는지 봅니다. 설명이 잘리면 항목 위에 마우스를 올려 전체 설명을 읽습니다.')]),shot('09-commands-skills-fhd.jpg','명령어 창의 스킬 목록','스킬 항목을 펼친 실제 화면. 그룹명과 이름·설명을 확인합니다.',crop=(530,160,860,760))))+
block('skills-catalog','확인한 공용 Skill과 업무 Skill',table(['활용 분야','MyHarness에서 확인한 Skill','하는 일'],[['시각 문서','<code>visual-artifact</code> · <code>design-md</code>','HTML 보고서·시각 자료 구성'],['문서·표','<code>pptx-writer</code> · <code>spreadsheet-analyst</code>','프레젠테이션·스프레드시트 작업'],['구상·검토','<code>brainstorming</code> · <code>grill-me</code>','아이디어·접근법·판단 기준 검토'],['산출물 검증','<code>visual-review</code> · <code>playwright-capture</code>','렌더링·잘림·화면 캡처 확인'],['Skill 개선','<code>skill-creator</code> · <code>skill-evaluator</code>','재사용 지침 제작·평가']])+'<p class="small muted">2026.09.28 MyHarness 화면에서 확인한 주요 공용 Skill 예시입니다. P-Harness의 활성 목록은 실제 좌상단 / 명령어 창에서 확인하세요.</p>'+table(['그룹별 업무 Skill','명단 상태','사용 시 확인'],[['투자관리그룹','제공 자료 및 참고 환경에서 확정 명단 미확인','실제 등록 이름·입력자료·산출물 기준'],['사업관리그룹','제공 자료 및 참고 환경에서 확정 명단 미확인','실제 등록 이름·적용 업무·판단 기준']])+note('부서명과 Skill 이름을 혼동하지 마세요','업무 문서가 연결되어 있다는 것만으로 그 부서의 전용 Skill이 탑재됐다고 볼 수 없습니다. 실제 등록 목록과 설명에서 확인하세요.'))+
block('skills-shortcut','보조 방법 · $로 특정 도구를 지정하기','<p>목록에서 도구를 확인한 뒤, 이번 요청에 쓸 Skill·MCP를 직접 지정하려면 입력창에 <code>$</code>를 입력하거나 입력창 아래 <strong>Skill 및 MCP 호출</strong> 버튼을 누릅니다. 선택한 이름과 함께 업무 목적·자료·완료조건을 적으세요.</p>'+shot('04-skills-fhd.jpg','Skill 및 MCP 빠른 지정','채팅 입력창의 보조 경로입니다. 도구 둘러보기는 좌상단 / 명령어 창에서 시작하세요.')+'<p class="small muted"><code>@</code>는 파일 연결에 사용합니다. 파일명이나 도구명을 문장에 적는 것만으로 연결됐다고 판단하지 말고 선택된 항목을 확인하세요.</p>')+
runpy.run_path(str(ROOT / 'skill_authoring.py'))['render'](block, table, prompt, note, steps))

mcp_groups=[('mcp-company','기업 공시·재무',[('company-disclosure','금융감독원 OpenDART · SEC EDGAR · Companies House','기업 공시·실적·재무자료')]),('mcp-economy','경제·금융·국가통계',[('ecos','한국은행 ECOS','환율·금리·물가·주요 통계'),('kosis','KOSIS 국가통계포털','산업·고용·지역·인구 통계'),('macro-finance','FRED · NY Fed · ECB · BIS · OECD · 일본 e-Stat','거시·금융 시계열'),('worldbank','World Bank','국가별 경제·개발 지표'),('development-finance','ADB KIDB','아시아·태평양 개발 지표')]),('mcp-trade','무역·에너지·산업',[('comtrade','UN Comtrade','국가·품목·기간별 수출입'),('trade-market','한국 관세청 · U.S. Census · WTO · Eurostat COMEXT','공식 무역 통계 비교'),('eia','미국 EIA','원유·천연가스·에너지 지표'),('environment-industry','Eurostat PRODCOM · EPA ECHO · USDA ERS','산업생산·환경준수·농업경제')]),('mcp-law','법령·국회·입법동향',[('korean-law','법제처 국가법령정보','법령·판례·행정규칙·해석례'),('national-assembly','열린국회정보 · 국민참여입법센터','국내 의안·심사·입법예고'),('legislation-regulation','미국·EU·영국의 공식 의회·법령 자료','법안·입법절차·행정규정')]),('mcp-tech','특허·연구자료',[('patent-tech','KIPRISPlus · EPO OPS · OpenAlex · Crossref · Semantic Scholar','특허 서지·연구 메타데이터')])]
mcp_content=block('mcp-browse','좌상단 / 버튼에서 MCP를 살펴보세요','<p><strong>좌상단 <code>/</code> 명령어 → MCP 펼치기 → 이름·연결 기관 확인</strong> 순서입니다. Skill과 같은 창에서 MCP 항목을 따로 펼칩니다.</p>'+screen_guide(steps([('명령어 창에서 MCP를 펼칩니다','화면 좌상단 / 버튼을 누른 뒤 MCP 항목을 엽니다.'),('업무 목적에 맞는 이름과 설명을 읽습니다','기업 실적은 company-disclosure, 환율·금리는 ecos처럼 필요한 자료를 기준으로 살펴봅니다. 설명이 잘리면 항목 위에 마우스를 올립니다.'),('연결 기관과 활성 표시를 확인합니다','활성 표시는 사용 설정입니다. 실제 조회 성공 여부는 요청을 수행한 뒤 결과와 출처로 확인합니다.')]),shot('10-commands-mcp-fhd.jpg','명령어 창의 MCP 목록','MCP 항목을 펼친 실제 화면. 이름·설명·활성 상태를 볼 수 있습니다.',crop=(530,150,860,780)))+'<p class="small muted">특정 MCP를 이번 요청에 직접 지정할 때는 입력창의 <code>$</code> 또는 Skill 및 MCP 호출 버튼을 보조 방법으로 사용합니다. <a href="#skills-shortcut">빠르게 지정하는 방법 ↗</a></p>')
mcp_content+=block('mcp-routing','조사할 업무에서 출발하세요','<p><strong>업무 목적 → 라우팅 분류 → 연결 기관</strong> 순서로 선택합니다. 예를 들어 기업 실적은 기업 공시, 환율은 경제·금융, 국회 계류법안은 입법동향으로 접근합니다.</p><div class="source-note">아래는 제공 매뉴얼과 MyHarness 명령어 창의 목록을 대조한 연결 안내입니다. 등록 여부와 개별 기관의 실시간 조회 성공은 다릅니다. ADB KIDB는 두 기관이 아니라 ADB의 Key Indicators Database를 뜻합니다.</div>')
for id,title,rows in mcp_groups:mcp_content+=block(id,title,table(['라우팅 이름','연결 기관·서비스','찾을 수 있는 정보'],[(f'<code>{a}</code>',b,c) for a,b,c in rows],'mcp-table'))
mcp_content+=block('mcp-internal','사내 연결은 현재 상태를 확인하세요','<p>참고자료에는 투자관리·사업관리 문서 활용과 P-INVISION·AI-CONE의 연결 계획이 소개되어 있습니다. 명령어 창에서는 사내 MCP의 등록 이름과 활성·비활성 표시를 확인할 수 있습니다. 이번 캡처는 목록 확인이며 실제 사내 시스템 조회까지 검증한 것은 아닙니다.</p>'+table(['연결 분야','MyHarness 목록의 예','사용 전 확인'],[['문서·메일·일정','posco-ecm · posco-email · posco-calender','활성 상태·권한·실제 조회 결과'],['데이터·기준정보','posco-datalake · posco-ontology','활성 상태·권한·실제 조회 결과'],['업무 시스템·시장 정보','posco-erp · posco-plm · posco-gih · posco-mih','활성 상태·권한·실제 조회 결과']])+note('등록·활성과 실제 조회 성공을 구분하세요','공개 웹 자료를 사내 시스템에서 조회한 정보처럼 표현하면 안 됩니다. 연결되지 않거나 읽을 수 없는 사내 문서는 허용된 방식으로 직접 제공하세요.'))
mcp_content+=block('mcp-check','조회 결과와 실패 상태를 확인하세요',table(['상태','의미','다음 행동'],[['연결 실패','요청 자체가 완료되지 않음','범위와 연결 상태 확인, 실패 사실 명시'],['결과 없음','조회는 됐지만 조건에 맞는 결과가 없음','식별자·기간·검색 조건 점검'],['오래된 자료','업데이트 시점이 요구 기준보다 과거','발표일을 확인하고 한계 표시'],['결과 반환','자료가 조회됨','기업·단위·코드·원문을 대조']])+prompt('prompt-mcp','조회 결과 확인','사용한 자료의 기관, 기준일, 단위, 국가·품목 코드 또는 기업 식별자와 원문 링크를 함께 알려줘. 조회 실패와 검색 결과 없음은 구분하고, 확인되지 않은 범위를 명시해줘.'))
chapter('mcp','MCP 활용하기','MCP는 도구와 정보원에 연결하는 방식입니다.','기관 이름을 외우기보다, 필요한 데이터의 성격을 알고 알맞은 연결을 선택하세요.',mcp_content)

chapter('prompt','일을 잘 맡기는 요청법','좋은 요청은, 필요한 조건이 선명합니다.','길이보다 중요한 것은 업무 목적과 판단 기준입니다. 모르는 조건은 AI가 질문하도록 열어두세요.',
block('prompt-six','요청의 여섯 요소',request_map([['목적·독자','누가 어떤 판단에 사용할지','경영진의 경쟁전략 검토'],['대상·범위','어떤 기업·사업·항목인지','포스코 철강사업과 주요 3개 경쟁사'],['기준 시점','어느 기간과 시점인지','2023~2025년 실적'],['제공 자료','무엇을 우선 참고할지','기존 보고서와 공시 원문'],['수행할 분석','어떤 질문에 답할지','수익성 차이와 조달·판매 전략'],['완료조건','형식·분량·검증 기준','결론 우선 HTML, 출처와 가설 구분']]))+
block('prompt-builder','짧은 요청이 구체화되는 과정','''<div class="compare-prompt"><div class="compare-before"><span class="eyebrow">BEFORE</span><p>“포스코의 주요 경쟁사 분석해줘.”</p><span class="small muted">대상·기간·분석 깊이·결과 형태를 AI가 추측해야 합니다.</span></div><div class="builder-buttons"><button data-builder="0" aria-pressed="true">처음</button><button data-builder="1" aria-pressed="false">목적</button><button data-builder="2" aria-pressed="false">대상·기간</button><button data-builder="3" aria-pressed="false">분석 항목</button><button data-builder="4" aria-pressed="false">자료·기준</button><button data-builder="5" aria-pressed="false">완료조건</button><button data-builder="6" aria-pressed="false">추가 질문</button></div><div id="builder-output" class="builder-output" aria-live="polite"></div><div id="builder-state" class="builder-caption"></div></div>'''+prompt('prompt-improved','완성 요청문 · 바로 복사',competitor))+
block('prompt-questions','추가 질문을 업무의 시작에 넣으세요','<p>처음부터 모든 정보를 알 필요는 없습니다. 작업 전에 필요한 질문을 받으면 뒤늦게 범위를 바꾸는 일을 줄일 수 있습니다. 요청 개선 기능이 보이지 않아도 문장으로 지시할 수 있습니다.</p>'+prompt('prompt-ask','추가 확인을 유도하는 한 문장','작업에 필요한 정보가 부족하면 나에게 질문해줘. 대상, 기간, 비교 기준, 결과 형식 중 중요한 누락부터 확인하고, 제안할 기본값이 있으면 함께 알려줘.')+table(['AI의 질문 예','답변 예'],[['연결 기준과 별도 기준 중 무엇을 비교할까요?','동일한 범위를 우선하고, 비교가 불가능하면 차이를 표시해줘.'],['어떤 산업의 수요를 중점적으로 볼까요?','자동차·조선·건설·에너지와 AI 데이터센터·전기강판을 포함해줘.'],['보고서의 독자와 분량은 어떻게 할까요?','경영진용으로 결론과 판단사항을 앞에 두고 상세 근거는 뒤에 배치해줘.']]))+
block('prompt-revise','수정 요청은 바꿀 부분을 짚어주세요',''.join(before_after(a,b) for a,b in [['더 잘 만들어줘','결론을 첫 단락에 두고, 회사별 비교 기준을 표로 정리해줘.'],['분석이 부족해','원료 조달 구조와 제품 믹스가 수익성에 미친 영향을 구분하고, 근거가 없는 설명은 가설로 표시해줘.'],['수치가 이상해','원문 표의 단위와 연결 범위를 다시 대조하고, 바뀐 수치와 수정 이유를 알려줘.']])) ,True)

chapter('files','사내자료 활용하기','좋은 기존 산출물이, 좋은 기준이 됩니다.','유사 업무의 최종보고서와 이번 작업 자료를 함께 제공하면 업무 맥락과 원하는 수준을 전달하기 쉽습니다.',
block('files-ecm','ECM 자료를 연결하는 순서',VISUALS['file_plate']()+'<p class="small muted">ECM 목록의 직접 연결과 PC로 내려받은 파일 첨부는 다른 경로입니다.</p>'+steps([('관련 최종산출물을 준비합니다','유사 업무의 최종보고서, 이번 기간의 데이터, 판단 기준을 준비합니다.'),('내 PC로 내려받아 첨부합니다','제공 운영 안내는 Fasoo DRM 상태의 파일 첨부를 설명합니다. 실제 열람 권한과 지원 여부를 확인하세요.'),('자료의 역할을 구분합니다','“기존 보고서는 형식 참고, 이번 엑셀은 수치의 기준”처럼 우선순위를 알려줍니다.')])+note('DRM 인식과 ECM 직접 연결은 별개입니다','이번 MyHarness 캡처로 P-Harness의 Fasoo DRM 인식 동작까지 검증한 것은 아닙니다. 읽기 오류가 나면 허용된 자료 제공 경로와 지원 여부를 확인하세요.'))+
block('files-recognition','표와 그림, 읽었다고 끝내지 마세요',shot('07-attachment-fhd.jpg','파일 첨부와 인식 확인 요청','MyHarness에서 교육용 CSV를 첨부한 실제 화면입니다. AI에 전송하기 전 입력 예시이며 DRM 검증 화면은 아닙니다.')+table(['확인 대상','AI에게 확인할 내용','원본과 대조할 점'],[['표','열 제목·단위·기간·합계를 먼저 설명해줘','%, 억원, 백만 달러 등 단위와 소계'],['복잡한 그림','주요 요소와 화살표의 연결 관계를 설명해줘','방향·범례·누락된 요소'],['슬라이드','이 장의 결론과 근거를 구분해줘','본문·각주·캡션의 관계']])+prompt('prompt-read','중요한 정보를 먼저 확인','첨부 문서에서 [페이지/슬라이드 번호]의 [표 또는 그림]을 먼저 확인해줘. 제목, 항목, 단위, 기간, 핵심 수치를 원문 그대로 정리하고, 읽지 못했거나 확신하기 어려운 부분은 표시해줘. 내 확인 전에는 그 부분을 추정해 분석에 사용하지 마.')+'<p>작은 글씨나 복잡한 표가 누락되면 해당 부분을 캡처해 추가하세요. 원래 문서의 페이지 번호와 확인할 영역을 함께 적으면 대조하기 쉽습니다.</p>')+
block('files-reuse','기존 보고서는 형식과 기준의 참고입니다',cards([('기존 최종보고서','목차, 문체, 시각화, 판단 기준을 참고합니다.'),('이번 작업 데이터','분석할 시점의 사실과 수치를 제공합니다.'),('변경된 업무 조건','독자, 목적, 규정, 조사 범위의 차이를 알립니다.')])+prompt('prompt-reference','자료의 우선순위 지정','첨부한 기존 보고서는 목차와 표현 방식의 참고로 사용해줘. 실적 수치는 이번에 첨부한 데이터와 최신 공시를 기준으로 확인하고, 자료 간 수치가 다르면 기준 시점과 범위를 비교해 차이를 설명해줘.')))

chapter('workflow','경쟁사 분석 따라 하기','업무 한 건을 끝까지 연결해봅니다.','포스코와 주요 철강사의 실적 비교를 통해 요청부터 보고서 검증까지 익힙니다. 아래는 교육용 진행 예시입니다.',
report_example+
block('workflow-define','01. 대상과 비교 기준 정하기','<p>“포스코”가 포스코홀딩스인지, (주)포스코의 철강사업인지부터 구분합니다. 기업마다 회계연도와 사업 범위가 다르므로 표에 넣기 전에 비교 가능한 기준을 정해야 합니다.</p>'+table(['정할 항목','이번 예시의 방향'],[['분석 대상','(주)포스코, 일본제철, 아르셀로미탈, 보무강철'],['기간','2023~2025년 실적 · 교육용 고정 기간'],['지표','매출액·영업이익·영업이익률'],['비교 기준','연결/별도, 회계연도, 통화, 사업 범위'],['추가 주제','원료법인 구성, 제품·판매 전략']]))+
block('workflow-clarify','02. 자료를 읽고 추가 질문에 답하기','<p>기존 보고서와 분석 기준을 첨부한 뒤, AI가 이해한 범위를 먼저 확인합니다. “동일 기준으로 비교할 수 없는 경우는 따로 표시해줘”라고 요청하면 겉으로만 비슷한 숫자를 비교하는 일을 줄일 수 있습니다.</p>'+prompt('prompt-clarify','비교 기준 확인','먼저 비교 대상의 법인명, 회계연도, 통화, 연결 범위와 지표 정의를 표로 정리해줘. 자료에서 확인되지 않는 항목은 미확인으로 표시하고, 비교 방식에 대한 중요한 선택은 나에게 물어봐줘.'))+
block('workflow-research','03. 조사 근거를 확인하기',steps([('공식 자료를 우선합니다','공시와 기업 실적 발표의 원문을 확인하고 자료의 발표일을 기록합니다.'),('숫자의 기준을 맞춥니다','단위와 회계연도를 통일하거나 차이를 표에 분명히 표시합니다.'),('확인할 수 없는 범위를 남깁니다','조회 실패, 비공개 자료, 기간 불일치를 구분합니다. 없는 값을 추정으로 채우지 않습니다.')])+note('도구가 실행됐다는 것과 근거가 맞다는 것은 다릅니다','MCP가 데이터를 반환해도 기업 식별자와 기간이 맞는지 확인하세요. 특정 연결이 항상 자동 선택된다고 가정하지 말고 결과의 근거를 확인합니다.'))+
block('workflow-report','04. 경영진이 읽을 순서로 구성하기',screen_guide(table(['보고서 순서','담을 내용'],[['핵심 결론','가장 큰 차이와 경영진이 판단할 사항'],['실적 비교','비교 기준을 통일한 표·추세'],['원인 분석','확인된 근거와 추가 검증이 필요한 가설'],['원료·판매 전략','조달 구조, 원료법인, 제품·판매 방식'],['시사점','선택할 대안, 실행 조건, 위험'],['근거와 한계','출처, 기준일, 미확인 범위']]),shot('06-viewer-fhd.jpg','실제 HTML 보고서 미리보기','MyHarness 기존 산출물을 연 조작 예시입니다. 화면에 보이는 보고서의 사실관계를 이 교육자료에서 재검증한 것은 아닙니다.')))+
block('workflow-verify','05. 검증하고 수정하기',prompt('prompt-verify','완성 뒤 한 번 더 확인','보고서의 주요 수치를 원문과 대조하고, 합계·단위·기간·연결 범위가 맞는지 확인해줘. 사실과 추정이 섞인 문장을 구분하고, 출처가 없는 주장과 확인되지 않은 부분을 목록으로 정리해줘. 수정한 내용은 무엇이 왜 바뀌었는지 알려줘.')+'<p>담당자는 AI가 제시한 출처를 직접 확인하고 업무적 해석을 검토합니다. 특히 의사결정에 영향을 주는 핵심 수치와 원인 설명부터 확인하세요.</p><div class="reading-path"><a href="#cases-competitor">경쟁사 분석 요청문 복사 ↗</a><a href="#review-checklist">최종 체크리스트로 이동 ↗</a></div>'),True)

chapter('cases','업무별 요청문','내 업무에 맞게 바꾸어 쓰세요.','각 요청문은 복사한 뒤 대상·기간·기준일을 바꿔 사용합니다. 보고서의 실제 조사 결과를 담은 예시는 아닙니다.',
block('cases-competitor','경쟁사 실적·전략 분석',before_after('“포스코의 주요 경쟁사 분석해줘.”','법인·기간·지표·전략 비교·독자·검증 조건을 함께 지정합니다.')+prompt('case-competitor','CASE 01 · 경쟁사 분석',competitor)+note('결과에서 확인할 것','연결 범위와 회계연도, 공시 원문, 영업이익률 계산, 원인과 가설의 구분을 확인하세요.'))+
block('cases-environment','경영환경·경영계획 분석',before_after('“27년 경영환경 분석해줘.”','사업과 수요 산업을 특정하고, 전망의 시점과 가정을 구분합니다.')+prompt('case-environment','CASE 02 · 경영환경 전망',environment)+prompt('case-environment-follow','추가 질문에 답하는 예','제안한 기본값으로 하되 자동차·조선·건설·에너지에 AI 데이터센터와 전기강판 수요를 추가해줘. 각 산업이 철강 수요와 제품 구성에 미치는 영향을 구분해줘.')+note('결과에서 확인할 것','전망 발표일, 대상 기간, 기준 시나리오와 불확실성, 수요·원가·투자로 이어지는 경로를 확인하세요.'))+
block('cases-legislation','입법동향과 대응 우선순위',before_after('“포스코 관련 입법상황 업데이트해줘.”','관할·기준일·법안 단계와 영향을 받을 사업을 지정합니다.')+prompt('case-legislation','CASE 03 · 입법동향',legislation)+prompt('case-legislation-follow','후속 분석 요청','현재 계류 중인 법안의 발의자 이름과 소속 정당을 공식 자료에서 확인되는 범위까지 추가해줘. 대표발의자와 공동발의자를 구분하고, 확인되지 않은 항목은 빈 추정으로 채우지 말아줘.')+note('기준일을 반드시 바꾸세요','상사 예시는 2026년 8월 말입니다. 실제 사용 시 원하는 기준일로 바꾸고, 계류 법안과 확정 법률, 효력 발생일을 구분하세요.'))+
block('cases-template','내 업무용 공통 틀',prompt('case-template','대괄호 부분을 바꿔 사용',template)))

chapter('artifacts','결과물과 대화 관리','파일을 열고, 고치고, 다시 활용하세요.','대화와 파일은 함께 관리하되, 보고서의 최종본이 무엇인지 분명하게 남겨두세요.',
block('artifacts-format','원하는 산출물 형식을 지정하세요','<p>제공 사용법은 “보고서 만들어줘”의 기본 결과를 세로형 HTML로 설명합니다. 원하는 파일 형식과 분량이 있다면 명시하는 것이 가장 분명합니다.</p>'+table(['원하는 결과','요청 예'],[['읽기 쉬운 보고서','결론을 앞에 둔 세로형 HTML 보고서로 만들어줘.'],['수치를 다룰 표','수식과 단위를 확인할 수 있는 Excel 파일로 만들어줘.'],['발표 자료','발표 대상과 시간을 기준으로 PPTX를 만들어줘.'],['검토용 문서','수정하기 쉬운 문서 형식과 필요한 분량을 지정해줘.']])+'<p class="small muted">위 항목은 P-Harness에 맡길 산출물의 예입니다. 이 교육 매뉴얼 자체는 세로형 HTML 한 개로 제공합니다.</p>')+
block('artifacts-viewer','오른쪽 패널에서 확인하고 다운로드',screen_guide(steps([('파일을 엽니다','보고서 이름을 클릭해 오른쪽 미리보기에서 확인합니다.'),('내용과 화면을 함께 봅니다','표·차트가 잘리지 않았는지, 출처가 있는지 확인합니다.'),('수정 범위를 알려줍니다','짧은 문구 수정과 구조·수치 수정은 구분해서 요청합니다.'),('최종본을 저장합니다','원하는 파일을 다운로드하고 이름과 수정 내용을 확인합니다.')]),shot('05-files-fhd.jpg','프로젝트 파일 목록','파일 이름을 눌러 열고, 다운로드 버튼으로 저장합니다. 실제 참고 화면 · FHD.')))+
block('artifacts-edit','문구 수정과 구조 수정을 구분하세요',table(['바꾸려는 것','권장 방법','확인할 점'],[['오탈자·짧은 표현','직접 편집 기능이 제공되면 사용','저장 여부와 최종 파일 반영'],['단락 순서·표 구조','AI에게 수정 지시','변경 범위와 유지할 내용'],['수치·차트 데이터','원본과 근거를 지정해 재검증 요청','표와 차트 수치가 함께 바뀌었는지']])+prompt('prompt-edit','기존 보고서 수정','@에서 선택한 기존 보고서를 수정해줘. 핵심 결론을 맨 앞에 배치하고, 비교표에는 단위와 기준일을 추가해줘. 확인되지 않은 원인은 가설로 표시하고, 나머지 분석 범위와 원문 출처는 유지해줘.'))+
block('artifacts-history','대화와 파일 정리',table(['기능','활용 방법'],[['제목 검색','업무명·기업명·보고서명이 들어간 대화 제목으로 찾기'],['상단 고정·좋아요','진행 중 업무와 재사용할 좋은 대화를 구분해 관리'],['이름 변경','기준 기간과 목적이 드러나는 이름 사용'],['여기서 분기','기존 맥락을 바탕으로 다른 방향의 작업 이어가기'],['파일 즐겨찾기·정렬','자주 쓰는 산출물과 최신 결과를 빠르게 찾기'],['삭제','대상 대화·파일을 확인한 뒤 사용. 보관 방식은 운영 정책 확인']]))+
block('artifacts-keys','입력 단축키 빠른 참고',table(['입력','사용법','주의할 상황'],[['좌상단 <code>/</code> 버튼','명령어 창에서 스킬·MCP 목록 확인','이름·설명을 먼저 보고 필요한 도구를 파악'],['<kbd>Enter</kbd>','대기 중 요청 전송','실행 중 추가 지시는 진행 중 작업에 영향을 줄 수 있음'],['<kbd>Shift</kbd> + <kbd>Enter</kbd>','줄바꿈','여러 조건을 나누어 쓸 때'],['<kbd>Ctrl</kbd> + <kbd>Enter</kbd>','실행 중 다음 요청 대기열 추가','현재 배포 화면의 대기열 안내 확인'],['<code>@</code> / <code>$</code>','파일 / Skill·MCP 선택','실제로 선택된 항목 확인']])+'<p class="small muted">작업 중 전송과 대기열 동작은 제공 매뉴얼 기준이며 이번 캡처에서는 AI 실행 중 동작을 별도로 재현하지 않았습니다.</p>'))

checks=['요청한 목적과 범위를 충족했나요?','자료 기준일과 비교 기간이 맞나요?','핵심 수치·합계·단위를 대조했나요?','기업·제품·국가의 식별이 정확한가요?','주요 사실에 원문 출처가 있나요?','사실과 가설·전망이 구분되나요?','누락·실패·미확인 범위가 표시됐나요?','담당자가 해석과 최종 사용을 판단했나요?']
chapter('review','검증과 문제 해결','잘 만든 초안도, 확인은 필요합니다.','모든 문장을 같은 깊이로 검토하기보다 의사결정에 영향을 주는 핵심 수치와 해석부터 확인하세요.',
block('review-checklist','최종 사용 전 체크리스트','<div class="checklist">'+''.join(f'<label><input type="checkbox"><span>{x}</span></label>' for x in checks)+'</div><div class="check-progress" id="check-progress" aria-live="polite"></div><button id="reset-checks">체크 초기화</button><p class="small muted">이 체크는 현재 열린 문서에서의 개인 점검용입니다. 결과를 서버에 전송하지 않습니다.</p>')+
block('review-problems','문제가 생겼을 때 이렇게 요청하세요',table(['증상','먼저 확인','추가 요청 예'],[['문서를 못 읽음','파일 형식·권한·첨부 상태','읽지 못한 파일과 원인을 알려줘. 대체 제공 방식이 필요하면 설명해줘.'],['표·그림 일부 누락','페이지·캡처·단위·글자 크기','이 영역을 먼저 설명하고 원문 수치를 대조해줘.'],['다른 기업의 수치','법인명·식별자·연결 범위','정확한 법인과 보고 범위를 다시 확인해줘.'],['출처가 부족함','사실과 가설 구분','이 주장을 뒷받침하는 원문을 제시하고 없으면 미확인으로 남겨줘.'],['조회 실패','연결 실패인지 결과 없음인지','실패한 범위와 성공한 범위를 나누어 알려줘.'],['분석 범위 누락','요청 항목과 목차 비교','요청한 항목별로 포함 여부를 점검하고 누락 부분만 보완해줘.'],['보고서 화면 잘림','표 너비·긴 문장·배율','내용은 유지하고 표와 본문이 잘리지 않게 레이아웃을 수정해줘.']]))+
block('review-boundary','업무 담당자가 마지막 판단을 합니다','<div class="wide-note"><b>AI는 조사와 초안을 돕고,<br>담당자는 근거와 의미를 판단합니다.</b><p>중요한 수치, 원인 해석, 대응 우선순위가 실제 업무 맥락에 맞는지 확인하세요.</p></div><p>조회되지 않은 자료를 “존재하지 않는다”고 결론내리거나, 그럴듯한 원인 설명을 확정된 사실로 받아들이지 마세요. 확인되지 않은 부분을 분명하게 남기는 것도 좋은 결과의 일부입니다.</p>'),True)

chapter('reference','빠른 참고','다음 업무에도 꺼내 쓰세요.','필요한 요청문과 개념을 다시 찾아보고, 실제 운영 화면의 안내를 우선하세요.',
block('reference-shortcuts','자주 찾는 항목','<div class="link-grid"><a href="#cases-template">내 업무용 요청문 <span>↗</span></a><a href="#files-recognition">표·그림 인식 확인 <span>↗</span></a><a href="#model-selection">모델 선택 기준 <span>↗</span></a><a href="#mcp-routing">MCP와 기관 목록 <span>↗</span></a><a href="#artifacts-keys">입력 단축키 <span>↗</span></a><a href="#review-checklist">최종 검증 체크리스트 <span>↗</span></a></div>')+
block('reference-terms','용어 사전','<dl class="term-grid">'+''.join(f'<dt>{a}</dt><dd>{b}</dd>' for a,b in [('Harness','대화·파일·도구·실행을 묶어 업무 수행을 돕는 환경'),('LLM','언어를 이해하고 추론·작성하는 모델'),('Skill','업무의 절차·기준·형식을 담은 재사용 지침'),('MCP','AI와 도구·데이터를 연결하는 표준 방식'),('Effort','답을 만들기 위한 검토 수준 설정'),('Token','입력과 출력 등을 처리할 때 사용하는 단위'),('Artifact','보고서·표·이미지 등 작업으로 만들어진 산출물'),('DRM','문서 사용 권한과 보호 정책을 적용하는 기술'),('ECM','사내 문서를 관리하는 시스템')])+'</dl>')+
block('reference-basis','자료와 화면의 기준',table(['구분','이 문서의 기준'],[['교육 내용','제공된 feedback.md와 P-Harness_사용법_v3.html을 재구성'],['화면·등록 목록','2026.09.28 로컬 MyHarness UI 참고 · FHD 캡처'],['P-Harness 운영','DRM·월별 한도·실제 모델·부서별 Skill·사내 연결은 해당 운영 환경 확인 필요'],['예시의 성격','요청문과 개념도는 교육용. 기존 보고서 캡처는 조작 예시이며 분석 내용 재검증 아님'],['외부 자료','상사 피드백의 Harness 참고 영상 링크. 본문 열람과 핵심 기능은 오프라인 지원']])+note('배포 환경에서 확인할 항목','P-Harness의 모델·Effort 목록, DRM 지원, 그룹별 업무 Skill 명단, 사내 MCP 상태와 작업 중 단축키는 실제 배포 환경에서 확인하세요.')))

hero=VISUALS['cover'](HOME_SCREEN)
html='''<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="실제 화면과 업무 사례로 배우는 P-Harness 사용자 가이드. 세로형 단일 HTML 매뉴얼."><title>P-Harness — 시스템과 기능 사용자 가이드</title><link rel="icon" href="data:,"><style>'''+(ROOT/'style.css').read_text(encoding='utf-8')+(ROOT/'editorial.css').read_text(encoding='utf-8')+(ROOT/'reading.css').read_text(encoding='utf-8')+(ROOT/'textbook.css').read_text(encoding='utf-8')+'''</style></head><body><a class="skip" href="#start">본문으로 바로가기</a><header class="topbar"><a class="brand" href="#start"><span class="brand-mark">P</span>P-Harness</a><span class="top-tag">사용자 가이드</span><div class="toolbar"><button id="nav-toggle" aria-controls="sidebar" aria-expanded="true">'''+icon('menu')+'''<span>목차</span></button><button id="search-open" class="search-trigger" aria-label="매뉴얼 검색">'''+icon('search')+'''<span>매뉴얼 검색</span><kbd>Ctrl K</kbd></button><button id="fullscreen" aria-label="전체화면" aria-pressed="false">'''+icon('full')+'''<span>전체화면</span></button><button id="help-open" aria-label="문서 사용 도움말">'''+icon('help')+'''</button></div><div id="reading-progress" class="progress"></div></header><aside id="sidebar" class="sidebar"><div class="nav-head"><span>CONTENTS</span></div><nav id="toc" aria-label="전체 목차"></nav><div class="sidebar-foot"><b>읽은 위치 <span id="read-percent">0%</span></b>우클릭 · 전체화면 전환<br>Shift + 우클릭 · 기본 메뉴</div></aside><button class="scrim" id="scrim" aria-label="목차 닫기"></button><main class="main"><div class="paper">'''+hero+''.join(chapters)+'''<footer class="footer"><strong>구조를 이해하면, 필요한 기능을 찾을 수 있습니다.</strong>모델은 수행하고, Skill은 방법을 안내하고, MCP는 연결합니다. 결과는 작업공간에서 확인합니다.<br><span class="small">P-Harness 사용자 가이드 · 문서 수정일 2026.09.29 · 화면 참고 MyHarness</span></footer></div></main><dialog id="search-dialog" class="search-dialog" aria-labelledby="search-title"><div class="dialog-header"><h2 id="search-title">매뉴얼 검색</h2><button id="search-close" aria-label="검색 닫기">닫기 ×</button></div><div class="search-field"><input id="search-input" type="search" aria-label="검색어" placeholder="예: DRM, 경쟁사, MCP" autocomplete="off"><button id="search-clear">초기화</button></div><div id="search-count" class="search-meta" aria-live="polite"></div><div id="search-results" class="results"></div></dialog><dialog id="image-dialog" class="image-dialog" aria-labelledby="image-title"><div class="dialog-header"><h2 id="image-title">이미지 확대</h2><div class="zoom-tools"><button id="zoom-out" aria-label="이미지 축소">−</button><span id="zoom-value" class="small">100%</span><button id="zoom-in" aria-label="이미지 확대">＋</button><button id="zoom-fit">화면에 맞춤</button><button id="image-close">닫기 ×</button></div></div><div id="image-stage" class="image-stage" tabindex="0" aria-label="확대 이미지 영역, 스크롤하여 이동"><img id="zoom-image" alt=""></div><div id="image-caption" class="image-caption"></div></dialog><dialog id="help-dialog" class="help-pop" aria-labelledby="help-title"><h2 id="help-title">이 문서 사용법</h2><ul><li>목차에서 각 장으로 이동합니다. 세부 항목은 검색이나 본문 링크로 찾아갑니다.</li><li>Ctrl+K 또는 검색 버튼으로 본문과 요청문을 찾습니다.</li><li>페이지 안에서 우클릭하면 전체화면을 전환합니다. Esc 또는 상단 버튼으로 종료할 수 있습니다.</li><li>브라우저 기본 메뉴는 Shift+우클릭을 사용하세요.</li><li>이미지를 누르면 확대됩니다. 확대 창은 닫기 버튼으로 닫을 수 있습니다.</li><li>전체화면이 제한된 미리보기에서는 HTML 파일을 브라우저로 직접 여세요.</li></ul><button id="help-close">확인</button></dialog><div id="toast" class="toast" role="status" aria-live="polite" hidden></div><noscript><p>이 문서의 목차·검색·확대는 JavaScript가 필요합니다. 본문은 그대로 읽을 수 있습니다.</p></noscript><script>'''+(ROOT/'app.js').read_text(encoding='utf-8')+'''</script></body></html>'''
html, embedded_assets = runpy.run_path(str(ROOT / 'embed_assets.py'))['package_images'](html)

if __name__=='__main__':
    (OUT/'p-harness-guide.html').write_text(html,encoding='utf-8')
    print(f'Built {len(chapters)} chapters / {len(html.encode()):,} bytes / {len(list(CAP.glob("*.jpg")))} captured assets available')
