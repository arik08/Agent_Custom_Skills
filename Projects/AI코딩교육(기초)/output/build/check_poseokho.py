from pathlib import Path
from playwright.sync_api import sync_playwright
import json
O=Path(__file__).resolve().parents[1]
V=O/'validation/poseokho';V.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={'width':1440,'height':810},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto((O/'AI코딩교육_기획안2.html').as_uri()+'#/18')
    page.evaluate('document.fonts.ready')
    rows=page.evaluate("""() => Array.from(document.querySelectorAll('.slide')).flatMap((s,i)=>s.querySelector('.poseokho-companion')?[{slide:i+1,pose:s.querySelector('.poseokho-companion').dataset.pose}]:[])""")
    for row in rows:
        page.evaluate('(i)=>deck.go(i)',row['slide']-1)
        page.wait_for_timeout(800)
        row['loaded']=page.locator('.is-active .poseokho-companion img').evaluate('(e)=>e.complete&&e.naturalWidth>0')
        row['bounds']=page.locator('.is-active .poseokho-companion').bounding_box()
        row['moving']=page.locator('.is-active .poseokho-companion img').evaluate('(e)=>getComputedStyle(e).animationName')
        page.screenshot(path=str(V/f"slide-{row['slide']:02}.png"))
    result=page.evaluate((O/'build/check_plan2.js').read_text(encoding='utf-8'))
    page.emulate_media(reduced_motion='reduce')
    reduced=page.locator('.is-active .poseokho-companion img').evaluate('(e)=>getComputedStyle(e).animationName') if page.locator('.is-active .poseokho-companion img').count() else 'not-on-named-slide'
    page.evaluate('deck.go(17)')
    reduced=page.locator('.is-active .poseokho-companion img').evaluate('(e)=>getComputedStyle(e).animationName')
    report={'companions':rows,'errors':errors,'reduced_motion':reduced,'regression':result}
    (V/'checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
    browser.close()
