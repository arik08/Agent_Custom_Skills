"""교육용 가상 CSV → 오프라인 HTML. Python 기본 라이브러리만 사용합니다."""
from pathlib import Path
from collections import Counter
import csv, html, json, sys

def load_tasks(path):
    with Path(path).open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        required = ['담당자', '업무', '상태']
        missing = [k for k in required if k not in (reader.fieldnames or [])]
        if missing:
            raise ValueError('필수 열이 없습니다: ' + ', '.join(missing))
        tasks = []
        for row_number, row in enumerate(reader, 2):
            if None in row:
                raise ValueError(f'{row_number}행: 열 개수가 제목 행과 다릅니다.')
            task = {k: (row.get(k) or '').strip() for k in required}
            if not all(task.values()):
                raise ValueError(f'{row_number}행: 담당자·업무·상태는 비워 둘 수 없습니다.')
            tasks.append(task)
        return tasks

def build_report(tasks):
    pending = [t for t in tasks if t['상태'] != '완료']
    counts = Counter(t['담당자'] for t in pending)
    totals = f'전체 {len(tasks)}건 · 완료 {len(tasks)-len(pending)}건 · 미완료 {len(pending)}건'
    by_owner = ' · '.join(f'{html.escape(k)} {v}건' for k,v in sorted(counts.items())) or '미완료 업무 없음'
    payload = json.dumps(tasks, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    return '''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>업무 요청 요약기</title>
<style>*{box-sizing:border-box}body{font-family:'Malgun Gothic',sans-serif;background:#F5F8FB;color:#17364A;max-width:1000px;margin:70px auto;padding:24px;word-break:keep-all}h1{font-size:42px}p{line-height:1.7}button,select{font:inherit;padding:12px;border:1px solid #05507D;border-radius:8px;background:#EAF2F8;color:#17364A;margin:5px}table{width:100%;border-collapse:collapse;margin:30px 0}th,td{text-align:left;padding:18px;border-bottom:1px solid #B9CBD8}th{background:#05507D;color:#F5F8FB}button[aria-pressed=true]{background:#05507D;color:#F5F8FB}</style>
<p>AI 코딩 교육 · 가상 예제</p><h1>업무 요청 요약기</h1><h2>'''+totals+'''</h2><p>미완료 담당자별: '''+by_owner+'''</p>
<button id="toggle" aria-pressed="false">미완료만 보기</button><label for="owner">담당자</label><select id="owner"><option value="">전체</option></select><button id="reset">초기화</button><p id="count" aria-live="polite"></p>
<table><thead><tr><th>담당자</th><th>업무</th><th>상태</th></tr></thead><tbody id="rows"></tbody></table><p id="empty" hidden>조건에 맞는 업무가 없습니다.</p><p>미완료는 상태가 ‘완료’가 아닌 업무입니다. 이 예제는 네트워크와 AI API를 호출하지 않습니다.</p>
<script>const tasks='''+payload+''';const owner=document.getElementById('owner'),button=document.getElementById('toggle');let pending=false;[...new Set(tasks.map(t=>t['담당자']))].sort().forEach(v=>{const o=document.createElement('option');o.textContent=v;o.value=v;owner.append(o)});function render(){const list=tasks.filter(t=>(!pending||t['상태']!=='완료')&&(!owner.value||t['담당자']===owner.value));const rows=document.getElementById('rows');rows.replaceChildren();for(const t of list){const r=document.createElement('tr');for(const k of ['담당자','업무','상태']){const c=document.createElement('td');c.textContent=t[k];r.append(c)}rows.append(r)}document.getElementById('count').textContent='표시 '+list.length+'건';document.getElementById('empty').hidden=list.length>0;button.setAttribute('aria-pressed',String(pending));button.textContent=pending?'전체 상태 보기':'미완료만 보기'}button.onclick=()=>{pending=!pending;render()};owner.onchange=render;document.getElementById('reset').onclick=()=>{pending=false;owner.value='';render()};render();</script></html>'''

if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    root = Path(__file__).resolve().parent
    source = Path(sys.argv[1]) if len(sys.argv)>1 else root/'tasks.csv'
    target = Path(sys.argv[2]) if len(sys.argv)>2 else root/'report.html'
    try:
        if source.resolve() == target.resolve():
            raise ValueError('입력 파일과 출력 파일은 다른 경로여야 합니다.')
        target.write_text(build_report(load_tasks(source)), encoding='utf-8')
        print(f'{target.name} 생성 완료')
    except (OSError, ValueError, csv.Error) as error:
        print(f'처리 실패: {error}', file=sys.stderr)
        sys.exit(1)
