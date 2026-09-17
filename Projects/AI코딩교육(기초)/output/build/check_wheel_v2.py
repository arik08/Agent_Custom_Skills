from pathlib import Path
from playwright.sync_api import sync_playwright
import json,hashlib
O=Path(__file__).resolve().parents[1];result=[]
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True);page=b.new_page(viewport={'width':1440,'height':810});page.goto((O/'AI코딩교육_인터랙티브_v2.html').as_uri());page.evaluate('document.fonts.ready')
 for mode,values in [(0,[100,200,600,2400]),(1,[3,6,30]),(2,[1,3])]:
  for delta in values:
   for sign in [1,-1]:
    page.evaluate('deck.go(10)');page.evaluate('([d,m])=>document.body.dispatchEvent(new WheelEvent("wheel",{deltaY:d,deltaMode:m,bubbles:true,cancelable:true}))',[sign*delta,mode]);actual=page.evaluate('deck.current');assert actual==10+sign,(mode,delta,actual);result.append({'mode':mode,'delta':sign*delta,'moved':actual-10})
 page.evaluate('deck.go(10)');page.mouse.move(10,10);page.mouse.wheel(0,600);page.wait_for_timeout(100);assert page.evaluate('deck.current')==11
 page.mouse.wheel(0,-600);page.wait_for_timeout(100);assert page.evaluate('deck.current')==10
 page.evaluate('deck.go(10)');positions=[]
 for delta in [240,240,240,-240,-240]:
  page.evaluate('(d)=>document.body.dispatchEvent(new WheelEvent("wheel",{deltaY:d,bubbles:true,cancelable:true}))',delta);positions.append(page.evaluate('deck.current'))
 assert positions==[11,12,13,12,11],positions
 page.evaluate('deck.go(10)');positionsSmall=[]
 for delta in [20,20,20,20]:
  page.evaluate('(d)=>document.body.dispatchEvent(new WheelEvent("wheel",{deltaY:d,bubbles:true,cancelable:true}))',delta);positionsSmall.append(page.evaluate('deck.current'))
 assert positionsSmall==[10,10,10,11],positionsSmall
 page.wait_for_timeout(350);assert page.evaluate('deck.current')==11
 b.close()
v=O/'validation/interactive-v2';(v/'wheel-checks.json').write_text(json.dumps({'ok':True,'single_event_cases':result,'real_wheel_large_delta':True,'rapid_events_positions':positions,'small_delta_positions':positionsSmall,'no_delayed_move':True},ensure_ascii=False,indent=2),encoding='utf-8')
p=v/'검증_결과.md';s=p.read_text(encoding='utf-8');name='AI코딩교육_인터랙티브_v2.html';import re
s=re.sub(r'(- '+re.escape(name)+r': `)[0-9a-f]+(`)',lambda m:m[1]+hashlib.sha256((O/name).read_bytes()).hexdigest()+m[2],s)
s+='\n## 휠 이동 수정\n\n- 큰 delta를 여러 장으로 환산하던 로직 제거. 이동 시 방향에 따라 한 장만 처리하고 누적량 초기화. 키보드 이동 규칙은 유지.\n- 양방향·pixel/line/page 단위·큰 delta 18개 조합과 실제 wheel 이벤트 ±600, 빠른 연속 입력, 작은 delta 누적, 지연 이동 없음 검증 통과. `wheel-checks.json` 참조.\n- 실제 물리 휠 장치별 이벤트 발생 방식은 실기기 확인 대상이다.\n'
p.write_text(s,encoding='utf-8');print('PASS: 18 delta/mode/direction cases + wheel ±600 + rapid and accumulated events')
