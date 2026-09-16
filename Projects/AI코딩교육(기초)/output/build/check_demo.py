from pathlib import Path
import importlib.util, tempfile, json
root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('demo',root/'demo/summarize.py')
demo=importlib.util.module_from_spec(spec); spec.loader.exec_module(demo)
results=[]
tasks=demo.load_tasks(root/'demo/tasks.csv')
assert len(tasks)==6
assert len([t for t in tasks if t['상태']!='완료'])==4
report=demo.build_report(tasks)
assert '전체 6건 · 완료 2건 · 미완료 4건' in report
results.append('기본 가상 데이터 6건·미완료 4건 집계')
with tempfile.TemporaryDirectory() as td:
    p=Path(td)/'input.csv'
    for name,value,error in [
      ('필수 열 누락','담당자,업무\n민지,보고서\n','필수 열이 없습니다: 상태'),
      ('빈 필드','담당자,업무,상태\n민지,,대기\n','비워 둘 수 없습니다'),
      ('초과 열','담당자,업무,상태\n민지,보고서,대기,추가\n','열 개수'),
    ]:
        p.write_text(value,encoding='utf-8')
        try: demo.load_tasks(p); raise AssertionError(name)
        except ValueError as e: assert error in str(e)
        results.append(name+' 안내')
    p.write_text('담당자,업무,상태\n',encoding='utf-8')
    assert demo.load_tasks(p)==[]
    assert '전체 0건' in demo.build_report([])
    results.append('제목만 있는 빈 CSV')
    p.write_text('담당자,업무,상태\n새담당자,새업무,보류\n다른담당자,다른업무,완료\n',encoding='utf-8-sig')
    new=demo.load_tasks(p)
    assert '미완료 1건' in demo.build_report(new)
    results.append('새 담당자·보류 상태·UTF-8 BOM 입력')
    evil=demo.build_report([{'담당자':'<b>새담당자</b>','업무':'</script><img src=x onerror=alert(1)>','상태':'대기'}])
    assert '</script><img' not in evil and '\\u003c/script' in evil
    results.append('HTML 특수문자 이스케이프')
out={'ok':True,'checks':results,'api_calls':0}
(root/'validation/demo-checks.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(out,ensure_ascii=False))
