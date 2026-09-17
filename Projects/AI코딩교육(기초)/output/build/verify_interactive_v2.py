from pathlib import Path
from playwright.sync_api import sync_playwright
import json
O=Path(__file__).resolve().parents[1]; V=O/'validation/interactive-v2';V.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 page=b.new_page(viewport={'width':1440,'height':810},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((O/'AI코딩교육_인터랙티브_v2.html').as_uri());page.evaluate('document.fonts.ready');page.wait_for_timeout(200)
 print('errors',errors)
 print('deck',page.evaluate('({count:window.deck?.count,terms:document.querySelectorAll(".term").length})'))
 findings=[]
 for i in range(32):
  page.evaluate('(i)=>deck.go(i)',i);page.wait_for_timeout(70)
  data=page.evaluate('''()=>{const s=document.querySelector('.slide.is-active'),sb=s.querySelector('.slide-body'),ins=s.querySelector('.insight'),r=sb.getBoundingClientRect(),ir=ins.getBoundingClientRect();const bad=[...sb.querySelectorAll('*')].filter(e=>{const z=e.getBoundingClientRect();return z.width&&z.height&&getComputedStyle(e).display!=='none'&&(!e.closest('details:not([open])')||e.closest('summary'))&&z.bottom>ir.top+2&&!e.closest('.asset-scene')}).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,60),bottom:e.getBoundingClientRect().bottom}));return {slide:Number(s.dataset.index)+1,bodyBottom:r.bottom,insightTop:ir.top,bad:bad.slice(0,8)}}''')
  if data['bad']:findings.append(data)
  page.screenshot(path=str(V/f'slide-{i+1:02}.png'))
 (V/'layout.json').write_text(json.dumps({'errors':errors,'findings':findings},ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(findings,ensure_ascii=False))
 b.close()
