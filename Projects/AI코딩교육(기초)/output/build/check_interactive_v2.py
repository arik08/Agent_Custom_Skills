from pathlib import Path
from playwright.sync_api import sync_playwright
import json
O=Path(__file__).resolve().parents[1];V=O/'validation/interactive-v2';V.mkdir(exist_ok=True,parents=True)
results={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 page=b.new_page(viewport={'width':1440,'height':810})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((O/'AI코딩교육_인터랙티브_v2.html').as_uri());page.evaluate('document.fonts.ready')
 def go(n):page.evaluate('(n)=>deck.go(n)',n)
 def cur():return page.evaluate('deck.current')
 def check(name,value):
  results[name]=value
  assert value,name
 check('32 slides',page.evaluate('deck.count')==32)
 for key in ['ArrowRight','ArrowDown','PageDown','Space','Enter']:
  go(3);page.locator('body').click(position={'x':10,'y':10});page.keyboard.press(key);check('next '+key,cur()==4)
 for key in ['ArrowLeft','ArrowUp','PageUp','Shift+Space','Backspace']:
  go(3);page.keyboard.press(key);check('previous '+key,cur()==2)
 page.keyboard.press('Home');check('Home',cur()==0);page.keyboard.press('ArrowLeft');check('start bound',cur()==0)
 page.keyboard.press('End');check('End',cur()==31);page.keyboard.press('ArrowRight');check('end bound',cur()==31)
 go(0)
 for _ in range(12):page.keyboard.press('ArrowRight')
 check('rapid keys',cur()==12);page.wait_for_timeout(900);check('no delayed navigation',cur()==12)
 page.keyboard.down('ArrowRight');page.keyboard.down('ArrowRight');page.keyboard.down('ArrowRight');page.keyboard.up('ArrowRight');check('repeat key events',cur()==15)
 page.mouse.move(10,10);page.mouse.wheel(0,100);page.wait_for_timeout(100);check('wheel forward',cur()==16);page.mouse.wheel(0,-100);page.wait_for_timeout(100);check('wheel reversal',cur()==15)
 for _ in range(4):page.mouse.wheel(0,20)
 page.wait_for_timeout(100);check('small delta accumulation',cur()==16)
 page.evaluate("location.hash='#/8'");page.wait_for_timeout(100);check('hash link',cur()==7)
 page.get_by_role('button',name='HTML',exact=True).click();check('HTML unstyled',not page.locator('#web-preview').evaluate("e=>e.classList.contains('styled')"))
 page.get_by_role('button',name='+ CSS',exact=True).click();check('CSS styled and no JS',page.locator('#preview-filter').is_disabled())
 page.get_by_role('button',name='+ JavaScript',exact=True).click();page.locator('#preview-filter').click();check('JS actual filtering',page.locator('#web-preview .done').is_hidden());check('controls do not navigate',cur()==7)
 page.screenshot(path=str(V/'anatomy.png'))
 go(16);page.locator('#toggle-done').click();check('pending 4',page.locator('.data-row').count()==4);check('owner counts 2 1 1',page.locator('.owner-bar strong').all_text_contents()==['2건','1건','1건'])
 page.locator('#owner').select_option(label='민지');check('owner filter 2',page.locator('.data-row').count()==2)
 page.locator('#task-search').fill('없는 업무');check('empty state',page.locator('#empty-state').is_visible() and page.locator('.data-row').count()==0)
 page.keyboard.press('Home');page.keyboard.press('f');check('input keys preserved',cur()==16 and page.evaluate('!document.fullscreenElement'))
 page.locator('#reset-demo').click();check('reset 6',page.locator('.data-row').count()==6)
 page.locator('#toggle-done').click();page.screenshot(path=str(V/'demo-filter.png'))
 go(17);page.locator('[data-case=empty]').click();check('empty error example','0건' in page.locator('#error-output').inner_text());page.locator('[data-case=ok]').click();check('valid error example','검증 통과' in page.locator('#error-output').inner_text())
 go(18);page.locator('summary').click();check('detail expands',page.locator('details').get_attribute('open') is not None and cur()==18);page.screenshot(path=str(V/'detail.png'))
 go(0);t=page.locator('.slide.is-active .term').first;t.hover();check('tooltip hover',page.locator('#concept-tip').is_visible());page.wait_for_timeout(220);page.screenshot(path=str(V/'tooltip-dark.png'));page.locator('#concept-tip').hover();page.wait_for_timeout(250);check('tooltip hover persistence',page.locator('#concept-tip').is_visible());page.keyboard.press('Escape');check('tooltip escape',page.locator('#concept-tip').is_hidden())
 go(6);t=page.locator('.slide.is-active .term').first;t.focus();check('tooltip focus',page.locator('#concept-tip').is_visible());page.wait_for_timeout(220);page.screenshot(path=str(V/'tooltip-light.png'));page.keyboard.press('PageDown');check('tooltip closed on navigation',page.locator('#concept-tip').is_hidden())
 go(3);page.locator('body').click(position={'x':5,'y':5});page.keyboard.press('f');page.wait_for_timeout(100);check('fullscreen entry',page.evaluate('!!document.fullscreenElement'));page.keyboard.press('f');page.wait_for_timeout(100);check('fullscreen toggle exit',page.evaluate('!document.fullscreenElement'))
 page.keyboard.press('f');page.wait_for_timeout(100);page.keyboard.press('Escape');page.wait_for_timeout(100);results['Escape native fullscreen']=page.evaluate('!document.fullscreenElement')
 if page.evaluate('!!document.fullscreenElement'):page.evaluate('document.exitFullscreen()')
 page.evaluate("()=>{document.documentElement.requestFullscreen=()=>Promise.reject(new Error('test rejection'));}");page.keyboard.press('f');page.wait_for_timeout(100);check('fullscreen rejected preserves deck',cur()==3)
 bounds=[]
 for size in [(1440,810),(1440,900),(1024,768),(1920,820),(540,960)]:
  page.set_viewport_size({'width':size[0],'height':size[1]});page.wait_for_timeout(100);go(6)
  data=page.evaluate('''()=>{const r=document.querySelector('#stage').getBoundingClientRect(),s=getComputedStyle(document.querySelector('#stage')),b=getComputedStyle(document.body);return {width:innerWidth,height:innerHeight,stage:[r.x,r.y,r.width,r.height],fits:r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,seamless:s.backgroundColor==='rgba(0, 0, 0, 0)'&&s.boxShadow==='none'}}''')
  check(f'viewport {size}',data['fits'] and data['seamless']);bounds.append(data)
  page.locator('.slide.is-active .term').last.hover();box=page.locator('#concept-tip').bounding_box();check(f'tooltip fits {size}',box['x']>=0 and box['y']>=0 and box['x']+box['width']<=size[0] and box['y']+box['height']<=size[1]);page.screenshot(path=str(V/f'ratio-{size[0]}x{size[1]}.png'));page.keyboard.press('Escape')
 page.set_viewport_size({'width':1440,'height':810});go(0);page.emulate_media(reduced_motion='reduce');check('reduced motion',page.locator('.p0').first.evaluate("e=>getComputedStyle(e).animationName")=='none');page.emulate_media(reduced_motion='no-preference')
 audit=page.evaluate((O/'build/audit.js').read_text(encoding='utf-8'));results['skill audit']=json.loads(audit) if isinstance(audit,str) else audit
 # Rebuild at final state for printing; print appendix carries all hover-only definitions.
 page.reload();page.evaluate('document.fonts.ready');page.evaluate("document.querySelectorAll('details').forEach(e=>e.open=true)")
 page.pdf(path=str(O/'AI코딩교육_인터랙티브_v2.pdf'),prefer_css_page_size=True,print_background=True)
 results['console errors']=errors;results['viewports']=bounds
 (V/'checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(results,ensure_ascii=False,indent=2))
 b.close()
