from pathlib import Path
from playwright.sync_api import sync_playwright
import pymupdf as fitz,json
from PIL import Image,ImageDraw
O=Path('Projects/AI코딩교육(기초)/output').resolve();V=O/'validation/interactive-v2'
r={}
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True)
 c=b.new_context(viewport={'width':1024,'height':768},has_touch=True);pg=c.new_page();requests=[];pg.on('request',lambda q:requests.append(q.url));pg.goto((O/'AI코딩교육_인터랙티브_v2.html').as_uri());pg.evaluate('document.fonts.ready')
 term=pg.locator('.slide.is-active .term').first;term.tap();pg.wait_for_timeout(220);r['touch open']=pg.locator('#concept-tip').is_visible();term.tap();r['touch close']=pg.locator('#concept-tip').is_hidden()
 pg.evaluate("()=>{glossary['Vibe Coding'][1]='긴 용어 설명을 읽는 검증입니다. '.repeat(160);}");term.tap();pg.wait_for_timeout(200);tip=pg.locator('#concept-tip');r['long tooltip scrollable']=tip.evaluate('e=>e.scrollHeight>e.clientHeight');tip.hover();pg.mouse.wheel(0,300);pg.wait_for_timeout(200);r['tooltip scroll not navigation']=pg.evaluate('deck.current===0');r['tooltip can scroll']=tip.evaluate('e=>e.scrollTop>0');r['no external assets']=not any(u.startswith(('https:','http:')) for u in requests)
 b.close()
d=fitz.open(O/'AI코딩교육_인터랙티브_v2.pdf');r['pdf pages']=len(d);r['pdf all pages have text']=all(len(p.get_text().strip())>50 for p in d);r['pdf glossary included']='Database' in d[-1].get_text();r['pdf detail expanded']='상위 폴더' in d[18].get_text();r['pdf out of bounds']=[]
sheet=Image.new('RGB',(1440,((len(d)+3)//4)*225),(220,231,237));dr=ImageDraw.Draw(sheet)
for i,page in enumerate(d):
 pix=page.get_pixmap(matrix=fitz.Matrix(.25,.25));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((350,197));x=i%4*360;y=i//4*225;sheet.paste(im,(x,y+23));dr.text((x+5,y+5),str(i+1),fill='black')
 for block in page.get_text('blocks'):
  if block[0]<-1 or block[1]<-1 or block[2]>page.rect.width+1 or block[3]>page.rect.height+1:r['pdf out of bounds'].append(i+1)
for n in [0,18,22,32,36]:d[n].get_pixmap(matrix=fitz.Matrix(.8,.8)).save(V/f'pdf-{n+1:02}.png')
sheet.save(V/'pdf-contact-sheet.jpg');(V/'extra-checks.json').write_text(json.dumps(r,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(r,ensure_ascii=False));assert all(v for k,v in r.items() if isinstance(v,bool));assert not r['pdf out of bounds']
